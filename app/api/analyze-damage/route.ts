import {NextRequest, NextResponse} from 'next/server';

import OpenAI from 'openai';
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const {imageBase64} = await request.json();
    if (!imageBase64) {
      return NextResponse.json(
        {error: 'Image data is required'},
        {status: 400},
      );
    }

    console.log('=== Damage Analysis Request ===');
    console.log('Using: OpenAI Vision API');
    console.log('Image data received (length):', imageBase64.length);
    console.log('Image data preview:', imageBase64.substring(0, 100) + '...');
    console.log('Timestamp:', new Date().toISOString());

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert auto insurance damage assessor. Analyze vehicle damage photos and provide detailed cost estimates.\n\nReturn your response as a JSON object with this EXACT structure:\n{\n  "damages": [\n    {\n      "type": "string (e.g., 'Front Bumper Damage', 'Hood Dent', 'Door Scratch')",\n      "severity": "minor" | "moderate" | "severe",\n      "estimatedCost": number,\n      "description": "string (detailed description of the damage)"\n    }\n  ],\n  "laborHours": number,\n  "partsNeeded": ["array", "of", "strings"],\n  "confidence": number (between 0 and 1, e.g., 0.85 for 85% confidence),\n  "totalCost": number (sum of all damage costs)\n}\n\nCost Guidelines:\n- Minor (scratches, small dents): $150-500\n- Moderate (bumper damage, panel dents): $500-1500\n- Severe (structural damage, multiple parts): $1500-5000+\n- Labor rate: $100-150/hour\n\nIf the image is NOT a vehicle or shows NO visible damage, return:\n{\n  "damages": [],\n  "laborHours": 0,\n  "partsNeeded": [],\n  "confidence": 0,\n  "totalCost": 0\n}`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this vehicle damage photo and provide a detailed repair cost estimate in JSON format.',
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    console.log('OpenAI raw response:', content);
    let estimate;
    try {
      estimate = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content);
      throw new Error('OpenAI returned invalid JSON');
    }

    // Validate and fix response structure
    if (!estimate.damages || !Array.isArray(estimate.damages)) {
      estimate.damages = [];
    }
    if (!estimate.totalCost && estimate.damages.length > 0) {
      estimate.totalCost = estimate.damages.reduce(
        (sum: number, damage: any) => sum + (damage.estimatedCost || 0),
        0,
      );
    }
    if (estimate.confidence > 1) {
      estimate.confidence = estimate.confidence / 100;
    }
    estimate.damages = estimate.damages.map((damage: any) => {
      const validSeverities = ['minor', 'moderate', 'severe'];
      if (!validSeverities.includes(damage.severity)) {
        damage.severity = 'moderate';
      }
      return damage;
    });

    console.log('Returning estimate:', JSON.stringify(estimate, null, 2));
    console.log('==============================\n');
    return NextResponse.json(estimate);
  } catch (error: any) {
    console.error('Error analyzing damage:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze damage',
        details: error.message,
      },
      {status: 500},
    );
  }
}
