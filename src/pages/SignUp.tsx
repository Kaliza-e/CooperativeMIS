import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Handshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
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
      !form.fullName ||
      !form.email ||
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

    try {
      setLoading(true);

      const res = await authAPI.register({
        name: form.fullName.trim(),
        fullName: form.fullName.trim(),
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

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F4F9FD]">
      {/* LEFT SIDE: MedCare Blue Gradient Hero with Real Photo */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-[#0E8FC9] via-[#1A9DD5] to-[#35B6E8] text-white relative overflow-hidden">
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <Handshake size={22} className="text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight leading-none block">
              TERIMBERE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
              Cooperative System
            </span>
          </div>
        </div>

        {/* Center Presentation */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6 max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
            <CheckCircle2 size={14} /> New Member Enrollment
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Official Cooperative Membership Enrollment
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            Register your membership with full statutory compliance. Access transparent shares, mutual emergency funds, and low-interest credit.
          </p>

          {/* Real Photo Card */}
          <div className="rounded-2xl overflow-hidden border border-white/25 shadow-xl relative aspect-[16/9]">
            <img
              src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80"
              alt="Cooperative member registration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white">
                Member-Owned Community Finance • Annual Dividend Program
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Terimbere Cooperative. Regulated & member-owned.
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-[28px] shadow-soft border border-[#E2EEF7] p-8 sm:p-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
            <ShieldCheck size={13} /> Membership Registration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-[#6B7280] mt-1 mb-6">
            Enter your details below to join the cooperative.
          </p>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs font-semibold"
            >
              {success}
            </motion.div>
          )}

          {/* Full Name */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block mb-2">
              Full Name
            </label>
            <div className="flex items-center bg-[#F8FBFE] rounded-2xl px-4 border border-[#E2EEF7] focus-within:border-[#0E8FC9] focus-within:ring-2 focus-within:ring-[#0E8FC9]/15 transition-all">
              <User size={18} className="text-[#6B7280] shrink-0" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Jean Claude Munyaneza"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block mb-2">
              Email Address
            </label>
            <div className="flex items-center bg-[#F8FBFE] rounded-2xl px-4 border border-[#E2EEF7] focus-within:border-[#0E8FC9] focus-within:ring-2 focus-within:ring-[#0E8FC9]/15 transition-all">
              <Mail size={18} className="text-[#6B7280] shrink-0" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="member@terimbere.coop"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block mb-2">
              Password
            </label>
            <div className="flex items-center bg-[#F8FBFE] rounded-2xl px-4 border border-[#E2EEF7] focus-within:border-[#0E8FC9] focus-within:ring-2 focus-within:ring-[#0E8FC9]/15 transition-all">
              <Lock size={18} className="text-[#6B7280] shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6B7280] hover:text-[#0E8FC9] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block mb-2">
              Confirm Password
            </label>
            <div className="flex items-center bg-[#F8FBFE] rounded-2xl px-4 border border-[#E2EEF7] focus-within:border-[#0E8FC9] focus-within:ring-2 focus-within:ring-[#0E8FC9]/15 transition-all">
              <Lock size={18} className="text-[#6B7280] shrink-0" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-[#6B7280] hover:text-[#0E8FC9] transition-colors p-1"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary-pill py-3.5 text-sm font-bold shadow-[0_8px_20px_-4px_rgba(14,143,201,0.35)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Register Account <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Bottom Login Link */}
          <p className="text-center mt-6 text-xs text-[#6B7280]">
            Already have a cooperative account?
            <Link
              to="/login"
              className="text-[#0E8FC9] font-bold ml-1 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
