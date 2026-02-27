# 💰 PayLockr - AI-Powered Tax Management for Indian Freelancers

> Automate tax calculations, vault savings, and import bank statements with AI. Built specifically for Indian freelancers following FY 2025-26 New Tax Regime.

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![PayLockr Dashboard](https://via.placeholder.com/800x400/0a0a0a/22d3ee?text=PayLockr+Dashboard)

---

## ✨ Features

### 🧮 Smart Tax Calculator
- **Real-time tax estimation** based on FY 2025-26 New Tax Regime
- **Progressive tax slabs**: 0% up to ₹4L, then 5%, 10%, 15%, 20%, 25%, 30%
- **₹75,000 standard deduction** automatically applied
- **Section 87A rebate** (up to ₹60,000 for income ≤ ₹12L)
- **Accurate monthly projections** based on actual transaction dates

### 🔒 Automatic Tax Vaulting
- **10% auto-save** from every income transaction
- **Separate vault tracking** with real-time balance
- **Tax coverage meter** showing readiness for payments
- **Quarterly reminders** for advance tax deadlines

### 📊 AI-Powered Bank Statement Import
- **Gemini Vision AI** extracts transactions from any format
- **Universal bank support**: HDFC, ICICI, SBI, Axis, Kotak, PNB, BOB, and ALL Indian banks
- **PDF & Image support** (multi-page statements)
- **Auto-categorization**: UPI, NEFT, IMPS, RTGS, ATM
- **Smart classification**: Credits → Business Income, Debits → Expenses

### 📈 Financial Insights
- **AI-powered recommendations** for tax savings
- **Monthly income/expense breakdown** with charts
- **Cashflow analysis** and growth trends
- **Deductible expense tracking**

### 🎨 Modern Interface
- **Dark/Light mode** with smooth transitions
- **Responsive design** (mobile, tablet, desktop)
- **Real-time updates** without page refresh
- **Advanced filtering** by date, category, amount

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org)
- **Python 3.11+** - [Download](https://python.org)
- **Git** - [Download](https://git-scm.com)

### One-Click Start

1. **Clone the repository**
```bash
git clone https://github.com/saiyamjain468s-projects/paylockr.git
cd paylockr/"Prototype 4"
```

2. **Run PayLockr**
```bash
# Windows: Double-click this file
start-paylockr.bat

# If you encounter issues, run the fix script first:
fix-paylockr.bat
```

3. **Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Demo Accounts

**Saiyam** (Freelancer with sample data)
- Email: `saiyam@paylockr.app`
- Password: `Demo@123`

**Admin** (Empty account for testing imports)
- Email: `admin@paylockr.app`
- Password: `Admin@123`

---

## 📖 Manual Setup

### Frontend Setup
```bash
cd "Prototype 4"
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
npm run dev
```

### Backend Setup
```bash
cd document-service
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Gemini API key
uvicorn app.main:app --reload --port 8000
```

---

## 🔐 Environment Variables

Create `.env.local` in the frontend folder:

```env
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_DOCUMENT_SERVICE_URL=http://localhost:8000

# Optional (for full features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_key
```

Create `.env` in the document-service folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

### Get API Keys (Free)
- **Gemini AI**: https://makersuite.google.com/app/apikey
- **Groq**: https://console.groq.com/keys
- **Supabase**: https://supabase.com (optional)

---

## 🏗️ Architecture

```
PayLockr/
├── Frontend (React + TypeScript + Vite)
│   ├── Dashboard - Real-time stats & charts
│   ├── Transactions - Import, filter, categorize
│   ├── Smart Tax Vault - Auto-save & tracking
│   ├── Tax Calendar - Quarterly deadlines
│   └── Insights - AI recommendations
│
└── Document Service (Python + FastAPI)
    ├── Gemini Vision API - Extract from images/PDFs
    ├── Universal parser - All Indian bank formats
    └── Smart categorization - Auto-classify transactions
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.8** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Lucide Icons** - Icon library

### Backend
- **Python 3.11+** - Runtime
- **FastAPI** - Web framework
- **Gemini Vision API** - AI extraction
- **Tesseract OCR** - Fallback OCR

### Services
- **Supabase** - Auth & Database (optional)
- **Gemini AI** - Vision & Text generation
- **Groq** - Fast LLM inference

---

## 📱 Usage Guide

### Import Bank Statement
1. Click **"IMPORT"** button in Transactions page
2. Upload PDF or screenshot of your bank statement
3. AI extracts all transactions automatically
4. Review and confirm imported data
5. Transactions appear with auto-calculated tax

### View Tax Breakdown
1. Go to **Dashboard**
2. See real-time tax calculation
3. Check vault balance vs. tax liability
4. View quarterly payment schedule

### Track Expenses
1. All debits auto-categorized (Food, Travel, etc.)
2. Filter by category, date, amount
3. See deductible business expenses
4. Export for tax filing

---

## 🚢 Deployment

### Deploy Frontend (Vercel)
```bash
npm run build
vercel
```

### Deploy Backend (Render)
1. Push `document-service/` to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GEMINI_API_KEY`
7. Deploy and copy URL
8. Update frontend `.env`: `VITE_DOCUMENT_SERVICE_URL=https://your-service.onrender.com`

---

## 🎯 Roadmap

- [ ] Multi-user support with Supabase
- [ ] Expense receipt scanning
- [ ] GST calculation for businesses
- [ ] ITR form pre-filling
- [ ] Investment tracking (80C, 80D)
- [ ] Mobile app (React Native)
- [ ] WhatsApp notifications
- [ ] CA consultation integration

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Vision & LLM capabilities
- **Indian Tax System** - FY 2025-26 New Regime
- **Open Source Community** - Amazing libraries

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/saiyamjain468s-projects/paylockr/issues)
- **Email**: saiyamjain468@gmail.com
- **Troubleshooting**: Check `start-paylockr.bat` logs

---

## 👨💻 Author

**Saiyam Jain**
- GitHub: [@saiyamjain468s-projects](https://github.com/saiyamjain468s-projects)
- Built for Cu AI Fest

---

<div align="center">

**Made with ❤️ for Indian Freelancers**

⭐ Star this repo if you find it helpful!

</div>
