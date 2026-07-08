# ClickInsights.AI — Setup Guide

## 1. Install dependencies

```bash
cd clickinsights
npm install
```

## 2. Set up Supabase

1. Go to https://supabase.com and create a free project
2. In your project dashboard → **Settings → API**
3. Copy your **Project URL** and **anon/public key**
4. Create your env file:

```bash
cp .env.example .env
```

5. Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

6. In Supabase dashboard → **Authentication → Providers** → make sure **Email** is enabled

## 3. Run locally

```bash
npm run dev
```

Open http://localhost:5173 — create an account and you're in.

---

## 4. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial ClickInsights MVP"
gh repo create clickinsights --public --source=. --push
# or manually: git remote add origin https://github.com/YOUR_USERNAME/clickinsights.git && git push -u origin main
```

---

## 5. Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
# Follow the prompts — it auto-detects Vite
```

### Option B — Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

---

## 6. Connect custom domain: clickinsights.ai

### Step 1 — Purchase the domain
Buy **clickinsights.ai** from Namecheap, Cloudflare Registrar, or Google Domains.

### Step 2 — Add domain in Vercel
1. Vercel Dashboard → your project → **Settings → Domains**
2. Enter `clickinsights.ai` and click **Add**
3. Vercel shows you DNS records to add

### Step 3 — Configure DNS at your registrar
Add these records at your domain registrar:

| Type  | Name | Value                         |
|-------|------|-------------------------------|
| A     | @    | 76.76.21.21                   |
| CNAME | www  | cname.vercel-dns.com          |

### Step 4 — SSL
Vercel automatically provisions a free SSL certificate within ~5 minutes. Your site will be live at https://clickinsights.ai.

---

## 7. Update Supabase auth redirect URL

Once live, go to Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://clickinsights.ai`
- **Redirect URLs**: `https://clickinsights.ai/**`

---

## Project Structure

```
clickinsights/
├── src/
│   ├── context/AuthContext.jsx   # Supabase auth state
│   ├── lib/supabase.js           # Supabase client
│   ├── components/layout/        # Sidebar + Layout
│   └── pages/
│       ├── Auth.jsx              # Login / signup
│       ├── Dashboard.jsx         # Overview + charts
│       ├── RevenueImpact.jsx     # Killer feature — $ lost per exit
│       ├── Sessions.jsx          # Session recordings list
│       ├── Heatmap.jsx           # Click / scroll / move maps
│       ├── AIDiagnosis.jsx       # AI root cause + fixes
│       └── Funnels.jsx           # Funnel drop-off analysis
├── vercel.json                   # SPA rewrite rules
└── .env.example                  # Copy to .env
```

## Next Steps (after MVP)

- [ ] Wire up real tracking script (snippet for customer sites)
- [ ] Connect OpenAI API for live AI diagnosis
- [ ] Add Stripe for billing ($59/mo base plan)
- [ ] Build onboarding flow with snippet installation guide
- [ ] Add team collaboration (invite users to a workspace)
