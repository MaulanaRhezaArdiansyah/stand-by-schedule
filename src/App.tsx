import { useState, useEffect } from 'react'
import './App.css'
import { fetchSupabaseData, invalidateCache, type Schedule } from './services/supabaseService'
import { apiService } from './services/apiService'
import { LoginModal } from './components/LoginModal'
import { AddScheduleModal } from './components/AddScheduleModal'
import { EditScheduleModal } from './components/EditScheduleModal'

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

      // Sort months by year and month order
      const monthOrder = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const sortedMonths = Object.values(grouped).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      })

      setMonthlySchedules(sortedMonths)
      setCadangan(data.backup)
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

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Yakin mau hapus schedule ini?')) return

    try {
      await apiService.deleteSchedule(scheduleId)
      invalidateCache()
      await loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleAddSuccess = async () => {
    invalidateCache()
    await loadData()
  }

  const handleEdit = (schedule: DaySchedule) => {
    setEditingSchedule(schedule)
    setShowEditModal(true)
  }

  const handleEditSuccess = async () => {
    invalidateCache()
    await loadData()
    setEditingSchedule(null)
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
          {monthlySchedules.map((monthSchedule, monthIdx) => (
            <div key={monthIdx} className="month-section">
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
                              onClick={() => handleDelete(schedule.id)}
                              title="Hapus schedule"
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
            {monthlySchedules[0]?.monthNotes?.map((note, idx) => (
              <div key={idx} className="note-item">
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
                  <span className="time-badge h-day">06:00 WIB</span>
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
    </div>
  )
}

export default App
