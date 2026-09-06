import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import * as nsfwjs from "nsfwjs";
import * as jpeg from "jpeg-js";
import { PNG } from "pngjs";

import { Filter } from "bad-words"

type ModerationResult = {
    isSafe: boolean;
    flaggedCategories: string[];
};

// ---------- TEXT MODERATION ----------

const filter = new Filter();

// Extra terms bad-words doesn't catch by default — add/edit freely
const EXTRA_BLOCKED_WORDS = [
    "gun", "pistol", "rifle", "firearm", "grenade", "bomb", "explosive",
    "knife blade weapon", "ammunition", "ammo",
];
filter.addWords(...EXTRA_BLOCKED_WORDS);

export function checkTextModeration(text: string): ModerationResult {
    const isProfane = filter.isProfane(text);

    const lowerText = text.toLowerCase();
    const matchedWeaponTerms = EXTRA_BLOCKED_WORDS.filter((term) =>
        lowerText.includes(term)
    );

    const flagged: string[] = [];
    if (isProfane) flagged.push("inappropriate_language");
    if (matchedWeaponTerms.length > 0) flagged.push("weapon_terms");

    return {
        isSafe: flagged.length === 0,
        flaggedCategories: flagged,
    };
}

// ---------- IMAGE MODERATION ----------

let modelPromise: Promise<nsfwjs.NSFWJS> | null = null;

function getModel(): Promise<nsfwjs.NSFWJS> {
    if (!modelPromise) {
        modelPromise = (async () => {
            await tf.setBackend("cpu");
            await tf.ready();
            return nsfwjs.load(); // downloads model once, then cached in memory
        })();
    }
    return modelPromise;
}

function isPng(buffer: Buffer): boolean {
    return (
        buffer.length > 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
    );
}

function imageBufferToTensor(buffer: Buffer): tf.Tensor3D {
    let width: number, height: number, data: Uint8Array | Buffer;

    if (isPng(buffer)) {
        const png = PNG.sync.read(buffer);
        width = png.width;
        height = png.height;
        data = png.data; // RGBA
    } else {
        const decoded = jpeg.decode(buffer, { useTArray: true });
        width = decoded.width;
        height = decoded.height;
        data = decoded.data; // RGBA
    }

    const numPixels = width * height;
    const rgb = new Uint8Array(numPixels * 3);
    for (let i = 0; i < numPixels; i++) {
        rgb[i * 3] = data[i * 4];
        rgb[i * 3 + 1] = data[i * 4 + 1];
        rgb[i * 3 + 2] = data[i * 4 + 2];
    }

    return tf.tensor3d(rgb, [height, width, 3]);
}

async function fetchImageBuffer(url: string): Promise<Buffer> {
    if (url.startsWith("data:")) {
        const base64Data = url.split(",")[1];
        return Buffer.from(base64Data, "base64");
    }
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Thresholds: flag if these categories exceed this probability
const NSFW_THRESHOLDS: Record<string, number> = {
    Porn: 0.6,
    Hentai: 0.6,
    Sexy: 0.75, // "Sexy" alone is borderline clothing; keep higher to avoid false positives
};

export async function checkImageModeration(imageUrl: string): Promise<ModerationResult> {
    const model = await getModel();
    const buffer = await fetchImageBuffer(imageUrl);
    const tensor = imageBufferToTensor(buffer);

    let predictions;
    try {
        predictions = await model.classify(tensor);
    } finally {
        tensor.dispose(); // always free memory, even if classify throws
    }

    const flagged = predictions
        .filter((p) => {
            const threshold = NSFW_THRESHOLDS[p.className];
            return threshold !== undefined && p.probability >= threshold;
        })
        .map((p) => p.className);

    return {
        isSafe: flagged.length === 0,
        flaggedCategories: flagged,
    };
}

// ---------- COMBINED CHECK ----------

export async function checkContentModeration(
    text: string,
    imageUrls: string[]
): Promise<ModerationResult> {
    const textResult = checkTextModeration(text);

    const imageResults = await Promise.all(
        imageUrls.map((url) => checkImageModeration(url))
    );

    const allFlagged = [
        ...textResult.flaggedCategories,
        ...imageResults.flatMap((r) => r.flaggedCategories),
    ];

    return {
        isSafe: allFlagged.length === 0,
        flaggedCategories: [...new Set(allFlagged)],
    };
}
