import './LoginModal.css';

interface DeleteConfirmModalProps {
  readonly scheduleName: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function DeleteConfirmModal({ scheduleName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 id="delete-modal-title">Hapus Schedule</h2>
          <button className="close-btn" onClick={onCancel} aria-label="Tutup">×</button>
        </div>

        <div style={{ padding: '1.5rem 0' }}>
          <p style={{ color: '#e0e7ff', fontSize: '1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Yakin mau hapus schedule ini?
          </p>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#fca5a5', fontSize: '0.9rem', margin: 0 }}>
              {scheduleName}
            </p>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>
            Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="delete-confirm-btn"
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
