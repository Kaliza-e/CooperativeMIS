import { useState, useEffect } from 'react'
import { meetingsAPI, attendanceAPI, membersAPI } from '../lib/api'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus, Calendar, MapPin, Clock, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { notify } from '../components/ui/Toast'

interface Meeting {
  id: number
  title: string
  description: string
  meeting_date: string
  location: string
  meeting_type: string
  status: string
}

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [attendance, setAttendance] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    location: '',
    meeting_type: 'regular',
    status: 'scheduled',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [meetingsRes, membersRes] = await Promise.all([meetingsAPI.getAll(), membersAPI.getAll()])
      setMeetings(meetingsRes.data)
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
        await meetingsAPI.update(editingId, formData)
      } else {
        await meetingsAPI.create(formData)
      }
      window.dispatchEvent(new Event('dashboard-data-updated'))
      loadData()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving meeting:', error)
    }
  }

  const handleEdit = (meeting: Meeting) => {
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      meeting_date: meeting.meeting_date ? new Date(meeting.meeting_date).toISOString().slice(0, 16) : '',
      location: meeting.location || '',
      meeting_type: meeting.meeting_type,
      status: meeting.status,
    })
    setEditingId(meeting.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await meetingsAPI.delete(id)
        window.dispatchEvent(new Event('dashboard-data-updated'))
        loadData()
      } catch (error) {
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const handleAttendance = async (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    try {
      const res = await attendanceAPI.getByMeeting(meeting.id)
      setAttendance(res.data)
    } catch (error) {
      console.error('Error loading attendance:', error)
    }
    setIsAttendanceOpen(true)
  }

  const handleRecordAttendance = async (memberId: number, status: string) => {
    try {
      if (selectedMeeting) {
        await attendanceAPI.record({
          meeting_id: selectedMeeting.id,
          member_id: memberId,
          status,
        })
        const res = await attendanceAPI.getByMeeting(selectedMeeting.id)
        setAttendance(res.data)
      }
    } catch (error) {
      console.error('Error recording attendance:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      meeting_date: '',
      location: '',
      meeting_type: 'regular',
      status: 'scheduled',
    })
    setEditingId(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Meeting Title',
      render: (value: string, row: Meeting) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <span className="font-bold text-[#1F2A37] block leading-snug">{value}</span>
            <span className="text-xs text-[#6B7280]">{row.description || 'General Agenda'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: string) => (
        <span className="text-[#6B7280] text-xs font-medium flex items-center gap-1.5">
          <MapPin size={13} className="text-[#0E8FC9]" />
          {value || 'Virtual / Main Office'}
        </span>
      ),
    },
    {
      key: 'meeting_date',
      label: 'Date & Time',
      render: (value: string) => (
        <span className="text-[#1F2A37] text-xs font-medium flex items-center gap-1.5">
          <Clock size={13} className="text-[#6B7280]" />
          {new Date(value).toLocaleString('default', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'meeting_type',
      label: 'Type',
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F2A37] bg-[#F8FBFE] border border-[#E2EEF7] px-3 py-1 rounded-full capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variant =
          value === 'scheduled'
            ? 'primary'
            : value === 'completed'
            ? 'success'
            : 'neutral'
        return (
          <Badge variant={variant} dot size="md">
            {value}
          </Badge>
        )
      },
    },
    {
      key: 'actions_attendance',
      label: 'Quorum',
      render: (_: any, row: Meeting) => (
        <button
          onClick={() => handleAttendance(row)}
          className="btn-secondary-pill px-3 py-1 text-xs font-bold"
        >
          <Users size={12} /> Roll Call
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
            ASSEMBLIES & SESSIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
            Meetings Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Schedule general assemblies, record committee resolutions, and manage member attendance quorum.
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
          Schedule Meeting
        </Button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={meetings}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Meeting Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Meeting Details' : 'Schedule New Meeting'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Meeting Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Q4 General Assembly & Audit"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
              Agenda & Description
            </label>
            <textarea
              placeholder="Summary of meeting agenda items..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.meeting_date}
                onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Venue / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Main Hall or Virtual"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] placeholder-[#9CA3AF] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Meeting Category
              </label>
              <select
                value={formData.meeting_type}
                onChange={(e) => setFormData({ ...formData, meeting_type: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="regular">Regular Assembly</option>
                <option value="special">Special Committee</option>
                <option value="emergency">Emergency Session</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F2A37] block">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#F8FBFE] border border-[#E2EEF7] rounded-2xl px-4 py-3 text-sm text-[#1F2A37] focus:border-[#0E8FC9] focus:ring-2 focus:ring-[#0E8FC9]/15 transition-all outline-none cursor-pointer"
              >
                <option value="scheduled">Scheduled</option>
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
              {editingId ? 'Save Changes' : 'Schedule Assembly'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Attendance / Quorum Roll Call Modal */}
      <Modal
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        title={`Attendance Quorum: ${selectedMeeting?.title || 'Assembly'}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#6B7280]">
            Mark real-time member presence for legal quorum validation.
          </p>

          <div className="max-h-96 overflow-y-auto space-y-2.5 divide-y divide-[#F0F6FA]">
            {members.map((member) => {
              const record = attendance.find((a) => a.member_id === member.id)
              const status = record?.status || 'unmarked'

              return (
                <div key={member.id} className="pt-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#1F2A37] block">{member.name}</span>
                    <span className="text-[11px] text-[#6B7280]">{member.role || 'Member'}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRecordAttendance(member.id, 'present')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleRecordAttendance(member.id, 'absent')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        status === 'absent'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => handleRecordAttendance(member.id, 'excused')}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        status === 'excused'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      Excused
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-4 border-t border-[#F0F6FA] flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAttendanceOpen(false)}
            >
              Done Roll Call
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
