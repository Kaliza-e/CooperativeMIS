import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  Users,
  PiggyBank,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  FileSpreadsheet,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Layers,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Welcome() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [transactionTab, setTransactionTab] = useState<"all" | "savings" | "loans" | "expenses">("all");

  const isAuthenticated = Boolean(
    localStorage.getItem("token") && localStorage.getItem("user")
  );

  // Concise, punchy hero slides with authentic cooperative photography
  const heroSlides = [
    {
      badge: "CENTRALIZED COOPERATIVE SYSTEM",
      title: "Manage Your Cooperative. Track Every Transaction. Monitor Your Growth.",
      subtitle:
        "TERIMBERE brings your members, savings, loans, meetings, and finances together in one organized platform.",
      bgImage:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1920&q=80",
      statsTag: "Accurate Records • Instant Financial Reports",
    },
    {
      badge: "SAVINGS & LOANS MANAGEMENT",
      title: "Track Member Savings & Micro-Loans with Precision",
      subtitle:
        "Automate repayment schedules, monitor balances in real time, and protect your treasury from calculation errors.",
      bgImage:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1920&q=80",
      statsTag: "99.4% On-Time Repayments • Real-Time Amortization",
    },
    {
      badge: "MEETINGS & GOVERNANCE",
      title: "Convene Assemblies & Enforce Legal Quorum",
      subtitle:
        "Digital roll calls verify meeting quorum in seconds, delegating committee tasks and compiling signed reports.",
      bgImage:
        "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1920&q=80",
      statsTag: "Live Attendance Verification • Signed PDF & Excel Exports",
    },
  ];

  // Auto-advance slides smoothly every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Sample transactions representing actual system ledger data
  const sampleTransactions = [
    {
      id: "TX-2026-091",
      type: "savings",
      typeLabel: "Savings Deposit",
      member: "Esther Uwase",
      memberId: "MEM-042",
      amount: "+$250.00",
      method: "Mobile Money",
      date: "Today, 10:30 AM",
      status: "Recorded",
      isPositive: true,
    },
    {
      id: "TX-2026-090",
      type: "loans",
      typeLabel: "Loan Repayment",
      member: "Berard Habimana",
      memberId: "MEM-019",
      amount: "+$185.00",
      method: "Bank Transfer",
      date: "Today, 09:15 AM",
      status: "Reconciled",
      isPositive: true,
    },
    {
      id: "TX-2026-089",
      type: "expenses",
      typeLabel: "Operational Expense",
      member: "Assembly Hall Rental",
      memberId: "VOUCHER-08",
      amount: "-$120.00",
      method: "Cash Voucher",
      date: "Yesterday",
      status: "Approved",
      isPositive: false,
    },
    {
      id: "TX-2026-088",
      type: "loans",
      typeLabel: "Loan Disbursement",
      member: "Kaliza Mukamana",
      memberId: "MEM-063",
      amount: "-$1,500.00",
      method: "Bank Transfer",
      date: "2 Days ago",
      status: "Disbursed",
      isPositive: false,
    },
    {
      id: "TX-2026-087",
      type: "savings",
      typeLabel: "Monthly Contribution",
      member: "Jean de Dieu N.",
      memberId: "MEM-014",
      amount: "+$100.00",
      method: "Mobile Money",
      date: "3 Days ago",
      status: "Recorded",
      isPositive: true,
    },
  ];

  const filteredTransactions =
    transactionTab === "all"
      ? sampleTransactions
      : sampleTransactions.filter((tx) => tx.type === transactionTab);

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#1F2A37] overflow-x-hidden font-sans selection:bg-[#0E8FC9]/20 selection:text-[#0E8FC9]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING PILL NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 transition-all">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-[0_12px_36px_-6px_rgba(14,143,201,0.18)] px-5 sm:px-8 py-3.5 flex items-center justify-between border border-white/70 text-[#1F2A37]">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0E8FC9] to-[#35B6E8] flex items-center justify-center text-white shadow-md shadow-[#0E8FC9]/25">
              <Handshake size={20} />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1F2A37] block leading-none">
                TERIMBERE
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E8FC9]">
                Cooperative System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#4B5563]">
            <a href="#hero" className="hover:text-[#0E8FC9] transition-colors py-1">
              Home
            </a>
            <a href="#about" className="hover:text-[#0E8FC9] transition-colors py-1">
              About
            </a>
            <a href="#features" className="hover:text-[#0E8FC9] transition-colors py-1">
              Features
            </a>
            <a href="#overview" className="hover:text-[#0E8FC9] transition-colors py-1">
              Overview
            </a>
            <a href="#transactions" className="hover:text-[#0E8FC9] transition-colors py-1">
              Transactions
            </a>
            <a href="#reports" className="hover:text-[#0E8FC9] transition-colors py-1">
              Reports
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0E8FC9] hover:text-[#0973A3] px-4 py-2 rounded-full bg-[#E8F4FB] hover:bg-[#D4ECFB] transition-all cursor-pointer"
              >
                Go to Dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1F2A37] hover:text-[#0E8FC9] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0E8FC9] to-[#35B6E8] text-white text-xs font-bold hover:shadow-[0_8px_20px_-4px_rgba(14,143,201,0.4)] transition-all cursor-pointer"
            >
              <span>{isAuthenticated ? "My Account" : "Get Started"}</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4B5563] hover:text-[#0E8FC9] rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 lg:hidden flex flex-col gap-3 text-sm font-semibold text-[#1F2A37]"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                Home
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                About
              </a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                Core Features
              </a>
              <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                Financial Overview
              </a>
              <a href="#transactions" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                Transactions
              </a>
              <a href="#reports" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#0E8FC9]">
                Reports
              </a>
              <hr className="border-gray-100 my-1" />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. RESTORED CINEMATIC COOPERATIVE HERO (Reduced Verbosity)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[96vh] flex flex-col justify-between pt-36 pb-20 px-6 sm:px-12 overflow-hidden"
      >
        {/* Full-bleed Photo Carousel with Smooth Dissolve */}
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              scale: activeSlide === index ? 1 : 1.05,
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img
              src={slide.bgImage}
              alt="Cooperative Collaboration"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#081726]/90 via-[#0A2239]/80 to-[#0B1D2E]/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E8FC9]/25 via-transparent to-transparent" />
          </motion.div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center mt-8 sm:mt-12 space-y-6">
          {/* Eyebrow Pill */}
          <motion.div
            key={`badge-${activeSlide}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold uppercase tracking-widest shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#35B6E8] animate-pulse" />
            <span>{heroSlides[activeSlide].badge}</span>
          </motion.div>

          {/* Punchy Headline */}
          <motion.h1
            key={`title-${activeSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]"
          >
            {heroSlides[activeSlide].title}
          </motion.h1>

          {/* Simple, Non-Verbose Subtitle */}
          <motion.p
            key={`sub-${activeSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            {heroSlides[activeSlide].subtitle}
          </motion.p>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold shadow-[0_12px_30px_-6px_rgba(14,143,201,0.6)] cursor-pointer"
            >
              {isAuthenticated ? "Launch Dashboard" : "Get Started"}
              <ArrowRight size={17} />
            </Button>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold transition-all cursor-pointer"
            >
              Explore Features <ChevronDown size={16} />
            </a>
          </motion.div>

          {/* Search Pill Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-xl mx-auto pt-4"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.25)] p-2 pl-5 flex items-center border border-white/40">
              <Search size={18} className="text-[#0E8FC9] shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member records, loan plans, assemblies..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#1F2A37] placeholder-[#6B7280] outline-none"
              />
              <button
                type="submit"
                className="btn-primary-pill text-xs font-bold px-5 py-2.5 shrink-0 shadow-md cursor-pointer"
              >
                Search <ArrowRight size={14} />
              </button>
            </div>
          </motion.form>
        </div>

        {/* Bottom Hero HUD Strip & Slide Switcher */}
        <div className="relative z-10 max-w-6xl mx-auto w-full pt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/15 text-white/90 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E8FC9]" />
            <span className="font-semibold text-white tracking-wide">
              {heroSlides[activeSlide].statsTag}
            </span>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 font-semibold">
            <div>
              <span className="text-[#35B6E8] font-bold text-sm">1,280</span> Members
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="text-[#35B6E8] font-bold text-sm">99.4%</span> Repayments
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="text-[#35B6E8] font-bold text-sm">100%</span> Audited Ledger
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
              }
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === i ? "w-6 bg-[#0E8FC9]" : "w-2 bg-white/40"
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Organic Curved Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0 pointer-events-none text-[#F4F9FD]">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-12 sm:h-20" preserveAspectRatio="none">
            <path
              d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION A: ABOUT TERIMBERE (Concise)
      ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <ShieldCheck size={14} /> Purpose-Built
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2A37] tracking-tight">
              Designed for Cooperative Administration
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              Cooperatives need specialized tools: managing member equity, monitoring individual savings contributions, automating loan amortization, and validating assembly quorum.
            </p>
            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
              TERIMBERE centralizes your records in one secure system, eliminating manual spreadsheet errors.
            </p>

            <div className="pt-2 grid sm:grid-cols-2 gap-3 text-xs font-bold text-[#1F2A37]">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E2EEF7] shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                <span>Accurate Member Records</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E2EEF7] shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                <span>Double-Entry Ledger</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E2EEF7] shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                <span>Automated Loan Schedules</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E2EEF7] shadow-2xs">
                <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                <span>One-Click Export Reports</span>
              </div>
            </div>
          </div>

          {/* Right Governance Role Breakdown */}
          <div className="bg-white rounded-3xl p-7 border border-[#E2EEF7] shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F6FA] pb-3">
              <h4 className="font-extrabold text-sm text-[#1F2A37]">
                Governance Role Separation
              </h4>
              <span className="text-[10px] font-bold text-[#0E8FC9] bg-[#E8F4FB] px-2.5 py-0.5 rounded-full">
                Protected Access
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#F8FBFE] rounded-2xl border border-[#E2EEF7] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1F2A37]">Chairperson & Executive</div>
                  <div className="text-[11px] text-[#6B7280]">Policy oversight & assembly leadership</div>
                </div>
                <span className="text-[10px] font-bold text-[#0E8FC9]">Admin</span>
              </div>

              <div className="p-3 bg-[#F8FBFE] rounded-2xl border border-[#E2EEF7] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1F2A37]">Treasurer & Accountant</div>
                  <div className="text-[11px] text-[#6B7280]">Treasury inflows, loans & disbursements</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600">Treasury</span>
              </div>

              <div className="p-3 bg-[#F8FBFE] rounded-2xl border border-[#E2EEF7] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1F2A37]">Supervisory Board</div>
                  <div className="text-[11px] text-[#6B7280]">Audit trails & compliance verification</div>
                </div>
                <span className="text-[10px] font-bold text-purple-600">Auditor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION B: 6 CORE MODULES (Clean & Scannable)
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white border-t border-[#E2EEF7]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Layers size={14} /> The 6 Core Modules
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2A37] tracking-tight">
              Essential Tools for Your Cooperative
            </h2>
            <p className="text-sm text-[#6B7280]">
              Built strictly around the six operational workflows of cooperative management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* 1. Member Management */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Member Management</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Register members, maintain verified contact details, track membership status (`active`, `inactive`, `suspended`), and monitor participation.
              </p>
            </div>

            {/* 2. Savings and Contributions */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <PiggyBank size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Savings & Contributions</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Record deposits, track accumulated savings, monitor individual member balances, and maintain clear contribution histories.
              </p>
            </div>

            {/* 3. Loan Management */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <TrendingUp size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Loan Management</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Issue loans, calculate interest and repayment schedules, log installments, and monitor outstanding balances with overpayment safeguards.
              </p>
            </div>

            {/* 4. Meetings Management */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <Calendar size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Meetings & Quorum</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Schedule assemblies, track member attendance (`Present`, `Absent`, `Excused`), and verify statutory quorum thresholds in real time.
              </p>
            </div>

            {/* 5. Financial Management */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <DollarSign size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Financial Management</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Record all cash inflows and outflows, categorize vouchers, and monitor your current liquid treasury balance.
              </p>
            </div>

            {/* 6. Reports and Analytics */}
            <div className="bg-[#F8FBFE] rounded-3xl p-7 border border-[#E2EEF7] shadow-2xs space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
                <FileText size={22} />
              </div>
              <h3 className="text-lg font-black text-[#1F2A37]">Reports & Exports</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Generate signed PDF summaries and multi-sheet Excel (.xlsx) workbooks for audits, tax filings, and general assemblies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION C: FINANCIAL OVERVIEW PREVIEW (8 Indicators)
      ───────────────────────────────────────────────────────────── */}
      <section id="overview" className="py-24 bg-[#E8F4FB] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 bg-white text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xs">
              <BarChart3 size={14} /> Financial Overview
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2A37] tracking-tight">
              Key Cooperative Indicators
            </h2>
            <p className="text-sm text-[#6B7280]">
              Live portfolio summary accessible to administrators.
            </p>
          </div>

          {/* 8 Indicators Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Total Members
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">1,280</span>
              <span className="text-[10px] text-[#0E8FC9] font-bold mt-1 block">Active Roster</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Total Savings
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">$348,720</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Accumulated</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Loans Disbursed
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">$184,250</span>
              <span className="text-[10px] text-[#0E8FC9] font-bold mt-1 block">Cumulative</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Outstanding Loans
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">$42,600</span>
              <span className="text-[10px] text-amber-600 font-bold mt-1 block">Amortizing</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Total Repayments
              </span>
              <span className="text-2xl font-black text-emerald-600 block">$141,650</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Recovered</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Total Income
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">$96,400</span>
              <span className="text-[10px] text-[#0E8FC9] font-bold mt-1 block">Dues & Interest</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2EEF7] shadow-soft">
              <span className="text-[11px] font-bold uppercase text-[#6B7280] block mb-1">
                Total Expenses
              </span>
              <span className="text-2xl font-black text-[#1F2A37] block">$32,180</span>
              <span className="text-[10px] text-rose-600 font-bold mt-1 block">Operational</span>
            </div>

            <div className="bg-gradient-to-br from-[#0E8FC9] to-[#35B6E8] p-5 rounded-3xl text-white shadow-md">
              <span className="text-[11px] font-bold uppercase text-white/80 block mb-1">
                Treasury Balance
              </span>
              <span className="text-2xl font-black text-white block">$412,940</span>
              <span className="text-[10px] text-white/90 font-bold mt-1 block">Liquid Cash</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION D: TRANSACTION TRACKING
      ───────────────────────────────────────────────────────────── */}
      <section id="transactions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Filter size={14} /> Clear Records
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1F2A37] tracking-tight">
              Financial Transaction Tracking
            </h2>
            <p className="text-sm text-[#6B7280]">
              Every contribution, disbursement, and operational voucher is logged with an audit trail.
            </p>
          </div>

          <div className="bg-[#F8FBFE] rounded-3xl border border-[#E2EEF7] p-6 max-w-5xl mx-auto shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2EEF7] gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTransactionTab("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transactionTab === "all"
                      ? "bg-[#0E8FC9] text-white"
                      : "bg-white text-[#6B7280] hover:text-[#0E8FC9] border border-[#E2EEF7]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTransactionTab("savings")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transactionTab === "savings"
                      ? "bg-[#0E8FC9] text-white"
                      : "bg-white text-[#6B7280] hover:text-[#0E8FC9] border border-[#E2EEF7]"
                  }`}
                >
                  Savings
                </button>
                <button
                  onClick={() => setTransactionTab("loans")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transactionTab === "loans"
                      ? "bg-[#0E8FC9] text-white"
                      : "bg-white text-[#6B7280] hover:text-[#0E8FC9] border border-[#E2EEF7]"
                  }`}
                >
                  Loans
                </button>
                <button
                  onClick={() => setTransactionTab("expenses")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transactionTab === "expenses"
                      ? "bg-[#0E8FC9] text-white"
                      : "bg-white text-[#6B7280] hover:text-[#0E8FC9] border border-[#E2EEF7]"
                  }`}
                >
                  Expenses
                </button>
              </div>

              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Audit Logged
              </span>
            </div>

            <div className="divide-y divide-[#E2EEF7]">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.isPositive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {tx.isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-[#1F2A37] flex items-center gap-2">
                        <span>{tx.member}</span>
                        <span className="text-[10px] text-[#6B7280] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E2EEF7]">
                          {tx.memberId}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {tx.typeLabel} • {tx.method} • {tx.date}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black ${
                        tx.isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {tx.amount}
                    </span>
                    <span className="text-[9px] font-bold text-[#0E8FC9] bg-[#E8F4FB] px-2 py-0.5 rounded-full block mt-0.5">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION E: REPORTS & REGULATORY EXPORTS
      ───────────────────────────────────────────────────────────── */}
      <section id="reports" className="py-24 bg-[#F8FBFE] border-t border-[#E2EEF7]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                <FileSpreadsheet size={14} /> Official Exports
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1F2A37] tracking-tight">
                Audited Reports at the Click of a Button
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Generate signed PDF summaries and detailed Excel workbooks for tax compliance, annual audits, and general assemblies without manual data entry.
              </p>
              <div className="pt-2 space-y-2 text-xs font-semibold text-[#1F2A37]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                  <span>jsPDF-generated treasury and member audit statements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                  <span>SheetJS (.xlsx) workbooks for external accounting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0E8FC9]" />
                  <span>Attendance and quorum records for legal governance</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-5 rounded-2xl border border-[#E2EEF7] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1F2A37]">Financial Audit Statement (PDF)</h4>
                    <span className="text-[11px] text-[#6B7280]">Signed balance sheet & cash flow summary</span>
                  </div>
                </div>
                <Download size={16} className="text-[#0E8FC9]" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2EEF7] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1F2A37]">Membership & Loan Ledger (Excel)</h4>
                    <span className="text-[11px] text-[#6B7280]">Multi-sheet workbook (.xlsx)</span>
                  </div>
                </div>
                <Download size={16} className="text-[#0E8FC9]" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2EEF7] shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E8FC9] flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1F2A37]">Assembly Quorum Roster</h4>
                    <span className="text-[11px] text-[#6B7280]">Attendance record with quorum validation</span>
                  </div>
                </div>
                <Download size={16} className="text-[#0E8FC9]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION F: FAQ (Concise)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-[#E2EEF7]">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-black text-[#1F2A37] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#6B7280]">
              Quick answers about cooperative management with TERIMBERE.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What does TERIMBERE manage for cooperatives?",
                a: "TERIMBERE centralizes member registries, savings contributions, micro-loan schedules, meeting attendance roll calls, and treasury income/expenses.",
              },
              {
                q: "Can we track loan installments and interest?",
                a: "Yes. The system automatically computes amortization, tracks installment payments, and prevents overpayments.",
              },
              {
                q: "How does quorum verification work during assemblies?",
                a: "The interactive roll-call marks members as Present, Absent, or Excused, immediately calculating whether statutory quorum is met.",
              },
              {
                q: "What reports can be downloaded?",
                a: "Signed PDF statements for audit committees and multi-sheet Excel (.xlsx) workbooks for external accounting and tax filings.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E2EEF7] bg-[#F8FBFE] overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#1F2A37] hover:text-[#0E8FC9] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-300 text-[#0E8FC9] ${
                      activeFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-5 text-xs text-[#6B7280] leading-relaxed border-t border-[#E2EEF7] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FINAL CALL TO ACTION BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#0E8FC9] via-[#1A9DD5] to-[#35B6E8] rounded-3xl sm:rounded-[36px] p-10 sm:p-14 text-white text-center relative overflow-hidden shadow-[0_20px_50px_-10px_rgba(14,143,201,0.5)]">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Bring Clarity and Accountability to Your Cooperative
            </h2>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Start managing your cooperative's members, contributions, micro-loans, and meetings with TERIMBERE today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#0E8FC9] font-black text-xs hover:bg-[#F4F9FD] shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B1D2E] text-white pt-14 pb-10 px-6 sm:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E8FC9] to-[#35B6E8] flex items-center justify-center text-white">
                <Handshake size={16} />
              </div>
              <span className="font-extrabold text-lg text-white">TERIMBERE</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Centralized cooperative management platform for members, savings, loans, meetings, and financial reports.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-[#35B6E8] text-[11px]">
              Core Modules
            </h4>
            <ul className="space-y-1.5 text-white/75">
              <li>Member Management</li>
              <li>Savings & Contributions</li>
              <li>Loan Management</li>
              <li>Meetings & Quorum</li>
              <li>Financial Management</li>
              <li>Reports & Analytics</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-[#35B6E8] text-[11px]">
              Cooperative System
            </h4>
            <ul className="space-y-1.5 text-white/75">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About TERIMBERE
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Financial Overview
                </a>
              </li>
              <li>
                <a href="#reports" className="hover:text-white transition-colors">
                  Reports & Exports
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-[#35B6E8] text-[11px]">
              Access Portal
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left font-bold text-white/90 hover:text-white cursor-pointer"
              >
                Sign In to Cooperative &rarr;
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full text-left font-bold text-[#35B6E8] hover:underline cursor-pointer"
              >
                Register Organization &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-3">
          <div>
            © {new Date().getFullYear()} TERIMBERE Cooperative Management System.
          </div>
          <div className="flex items-center gap-5">
            <span>Accurate Records</span>
            <span>Transaction Transparency</span>
            <span>Secure Reports</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
