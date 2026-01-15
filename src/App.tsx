import { useState, useEffect } from 'react'
import './App.css'
import { fetchGistData } from './services/gistService'

interface DaySchedule {
  date: number
  day: string
  frontOffice: string
  middleOffice: string
  backOffice: string
  notes?: string
}

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchGistData()

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
          acc[key].schedules.push({
            date: schedule.date,
            day: schedule.day,
            frontOffice: schedule.frontOffice,
            middleOffice: schedule.middleOffice,
            backOffice: schedule.backOffice,
            notes: schedule.notes
          })
          return acc
        }, {} as Record<string, MonthSchedule>)

        setMonthlySchedules(Object.values(grouped))
        setCadangan(data.backup)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Gagal memuat data. Silakan refresh halaman.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const [editingCell, setEditingCell] = useState<{ monthIdx: number; scheduleIdx: number; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleCellClick = (monthIdx: number, scheduleIdx: number, field: string, currentValue: string) => {
    setEditingCell({ monthIdx, scheduleIdx, field })
    setEditValue(currentValue)
  }

  const handleCellBlur = () => {
    if (editingCell) {
      const { monthIdx, scheduleIdx, field } = editingCell
      const newSchedules = [...monthlySchedules]
      newSchedules[monthIdx].schedules[scheduleIdx] = {
        ...newSchedules[monthIdx].schedules[scheduleIdx],
        [field]: editValue
      }
      setMonthlySchedules(newSchedules)
    }
    setEditingCell(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur()
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
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
        <h1>📋 Jadwal Stand By Tim Dev</h1>
        <p className="subtitle">Jadwal Bulanan - Weekend Stand By</p>
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
                    </tr>
                  </thead>
                  <tbody>
                    {monthSchedule.schedules.map((schedule, scheduleIdx) => (
                      <tr key={scheduleIdx} className={schedule.notes ? 'has-notes' : ''}>
                        <td className="date-cell">{schedule.date} {monthSchedule.month.slice(0, 3)}</td>
                        <td className="day-cell">{schedule.day}</td>
                        <td
                          className="fo-cell editable-cell"
                          onClick={() => handleCellClick(monthIdx, scheduleIdx, 'frontOffice', schedule.frontOffice)}
                        >
                          {editingCell?.monthIdx === monthIdx &&
                           editingCell?.scheduleIdx === scheduleIdx &&
                           editingCell?.field === 'frontOffice' ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="cell-input"
                            />
                          ) : (
                            schedule.frontOffice
                          )}
                        </td>
                        <td
                          className="mo-cell editable-cell"
                          onClick={() => handleCellClick(monthIdx, scheduleIdx, 'middleOffice', schedule.middleOffice)}
                        >
                          {editingCell?.monthIdx === monthIdx &&
                           editingCell?.scheduleIdx === scheduleIdx &&
                           editingCell?.field === 'middleOffice' ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="cell-input"
                            />
                          ) : (
                            schedule.middleOffice
                          )}
                        </td>
                        <td
                          className="bo-cell editable-cell"
                          onClick={() => handleCellClick(monthIdx, scheduleIdx, 'backOffice', schedule.backOffice)}
                        >
                          {editingCell?.monthIdx === monthIdx &&
                           editingCell?.scheduleIdx === scheduleIdx &&
                           editingCell?.field === 'backOffice' ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              autoFocus
                              className="cell-input"
                            />
                          ) : (
                            schedule.backOffice
                          )}
                        </td>
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
            {monthlySchedules[0].monthNotes?.map((note, idx) => (
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
    </div>
  )
}

export default App
