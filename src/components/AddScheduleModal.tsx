import { useState } from 'react';
import { apiService } from '../services/apiService';
import type { Schedule } from '../services/supabaseService';
import './LoginModal.css';

interface AddScheduleModalProps {
  readonly onSuccess: (newSchedule: Schedule) => void;
  readonly onClose: () => void;
}

export function AddScheduleModal({ onSuccess, onClose }: AddScheduleModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selectedDate, setSelectedDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    frontOffice: '',
    middleOffice: '',
    backOffice: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const convertDateToScheduleFormat = (dateString: string) => {
    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dateNum = date.getDate();
    const day = days[date.getDay()];

    return { month, year, date: dateNum, day };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { month, year, date, day } = convertDateToScheduleFormat(selectedDate);

      const result = await apiService.addSchedule({
        month,
        year,
        date,
        day,
        frontOffice: formData.frontOffice,
        middleOffice: formData.middleOffice,
        backOffice: formData.backOffice,
        notes: formData.notes
      });

      onSuccess({
        id: result.id,
        month,
        year,
        date,
        day,
        frontOffice: formData.frontOffice,
        middleOffice: formData.middleOffice,
        backOffice: formData.backOffice,
        notes: formData.notes
      });
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add schedule';
      if (errorMsg.includes('duplicate') || errorMsg.includes('already exists')) {
        setError('Jadwal untuk tanggal ini sudah ada. Pilih tanggal lain.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-modal-title"
    >
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 id="add-modal-title">Tambah Schedule Baru</h2>
          <button className="close-btn" onClick={onClose} aria-label="Tutup">×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="schedule-date">Pilih Tanggal</label>
            <input
              id="schedule-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: 'white',
                fontSize: '1rem',
                width: '100%',
                colorScheme: 'dark'
              }}
            />
            <small style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
              {selectedDate && (() => {
                const { month, year, date, day } = convertDateToScheduleFormat(selectedDate);
                return `${day}, ${date} ${month} ${year}`;
              })()}
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="front-office">Front Office</label>
            <input
              id="front-office"
              type="text"
              value={formData.frontOffice}
              onChange={(e) => setFormData({ ...formData, frontOffice: e.target.value })}
              placeholder="Nama developer FO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="middle-office">Middle Office</label>
            <input
              id="middle-office"
              type="text"
              value={formData.middleOffice}
              onChange={(e) => setFormData({ ...formData, middleOffice: e.target.value })}
              placeholder="Nama developer MO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="back-office">Back Office</label>
            <input
              id="back-office"
              type="text"
              value={formData.backOffice}
              onChange={(e) => setFormData({ ...formData, backOffice: e.target.value })}
              placeholder="Nama developer BO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Opsional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan tambahan..."
              rows={3}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                padding: '0.8rem 1rem',
                color: 'white',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Menambahkan...' : 'Tambah Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
