# Ollama Local Testing Setup

## Overview

Use Ollama to test damage analysis locally without API costs. Perfect for development and testing before deploying with OpenAI.

## Prerequisites

1. **Install Ollama**

   ```bash
   # macOS
   brew install ollama

   # Or download from https://ollama.ai/download
   ```

2. **Start Ollama Service**

   ```bash
   ollama serve
   ```

   Leave this running in a terminal. Default URL: `http://localhost:11434`

3. **Pull Vision Model**

   ```bash
   # Recommended: LLaMA 3.2 Vision (11B parameters)
   ollama pull llama3.2-vision:11b

   # Or smaller/faster alternatives:
   ollama pull llama3.2-vision:7b    # Smaller, faster
   ollama pull llava:13b              # Alternative vision model
   ```

## Configuration

Your `.env.local` is already configured:

```bash
USE_OLLAMA=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2-vision:11b
```

## Usage

1. **Start Ollama** (if not running):

   ```bash
   ollama serve
   ```

2. **Start Next.js dev server**:

   ```bash
   npm run dev
   ```

3. **Test the app**:
   - Go to http://localhost:3000
   - Login with Google
   - Upload a vehicle damage photo
   - Click "Analyze Damage"
   - Check terminal logs to see Ollama processing

## Terminal Output

You should see:

```bash
=== Damage Analysis Request ===
Using: Ollama (llama3.2-vision:11b)
Image data received (length): 123456
Calling Ollama API at: http://localhost:11434
Ollama raw response: {"damages": [...], ...}
Returning estimate: {...}
```

## Switch Between Ollama and OpenAI

**Use Ollama (local, free):**

```bash
USE_OLLAMA=true
```

**Use OpenAI (cloud, paid):**

```bash
USE_OLLAMA=false
OPENAI_API_KEY=sk-proj-your-key-here
```

Then restart the dev server.

## Performance Expectations

**LLaMA 3.2 Vision 11B:**

- First request: ~10-30 seconds (model loading)
- Subsequent requests: ~3-10 seconds
- Accuracy: Good for most vehicle damage
- GPU recommended for speed

**LLaMA 3.2 Vision 7B:**

- Faster but less accurate
- Good for quick testing

## Troubleshooting

### Error: "Ollama API error: 404"

- Model not pulled. Run: `ollama pull llama3.2-vision:11b`

### Error: "Connection refused"

- Ollama service not running. Run: `ollama serve`

### Slow Performance

- Normal on first request (loading model into memory)
- Use GPU if available: Ollama auto-detects
- Use smaller model: `llama3.2-vision:7b`

### Invalid JSON Response

- Ollama sometimes returns text instead of pure JSON
- The code has fallback handling
- Try adding more specific prompts

### Out of Memory

- Model too large for your system
- Use smaller model: `ollama pull llama3.2-vision:7b`
- Close other applications

## Available Vision Models

| Model               | Size | Speed  | Accuracy | Command                           |
| ------------------- | ---- | ------ | -------- | --------------------------------- |
| llama3.2-vision:11b | ~7GB | Medium | High     | `ollama pull llama3.2-vision:11b` |
| llama3.2-vision:7b  | ~4GB | Fast   | Good     | `ollama pull llama3.2-vision:7b`  |
| llava:13b           | ~8GB | Medium | High     | `ollama pull llava:13b`           |
| llava:7b            | ~4GB | Fast   | Good     | `ollama pull llava:7b`            |
| bakllava            | ~5GB | Fast   | Good     | `ollama pull bakllava`            |

## Test with Ollama CLI

Quick test without the app:

```bash
# Encode image to base64
base64 -i test-damage.jpg > image.b64

# Test with Ollama CLI
ollama run llama3.2-vision:11b "Describe the vehicle damage in this image" < image.b64
```

## Comparing Ollama vs OpenAI

| Feature  | Ollama                    | OpenAI GPT-4 Vision   |
| -------- | ------------------------- | --------------------- |
| Cost     | Free                      | ~$0.01-0.03 per image |
| Speed    | 3-30s (local)             | 1-5s (API)            |
| Accuracy | Good                      | Excellent             |
| Privacy  | 100% local                | Cloud-based           |
| Setup    | Install + download models | API key only          |
| Best For | Development, testing      | Production            |

## Production Deployment

**Important:** Ollama is for local testing only. For production:

1. Set `USE_OLLAMA=false` in production `.env`
2. Add OpenAI API key
3. Ollama requires server GPU resources - expensive to host

## Advanced: Custom Prompts

Edit `app/api/analyze-damage/route.ts` to customize the prompt:

```typescript
const systemPrompt = `Your custom instructions here...`;
```

## Resources

- Ollama Docs: https://github.com/ollama/ollama
- Model Library: https://ollama.ai/library
- Vision Models: https://ollama.ai/search?q=vision
- Discord Community: https://discord.gg/ollama

## Quick Commands Reference

```bash
# Start Ollama
ollama serve

# Pull vision model
ollama pull llama3.2-vision:11b

# List installed models
ollama list

# Remove model
ollama rm llama3.2-vision:11b

# Check Ollama version
ollama --version

# View model info
ollama show llama3.2-vision:11b
```
