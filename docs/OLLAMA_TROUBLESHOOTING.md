# Ollama Vision Model is Too Slow - Solutions

## The Problem

The `llama3.2-vision:11b` model is taking longer than 2 minutes to process images, which causes timeouts.

## Quick Fixes (Choose One)

### Option 1: Use Mock Data (Fastest - For UI Development)

```bash
# In .env.local
USE_OLLAMA=false
```

This will return mock damage estimates instantly. Perfect for developing the UI.

### Option 2: Increase Timeout (If Close to Working)

```bash
# In .env.local
OLLAMA_TIMEOUT=300000  # 5 minutes
```

Then restart dev server: `npm run dev`

### Option 3: Use Smaller/Faster Model ⭐ RECOMMENDED

```bash
# Pull the 7B model (smaller, faster)
ollama pull llama3.2-vision:7b

# Update .env.local
OLLAMA_MODEL=llama3.2-vision:7b
OLLAMA_TIMEOUT=60000  # 1 minute should be enough
```

### Option 4: Use LLaVA (Alternative Vision Model)

```bash
# Pull LLaVA (often faster than llama vision)
ollama pull llava:7b

# Update .env.local
OLLAMA_MODEL=llava:7b
OLLAMA_TIMEOUT=60000
```

## Performance Comparison

| Model               | Size  | RAM   | Speed (Cold) | Speed (Warm) | Quality |
| ------------------- | ----- | ----- | ------------ | ------------ | ------- |
| llama3.2-vision:11b | 7.8GB | ~10GB | 60-300s      | 10-60s       | Best    |
| llama3.2-vision:7b  | 4GB   | ~6GB  | 20-60s       | 5-20s        | Good ⭐ |
| llava:7b            | 4GB   | ~6GB  | 15-45s       | 5-15s        | Good ⭐ |
| llava:13b           | 8GB   | ~10GB | 30-90s       | 8-30s        | Better  |

⭐ = Recommended for development

## System Requirements

For smooth operation you need:

- **CPU**: Apple Silicon or modern Intel with AVX2
- **RAM**: At least 8GB free (16GB+ recommended)
- **Storage**: 5-10GB for model

## Troubleshooting

### Still Timing Out?

1. **Check system resources**: `top` or Activity Monitor
2. **Close other apps** to free RAM
3. **Restart Ollama**: `killall ollama && ollama serve`

### Model Loading Forever?

```bash
# Remove and re-pull the model
ollama rm llama3.2-vision:11b
ollama pull llama3.2-vision:11b
```

### Out of Memory?

You need a smaller model or more RAM. Try:

```bash
ollama pull llava:7b
```

## Testing Models

Quick test script:

```bash
#!/bin/bash
MODEL="llava:7b"  # or any model

time ollama run $MODEL "Describe what you see" < <(echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==" | base64 -d)
```

## My Recommendation for Development

**Use mock data** while building the UI:

```bash
USE_OLLAMA=false
```

**Switch to LLaVA 7B** when you need to test AI:

```bash
ollama pull llava:7b
USE_OLLAMA=true
OLLAMA_MODEL=llava:7b
OLLAMA_TIMEOUT=60000
```

**Use OpenAI** for production:

```bash
USE_OLLAMA=false
OPENAI_API_KEY=sk-proj-your-key
```

## Current Status Check

Run this to see what's using resources:

```bash
ps aux | grep ollama
ollama list
```

## Need Help?

1. Check Ollama logs: `journalctl -u ollama` (Linux) or Console.app (Mac)
2. Ollama Discord: https://discord.gg/ollama
3. GitHub Issues: https://github.com/ollama/ollama/issues
