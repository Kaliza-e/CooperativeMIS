import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await authAPI.login({
        email: form.email,
        password: form.password,
      });

      // save token
      localStorage.setItem("token", res.data.token);

      // save user if backend sends it
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      window.dispatchEvent(new Event("auth-state-changed"));

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid email or password."
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
            <ShieldCheck size={14} /> Member Portal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Official Access to Your Cooperative Account
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            Monitor real-time share contributions, track pending loan applications, and review upcoming general assembly schedules.
          </p>

          {/* Real Photo Card */}
          <div className="rounded-2xl overflow-hidden border border-white/25 shadow-xl relative aspect-[16/9]">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
              alt="Cooperative meeting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-xs font-semibold text-white">
                Terimbere Multi-Purpose Cooperative • Member Registry
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-white/70">
          © {new Date().getFullYear()} Terimbere Cooperative. Protected by 256-bit encryption.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-[28px] shadow-soft border border-[#E2EEF7] p-8 sm:p-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#E8F4FB] text-[#0E8FC9] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
            <ShieldCheck size={13} /> Secure Sign In
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-[#6B7280] mt-1 mb-6">
            Enter your credentials to access your cooperative account.
          </p>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-semibold"
            >
              {error}
            </motion.div>
          )}

          {/* Email Field */}
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

          {/* Password Field */}
          <div className="mb-3">
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
                placeholder="••••••••"
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

          <div className="text-right mb-6">
            <Link
              to="/signup"
              className="text-xs text-[#0E8FC9] font-bold hover:underline"
            >
              Need an account? Sign up
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary-pill py-3.5 text-sm font-bold shadow-[0_8px_20px_-4px_rgba(14,143,201,0.35)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Bottom Switch Link */}
          <p className="text-center mt-6 text-xs text-[#6B7280]">
            Don't have a cooperative account?
            <Link
              to="/signup"
              className="text-[#0E8FC9] font-bold ml-1 hover:underline"
            >
              Register here
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
