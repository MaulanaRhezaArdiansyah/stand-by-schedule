import { useState, useEffect } from 'react'
import './App.css'

interface ScheduleItem {
  title: string
  date: string
  time: string
  roles: {
    FO: string | Array<{ name: string; time: string }>
    MO: string | Array<{ name: string; time: string }>
    BO: string | Array<{ name: string; time: string }>
  }
}

function App() {
  const [isVisible, setIsVisible] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState('')

  // Tanggal takedown: 9 Januari 2026 pukul 23:55
  const takedownDate = new Date('2026-01-09T23:55:00+07:00')

  const schedules: ScheduleItem[] = [
    {
      title: 'Jadwal Stand By Go Live',
      date: '8 Januari 2026 - 9 Januari 2026',
      time: '23.30 - 02.00',
      roles: {
        FO: 'Dirga',
        MO: 'Alawi',
        BO: 'mip'
      }
    },
    {
      title: 'Jadwal Stand By',
      date: '9 Januari 2026',
      time: '17.00 - 22.00',
      roles: {
        FO: [
          { name: 'Hilmi', time: '17.00-19.00' },
          { name: 'Ardan', time: '19.00-21.00' },
          { name: 'Pak Rizal', time: '21.00-22.00' }
        ],
        MO: [
          { name: 'Rheza', time: '17.00-19.00' },
          { name: 'Vigo', time: '19.00-21.00' },
          { name: 'Farhan', time: '21.00-22.00' }
        ],
        BO: [
          { name: 'rine', time: '17.00-20.00' },
          { name: 'maul', time: '20.00-22.00' }
        ]
      }
    }
  ]

  useEffect(() => {
    const checkTakedown = () => {
      const now = new Date()

      if (now >= takedownDate) {
        setIsVisible(false)
        return
      }

      // Calculate time remaining
      const diff = takedownDate.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      )
    }

    checkTakedown()
    const interval = setInterval(checkTakedown, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <div className="takedown-message">
        <h1>⏰ Jadwal Sudah Tidak Aktif</h1>
        <p>Halaman ini sudah tidak tersedia sejak 9 Januari 2026, 23:55 WIB</p>
      </div>
    )
  }

  const renderRole = (role: string | Array<{ name: string; time: string }>) => {
    if (typeof role === 'string') {
      return <div className="person">{role}</div>
    }
    return (
      <div className="person-list">
        {role.map((person, idx) => (
          <div key={idx} className="person-shift">
            <span className="name">{person.name}</span>
            <span className="time">({person.time})</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Jadwal Stand By Go Live</h1>
        <div className="countdown">
          <p>Halaman akan otomatis takedown dalam:</p>
          <div className="timer">{timeRemaining}</div>
        </div>
      </header>

      <main className="main">
        {schedules.map((schedule, idx) => (
          <div key={idx} className="schedule-card">
            <div className="schedule-header">
              <h2>{schedule.title}</h2>
              <div className="schedule-meta">
                <span className="date">📅 {schedule.date}</span>
                <span className="time">🕐 {schedule.time}</span>
              </div>
            </div>

            <div className="roles-grid">
              <div className="role-section fo">
                <h3>FO - Front Office</h3>
                {renderRole(schedule.roles.FO)}
              </div>

              <div className="role-section mo">
                <h3>MO - Middle Office</h3>
                {renderRole(schedule.roles.MO)}
              </div>

              <div className="role-section bo">
                <h3>BO - Back Office</h3>
                {renderRole(schedule.roles.BO)}
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="footer">
        <p>Stand By Schedule System • Auto-takedown: 9 Jan 2026, 23:55 WIB</p>
      </footer>
    </div>
  )
}

export default App
