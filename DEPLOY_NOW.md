# 🚀 Deploy PayLockr in 2 Minutes

## Option 1: One-Click Deploy (Easiest)

```bash
quick-deploy.bat
```
Choose your platform and follow prompts!

---

## Option 2: Individual Platform

### Vercel
```bash
deploy-vercel.bat
```

### Netlify
```bash
deploy-netlify.bat
```

---

## Option 3: GitHub Auto-Deploy (Best for Production)

### Vercel
1. Push to GitHub: `git push origin main`
2. Go to https://vercel.com/new
3. Import repository
4. Add environment variables (see below)
5. Deploy ✅

### Netlify
1. Push to GitHub: `git push origin main`
2. Go to https://app.netlify.com/start
3. Connect repository
4. Add environment variables (see below)
5. Deploy ✅

---

## 🔑 Required Environment Variables

Add these in your deployment dashboard:

```
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
VITE_DOCUMENT_SERVICE_URL=https://your-backend.onrender.com
```

### Get Free API Keys:
- **Gemini**: https://makersuite.google.com/app/apikey
- **Groq**: https://console.groq.com/keys

---

## 📦 Deploy Backend (Python Service)

### Render (Free - Recommended)
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. Root directory: `document-service`
5. Build: `pip install -r requirements.txt`
6. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add env: `GEMINI_API_KEY=your_key`
8. Deploy
9. Copy URL → Update frontend `VITE_DOCUMENT_SERVICE_URL`

---

## ✅ Verify Deployment

- [ ] Site loads
- [ ] Login works (use demo: saiyam@paylockr.app / Demo@123)
- [ ] Dashboard displays
- [ ] No console errors

---

## 🆘 Troubleshooting

**Build fails?**
- Run `npm install` locally first
- Check Node.js version: `node -v` (need 18+)

**Blank page?**
- Check browser console for errors
- Verify environment variables are set
- Check if variables start with `VITE_`

**Backend not working?**
- Deploy backend first
- Update `VITE_DOCUMENT_SERVICE_URL`
- Redeploy frontend

---

## 📚 Full Guide

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
