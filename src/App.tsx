import { useState, useEffect } from 'react'
import './App.css'
import { fetchSupabaseData, invalidateCache, type Schedule } from './services/supabaseService'
import { apiService } from './services/apiService'
import { LoginModal } from './components/LoginModal'
import { AddScheduleModal } from './components/AddScheduleModal'
import { EditScheduleModal } from './components/EditScheduleModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

interface DaySchedule extends Schedule {}

interface MonthSchedule {
  month: string
  year: number
  schedules: DaySchedule[]
  monthNotes?: string[]
}

interface Cadangan {
  backOffice: string
  frontOffice: string
}

const MONTH_ORDER = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// Helper functions for schedule state management
function sortMonthsByDate(months: MonthSchedule[]): MonthSchedule[] {
  return [...months].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
  });
}

function removeScheduleFromState(schedules: MonthSchedule[], scheduleId: string): MonthSchedule[] {
  return schedules
    .map(month => ({
      ...month,
      schedules: month.schedules.filter(s => s.id !== scheduleId)
    }))
    .filter(month => month.schedules.length > 0);
}

function addScheduleToState(
  schedules: MonthSchedule[],
  newSchedule: DaySchedule
): MonthSchedule[] {
  const key = `${newSchedule.month}-${newSchedule.year}`;
  const existingMonthIndex = schedules.findIndex(m => `${m.month}-${m.year}` === key);

  if (existingMonthIndex >= 0) {
    const updated = [...schedules];
    updated[existingMonthIndex] = {
      ...updated[existingMonthIndex],
      schedules: [...updated[existingMonthIndex].schedules, newSchedule].sort((a, b) => a.date - b.date)
    };
    return updated;
  }

  const newMonth: MonthSchedule = {
    month: newSchedule.month,
    year: newSchedule.year,
    schedules: [newSchedule],
    monthNotes: schedules[0]?.monthNotes ?? []
  };

  return sortMonthsByDate([...schedules, newMonth]);
}

function updateScheduleInState(
  schedules: MonthSchedule[],
  updatedSchedule: DaySchedule
): MonthSchedule[] {
  const withoutOld = removeScheduleFromState(schedules, updatedSchedule.id);
  return addScheduleToState(withoutOld, updatedSchedule);
}

