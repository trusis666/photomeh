import { NextRequest, NextResponse } from "next/server";
import { validateImageData } from "./validators";
import { logRequest, logResponse } from "./utils";
import { analyzeDamageWithOpenAI } from "./openai-client";
import type { ApiError } from "./types";

export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    // Validate input
    if (!imageBase64) {
      return NextResponse.json<ApiError>(
        {
          error: "Image data is required",
          details: "Missing imageBase64 field",
        },
        { status: 400 },
      );
    }

    if (!validateImageData(imageBase64)) {
      return NextResponse.json<ApiError>(
        {
          error: "Invalid image format",
          details: "Expected base64-encoded image with data URI scheme",
        },
        { status: 400 },
      );
    }

    logRequest(imageBase64);

    // Analyze damage using OpenAI
    const estimate = await analyzeDamageWithOpenAI(imageBase64);

    logResponse(estimate);

    return NextResponse.json(estimate, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Error in damage analysis:", error);

    // Handle specific error types
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      return NextResponse.json<ApiError>(
        {
          error: "Service temporarily unavailable",
          details: "Unable to connect to AI service",
        },
        { status: 503 },
      );
    }

    if (error.status === 401) {
      return NextResponse.json<ApiError>(
        {
          error: "Configuration error",
          details: "Invalid API credentials",
        },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiError>(
      {
        error: "Failed to analyze damage",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
