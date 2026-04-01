import { getTodayKey, normalizeStats } from './game'

const STORAGE_KEYS = {
  user: 'trash2points_user',
  stats: 'trash2points_stats',
  activityLog: 'trash2points_activity_log',
}

const DEFAULT_STATS = {
  points: 0,
  streak: 0,
  lastActiveDate: null,
  todayCount: 0,
}

export function loadAppState() {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null')
    const stats = normalizeStats(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || 'null') || DEFAULT_STATS,
    )
    const activityLog = JSON.parse(localStorage.getItem(STORAGE_KEYS.activityLog) || '[]')

    return {
      user,
      stats,
      activityLog,
    }
  } catch {
    return {
      user: null,
      stats: DEFAULT_STATS,
      activityLog: [],
    }
  }
}

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

export function saveStats(stats) {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats))
}

export function saveActivityLog(activityLog) {
  localStorage.setItem(STORAGE_KEYS.activityLog, JSON.stringify(activityLog))
}

export function initializeUserProfile(user) {
  const starterStats = {
    ...DEFAULT_STATS,
    lastActiveDate: getTodayKey(),
  }

  saveUser(user)
  saveStats(starterStats)
  saveActivityLog([])

  return {
    user,
    stats: starterStats,
    activityLog: [],
  }
}

export function resetAppState() {
  localStorage.removeItem(STORAGE_KEYS.user)
  localStorage.removeItem(STORAGE_KEYS.stats)
  localStorage.removeItem(STORAGE_KEYS.activityLog)
}
