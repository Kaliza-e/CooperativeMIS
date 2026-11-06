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
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0B1D2E]/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content - Perfectly Centered, High-Contrast & Visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-[24px] shadow-2xl border border-[#E2EEF7] w-full max-w-lg overflow-hidden z-10 my-auto"
          >
            {/* Compact Header (Never Cut Off) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F6FA] bg-gradient-to-r from-white via-[#F8FBFE] to-white shrink-0">
              <h2 className="text-base sm:text-lg font-bold text-[#1F2A37] tracking-tight">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-[#E8F4FB] text-[#0E8FC9] hover:bg-[#DCEEF9] rounded-xl transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X size={17} />
              </motion.button>
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-6 max-h-[calc(88vh-65px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
