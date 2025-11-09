# OpenAI Vision API Integration Guide

## Overview

This guide explains how to replace the `mockEstimate` with real AI-powered damage analysis using OpenAI's GPT-4 Vision API.

## Prerequisites

1. **OpenAI API Key**

   - Sign up at https://platform.openai.com/
   - Create an API key at https://platform.openai.com/api-keys
   - Add billing information (GPT-4 Vision requires paid account)
   - Add the key to `.env.local`:
     ```bash
     OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
     ```

2. **Restart Dev Server**
   - After adding the API key: `npm run dev`

## Implementation Steps

### Step 1: Replace Mock Estimate with Real API Call

In `app/api/analyze-damage/route.ts`, replace lines 26-56 with:

```typescript
// Call OpenAI Vision API
const response = await openai.chat.completions.create({
  model: 'gpt-4o', // or 'gpt-4-vision-preview'
  messages: [
    {
      role: 'system',
      content: `You are an expert auto insurance damage assessor. Analyze vehicle damage photos and provide detailed cost estimates.

Return your response as a JSON object with this EXACT structure:
{
  "damages": [
    {
      "type": "string (e.g., 'Front Bumper Damage', 'Hood Dent', 'Door Scratch')",
      "severity": "minor" | "moderate" | "severe",
      "estimatedCost": number,
      "description": "string (detailed description of the damage)"
    }
  ],
  "laborHours": number,
  "partsNeeded": ["array", "of", "strings"],
  "confidence": number (between 0 and 1, e.g., 0.85 for 85% confidence),
  "totalCost": number (sum of all damage costs)
}

Cost Guidelines:
- Minor (scratches, small dents): $150-500
- Moderate (bumper damage, panel dents): $500-1500
- Severe (structural damage, multiple parts): $1500-5000+
- Labor rate: $100-150/hour

If the image is NOT a vehicle or shows NO visible damage, return:
{
  "damages": [],
  "laborHours": 0,
  "partsNeeded": [],
  "confidence": 0,
  "totalCost": 0
}`,
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
  temperature: 0.2, // Lower temperature for more consistent estimates
});

const content = response.choices[0].message.content;
if (!content) {
  throw new Error('No response from OpenAI');
}

// Parse JSON response
console.log('OpenAI raw response:', content);
const estimate = JSON.parse(content);

// Validate response structure
if (!estimate.damages || !Array.isArray(estimate.damages)) {
  throw new Error('Invalid response format from AI');
}

// Calculate total cost if not provided
if (!estimate.totalCost && estimate.damages.length > 0) {
  estimate.totalCost = estimate.damages.reduce(
    (sum: number, damage: any) => sum + (damage.estimatedCost || 0),
    0,
  );
}

console.log('Parsed estimate:', JSON.stringify(estimate, null, 2));
return NextResponse.json(estimate);
```

### Step 2: Handle Edge Cases

Add validation and error handling:

```typescript
// After parsing the estimate, add:

// Ensure confidence is between 0 and 1
if (estimate.confidence > 1) {
  estimate.confidence = estimate.confidence / 100;
}

// Validate damage severity values
estimate.damages = estimate.damages.map((damage: any) => {
  const validSeverities = ['minor', 'moderate', 'severe'];
  if (!validSeverities.includes(damage.severity)) {
    damage.severity = 'moderate'; // Default fallback
  }
  return damage;
});

// Ensure all costs are numbers
estimate.totalCost = Number(estimate.totalCost) || 0;
estimate.laborHours = Number(estimate.laborHours) || 0;
```

### Step 3: Test with Different Images

Test scenarios:

1. **Clear vehicle damage**: Should return accurate estimates
2. **No damage**: Should return empty damages array
3. **Non-vehicle image**: Should return confidence: 0
4. **Poor quality image**: Should return lower confidence score

## API Costs

**GPT-4 Vision Pricing (as of 2024):**

- GPT-4o: ~$0.01-0.03 per image analysis
- Input: $5 per 1M tokens
- Output: $15 per 1M tokens
- Each analysis typically uses 500-1000 tokens

**Cost Management:**

- Set usage limits in OpenAI dashboard
- Monitor usage at https://platform.openai.com/usage
- Consider caching results in localStorage/Firestore

## Debugging

### View API Logs

Terminal logs will show:

```bash
=== Damage Analysis Request ===
Image data received (length): 123456
OpenAI raw response: {"damages": [...], ...}
Parsed estimate: {...}
```

### Common Issues

1. **Error: "No response from OpenAI"**

   - Check API key is valid
   - Verify billing is set up
   - Check OpenAI service status

2. **Error: "Invalid response format"**

   - AI didn't return valid JSON
   - Add retry logic or use stricter prompts

3. **High costs**
   - Resize images before sending (recommend max 1024px)
   - Cache previous analyses

## Advanced: Image Optimization

To reduce costs, resize images before sending:

```typescript
// Add to UploadForm.tsx before calling estimateDamage()
async function resizeImage(base64: string, maxWidth = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64;
  });
}
```

## Future Enhancements

1. **Confidence Thresholds**: Alert users when confidence < 0.7
2. **Multi-angle Analysis**: Upload multiple photos for better accuracy
3. **Historical Data**: Learn from accepted/rejected estimates
4. **Real-time Streaming**: Use OpenAI streaming for progressive results
5. **Fallback Model**: Use cheaper model (GPT-4o-mini) for initial scan

## Alternative: Use Anthropic Claude

If you prefer Claude with vision:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1500,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
          },
        },
        {
          type: 'text',
          text: 'Analyze this vehicle damage...',
        },
      ],
    },
  ],
});
```

## Quick Start Checklist

- [ ] Get OpenAI API key
- [ ] Add to `.env.local`
- [ ] Replace mock code in `route.ts`
- [ ] Restart dev server
- [ ] Test with vehicle damage photo
- [ ] Monitor costs in OpenAI dashboard
- [ ] Add error handling
- [ ] Consider image optimization

## Support

- OpenAI API Docs: https://platform.openai.com/docs/guides/vision
- GPT-4 Vision Guide: https://platform.openai.com/docs/guides/vision
- Pricing: https://openai.com/pricing
