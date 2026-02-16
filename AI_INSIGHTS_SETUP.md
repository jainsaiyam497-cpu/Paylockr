# AI Tax Insights Setup Guide

## Why AI Insights Not Working

The AI Insights feature requires a **Google Gemini API key** to generate personalized tax recommendations.

## How to Fix

### Step 1: Get Free Gemini API Key
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with `AIza...`)

### Step 2: Add to Environment File
1. Open `.env.local` file in project root
2. Add your key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyC_YOUR_ACTUAL_KEY_HERE
   ```
3. Save the file

### Step 3: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## What AI Insights Does

Once configured, the AI will analyze:
- Your transaction patterns
- Income sources and amounts
- Tax-saving opportunities
- Optimal tax percentage to vault
- Tax slab risks
- Deduction recommendations

## Already Fixed
✅ Indian number format (₹1,00,000 style) - DONE
✅ All currency displays use proper Indian formatting

## Free Tier Limits
- 60 requests per minute
- Completely free for personal use
- No credit card required

## Alternative (If API Doesn't Work)
The app will show a helpful error message explaining:
- API key is missing or invalid
- How to get a new key
- Link to setup instructions
