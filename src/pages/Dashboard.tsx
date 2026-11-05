import { useState, useEffect } from 'react'
import { membersAPI, meetingsAPI, tasksAPI, financesAPI } from '../lib/api'
import {
  Users, Calendar, CheckSquare, DollarSign,
  TrendingUp, ArrowUpRight,
  FileText, ChevronRight, Clock
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

interface FinanceRecord {
  transaction_type: 'income' | 'expense' | string
  amount: number | string | null
  transaction_date: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMeetings: 0,
    pendingTasks: 0,
    totalIncome: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentMembers, setRecentMembers] = useState<any[]>([])
  const [chartData, setChartData] = useState<{ name: string; income: number; expense: number }[]>([])
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([])
  const [upcomingMeetings, setUpcomingMeetings] = useState<any[]>([])
  const [chartRange, setChartRange] = useState<'7' | '12'>('7')
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0
    if (typeof value === 'string') {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return 0
  }

  const buildFinanceChartData = (records: FinanceRecord[], months: number) => {
    const monthBuckets: { key: string; name: string; income: number; expense: number }[] = []

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(1)
      date.setMonth(date.getMonth() - i)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const name = date.toLocaleString('default', { month: 'short' })
      monthBuckets.push({ key, name, income: 0, expense: 0 })
    }

    const bucketMap = new Map(monthBuckets.map((bucket) => [bucket.key, bucket]))
    records.forEach((record) => {
      const date = new Date(record.transaction_date)
      if (Number.isNaN(date.getTime())) return
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const bucket = bucketMap.get(key)
      if (!bucket) return
      const amount = toNumber(record.amount)
      if (record.transaction_type === 'income') bucket.income += amount
      if (record.transaction_type === 'expense') bucket.expense += amount
    })

    return monthBuckets.map(({ name, income, expense }) => ({ name, income, expense }))
  }

  useEffect(() => {
    loadStats()
    const interval = window.setInterval(loadStats, 15000)
    const onFocus = () => loadStats()
    const onDataUpdated = () => loadStats()

    window.addEventListener('focus', onFocus)
    window.addEventListener('dashboard-data-updated', onDataUpdated)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('dashboard-data-updated', onDataUpdated)
    }
  }, [chartRange])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [membersRes, meetingsRes, tasksRes, financeRes, financesRes] = await Promise.all([
        membersAPI.getAll(),
        meetingsAPI.getAll(),
        tasksAPI.getAll(),
        financesAPI.getSummary(),
        financesAPI.getAll(),
      ])

      const scheduledMeetings = (meetingsRes.data || []).filter((m: any) => m.status === 'scheduled').length
      const pending = tasksRes.data.filter((t: any) => t.status === 'pending').length

      setStats({
        totalMembers: membersRes.data.length,
        activeMeetings: scheduledMeetings,
        pendingTasks: pending,
        totalIncome: toNumber(financeRes.data?.total_income),
      })

      const sortedMembers = [...(membersRes.data || [])].sort((a: any, b: any) => {
        return new Date(b.joining_date || b.created_at).getTime() - new Date(a.joining_date || a.created_at).getTime()
      })
      setRecentMembers(sortedMembers.slice(0, 4))

      const upcoming = (meetingsRes.data || [])
        .filter((m: any) => m.status === 'scheduled')
        .sort((a: any, b: any) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime())
        .slice(0, 3)
      setUpcomingMeetings(upcoming)

      const monthsToShow = chartRange === '12' ? 12 : 7
      setChartData(buildFinanceChartData(financesRes.data || [], monthsToShow))

      const memberStatuses = membersRes.data.reduce(
        (acc: Record<string, number>, member: any) => {
          const status = member.status || 'unknown'
          acc[status] = (acc[status] || 0) + 1
          return acc
        },
        {}
      )

      const memberPie = [
        { name: 'Active', value: memberStatuses.active || 0, color: '#0E8FC9' },
        { name: 'Inactive', value: memberStatuses.inactive || 0, color: '#35B6E8' },
        { name: 'Suspended', value: memberStatuses.suspended || 0, color: '#F43F5E' },
      ].filter((item) => item.value > 0)

      setPieData(memberPie.length > 0 ? memberPie : [{ name: 'No Data', value: 1, color: '#d1d5db' }])
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-14 bg-white/60 rounded-3xl w-72" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-[26px] border border-[#E2EEF7]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-white rounded-[26px] border border-[#E2EEF7]" />
          <div className="h-80 bg-white rounded-[26px] border border-[#E2EEF7]" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Cooperative Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Welcome back, <span className="font-semibold text-[#1F2A37]">{user?.name || 'Administrator'}</span>! Here is your daily operational summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/reports')}
            icon={<FileText size={15} />}
          >
            Exports
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/finances')}
            icon={<TrendingUp size={15} />}
          >
            New Transaction
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards: 1 Solid Blue Highlight Card + 3 White Cards with Icon Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Solid Blue Highlight Card (Total Members) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="rounded-[26px] bg-gradient-to-br from-[#0E8FC9] via-[#1A9DD5] to-[#35B6E8] p-6 text-white shadow-card-blue relative overflow-hidden flex flex-col justify-between min-h-[175px]"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-[1px] pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider block">
                Total Members
              </span>
              <div className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                {stats.totalMembers.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Users size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90 relative z-10">
            <span>Verified accounts</span>
            <span className="inline-flex items-center gap-1 font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              <TrendingUp size={12} /> Active
            </span>
          </div>
        </motion.div>

        {/* Card 2: White Card (Total Income) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="rounded-[26px] bg-white border border-[#E2EEF7] p-6 shadow-soft flex flex-col justify-between min-h-[175px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Total Revenue
              </span>
              <div className="text-3xl font-extrabold text-[#1F2A37] mt-1.5 tracking-tight">
                ${stats.totalIncome.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm">
              <DollarSign size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Net cooperative income</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} /> +5.4%
            </span>
          </div>
        </motion.div>

        {/* Card 3: White Card (Scheduled Meetings) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="rounded-[26px] bg-white border border-[#E2EEF7] p-6 shadow-soft flex flex-col justify-between min-h-[175px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Scheduled Assemblies
              </span>
              <div className="text-3xl font-extrabold text-[#1F2A37] mt-1.5 tracking-tight">
                {stats.activeMeetings}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm">
              <Calendar size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Upcoming sessions</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#0E8FC9] bg-[#E8F4FB] border border-[#D1E8F6] px-2 py-0.5 rounded-full">
              Quorum Active
            </span>
          </div>
        </motion.div>

        {/* Card 4: White Card (Pending Tasks) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="rounded-[26px] bg-white border border-[#E2EEF7] p-6 shadow-soft flex flex-col justify-between min-h-[175px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Pending Actions
              </span>
              <div className="text-3xl font-extrabold text-[#1F2A37] mt-1.5 tracking-tight">
                {stats.pendingTasks}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm">
              <CheckSquare size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Committee tasks</span>
            <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              In progress
            </span>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Finance Chart + Member Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bar Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white p-7 rounded-[28px] shadow-soft border border-[#E2EEF7]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8FC9] block">
                FINANCIAL HEALTH
              </span>
              <h2 className="text-lg font-bold text-[#1F2A37]">Income & Expense Trajectory</h2>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value as '7' | '12')}
                className="bg-[#F8FBFE] border border-[#E2EEF7] rounded-full px-4 py-1.5 text-xs font-semibold text-[#1F2A37] focus:border-[#0E8FC9] outline-none cursor-pointer"
              >
                <option value="7">Last 7 Months</option>
                <option value="12">Last 12 Months</option>
              </select>
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF4F9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: '#F4F9FD' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #E2EEF7',
                    boxShadow: '0 10px 25px -5px rgba(14,143,201,0.15)',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="income" name="Income" fill="#0E8FC9" radius={[6, 6, 0, 0]} barSize={16} />
                <Bar dataKey="expense" name="Expense" fill="#35B6E8" radius={[6, 6, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#F0F6FA] text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0E8FC9]" />
              <span className="text-[#1F2A37]">Cooperative Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#35B6E8]" />
              <span className="text-[#6B7280]">Operational Expenses</span>
            </div>
          </div>
        </motion.div>

        {/* Member Status Distribution Pie */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-7 rounded-[28px] shadow-soft border border-[#E2EEF7] flex flex-col justify-between"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8FC9] block mb-0.5">
              MEMBERSHIP
            </span>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1F2A37]">Status Breakdown</h2>
              <span className="text-xs font-bold text-[#0E8FC9] bg-[#E8F4FB] px-2.5 py-0.5 rounded-full">
                Active Ratio
              </span>
            </div>

            <div className="h-[200px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-[#1F2A37]">
                  {pieData.reduce((sum, item) => sum + item.value, 0)}
                </span>
                <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#F0F6FA]">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#6B7280] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#1F2A37] bg-[#F8FBFE] px-2 py-0.5 rounded-md border border-[#E2EEF7]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: New Members List + Upcoming Assemblies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Members */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[28px] shadow-soft border border-[#E2EEF7] overflow-hidden"
        >
          <div className="p-6 sm:p-7 flex items-center justify-between border-b border-[#F0F6FA]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8FC9] block">
                ROSTER
              </span>
              <h2 className="text-lg font-bold text-[#1F2A37]">Recent Member Enrollments</h2>
            </div>
            <Link
              to="/members"
              className="btn-secondary-pill px-4 py-1.5 text-xs font-bold"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FBFE] border-b border-[#E2EEF7] text-[#6B7280] text-[11px] uppercase tracking-wider">
                  <th className="px-6 py-3.5 font-bold">Member</th>
                  <th className="px-6 py-3.5 font-bold">Member ID</th>
                  <th className="px-6 py-3.5 font-bold">Joined Date</th>
                  <th className="px-6 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F6FA]">
                {recentMembers.map((member: any) => (
                  <tr key={member.id} className="hover:bg-[#F4F9FD] transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E8F4FB] text-[#0E8FC9] font-bold flex items-center justify-center text-xs border border-[#D5ECF8]">
                          {member.name ? member.name[0] : 'M'}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#1F2A37] block leading-tight">
                            {member.name}
                          </span>
                          <span className="text-xs text-[#6B7280]">{member.email || member.role || 'Member'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#6B7280] font-semibold">
                      #{member.id}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#6B7280]">
                      {new Date(member.joining_date || member.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to="/members"
                        className="inline-flex p-2 text-[#6B7280] hover:text-[#0E8FC9] hover:bg-[#E8F4FB] rounded-xl transition-all"
                      >
                        <ArrowUpRight size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Upcoming Assemblies & Events */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-7 rounded-[28px] shadow-soft border border-[#E2EEF7] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8FC9] block">
                  CALENDAR
                </span>
                <h2 className="text-lg font-bold text-[#1F2A37]">Upcoming Assemblies</h2>
              </div>
              <Calendar size={18} className="text-[#0E8FC9]" />
            </div>

            <div className="space-y-3.5 mt-5">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    onClick={() => navigate('/meetings')}
                    className="p-3.5 rounded-2xl bg-[#F8FBFE] border border-[#E2EEF7] hover:border-[#0E8FC9] transition-all cursor-pointer group flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1F2A37] truncate group-hover:text-[#0E8FC9] transition-colors">
                        {meeting.title}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(meeting.meeting_date).toLocaleString('default', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[#6B7280] text-xs">
                  No upcoming meetings scheduled.
                </div>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/meetings')}
            className="w-full mt-6 text-xs"
            iconRight={<ChevronRight size={14} />}
          >
            Manage Meetings
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
