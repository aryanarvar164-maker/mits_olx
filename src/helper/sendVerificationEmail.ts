import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verificationEmails";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    const errorMessage =
      emailError instanceof Error
        ? emailError.message
        : 'Failed to send verification email.';

    return { success: false, message: errorMessage };
  }
}