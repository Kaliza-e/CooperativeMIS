import { useState, useEffect } from 'react'
import { loansAPI, loanPaymentsAPI, membersAPI } from '../lib/api'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, TrendingUp, Calendar, Clock, PiggyBank, History, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { notify } from '../components/ui/Toast'

interface Loan {
  id: number
  member_id: number
  member_name: string
  amount: number | string
  interest_rate: number | string
  loan_date: string
  due_date: string
  status: string
  purpose: string
  monthly_payment: number | string
  total_paid: number | string
  remaining_balance: number | string
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [summary, setSummary] = useState({
    total_loans: 0,
    total_loan_amount: 0,
    active_loans_amount: 0,
    paid_loans_amount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    member_id: 0,
    amount: 0,
    interest_rate: 0,
    loan_date: new Date().toISOString().split('T')[0],
    due_date: '',
    purpose: '',
    monthly_payment: 0,
  })
  const [paymentData, setPaymentData] = useState({
    payment_date: new Date().toISOString().split('T')[0],
    amount_paid: 0,
    payment_method: '',
    notes: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0
    if (typeof value === 'string') {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : 0
    }
    return 0
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [loansRes, summaryRes, membersRes] = await Promise.all([
        loansAPI.getAll(),
        loansAPI.getSummary(),
        membersAPI.getAll(),
      ])
      setLoans(loansRes.data)
      setSummary(summaryRes.data)
      setMembers(membersRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.member_id) {
      setError('Please select a member before saving.')
      return
    }
    if (!formData.amount || !formData.loan_date || !formData.due_date) {
      setError('Please fill all required fields.')
      return
    }
    try {
      if (editingId) {
        await loansAPI.update(editingId, formData)
        notify.success('Loan record updated successfully!')
      } else {
        await loansAPI.create(formData)
        notify.success('Micro-loan disbursed successfully!')
      }
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadData()
      setIsModalOpen(false)
      resetForm()
    } catch (error: any) {
      console.error('Error saving loan:', error)
      const msg = error?.response?.data?.message || 'Failed to save loan. Please check your inputs and try again.'
      setError(msg)
      notify.error(msg)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLoan) return
    try {
      await loanPaymentsAPI.record({
        loan_id: selectedLoan.id,
        ...paymentData,
      })
      notify.success('Installment payment recorded!')
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadData()
      loadPayments(selectedLoan.id)
      setPaymentData({
        payment_date: new Date().toISOString().split('T')[0],
        amount_paid: 0,
        payment_method: '',
        notes: '',
      })
    } catch (error: any) {
      console.error('Error recording payment:', error)
      notify.error(error?.response?.data?.message || 'Could not record installment payment.')
    }
  }

  const handleEdit = (loan: Loan) => {
    setFormData({
      member_id: loan.member_id,
      amount: toNumber(loan.amount),
      interest_rate: toNumber(loan.interest_rate),
      loan_date: loan.loan_date ? loan.loan_date.split('T')[0] : '',
      due_date: loan.due_date ? loan.due_date.split('T')[0] : '',
      purpose: loan.purpose || '',
      monthly_payment: toNumber(loan.monthly_payment),
    })
    setEditingId(loan.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await loansAPI.delete(id)
        window.dispatchEvent(new Event('dashboard-data-updated'))
        loadData()
      } catch (error) {
        console.error('Error deleting loan:', error)
      }
    }
  }

  const loadPayments = async (loanId: number) => {
    try {
      const res = await loanPaymentsAPI.getByLoan(loanId)
      setPayments(res.data)
    } catch (error) {
      console.error('Error loading payments:', error)
    }
  }

  const handleViewPayments = async (loan: Loan) => {
    setSelectedLoan(loan)
    await loadPayments(loan.id)
    setIsPaymentOpen(true)
  }

  const resetForm = () => {
    setFormData({
      member_id: 0,
      amount: 0,
      interest_rate: 0,
      loan_date: new Date().toISOString().split('T')[0],
      due_date: '',
      purpose: '',
      monthly_payment: 0,
    })
    setEditingId(null)
    setError('')
  }

