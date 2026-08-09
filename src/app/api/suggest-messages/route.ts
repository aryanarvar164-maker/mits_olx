import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try{
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

   
    const result = streamText({
        model: "openai/gpt-5.3-chat",
        prompt,
    });

    return result.toUIMessageStreamResponse();
  }catch(error){
    if(error instanceof OpenAI.OpenAIError){
        const {message, headers, status, name} = error
        return NextResponse.json({
            name, status, message, headers
        },{status})
    }
    else{
         console.error('An unexpected error occurred:', error);
      throw error;
    }

  }
}