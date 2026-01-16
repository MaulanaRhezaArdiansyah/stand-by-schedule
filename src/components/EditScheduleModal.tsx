import { useState } from 'react';
import { apiService, type Schedule } from '../services/apiService';
import './LoginModal.css';

interface EditScheduleModalProps {
  schedule: Schedule;
  onSuccess: (updatedSchedule: any) => void;
  onClose: () => void;
}

export function EditScheduleModal({ schedule, onSuccess, onClose }: EditScheduleModalProps) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Convert schedule to date string format
  const scheduleToDateString = () => {
    const monthIndex = months.indexOf(schedule.month);
    // Pad month and date with leading zeros
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

      // Pass the updated schedule data to parent
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>✏️ Edit Schedule</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label>Pilih Tanggal</label>
            <input
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
            <label>Front Office</label>
            <input
              type="text"
              value={formData.frontOffice}
              onChange={(e) => setFormData({ ...formData, frontOffice: e.target.value })}
              placeholder="Nama developer FO"
              required
            />
          </div>

          <div className="form-group">
            <label>Middle Office</label>
            <input
              type="text"
              value={formData.middleOffice}
              onChange={(e) => setFormData({ ...formData, middleOffice: e.target.value })}
              placeholder="Nama developer MO"
              required
            />
          </div>

          <div className="form-group">
            <label>Back Office</label>
            <input
              type="text"
              value={formData.backOffice}
              onChange={(e) => setFormData({ ...formData, backOffice: e.target.value })}
              placeholder="Nama developer BO"
              required
            />
          </div>

          <div className="form-group">
            <label>Notes (Opsional)</label>
            <textarea
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
