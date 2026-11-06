import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { financesAPI } from '../lib/api'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, TrendingUp, TrendingDown, Wallet, Calendar, Tag, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { notify } from '../components/ui/Toast'
import DotGrid from '../components/ui/DotGrid'
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormField'

interface Finance {
  id: number
  transaction_type: string
  amount: number | string | null
  category: string
  description: string
  transaction_date: string
  member_name: string
}

export default function Finances() {
  const [finances, setFinances] = useState<Finance[]>([])
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0 })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    transaction_type: 'income',
    amount: 0,
    category: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    member_id: null as number | null,
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const formatCurrency = (value: unknown) => `$${toNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

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
      const [financesRes, summaryRes] = await Promise.all([
        financesAPI.getAll(),
        financesAPI.getSummary(),
      ])
      setFinances(financesRes.data)
      setSummary(summaryRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await financesAPI.update(editingId, formData)
        notify.success('Financial transaction updated!')
      } else {
        await financesAPI.create(formData)
        notify.success('Transaction logged to treasury ledger!')
      }
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadData()
      setIsModalOpen(false)
      resetForm()
    } catch (error: any) {
      console.error('Error saving finance record:', error)
      notify.error(error?.response?.data?.message || 'Could not record financial transaction.')
    }
  }

  const handleEdit = (finance: Finance) => {
    setFormData({
      transaction_type: finance.transaction_type,
      amount: toNumber(finance.amount),
      category: finance.category || '',
      description: finance.description || '',
      transaction_date: finance.transaction_date ? finance.transaction_date.split('T')[0] : '',
      payment_method: '',
      member_id: null,
    })
    setEditingId(finance.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await financesAPI.delete(id)
        notify.info('Transaction record removed.')
        window.dispatchEvent(new Event('dashboard-data-updated'))
        loadData()
      } catch (error) {
        console.error('Error deleting record:', error)
        notify.error('Failed to remove transaction record.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      transaction_type: 'income',
      amount: 0,
      category: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0],
      payment_method: '',
      member_id: null,
    })
    setEditingId(null)
  }

  const columns = [
    {
      key: 'transaction_type',
      label: 'Type',
      render: (value: string) => {
        const isIncome = value === 'income'
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 ${
              isIncome
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {isIncome ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
            {value}
          </span>
        )
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number | string | null, row: Finance) => {
        const isIncome = row.transaction_type === 'income'
        return (
          <span className={`text-sm font-extrabold ${isIncome ? 'text-emerald-600' : 'text-[#1F2A37]'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(value)}
          </span>
        )
      },
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F2A37] bg-[#F8FBFE] border border-[#E2EEF7] px-3 py-1 rounded-full">
          <Tag size={11} className="text-[#0E8FC9]" />
          {value || 'General'}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <span className="text-xs text-[#6B7280] font-medium line-clamp-1 max-w-xs">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'transaction_date',
      label: 'Date',
      render: (value: string) => (
        <span className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
          <Calendar size={13} className="text-[#9CA3AF]" />
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const totalIncome = toNumber(summary.total_income)
  const totalExpense = toNumber(summary.total_expense)
  const balance = totalIncome - totalExpense

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
            TREASURY & GENERAL LEDGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Financial Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Track real-time cooperative cash flow, membership dues, and operational expense vouchers.
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
          Record Transaction
        </Button>
      </div>

      {/* 3 Summary Cards: Solid Blue Highlight for Current Balance */}
      <div className="relative">
        <DotGrid variant="dense" mask="none" className="opacity-90 -inset-x-4 -inset-y-3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Solid Blue Highlight Card */}
          <Card
            variant="highlight"
            padding="lg"
            hoverLift
            className="flex flex-col justify-between min-h-[160px] relative overflow-hidden"
          >
            <DotGrid variant="light" mask="center" className="opacity-45" />
            <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider block">
                Net Treasury Balance
              </span>
              <div className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Wallet size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/90 relative z-10">
            <span>Liquid reserve funds</span>
            <span className="font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              Audited
            </span>
          </div>
        </Card>

        {/* Total Income */}
        <Card
          variant="white"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Total Inflow
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1.5 tracking-tight">
                ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Income & contributions</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +Positive
            </span>
          </div>
        </Card>

        {/* Total Expense */}
        <Card
          variant="white"
          padding="lg"
          hoverLift
          className="flex flex-col justify-between min-h-[160px]"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#6B7280] text-xs font-bold uppercase tracking-wider block">
                Total Outflow
              </span>
              <div className="text-3xl font-extrabold text-rose-600 mt-1.5 tracking-tight">
                ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
              <TrendingDown size={22} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0F6FA] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Expenses & disbursements</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Vouchers
            </span>
          </div>
        </Card>
        </div>
      </div>

      {/* Main Finance Table */}
      <DataTable
        columns={columns}
        data={finances}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Ledger Record' : 'Record New Transaction'}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Transaction Type"
              value={formData.transaction_type}
              onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
              required
            >
              <option value="income">Income (+ Inflow)</option>
              <option value="expense">Expense (- Outflow)</option>
            </FormSelect>

            <FormInput
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : 0 })}
              icon={<DollarSign size={15} />}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Category"
              type="text"
              placeholder="e.g. Member Dues, Dividends"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              icon={<Tag size={15} />}
            />

            <FormInput
              label="Transaction Date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              required
            />
          </div>

          <FormTextarea
            label="Memo / Description"
            placeholder="Reference notes, receipt number, or purpose..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F6FA]">
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
              {editingId ? 'Save Changes' : 'Record Transaction'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
