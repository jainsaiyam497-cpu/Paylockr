# Paylockr 💰

A comprehensive financial management and tax compliance platform designed to help individuals and businesses manage their finances efficiently and stay compliant with Indian tax regulations.

## Features ✨

- **Financial Dashboard** - Track your income, expenses, and financial overview at a glance
- **Tax Calendar** - Stay updated with important tax deadlines and compliance dates
- **Income Management** - Record and categorize your income sources
- **Expense Tracking** - Monitor and organize your spending patterns
- **Tax Planning** - Get insights on tax-saving strategies and deductions
- **Secure Authentication** - User authentication with Supabase backend
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack 🛠️

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS3
- **Backend:** Supabase (Authentication & Database)
- **Deployment:** Netlify

## Project Structure 📁

```
src/
├── components/          # Reusable UI components
│   └── Button.tsx
├── pages/              # Page components
├── services/           # API and service integrations
│   ├── geminiService.ts
│   ├── supabaseClient.ts
│   ├── dataService.ts       # Core data relationship manager
│   ├── transactionService.ts
│   └── taxService.ts
├── styles/             # Global and component styles
│   └── designSystem.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── utils/              # Utility functions
│   ├── multiUserUnifiedData.ts  # Interconnected data system
│   └── smartTaxVault.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Data Architecture 🏗️

Paylockr uses a **comprehensive interconnected data model** where every transaction, invoice, expense, and tax entry is meaningfully linked. This creates a living financial ecosystem.

**Key Features:**
- ✅ Every transaction links to invoices or expenses
- ✅ Smart Tax Vault auto-calculates from real income
- ✅ Tax Calendar shows actual amounts from vault
- ✅ AI Insights analyzes cross-module patterns
- ✅ Bank accounts reflect real-time balances
- ✅ No isolated data - everything is connected

**Documentation:**
- [Complete Data Architecture](./DATA_ARCHITECTURE.md) - Detailed system design
- [Quick Start Guide](./QUICK_START.md) - How to use the data system
- [System Diagrams](./SYSTEM_DIAGRAM.md) - Visual data flow maps

**Example Data Flow:**
```
Client Pays Invoice → Transaction Created → Vault Entry Generated 
→ Tax Calendar Updated → Bank Balance Updated → Dashboard Refreshed 
→ AI Insights Analyzed → Notification Sent
```

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaiyamJain468/Paylockr.git
   cd Paylockr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   # The .env.local file already exists, just update it with your keys
   ```
   
   **Add your API keys to `.env.local`:**
   ```env
   # Google Gemini AI (Required for AI Insights)
   VITE_GEMINI_API_KEY=AIzaSyC_your_actual_key_here
   
   # Supabase (Optional - for real authentication)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Get Gemini API Key (Free):**
   - Visit: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy and paste into `.env.local`
   
   **Get Supabase Credentials (Optional):**
   - Visit: https://supabase.com
   - Create project and get URL + anon key from Settings → API

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser
   
   **Note:** After adding API keys to `.env.local`, restart the dev server (Ctrl+C, then `npm run dev`)

### Build for Production

```bash
npm run build
```

This generates optimized files in the `dist` folder.

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## Important Notes ⚠️

When working with JSX and text content containing comparison operators:
- Replace `>` with `&gt;`
- Replace `<` with `&lt;`

Example:
```jsx
// ❌ Wrong
<li>Turnover > ₹10 lakh</li>

// ✅ Correct
<li>Turnover &gt; ₹10 lakh</li>
```

## Key Features in Detail 📋

### AI-Powered Tax Insights ✨
Get personalized tax recommendations using Google Gemini AI:
- Analyze your transaction patterns
- Identify tax-saving opportunities
- Get recommendations on tax percentage to set aside
- Understand tax slab risks
- **Setup:** See `SETUP_GUIDE.md` for API key instructions

### Tax Calendar
Comprehensive tax compliance calendar for Indian taxpayers including:
- Income Tax deadlines
- GST filing dates
- TDS deposit schedules
- Audit requirements
- Quarterly advance tax payments

### Financial Dashboard
- Real-time balance overview
- Income vs. Expense visualization
- Transaction history
- Financial health metrics

### Authentication
Secure user authentication powered by Supabase with:
- Email/password login
- Secure session management
- User data protection

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

For support, email support@paylockr.com or open an issue on GitHub.

## Author ✍️

**Saiyam Jain**
- GitHub: [@SaiyamJain468](https://github.com/SaiyamJain468)

---

**Built with ❤️ for financial freedom**