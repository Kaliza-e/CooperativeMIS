import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Menu, Home, Users, Calendar, CheckSquare,
  DollarSign, TrendingUp, FileText, Search,
  Bell, ChevronDown, LogOut, Handshake, X,
  ArrowLeft, User
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DotGrid from './ui/DotGrid'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const location = useLocation()
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null

  const userDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/meetings', label: 'Meetings', icon: Calendar },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/finances', label: 'Finances', icon: DollarSign },
    { path: '/loans', label: 'Loans', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
  ]

  return (
    <div className="flex h-screen bg-[#0E8FC9] text-[#1F2A37] overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A2239]/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          1. TEAL/CYAN SIDEBAR (Matching PinHome Design Reference)
      ───────────────────────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 260 : 84,
        }}
        className={`fixed lg:static top-0 bottom-0 left-0 bg-[#0E8FC9] text-white flex flex-col z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Hamburger Button beside logo - Seamless with no white lines */}
        <div className="h-20 flex items-center justify-between px-5 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3 select-none min-w-0" title="TERIMBERE">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
              <Handshake size={20} />
            </div>

            {(sidebarOpen || mobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <span className="font-black text-lg text-white tracking-tight block leading-none">
                  TERIMBERE
                </span>
              </motion.div>
            )}
          </Link>

          {/* Professional Hamburger Toggle right beside logo */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer shrink-0 items-center justify-center"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu size={19} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3.5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm ${
                  isActive
                    ? 'bg-white text-[#0E8FC9] shadow-md font-bold'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  size={19}
                  className={isActive ? 'text-[#0E8FC9] shrink-0' : 'text-white/80 shrink-0'}
                />
                {(sidebarOpen || mobileMenuOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer: Direct Sign Out Button - Seamless without dividing lines */}
        <div className="p-3.5 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/85 hover:text-white hover:bg-rose-500/20 transition-all font-semibold text-xs cursor-pointer group"
            title="Sign Out of Cooperative"
          >
            <LogOut size={18} className="text-white/80 group-hover:text-rose-200 shrink-0" />
            {(sidebarOpen || mobileMenuOpen) && (
              <span className="truncate">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT INSET WHITE CONTAINER WITH ROUNDED-TL CORNER
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white lg:rounded-tl-[36px] shadow-2xl relative z-10 transition-all">
        
        {/* ───────────────────────────────────────────────────────────
            HEADBAR: Clean, Minimalist (Matching Reference Image)
        ─────────────────────────────────────────────────────────── */}
        <header className="h-18 sm:h-20 bg-white px-5 sm:px-8 flex items-center justify-between border-b border-gray-100 z-30 shrink-0">
          
          {/* Left: Mobile Toggle & Minimalist Search Bar */}
          <div className="flex items-center gap-3 sm:gap-5 flex-1 max-w-lg">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#4B5563] hover:text-[#0E8FC9] hover:bg-[#F4F9FD] rounded-xl cursor-pointer shrink-0"
              title="Open Navigation"
            >
              <Menu size={22} />
            </button>

            {/* Clean Minimalist Search (Direct Match to PinHome Reference) */}
            <div className="relative flex items-center w-full max-w-sm sm:max-w-md focus-within:text-[#0E8FC9] transition-colors">
              <Search
                size={18}
                className="text-gray-400 group-focus-within:text-[#0E8FC9] shrink-0 mr-2.5 pointer-events-none transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cooperative records, members, loans..."
                className="w-full bg-transparent text-sm sm:text-base text-[#1F2A37] placeholder-gray-400 outline-none border-none focus:ring-0 font-medium"
              />
            </div>
          </div>

          {/* Right: Back to Home + User Profile + Notification Bell */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* 1. Back to Home Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-[#4B5563] hover:text-[#0E8FC9] hover:bg-[#E8F4FB] transition-all cursor-pointer border border-transparent hover:border-[#D5ECF8] whitespace-nowrap shrink-0"
              title="Return to Public Landing Page"
            >
              <ArrowLeft size={15} className="shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Back to Home</span>
              <span className="sm:hidden whitespace-nowrap">Home</span>
            </Link>

            {/* Direct Headbar Sign Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer border border-rose-100 whitespace-nowrap shrink-0"
              title="Sign Out of Cooperative"
            >
              <LogOut size={14} className="shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Sign Out</span>
            </button>

            {/* 2. User Name & Avatar Container */}
            <div className="relative" ref={userDropdownRef}>
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group py-1"
              >
                {/* User Full Name (as seen in reference) */}
                <span className="hidden md:inline-block text-xs sm:text-sm font-semibold text-[#1F2A37] group-hover:text-[#0E8FC9] transition-colors max-w-[130px] truncate">
                  {user?.name || 'Jonathan Stinson'}
                </span>

                {/* Circular Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#0E8FC9] transition-all shadow-xs shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                    alt={user?.name || "Cooperative Administrator"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <ChevronDown
                  size={14}
                  className={`text-gray-400 group-hover:text-[#0E8FC9] transition-transform duration-200 hidden sm:block ${
                    userDropdownOpen ? 'rotate-180 text-[#0E8FC9]' : ''
                  }`}
                />
              </div>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
                  >
                    {/* Header */}
                    <div className="p-3 bg-[#F8FBFE] rounded-2xl border border-gray-100 mb-1.5">
                      <p className="font-extrabold text-sm text-[#1F2A37] truncate">
                        {user?.name || 'Jonathan Stinson'}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {user?.email || 'member@terimbere.coop'}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-[#0E8FC9] uppercase">ROLE: {user?.role || 'Staff'}</span>
                        <span className="text-emerald-600">● Connected</span>
                      </div>
                    </div>

                    {/* Quick navigation */}
                    <div className="space-y-0.5">
                      <Link
                        to="/members"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1F2A37] font-semibold hover:bg-[#E8F4FB] hover:text-[#0E8FC9] transition-colors"
                      >
                        <User size={15} /> Member Registry
                      </Link>
                      <Link
                        to="/reports"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1F2A37] font-semibold hover:bg-[#E8F4FB] hover:text-[#0E8FC9] transition-colors"
                      >
                        <FileText size={15} /> Export Statements
                      </Link>
                    </div>

                    <div className="my-1 border-t border-gray-100" />

                    {/* Sign out */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 font-semibold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Notification Bell with Red Dot Badge (Direct Match to PinHome) */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-xl transition-all relative cursor-pointer ${
                  notificationsOpen
                    ? 'text-[#0E8FC9] bg-[#E8F4FB]'
                    : 'text-gray-500 hover:text-[#0E8FC9] hover:bg-[#F8FBFE]'
                }`}
                title="Notifications"
              >
                <Bell size={20} />
                {/* Red unread badge dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-xl border border-gray-100 p-4 z-50 text-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="font-extrabold text-sm text-[#1F2A37]">
                        Notifications
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 font-bold text-[10px]">
                        1 New
                      </span>
                    </div>

                    <div className="py-2.5 space-y-2">
                      <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-gray-100 hover:bg-[#E8F4FB] transition-colors cursor-pointer">
                        <div className="font-bold text-[#1F2A37]">
                          General Assembly Attendance Open
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          Quorum validation active for today's session.
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#F8FBFE] border border-gray-100 hover:bg-[#E8F4FB] transition-colors cursor-pointer">
                        <div className="font-bold text-[#1F2A37]">
                          Treasury Ledger Reconciled
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          Quarterly cash flow in perfect balance.
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center border-t border-gray-100">
                      <Link
                        to="/tasks"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[#0E8FC9] font-bold text-[11px] hover:underline"
                      >
                        View all tasks &rarr;
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* ───────────────────────────────────────────────────────────
            VIEWPORT: Main Scrollable Content Area with Page Transitions
        ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto bg-[#F8FBFE] relative">
          {/* Crisp, Visible Dot Grid Across Entire Dashboard Shell */}
          <DotGrid variant="subtle" mask="none" className="opacity-90" />

          <div className="p-5 sm:p-8 max-w-7xl mx-auto relative z-10 flex flex-col min-h-full justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

            {/* Clean Dashboard Footer Matching Site Wording */}
            <footer className="mt-14 pt-6 pb-2 border-t border-[#E2EEF7] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#1F2A37]">TERIMBERE</span>
                <span>•</span>
                <span>Centralized Cooperative System</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-[#0E8FC9]">
                <Link to="/members" className="hover:underline">Members</Link>
                <Link to="/loans" className="hover:underline">Loans</Link>
                <Link to="/finances" className="hover:underline">Finances</Link>
                <Link to="/meetings" className="hover:underline">Assemblies</Link>
                <Link to="/reports" className="hover:underline">Exports</Link>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
