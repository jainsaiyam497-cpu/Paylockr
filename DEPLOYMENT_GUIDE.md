# 🚀 Deployment Guide

## Quick Deploy

### Vercel (Recommended)
```bash
deploy-vercel.bat
```

### Netlify
```bash
deploy-netlify.bat
```

---

## Manual Deployment

### 1️⃣ Vercel

**Option A: CLI**
```bash
npm install -g vercel
npm run build
vercel --prod
```

**Option B: GitHub Integration**
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set environment variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_GROQ_API_KEY`
   - `VITE_DOCUMENT_SERVICE_URL`
5. Deploy

### 2️⃣ Netlify

**Option A: CLI**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**Option B: Drag & Drop**
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder
4. Add environment variables in Site Settings

**Option C: GitHub Integration**
1. Push code to GitHub
2. Go to https://app.netlify.com/start
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Deploy

---

## Environment Variables

Add these in your deployment platform:

```env
VITE_GEMINI_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_key_here
VITE_DOCUMENT_SERVICE_URL=https://your-backend.onrender.com
VITE_SUPABASE_URL=your_supabase_url (optional)
VITE_SUPABASE_ANON_KEY=your_supabase_key (optional)
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_key (optional)
```

---

## Deploy Backend (Python Service)

### Render (Free)
1. Go to https://render.com
2. New > Web Service
3. Connect `document-service` folder
4. Settings:
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env var: `GEMINI_API_KEY`
6. Deploy
7. Copy URL and update frontend: `VITE_DOCUMENT_SERVICE_URL`

### Railway
```bash
cd document-service
railway login
railway init
railway up
```

---

## Verify Deployment

1. ✅ Frontend loads
2. ✅ Login works
3. ✅ Dashboard displays
4. ✅ Import statement works (if backend deployed)
5. ✅ No console errors

---

## Troubleshooting

**Build fails:**
- Check Node.js version (18+)
- Run `npm install` locally first
- Check build logs

**Environment variables not working:**
- Must start with `VITE_`
- Redeploy after adding variables
- Check spelling

**Backend not connecting:**
- Verify `VITE_DOCUMENT_SERVICE_URL` is correct
- Check backend is deployed and running
- Check CORS settings in backend

---

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records

---

## Performance Tips

- ✅ Already configured: Code splitting
- ✅ Already configured: Asset caching
- ✅ Already configured: Gzip compression
- Consider: CDN for images
- Consider: Lazy loading for heavy components
