import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Handshake,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";
import { notify } from "../components/ui/Toast";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

    try {
      setLoading(true);

      const res = await authAPI.register({
        name: fullName,
        fullName: fullName,
        email: form.email.trim(),
        password: form.password,
      });

      // Save token & user if sent
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      window.dispatchEvent(new Event("auth-state-changed"));

      notify.success("Cooperative account registered successfully!");
      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Signup failed. Please try again.";
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] flex flex-col lg:flex-row relative overflow-x-hidden font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANE: Clean Form with Organic Wave Transition
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[54%] xl:w-[50%] min-h-screen bg-white flex flex-col justify-between px-6 sm:px-12 md:px-16 lg:px-20 py-8 lg:py-10 z-20 relative">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between w-full">
          {/* Brand Logo with blue dot indicator */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Return to Public Landing Page"
          >
            <div className="w-7 h-7 rounded-full bg-[#0E8FC9] flex items-center justify-center text-white shadow-sm shadow-[#0E8FC9]/30 group-hover:scale-105 transition-transform">
              <Handshake size={15} />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#1F2A37]">
              TERIMBERE<span className="text-[#0E8FC9]">.</span>
            </span>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-[#6B7280]">
            <Link
              to="/"
              className="hover:text-[#0E8FC9] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-[#0E8FC9] hover:text-[#0A6D9A] transition-colors font-bold"
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Center: Main SignUp Form */}
        <main className="max-w-[440px] w-full mx-auto my-auto py-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9CA3AF]">
                START FOR FREE
              </span>
            </div>

            {/* Heading with primary color dot (Reference Design) */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Create new account<span className="text-[#0E8FC9]">.</span>
            </h1>

            {/* Subheading / Switch link directly under heading */}
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2 mb-6">
              Already A Member?{" "}
              <Link
                to="/login"
                className="text-[#0E8FC9] font-bold hover:underline"
              >
                Log In
              </Link>
            </p>

            {/* Error & Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-semibold flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Row 1: First Name & Last Name (Side by Side) */}
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="bg-[#F4F8FB] hover:bg-[#EEF5FA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E8FC9]/25 focus-within:border-[#0E8FC9] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 transition-all">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="firstName"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]"
                    >
                      First Name
                    </label>
                    <User size={14} className="text-[#9CA3AF]" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Michal"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-semibold text-[#1F2A37] placeholder-[#B0BCC9] outline-none border-none p-0 mt-0.5"
                  />
                </div>

                {/* Last Name */}
                <div className="bg-[#F4F8FB] hover:bg-[#EEF5FA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E8FC9]/25 focus-within:border-[#0E8FC9] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 transition-all">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="lastName"
                      className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]"
                    >
                      Last Name
                    </label>
                    <User size={14} className="text-[#9CA3AF]" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Masiak"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-semibold text-[#1F2A37] placeholder-[#B0BCC9] outline-none border-none p-0 mt-0.5"
                  />
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="bg-[#F4F8FB] hover:bg-[#EEF5FA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E8FC9]/25 focus-within:border-[#0E8FC9] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]"
                  >
                    Email
                  </label>
                  <Mail size={14} className="text-[#9CA3AF]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="michal.masiak@anywhere.co"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-semibold text-[#1F2A37] placeholder-[#B0BCC9] outline-none border-none p-0 mt-0.5"
                />
              </div>

              {/* Row 3: Password */}
              <div className="bg-[#F4F8FB] hover:bg-[#EEF5FA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E8FC9]/25 focus-within:border-[#0E8FC9] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#9CA3AF] hover:text-[#0E8FC9] transition-colors p-0 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-semibold text-[#1F2A37] placeholder-[#B0BCC9] outline-none border-none p-0 mt-0.5 tracking-wider"
                />
              </div>

              {/* Row 4: Confirm Password */}
              <div className="bg-[#F4F8FB] hover:bg-[#EEF5FA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0E8FC9]/25 focus-within:border-[#0E8FC9] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-[#9CA3AF] hover:text-[#0E8FC9] transition-colors p-0 cursor-pointer"
                    title={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-semibold text-[#1F2A37] placeholder-[#B0BCC9] outline-none border-none p-0 mt-0.5 tracking-wider"
                />
              </div>

              {/* Dual Action Buttons (Reference Layout) */}
              <div className="flex items-center gap-3 pt-3">
                {/* Secondary Button: Return home */}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-1/2 py-3 px-4 rounded-full bg-[#F4F8FB] hover:bg-[#E9F2F8] border border-[#E2EEF7] text-[#4B5563] text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft size={15} />
                  <span>Return home</span>
                </button>

                {/* Primary Button: Create account */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 px-4 rounded-full bg-[#0E8FC9] hover:bg-[#0A7DB1] active:bg-[#086b97] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0E8FC9]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-xs text-[#9CA3AF] flex items-center justify-between pt-3 border-t border-gray-100/80">
          <span>© {new Date().getFullYear()} TERIMBERE Cooperative.</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#6B7280]">
            <Sparkles size={12} className="text-[#0E8FC9]" /> Regulated Member Registry
          </span>
        </footer>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANE: High-Res Scenic Photography + Organic Wave Section Divider
      ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block lg:flex-1 relative min-h-screen overflow-hidden">
        {/* High-Resolution Landscape that Complements Cyan Blue (#0E8FC9) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85')`,
          }}
        />

        {/* Crisp Lighting Overlay (No Dimming) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* ─────────────────────────────────────────────────────────────
            ORGANIC WAVY SECTION DIVIDER + PARALLEL DOTTED TRACE LINE
            (Matches Reference Section Divider Curve Exactly)
        ───────────────────────────────────────────────────────────── */}
        <div className="absolute inset-y-0 -left-[1px] w-28 xl:w-36 h-full pointer-events-none z-10">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* 1. Parallel Dotted Contour Trace Line (Echoing the curve) */}
            <path
              d="M 12 0 C 45 18, -8 38, 55 56 C 105 70, -2 88, 38 100"
              fill="none"
              stroke="#0E8FC9"
              strokeWidth="1.2"
              strokeDasharray="3 5"
              strokeOpacity="0.45"
            />

            {/* 2. Main White Organic Wave Fill */}
            <path
              d="M 0 0 L 8 0 C 35 18, -16 38, 42 56 C 88 70, -10 88, 25 100 L 0 100 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* Bottom Right: Modern Geometric Logo Emblem Watermark */}
        <div className="absolute bottom-10 right-12 z-10 flex flex-col items-end pointer-events-none select-none text-white/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
            <div className="flex gap-1.5 items-end">
              <span className="w-1.5 h-6 rounded-full bg-white/85 rotate-12" />
              <span className="w-1.5 h-7 rounded-full bg-white/85 rotate-12" />
              <span className="w-1.5 h-8 rounded-full bg-white rotate-12" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90 mt-2">
            TERIMBERE
          </span>
        </div>
      </div>
    </div>
  );
}