  const columns = [
    {
      key: 'member_name',
      label: 'Borrower',
      render: (value: string, row: Loan) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] font-bold flex items-center justify-center text-sm border border-[#D5ECF8] shadow-sm shrink-0">
            {value ? value[0].toUpperCase() : 'M'}
          </div>
          <div>
            <span className="font-bold text-[#1F2A37] block leading-snug">{value}</span>
            <span className="text-xs text-[#6B7280]">Loan #{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Principal',
      render: (value: number | string) => (
        <span className="font-extrabold text-sm text-[#1F2A37]">
          ${toNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'remaining_balance',
      label: 'Balance Remaining',
      render: (value: number | string) => {
        const bal = toNumber(value)
        return (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            bal > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            ${bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )
      },
    },
    {
      key: 'interest_rate',
      label: 'Interest Rate',
      render: (value: number | string) => (
        <span className="text-xs font-semibold text-[#6B7280]">
          {toNumber(value)}% APR
        </span>
      ),
    },
    {
      key: 'due_date',
      label: 'Maturity Date',
      render: (value: string) => (
        <span className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
          <Calendar size={13} className="text-[#9CA3AF]" />
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant =
          value === 'active'
            ? 'primary'
            : value === 'paid'
            ? 'success'
            : 'danger'
        return (
          <Badge variant={variant} dot size="md">
            {value}
          </Badge>
        )
      },
    },
    {
      key: 'payments',
      label: 'Installments',
      render: (_: unknown, row: Loan) => (
        <button
          onClick={() => handleViewPayments(row)}
          className="btn-secondary-pill px-3 py-1 text-xs font-bold"
        >
          <History size={12} /> Payments
        </button>
      ),
    },
  ]

  const totalOutstanding = loans
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + toNumber(l.remaining_balance), 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
            CREDIT PORTFOLIO & REPAYMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Cooperative Loans Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Manage member micro-loans, amortization schedules, and payment installments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          icon={<Plus size={18} />}
        >
          Disburse New Loan
        </Button>
      </div>

      {/* 4 Summary Cards: 1 Solid Blue Highlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Solid Blue Highlight (Total Disbursed) */}
        <Card
          variant="highlight"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider block">
                Total Disbursed
              </span>
              <div className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                ${toNumber(summary.total_loan_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <PiggyBank size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90 relative z-10">
            <span>Cumulative portfolio</span>
            <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              {summary.total_loans} Loans
            </span>
          </div>
        </Card>

        {/* Card 2: Active Outstanding Balance */}
        <Card
          variant="white"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Outstanding Principal
              </span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1.5 tracking-tight">
                ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
              <Clock size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Active loan balances</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              In repayment
            </span>
          </div>
        </Card>

        {/* Card 3: Total Repaid Amount */}
        <Card
          variant="white"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Repaid Capital
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1.5 tracking-tight">
                ${toNumber(summary.paid_loans_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
              <CheckCircle2 size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Collected installments</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Recovered
            </span>
          </div>
        </Card>

        {/* Card 4: Total Portfolio Count */}
        <Card
          variant="white"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Issued Loans
              </span>
              <div className="text-3xl font-extrabold text-[#1F2A37] mt-1.5 tracking-tight">
                {summary.total_loans}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Member contracts</span>
            <span className="font-bold text-[#0E8FC9] bg-[#E8F4FB] px-2 py-0.5 rounded-full">
              Contracts
            </span>
          </div>
        </Card>
      </div>

      {/* Main Loans Table */}
      <DataTable
        columns={columns}
        data={loans}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Disburse Loan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Loan Terms' : 'Disburse New Loan'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Borrower Member *
            </label>
            <select
              value={formData.member_id || ''}
              onChange={(e) =>
                setFormData({ ...formData, member_id: e.target.value ? parseInt(e.target.value, 10) : 0 })
              }
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              required
            >
              <option value="">Select a member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (#{m.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Principal Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : 0 })
                }
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.interest_rate}
                onChange={(e) =>
                  setFormData({ ...formData, interest_rate: e.target.value ? parseFloat(e.target.value) : 0 })
                }
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Disbursement Date *
              </label>
              <input
                type="date"
                value={formData.loan_date}
                onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Maturity Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Monthly Target ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_payment}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_payment: e.target.value ? parseFloat(e.target.value) : 0 })
                }
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Loan Purpose
              </label>
              <input
                type="text"
                placeholder="e.g. Agriculture Equipment"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F6FA]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              {editingId ? 'Save Changes' : 'Approve & Disburse'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment / Installment Ledger Modal */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title={`Repayment Ledger: ${selectedLoan?.member_name || 'Member'}`}
      >
        <div className="space-y-5">
          {selectedLoan && (
            <div className="bg-[#E8F4FB] border border-[#D1E8F6] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#0E8FC9] block">
                  Original Loan
                </span>
                <span className="text-lg font-extrabold text-[#1F2A37]">
                  ${toNumber(selectedLoan.amount).toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold uppercase text-[#0E8FC9] block">
                  Remaining Balance
                </span>
                <span className="text-lg font-extrabold text-amber-700">
                  ${toNumber(selectedLoan.remaining_balance).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentData.payment_date}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                  className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                  Amount Paid ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount_paid}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount_paid: e.target.value ? parseFloat(e.target.value) : 0 })
                  }
                  className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                  Payment Method
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bank Transfer, Cash, Mobile Money"
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                  className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Receipt number or notes"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-2.5 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
            >
              Post Payment
            </Button>
          </form>

          {/* Payment History List */}
          <div className="border-t border-[#F0F6FA] pt-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#1F2A37] mb-3">
              Recorded Installment History
            </h4>
            {payments.length === 0 ? (
              <p className="text-xs text-[#6B7280] italic">No payment installments recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center text-xs p-3 bg-[#F8FBFE] rounded-2xl border border-[#E2EEF7]"
                  >
                    <div>
                      <div className="font-bold text-[#1F2A37]">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {payment.payment_method || 'Standard Method'} {payment.notes ? `• ${payment.notes}` : ''}
                      </div>
                    </div>
                    <div className="font-extrabold text-emerald-600 text-sm">
                      +${toNumber(payment.amount_paid).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
