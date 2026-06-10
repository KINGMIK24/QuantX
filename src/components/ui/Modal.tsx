import React from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div className="ghost-card-purple max-w-md w-full max-h-96 overflow-auto p-6" style={{ margin: '0 20px' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Inter'", letterSpacing: '-0.04em' }}>{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-colors"
            style={{ color: '#fff' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
          >
            ×
          </button>
        </div>
        <div style={{ color: '#fff' }}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
