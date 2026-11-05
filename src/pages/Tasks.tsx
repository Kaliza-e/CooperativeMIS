import { useState, useEffect } from 'react'
import { tasksAPI, membersAPI } from '../lib/api'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, CheckSquare, Calendar, User } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

interface Task {
  id: number
  title: string
  description: string
  assigned_to: number
  assigned_to_name: string
  due_date: string
  priority: string
  status: string
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: null as number | null,
    assigned_by: null as number | null,
    due_date: '',
    priority: 'medium',
    status: 'pending',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const parsed = JSON.parse(user)
      setFormData((prev) => ({ ...prev, assigned_by: parsed?.id || null }))
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tasksRes, membersRes] = await Promise.all([tasksAPI.getAll(), membersAPI.getAll()])
      setTasks(tasksRes.data)
      setMembers(membersRes.data)
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
        await tasksAPI.update(editingId, formData)
      } else {
        await tasksAPI.create(formData)
      }
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadData()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      assigned_to: task.assigned_to || 0,
      assigned_by: 1,
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
      priority: task.priority,
      status: task.status,
    })
    setEditingId(task.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id)
        window.dispatchEvent(new Event('dashboard-data-updated'))
        loadData()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assigned_to: null,
      assigned_by: formData.assigned_by,
      due_date: '',
      priority: 'medium',
      status: 'pending',
    })
    setEditingId(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Task Details',
      render: (value: string, row: Task) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm shrink-0">
            <CheckSquare size={18} />
          </div>
          <div>
            <span className="font-bold text-[#1F2A37] block leading-snug">{value}</span>
            <span className="text-xs text-[#6B7280] line-clamp-1">{row.description || 'No description provided'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'assigned_to_name',
      label: 'Assigned Member',
      render: (value: string) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F2A37] bg-[#F8FBFE] border border-[#E2EEF7] px-3 py-1 rounded-full">
          <User size={13} className="text-[#0E8FC9]" />
          {value || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      render: (value: string) => (
        <span className="text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
          <Calendar size={13} className="text-[#9CA3AF]" />
          {value ? new Date(value).toLocaleDateString() : 'No deadline'}
        </span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value: string) => {
        const variant =
          value === 'high'
            ? 'danger'
            : value === 'medium'
            ? 'warning'
            : 'neutral'
        return (
          <Badge variant={variant} size="md">
            {value}
          </Badge>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant =
          value === 'completed'
            ? 'success'
            : value === 'in_progress'
            ? 'primary'
            : value === 'cancelled'
            ? 'danger'
            : 'warning'
        return (
          <Badge variant={variant} dot size="md">
            {value.replace('_', ' ')}
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
            OPERATIONS & ASSIGNMENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Tasks Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Assign and track operational workflows, audit checklists, and committee directives.
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
          Create New Task
        </Button>
      </div>

      {/* Main Tasks Table */}
      <DataTable
        columns={columns}
        data={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Task Details' : 'Create Operational Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Audit Q3 Member Share Certificates"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Description
            </label>
            <textarea
              placeholder="Provide actionable instructions for the assigned member..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Assignee
              </label>
              <select
                value={formData.assigned_to ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assigned_to: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="">Select a member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Deadline
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Execution Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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
              {editingId ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