function App() {
  const [monthlySchedules, setMonthlySchedules] = useState<MonthSchedule[]>([])
  const [cadangan, setCadangan] = useState<Cadangan>({ backOffice: '', frontOffice: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth state
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<DaySchedule | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingSchedule, setDeletingSchedule] = useState<{ id: string; schedule: DaySchedule } | null>(null)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchSupabaseData()

      // Group schedules by month
      const grouped = data.schedules.reduce((acc, schedule) => {
        const key = `${schedule.month}-${schedule.year}`
        if (!acc[key]) {
          acc[key] = {
            month: schedule.month,
            year: schedule.year,
            schedules: [],
            monthNotes: data.monthNotes
          }
        }
        acc[key].schedules.push(schedule)
        return acc
      }, {} as Record<string, MonthSchedule>)

      const sortedMonths = sortMonthsByDate(Object.values(grouped))

      // Convert backup IDs to names
      const backOfficeDev = data.developers.find(d => d.id === data.backup.backOffice)
      const frontOfficeDev = data.developers.find(d => d.id === data.backup.frontOffice)

      setMonthlySchedules(sortedMonths)
      setCadangan({
        backOffice: backOfficeDev?.name || data.backup.backOffice,
        frontOffice: frontOfficeDev?.name || data.backup.frontOffice
      })
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Gagal memuat data. Silakan refresh halaman.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Check if already logged in
    apiService.verifySession().then(result => {
      if (result?.email) {
        setUser({ email: result.email })
      }
    })
  }, [])

  const handleLogin = (userData: { email: string }) => {
    setUser(userData)
  }

  const handleLogout = () => {
    apiService.logout()
    setUser(null)
  }

  const canDeleteSchedule = (schedule: DaySchedule): boolean => {
    const scheduleMonthIndex = MONTH_ORDER.indexOf(schedule.month);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    if (schedule.year > currentYear) return true;
    if (schedule.year === currentYear && scheduleMonthIndex >= currentMonth) return true;

    return false;
  };

  const handleDeleteClick = (scheduleId: string, schedule: DaySchedule) => {
    if (!canDeleteSchedule(schedule)) {
      alert('Hanya bisa menghapus jadwal bulan ini atau yang akan datang.');
      return;
    }

    setDeletingSchedule({ id: scheduleId, schedule });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSchedule) return;

    try {
      await apiService.deleteSchedule(deletingSchedule.id);
      invalidateCache();
      setMonthlySchedules(prev => removeScheduleFromState(prev, deletingSchedule.id));
      setShowDeleteModal(false);
      setDeletingSchedule(null);
    } catch (err) {
      await loadData();
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleAddSuccess = (newSchedule: DaySchedule) => {
    invalidateCache();
    setMonthlySchedules(prev => addScheduleToState(prev, newSchedule));
  }

  const handleEdit = (schedule: DaySchedule) => {
    setEditingSchedule(schedule)
    setShowEditModal(true)
  }

  const handleEditSuccess = (updatedSchedule: DaySchedule) => {
    invalidateCache();
    setMonthlySchedules(prev => updateScheduleInState(prev, updatedSchedule));
    setEditingSchedule(null);
  }

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>📋 Jadwal Stand By Tim Dev</h1>
          <p className="subtitle">Memuat data...</p>
        </header>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>📋 Jadwal Stand By Tim Dev</h1>
          <p className="subtitle" style={{ color: '#ef4444' }}>{error}</p>
        </header>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>📋 Jadwal Stand By Tim Dev</h1>
            <p className="subtitle">Jadwal Bulanan - Weekend Stand By</p>
          </div>
          {user ? (
            <>
              <div className="user-info">
                <span className="user-badge">👤 {user.email}</span>
              </div>
              <div className="action-buttons">
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                  ➕ Tambah Schedule
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <div className="login-section">
              <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                🔐 Login Admin
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="layout">
        <main className="main">
          {monthlySchedules.map((monthSchedule) => (
            <div key={`${monthSchedule.month}-${monthSchedule.year}`} className="month-section">
              <div className="month-header">
                <h2>{monthSchedule.month} {monthSchedule.year}</h2>
              </div>

              <div className="table-container">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Hari</th>
                      <th className="fo-header">Front Office</th>
                      <th className="mo-header">Middle Office</th>
                      <th className="bo-header">Back Office</th>
                      {user && <th>Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {monthSchedule.schedules.map((schedule) => (
                      <tr key={schedule.id} className={schedule.notes ? 'has-notes' : ''}>
                        <td className="date-cell">{schedule.date} {monthSchedule.month.slice(0, 3)}</td>
                        <td className="day-cell">{schedule.day}</td>
                        <td className="fo-cell">{schedule.frontOffice}</td>
                        <td className="mo-cell">{schedule.middleOffice}</td>
                        <td className="bo-cell">{schedule.backOffice}</td>
                        {user && (
                          <td className="action-cell">
                            <button
                              className="edit-btn-small"
                              onClick={() => handleEdit(schedule)}
                              title="Edit schedule"
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-btn-small"
                              onClick={() => handleDeleteClick(schedule.id, schedule)}
                              title={canDeleteSchedule(schedule) ? "Hapus schedule" : "Tidak bisa hapus jadwal masa lalu"}
                              disabled={!canDeleteSchedule(schedule)}
                              style={{
                                opacity: canDeleteSchedule(schedule) ? 1 : 0.5,
                                cursor: canDeleteSchedule(schedule) ? 'pointer' : 'not-allowed'
                              }}
                            >
                              🗑️
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </main>

        <aside className="sidebar">
          <div className="cadangan-section">
            <h3>Cadangan</h3>
            <div className="cadangan-item">
              <span className="role-label">Back Office:</span>
              <span className="person-name">{cadangan.backOffice}</span>
            </div>
            <div className="cadangan-item">
              <span className="role-label">Front Office:</span>
              <span className="person-name">{cadangan.frontOffice}</span>
            </div>
          </div>

          <div className="notes-section">
            <h3>Catatan Penting</h3>
            {monthlySchedules[0]?.monthNotes?.map((note) => (
              <div key={note} className="note-item">
                <span className="note-icon">⚠️</span>
                <p>{note}</p>
              </div>
            ))}
          </div>

          <div className="reminder-info-section">
            <h3>📬 Sistem Reminder</h3>
            <div className="reminder-schedule">
              <div className="reminder-item">
                <div className="reminder-time">
                  <span className="time-badge h-minus-1">17:00 WIB</span>
                  <span className="day-label">H-1</span>
                </div>
                <p className="reminder-desc">
                  Reminder dikirim ke developer yang stand by <strong>besok</strong> via:
                </p>
                <div className="channel-badges">
                  <span className="channel-badge email">📧 Email</span>
                  <span className="channel-badge whatsapp">💬 WhatsApp</span>
                </div>
              </div>

              <div className="reminder-item">
                <div className="reminder-time">
                  <span className="time-badge h-day">05:00 WIB</span>
                  <span className="day-label">Hari H</span>
                </div>
                <p className="reminder-desc">
                  Reminder dikirim ke developer yang stand by <strong>hari ini</strong> via:
                </p>
                <div className="channel-badges">
                  <span className="channel-badge email">📧 Email</span>
                  <span className="channel-badge whatsapp">💬 WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {showAddModal && (
        <AddScheduleModal
          onSuccess={handleAddSuccess}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && editingSchedule && (
        <EditScheduleModal
          schedule={editingSchedule}
          onSuccess={handleEditSuccess}
          onClose={() => {
            setShowEditModal(false)
            setEditingSchedule(null)
          }}
        />
      )}

      {showDeleteModal && deletingSchedule && (
        <DeleteConfirmModal
          scheduleName={`${deletingSchedule.schedule.day}, ${deletingSchedule.schedule.date} ${deletingSchedule.schedule.month} ${deletingSchedule.schedule.year}`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false)
            setDeletingSchedule(null)
          }}
        />
      )}
    </div>
  )
}

export default App
