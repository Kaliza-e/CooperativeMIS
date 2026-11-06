import { useState } from 'react'
import { exportsAPI } from '../lib/api'
import { FileText, Users, DollarSign, CheckCircle2, ShieldCheck, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { motion } from 'framer-motion'
import { notify } from '../components/ui/Toast'
import DotGrid from '../components/ui/DotGrid'

export default function Reports() {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (type: 'pdf' | 'excel', module: 'members' | 'finances') => {
    try {
      setExporting(`${module}-${type}`)
      let response
      if (module === 'members') {
        response = type === 'pdf' ? await exportsAPI.exportMembersPDF() : await exportsAPI.exportMembersExcel()
      } else {
        response = type === 'pdf' ? await exportsAPI.exportFinancesPDF() : await exportsAPI.exportFinancesExcel()
      }

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${module}-report.${type === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.parentElement?.removeChild(link)
      notify.success(`${module === 'members' ? 'Members' : 'Financial'} statement downloaded successfully!`)
    } catch (error) {
      console.error('Error exporting:', error)
      notify.error('Failed to export file. Please verify database connectivity.')
    } finally {
      setExporting(null)
    }
  }

  const exportOptions = [
    {
      title: 'Members Directory Report',
      description: 'Export all registered members, roles, contact details, and account standing.',
      module: 'members' as const,
      icon: Users,
    },
    {
      title: 'Financial Ledger & Treasury Report',
      description: 'Export all income deposits, expense vouchers, and cumulative balances.',
      module: 'finances' as const,
      icon: DollarSign,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E8FC9] block mb-1">
          COMPLIANCE & EXPORTS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2A37] tracking-tight">
          Reports & Statements Generator
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Download authenticated PDF summaries and raw Excel workbooks for annual audits and assemblies.
        </p>
      </div>

      {/* Export Modules Grid with Dot-Grid Backer */}
      <div className="relative">
        <DotGrid variant="accent" mask="none" className="opacity-90 -inset-x-4 -inset-y-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {exportOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.module}
                variant="white"
                padding="lg"
                hoverLift
                className="border-[#E2EEF7] shadow-soft flex flex-col justify-between relative overflow-hidden"
              >
                <DotGrid variant="subtle" mask="none" className="opacity-45" />
                <div className="relative z-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center border border-[#D5ECF8] shadow-sm shrink-0">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2A37]">{option.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-[#F0F6FA]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport('pdf', option.module)}
                  disabled={exporting === `${option.module}-pdf`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-rose-600 px-5 py-3 rounded-xl transition-all disabled:opacity-50 font-bold text-xs cursor-pointer border border-rose-200 whitespace-nowrap shrink-0"
                >
                  {exporting === `${option.module}-pdf` ? (
                    <Loader2 size={16} className="animate-spin shrink-0" />
                  ) : (
                    <FileText size={16} className="shrink-0" />
                  )}
                  <span>{exporting === `${option.module}-pdf` ? 'Generating PDF...' : 'Download PDF'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExport('excel', option.module)}
                  disabled={exporting === `${option.module}-excel`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E8F4FB] hover:bg-[#DCEEF9] text-[#0E8FC9] px-5 py-3 rounded-xl transition-all disabled:opacity-50 font-bold text-xs cursor-pointer border border-[#D1E8F6] whitespace-nowrap shrink-0"
                >
                  {exporting === `${option.module}-excel` ? (
                    <Loader2 size={16} className="animate-spin shrink-0" />
                  ) : (
                    <FileSpreadsheet size={16} className="shrink-0" />
                  )}
                  <span>{exporting === `${option.module}-excel` ? 'Exporting...' : 'Export Excel'}</span>
                </motion.button>
              </div>
            </div>
          </Card>
        )
      })}
      </div>
    </div>

      {/* Compliance Guidelines Card */}
      <Card variant="white" padding="lg" className="border-[#E2EEF7] shadow-soft">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[#E8F4FB] text-[#0E8FC9] flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-base font-bold text-[#1F2A37]">Auditing Standards & Export Specifications</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B7280]">
          {[
            'PDF exports include formatted headings ready for official General Assembly presentation.',
            'Excel sheets retain unformatted raw values suitable for accounting reconciliation.',
            'All reports are cryptographically signed and generated directly from verified MySQL ledgers.',
            'Member loan schedules and monthly payment histories are calculated up to the current timestamp.',
          ].map((info, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 size={15} className="text-[#0E8FC9] shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
