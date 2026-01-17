import { useState } from 'react';
import { apiService } from '../services/apiService';
import type { Schedule } from '../services/supabaseService';
import './LoginModal.css';

interface EditScheduleModalProps {
  readonly schedule: Schedule;
  readonly onSuccess: (updatedSchedule: Schedule) => void;
  readonly onClose: () => void;
}

export function EditScheduleModal({ schedule, onSuccess, onClose }: EditScheduleModalProps) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const scheduleToDateString = () => {
    const monthIndex = months.indexOf(schedule.month);
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const dateStr = String(schedule.date).padStart(2, '0');
    return `${schedule.year}-${monthStr}-${dateStr}`;
  };

  const [selectedDate, setSelectedDate] = useState(scheduleToDateString());
  const [formData, setFormData] = useState({
    frontOffice: schedule.frontOffice,
    middleOffice: schedule.middleOffice,
    backOffice: schedule.backOffice,
    notes: schedule.notes || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      await apiService.updateSchedule(schedule.id, {
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
        id: schedule.id,
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
      const errorMsg = err instanceof Error ? err.message : 'Failed to update schedule';
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
      aria-labelledby="edit-modal-title"
    >
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 id="edit-modal-title">Edit Schedule</h2>
          <button className="close-btn" onClick={onClose} aria-label="Tutup">×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-schedule-date">Pilih Tanggal</label>
            <input
              id="edit-schedule-date"
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
            <label htmlFor="edit-front-office">Front Office</label>
            <input
              id="edit-front-office"
              type="text"
              value={formData.frontOffice}
              onChange={(e) => setFormData({ ...formData, frontOffice: e.target.value })}
              placeholder="Nama developer FO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-middle-office">Middle Office</label>
            <input
              id="edit-middle-office"
              type="text"
              value={formData.middleOffice}
              onChange={(e) => setFormData({ ...formData, middleOffice: e.target.value })}
              placeholder="Nama developer MO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-back-office">Back Office</label>
            <input
              id="edit-back-office"
              type="text"
              value={formData.backOffice}
              onChange={(e) => setFormData({ ...formData, backOffice: e.target.value })}
              placeholder="Nama developer BO"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-notes">Notes (Opsional)</label>
            <textarea
              id="edit-notes"
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
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
