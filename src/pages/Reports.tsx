import { useState } from 'react'
import { exportsAPI } from '../lib/api'
import { FileText, Users, DollarSign, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react'
import { Card } from '../components/ui/Card'

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
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export file. Please verify server connection.')
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
    <div className="space-y-8">
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

      {/* Export Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exportOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card
              key={option.module}
              variant="white"
              padding="lg"
              hoverLift
              className="border-[#E2EEF7] shadow-soft flex flex-col justify-between"
            >
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
                <button
                  onClick={() => handleExport('pdf', option.module)}
                  disabled={exporting === `${option.module}-pdf`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-rose-600 px-5 py-3 rounded-full transition-all disabled:opacity-50 font-bold text-xs cursor-pointer border border-rose-200"
                >
                  <FileText size={16} />
                  {exporting === `${option.module}-pdf` ? 'Generating PDF...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => handleExport('excel', option.module)}
                  disabled={exporting === `${option.module}-excel`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#E8F4FB] hover:bg-[#DCEEF9] text-[#0E8FC9] px-5 py-3 rounded-full transition-all disabled:opacity-50 font-bold text-xs cursor-pointer border border-[#D1E8F6]"
                >
                  <FileSpreadsheet size={16} />
                  {exporting === `${option.module}-excel` ? 'Exporting...' : 'Export Excel'}
                </button>
              </div>
            </Card>
          )
        })}
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
    </div>
  )
}
