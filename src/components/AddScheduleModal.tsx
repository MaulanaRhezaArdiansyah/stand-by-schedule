import { useState } from 'react';
import { apiService } from '../services/apiService';
import './LoginModal.css';

interface AddScheduleModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AddScheduleModal({ onSuccess, onClose }: AddScheduleModalProps) {
  const [formData, setFormData] = useState({
    month: 'Januari',
    year: new Date().getFullYear(),
    date: 1,
    day: 'Sabtu',
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

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiService.addSchedule(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2>➕ Tambah Schedule Baru</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Bulan</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Tahun</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Tanggal</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Hari</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '8px',
                  padding: '0.8rem 1rem',
                  color: 'white',
                  fontSize: '1rem'
                }}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
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
            {loading ? 'Menambahkan...' : 'Tambah Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
}
