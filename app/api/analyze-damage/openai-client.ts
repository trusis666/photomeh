import OpenAI from "openai";
import {
  SYSTEM_PROMPT,
  USER_PROMPT,
  MAX_TOKENS,
  TEMPERATURE,
} from "./constants";
import type { DamageEstimate } from "./types";
import { sanitizeEstimate } from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeDamageWithOpenAI(
  imageBase64: string,
): Promise<DamageEstimate> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: USER_PROMPT,
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
              detail: "high",
            },
          },
        ],
      },
    ],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  // Parse and validate response
  let rawEstimate: any;
  try {
    rawEstimate = JSON.parse(content);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    console.error("Raw response:", content);
    throw new Error("Invalid JSON response from AI model");
  }

  return sanitizeEstimate(rawEstimate);
}
