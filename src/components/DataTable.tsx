import React from 'react'
import { Trash2, Edit2, Inbox } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

export interface DataTableProps {
  columns: Column[]
  data: any[]
  onEdit?: (row: any) => void
  onDelete?: (id: number) => void
  loading?: boolean
}

export default function DataTable({ columns, data, onEdit, onDelete, loading }: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[26px] border border-[#E2EEF7] shadow-soft p-6 sm:p-8 overflow-hidden">
        <div className="space-y-4">
          {/* Skeleton Header */}
          <div className="h-10 bg-[#F4F9FD] rounded-2xl relative overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </div>
          {/* Skeleton Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-center py-2.5">
              <div className="h-7 bg-[#F8FBFE] rounded-xl flex-1 relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
              </div>
              <div className="h-7 bg-[#F8FBFE] rounded-xl flex-1 relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
              </div>
              <div className="h-7 bg-[#F8FBFE] rounded-xl w-28 relative overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-center items-center h-72 bg-white rounded-[26px] border border-[#E2EEF7] shadow-soft p-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center mb-4 shadow-sm">
          <Inbox size={28} />
        </div>
        <h3 className="text-base font-bold text-[#1F2A37]">No records found</h3>
        <p className="text-xs text-[#6B7280] mt-1 max-w-sm">
          There are currently no items matching your criteria in this cooperative ledger.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-[26px] border border-[#E2EEF7] shadow-soft overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FBFE] border-b border-[#E2EEF7]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-[#6B7280] text-xs uppercase tracking-wider font-bold"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-[#6B7280] text-xs uppercase tracking-wider font-bold text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F6FA]">
            <AnimatePresence mode="popLayout">
              {data.map((row, idx) => (
                <motion.tr
                  key={row.id || idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                  className="hover:bg-[#F4F9FD]/80 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-[#1F2A37] font-medium whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '-'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        {onEdit && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onEdit(row)}
                            className="p-2 text-[#6B7280] hover:text-[#0E8FC9] hover:bg-[#E8F4FB] rounded-xl transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                        )}
                        {onDelete && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => onDelete(row.id)}
                            className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
