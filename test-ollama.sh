#!/bin/bash

# Test Ollama Vision Model
# This script tests if Ollama can process images properly

echo "=== Testing Ollama Vision Model ==="
echo ""

# Check if Ollama is running
echo "1. Checking if Ollama is running..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✓ Ollama is running"
else
    echo "✗ Ollama is NOT running"
    echo "  Start it with: ollama serve"
    exit 1
fi

echo ""
echo "2. Checking installed models..."
curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*' | cut -d'"' -f4
echo ""

# Create a small test image (1x1 red pixel)
echo "3. Creating test image..."
TEST_IMAGE="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

echo ""
echo "4. Testing Ollama with vision model (this may take 30-60 seconds)..."
echo "   Note: First run loads the model into memory"

START=$(date +%s)
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
  -d "{
    \"model\": \"llama3.2-vision:11b\",
    \"prompt\": \"Describe this image in one sentence.\",
    \"images\": [\"$TEST_IMAGE\"],
    \"stream\": false
  }" \
  --max-time 120)
END=$(date +%s)
DURATION=$((END - START))

if [ $? -eq 0 ]; then
    echo "✓ Ollama responded in ${DURATION}s"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | jq -r '.response' 2>/dev/null || echo "$RESPONSE"
else
    echo "✗ Ollama request failed or timed out"
    echo "  This usually means:"
    echo "  - Model is loading (wait 1 minute and try again)"
    echo "  - System resources are low"
    echo "  - Model not properly installed"
fi

echo ""
echo "=== Test Complete ==="
echo ""
echo "If the test passed, your Next.js app should work."
echo "If it failed, try:"
echo "  1. Restart Ollama: killall ollama && ollama serve"
echo "  2. Re-pull model: ollama pull llama3.2-vision:11b"
echo "  3. Check system resources (RAM/CPU)"
