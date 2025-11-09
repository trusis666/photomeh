import {NextRequest, NextResponse} from 'next/server';
import OpenAI from 'openai';

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

    // Console log image data (first 100 chars of base64)
    console.log('=== Damage Analysis Request ===');
    console.log('Image data received (length):', imageBase64.length);
    console.log('Image data preview:', imageBase64.substring(0, 100) + '...');
    console.log('Timestamp:', new Date().toISOString());

    // TODO: Call OpenAI Vision API when ready
    // const response = await openai.chat.completions.create({...});

    // Return mock estimate for now
    const mockEstimate = {
      totalCost: 1250,
      damages: [
        {
          type: 'Front Bumper Damage',
          severity: 'moderate' as const,
          estimatedCost: 850,
          description: 'Impact damage with visible cracks and deformation',
        },
        {
          type: 'Paint Scratches',
          severity: 'minor' as const,
          estimatedCost: 400,
          description: 'Surface scratches requiring repainting',
        },
      ],
      laborHours: 8,
      partsNeeded: ['Front Bumper', 'Paint'],
      confidence: 0.85,
    };

    console.log('Returning estimate:', JSON.stringify(mockEstimate, null, 2));
    console.log('==============================\n');

    return NextResponse.json(mockEstimate);
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
