import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0B1D2E]/45 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative bg-white rounded-[28px] shadow-2xl border border-[#E2EEF7] w-full max-w-lg overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0F6FA] bg-gradient-to-r from-white via-[#F8FBFE] to-white">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E8FC9] block mb-0.5">
                  Cooperative Action
                </span>
                <h2 className="text-xl font-bold text-[#1F2A37] tracking-tight">{title}</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center bg-[#E8F4FB] text-[#0E8FC9] hover:bg-[#DCEEF9] rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div className="p-7 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
