# TERIMBERE Cooperative — Frontend Application

Modern, responsive web interface for the **TERIMBERE Cooperative Management Platform**, built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

---

## 🎨 Design System: MedCare Visual Language

The user interface follows a modern, human-centric aesthetic designed for clarity, high readability, and approachable microfinance operations:

* **Primary Palette**: `#0E8FC9` (Cyan Blue), with a subtle top-to-bottom or 135° gradient to `#35B6E8`.
* **Light Section Tint**: `#E8F4FB` (used for alternating section blocks and soft card backgrounds).
* **Card Surface**: Solid `#FFFFFF` with ultra-soft diffused shadows (`0 10px 30px -5px rgba(14, 143, 201, 0.08)`).
* **Text Hierarchy**: Deep Navy `#1F2A37` for headings; `#6B7280` for secondary metadata and table descriptions.
* **Border Radii**: Cards (`rounded-3xl` / 26px), Action buttons (`rounded-full` / Pill), Status badges (`rounded-full`), Icon containers (`rounded-2xl`).
* **Imagery**: Authentic, high-resolution photography from Unsplash — no cartoon or futuristic AI illustrations.

---

## 🚀 Application Structure & Pages

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── Badge.tsx           # Pill badges with status dot indicator
│   │   ├── Button.tsx          # Rounded-full button with hover-lift & icon support
│   │   ├── Card.tsx            # 26px rounded card container (white/highlight/soft)
│   │   ├── SectionHeader.tsx   # Uppercase eyebrow label, bold title, description
│   │   └── StatCard.tsx        # KPI metrics card (supports solid blue highlight)
│   ├── DataTable.tsx           # Universal 26px table with search, loading skeletons & empty state
│   ├── Layout.tsx              # App dashboard shell (collapsible sidebar, mobile drawer, topbar)
│   ├── Modal.tsx               # Accessible dialog with backdrop blur & spring transitions
│   └── theme-provider.tsx      # System theme configuration
├── context/
│   └── AuthContext.tsx         # JWT token storage, user state, auto-logout on 401
├── lib/
│   ├── api.ts                  # Axios client with bearer token interceptor & typed API methods
│   └── utils.ts                # Tailwind class merging (clsx + tailwind-merge)
├── pages/
│   ├── Welcome.tsx             # Public landing page (Cinematic hero, Floating island nav, FAQ)
│   ├── Login.tsx               # Member & officer sign-in with split photo hero
│   ├── SignUp.tsx              # Cooperative registration with validation & role selector
│   ├── Dashboard.tsx           # Financial overview, Recharts analytics, recent activity
│   ├── Members.tsx             # Member directory, status management, registration modal
│   ├── Loans.tsx               # Micro-loans portfolio, repayment ledger & installment submodal
│   ├── Finances.tsx            # Income & expense ledger, cash flow breakdown
│   ├── Meetings.tsx            # Assembly scheduler & live quorum attendance roll call
│   ├── Tasks.tsx               # Committee action items, priority tags, deadline tracking
│   └── Reports.tsx             # Official PDF and Excel statement download hub
├── App.tsx                     # React Router 7 route definitions & ProtectedRoute guards
├── index.css                   # Tailwind v4 theme definitions and custom utility classes
└── main.tsx                    # React DOM root mounting point
```

---

## 🔑 Key Features

### 1. Public Portal (`/`)
* **Floating Island Navbar**: Semi-translucent pill navigation bar fixed at the top with quick links and sign-in shortcuts.
* **Cinematic Atmospheric Hero**: Authentic cooperative library backdrop with ambient lighting, search prompt, and quick-access chips.
* **Service Showcase**: Detailed breakdown of Savings, Credit, Agribusiness and Insurance services.
* **General Assembly Timetable**: Upcoming member conventions and supervisory meetings.
* **Leadership Showcase & Testimonials**: Real executive profiles and verified member feedback.
* **Interactive FAQ**: Common questions regarding membership shares, dividend distribution, and borrowing limits.

### 2. Member & Executive Dashboard (`/dashboard`)
* Four top stat cards featuring a solid blue highlight card for **Active Members**.
* Interactive **Income vs Expenses** bar chart and **Financial Distribution** donut chart powered by Recharts.
* Real-time list of newly onboarded members and upcoming assemblies.

### 3. Credit & Loans Hub (`/loans`)
* Real-time calculations of total portfolio value, active balances, and accrued interest.
* Interactive installment modal allowing treasurers to record partial or full loan repayments.
* Built-in overpayment prevention preventing accidental double-entry.

### 4. Meeting Governance & Quorum Roll Call (`/meetings`)
* Schedule General Assemblies with venue, agenda, and quorum targets.
* Open an interactive roll call modal to mark members **Present**, **Absent**, or **Excused** with one click.

### 5. Compliance & Reporting (`/reports`)
* One-click PDF generation for auditor sign-off.
* Structured Excel (.xlsx) workbooks for quarterly financial filings.

---

## 🛠️ Local Development & Scripts

### Prerequisites
* Node.js v18 or later
* The backend server running on `http://127.0.0.1:5000`

### Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will run at `http://localhost:5173`.

### Vite Reverse Proxy
API requests made to `/api/*` are automatically forwarded to `http://127.0.0.1:5000` via `vite.config.ts`, avoiding cross-origin issues during local development.

### Production Build

```bash
# Type check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```
Production assets are generated in the `dist/` directory.
