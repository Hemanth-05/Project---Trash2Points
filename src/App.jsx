import { useEffect, useMemo, useState } from 'react'
import ActionCard from './components/ActionCard'
import ActivityFeed from './components/ActivityFeed'
import Leaderboard from './components/Leaderboard'
import MetricCard from './components/MetricCard'
import WelcomeScreen from './components/WelcomeScreen'
import {
  ACTION_META,
  ACTION_POINTS,
  buildLeaderboard,
  calculateUpdatedStats,
  getBadge,
  getProgressToNextBadge,
  getTodayKey,
} from './utils/game'
import {
  initializeUserProfile,
  loadAppState,
  resetAppState,
  saveActivityLog,
  saveStats,
  saveUser,
} from './utils/storage'

const TABS = ['Log Actions', 'Leaderboard', 'Profile']

function App() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    points: 0,
    streak: 0,
    lastActiveDate: null,
    todayCount: 0,
  })
  const [activityLog, setActivityLog] = useState([])
  const [activeTab, setActiveTab] = useState('Log Actions')
  const [toastMessage, setToastMessage] = useState('')
  const [isBursting, setIsBursting] = useState(false)

  useEffect(() => {
    const storedState = loadAppState()
    setUser(storedState.user)
    setStats(storedState.stats)
    setActivityLog(storedState.activityLog)
  }, [])

  useEffect(() => {
    if (!toastMessage) return undefined

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
      setIsBursting(false)
    }, 2400)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const badge = useMemo(() => getBadge(stats.points), [stats.points])
  const badgeProgress = useMemo(() => getProgressToNextBadge(stats.points), [stats.points])
  const leaderboard = useMemo(() => buildLeaderboard(user, stats.points), [user, stats.points])

  const handleStart = (profile) => {
    const initialState = initializeUserProfile(profile)
    setUser(initialState.user)
    setStats(initialState.stats)
    setActivityLog(initialState.activityLog)
  }

  const handleLogAction = (category) => {
    const currentDate = getTodayKey()
    const pointsEarned = ACTION_POINTS[category]
    const updatedDailyStats = calculateUpdatedStats(stats, currentDate)

    const updatedStats = {
      ...stats,
      ...updatedDailyStats,
      points: stats.points + pointsEarned,
    }

    const entry = {
      id: `${Date.now()}-${category}`,
      category,
      points: pointsEarned,
      timestamp: new Date().toISOString(),
      date: currentDate,
    }

    const updatedLog = [entry, ...activityLog].slice(0, 12)

    setStats(updatedStats)
    setActivityLog(updatedLog)
    saveStats(updatedStats)
    saveActivityLog(updatedLog)
    setToastMessage(
      `Nice! You earned ${pointsEarned} points for recycling ${category.toLowerCase()}.`,
    )
    setIsBursting(true)
  }

  const handleReset = () => {
    resetAppState()
    setUser(null)
    setStats({
      points: 0,
      streak: 0,
      lastActiveDate: null,
      todayCount: 0,
    })
    setActivityLog([])
    setActiveTab('Log Actions')
    setToastMessage('')
    setIsBursting(false)
  }

  const handleNameRefresh = () => {
    if (!user) return

    saveUser(user)
    setToastMessage('Profile saved locally for this demo browser.')
  }

  if (!user) {
    return <WelcomeScreen onStart={handleStart} />
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <section className="hero-card">
        <div>
          <span className="eyebrow">{user.apartment}</span>
          <h1>Welcome back, {user.name}</h1>
          <p>
            Build a simple recycling habit with small daily actions, streak momentum, and
            visible community progress.
          </p>
        </div>

        <div className="hero-card__badge">
          <span>{badge.icon}</span>
          <div>
            <p>Current badge</p>
            <strong>{badge.label}</strong>
          </div>
        </div>
      </section>

      <nav className="tabs" aria-label="Primary">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="metrics-grid">
        <MetricCard
          icon="⭐"
          label="Total Points"
          value={stats.points}
          detail="Each log builds your score"
        />
        <MetricCard
          icon="🔥"
          label="Current Streak"
          value={`${stats.streak} day${stats.streak === 1 ? '' : 's'}`}
          accent="sand"
          detail="Keep showing up daily"
        />
        <MetricCard
          icon="🧺"
          label="Today's Recycling"
          value={`${stats.todayCount} item${stats.todayCount === 1 ? '' : 's'}`}
          accent="mint"
          detail={`You recycled ${stats.todayCount} item${stats.todayCount === 1 ? '' : 's'} today`}
        />
      </section>

      {toastMessage ? (
        <div className={`toast ${isBursting ? 'toast--burst' : ''}`} role="status">
          <span>🌿</span>
          <p>{toastMessage}</p>
        </div>
      ) : null}

      {activeTab === 'Log Actions' ? (
        <section className="content-grid">
          <div className="content-stack">
            <section className="panel">
              <div className="section-heading">
                <h2>Log a Recycling Action</h2>
                <span className="chip chip--soft">Tap once per recycled item</span>
              </div>

              <div className="actions-grid">
                {Object.entries(ACTION_POINTS).map(([category, points]) => (
                  <ActionCard
                    key={category}
                    category={category}
                    points={points}
                    icon={ACTION_META[category].icon}
                    hint={ACTION_META[category].hint}
                    onClick={handleLogAction}
                  />
                ))}
              </div>
            </section>

            <section className="panel progress-panel">
              <div className="section-heading">
                <h2>Badge Progress</h2>
                <span className="chip chip--muted">Next milestone</span>
              </div>

              <div className="progress-copy">
                <p>
                  <strong>{badge.label}</strong>
                  {badgeProgress.remaining > 0
                    ? ` • ${badgeProgress.remaining} points to reach the next badge`
                    : ' • Top tier unlocked'}
                </p>
              </div>

              <div className="progress-bar" aria-hidden="true">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${badgeProgress.percentage}%` }}
                />
              </div>
            </section>
          </div>

          <ActivityFeed activityLog={activityLog} />
        </section>
      ) : null}

      {activeTab === 'Leaderboard' ? (
        <section className="content-grid leaderboard-layout">
          <Leaderboard leaderboard={leaderboard} />

          <div className="content-stack">
            <section className="panel impact-card">
              <div className="section-heading">
                <h2>Community Impact</h2>
                <span className="chip chip--soft">Demo metrics</span>
              </div>
              <div className="impact-stats">
                <div>
                  <strong>128</strong>
                  <span>items recycled this week</span>
                </div>
              </div>
            </section>

            <section className="panel profile-mini-card">
              <div className="section-heading">
                <h2>Your Snapshot</h2>
                <span className="chip">{badge.label}</span>
              </div>
              <p>
                {user.name} is currently ranked #{leaderboard.find((entry) => entry.isCurrentUser)?.rank || '-'} in{' '}
                {user.apartment}.
              </p>
              <p>
                Keep logging small recycling wins to move past the next neighbor on the board.
              </p>
            </section>
          </div>
        </section>
      ) : null}

      {activeTab === 'Profile' ? (
        <section className="content-grid profile-layout">
          <section className="panel profile-card">
            <div className="section-heading">
              <h2>Resident Profile</h2>
              <span className="chip chip--soft">Stored in localStorage</span>
            </div>

            <div className="profile-details">
              <div>
                <span>Name</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span>Apartment / Building</span>
                <strong>{user.apartment}</strong>
              </div>
              <div>
                <span>Last Active Date</span>
                <strong>{stats.lastActiveDate || 'No activity yet'}</strong>
              </div>
            </div>

            <button className="secondary-button" onClick={handleNameRefresh}>
              Save Demo Profile
            </button>
          </section>

          <section className="panel reset-card">
            <div className="section-heading">
              <h2>Reset Demo</h2>
              <span className="chip chip--muted">Start fresh</span>
            </div>
            <p>
              Clear this browser&apos;s local demo data and return to the join screen for another
              walkthrough.
            </p>
            <button className="danger-button" onClick={handleReset}>
              Reset Demo
            </button>
          </section>
        </section>
      ) : null}
    </main>
  )
}

export default App
