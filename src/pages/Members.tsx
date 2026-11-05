import { useState, useEffect } from 'react'
import { membersAPI } from '../lib/api'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, Mail, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { notify } from '../components/ui/Toast'

interface Member {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    joining_date: new Date().toISOString().split('T')[0],
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const res = await membersAPI.getAll()
      setMembers(res.data)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await membersAPI.update(editingId, formData)
        notify.success('Member profile updated successfully!')
      } else {
        await membersAPI.create(formData)
        notify.success('New member registered into cooperative roster!')
      }
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadMembers()
      setIsModalOpen(false)
      resetForm()
    } catch (error: any) {
      console.error('Error saving member:', error)
      notify.error(error?.response?.data?.message || 'Could not save member details.')
    }
  }

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      status: member.status,
      joining_date: '',
    })
    setEditingId(member.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await membersAPI.delete(id)
        notify.info('Member record removed from system.')
        window.dispatchEvent(new Event('dashboard-data-updated'))
        loadMembers()
      } catch (error) {
        console.error('Error deleting member:', error)
        notify.error('Failed to remove member record.')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      joining_date: new Date().toISOString().split('T')[0],
    })
    setEditingId(null)
  }

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (value: string, row: Member) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] font-bold flex items-center justify-center text-sm border border-[#D5ECF8] shadow-sm shrink-0">
            {value ? value[0].toUpperCase() : 'M'}
          </div>
          <div>
            <span className="font-bold text-[#1F2A37] block leading-snug">{value}</span>
            <span className="text-xs text-[#6B7280]">ID #{row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <span className="text-[#6B7280] text-xs font-medium flex items-center gap-1.5">
          <Mail size={13} className="text-[#9CA3AF]" />
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => (
        <span className="text-[#6B7280] text-xs font-medium flex items-center gap-1.5">
          <Phone size={13} className="text-[#9CA3AF]" />
          {value || 'N/A'}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F2A37] bg-[#F8FBFE] border border-[#E2EEF7] px-3 py-1 rounded-full">
          <ShieldCheck size={12} className="text-[#0E8FC9]" />
          {value || 'Member'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant =
          value === 'active'
            ? 'success'
            : value === 'inactive'
            ? 'neutral'
            : 'danger'
        return (
          <Badge variant={variant} dot size="md">
            {value}
          </Badge>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
            MEMBERSHIP DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Member Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Manage and monitor registered cooperative members, contact records, and roles.
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
          Add New Member
        </Button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal with MedCare styling */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Member Information' : 'Enroll New Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Marie Claire Uwera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="member@terimbere.coop"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+250 788 123 456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Assigned Role
              </label>
              <input
                type="text"
                placeholder="e.g. General Member, Treasurer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
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
              {editingId ? 'Save Changes' : 'Enroll Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
