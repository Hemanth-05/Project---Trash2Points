const DAY_IN_MS = 24 * 60 * 60 * 1000

export const ACTION_POINTS = {
  Plastic: 5,
  Paper: 3,
  Glass: 4,
  Organic: 2,
}

export const ACTION_META = {
  Plastic: { icon: '♻️', hint: 'Bottles, containers, packaging' },
  Paper: { icon: '📄', hint: 'Mail, cardboard, office paper' },
  Glass: { icon: '🫙', hint: 'Jars and glass containers' },
  Organic: { icon: '🌿', hint: 'Compost-friendly food scraps' },
}

export const DUMMY_LEADERBOARD = [
  { name: 'Alex', points: 72, apartment: 'Maple Court' },
  { name: 'Priya', points: 61, apartment: 'Maple Court' },
  { name: 'Jordan', points: 48, apartment: 'Maple Court' },
  { name: 'Sam', points: 35, apartment: 'Maple Court' },
]

function toLocalDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseLocalDate(dateString) {
  return new Date(`${dateString}T00:00:00`)
}

export function getTodayKey() {
  return toLocalDateKey(new Date())
}

export function isSameDay(firstDate, secondDate) {
  return Boolean(firstDate) && Boolean(secondDate) && firstDate === secondDate
}

export function isYesterday(dateString, referenceDateString) {
  if (!dateString || !referenceDateString) return false

  const previousDay = parseLocalDate(referenceDateString)
  previousDay.setDate(previousDay.getDate() - 1)

  return dateString === toLocalDateKey(previousDay)
}

export function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatDateLabel(dateString) {
  if (!dateString) return 'Today'

  const date = parseLocalDate(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getBadge(points) {
  if (points >= 100) {
    return {
      label: 'Sustainability Hero',
      icon: '🏆',
      min: 100,
      max: 100,
      nextTarget: null,
    }
  }

  if (points >= 50) {
    return {
      label: 'Green Champion',
      icon: '🌱',
      min: 50,
      max: 99,
      nextTarget: 100,
    }
  }

  if (points >= 20) {
    return {
      label: 'Eco Starter',
      icon: '🍃',
      min: 20,
      max: 49,
      nextTarget: 50,
    }
  }

  return {
    label: 'Beginner Recycler',
    icon: '🌼',
    min: 0,
    max: 19,
    nextTarget: 20,
  }
}

export function getProgressToNextBadge(points) {
  const badge = getBadge(points)

  if (!badge.nextTarget) {
    return { percentage: 100, remaining: 0 }
  }

  const range = badge.nextTarget - badge.min
  const progress = points - badge.min
  const percentage = Math.max(0, Math.min(100, (progress / range) * 100))

  return {
    percentage,
    remaining: badge.nextTarget - points,
  }
}

export function buildLeaderboard(user, points) {
  const community = [...DUMMY_LEADERBOARD]

  if (user?.name) {
    community.push({
      name: user.name,
      apartment: user.apartment,
      points,
      isCurrentUser: true,
    })
  }

  return community
    .sort((first, second) => second.points - first.points)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

export function calculateUpdatedStats(currentStats, currentDate) {
  const lastActiveDate = currentStats.lastActiveDate

  // Keep the streak rules intentionally simple for the hackathon MVP.
  if (!lastActiveDate) {
    return {
      streak: 1,
      todayCount: 1,
      lastActiveDate: currentDate,
    }
  }

  if (isSameDay(lastActiveDate, currentDate)) {
    return {
      streak: currentStats.streak || 1,
      todayCount: (currentStats.todayCount || 0) + 1,
      lastActiveDate: currentDate,
    }
  }

  if (isYesterday(lastActiveDate, currentDate)) {
    return {
      streak: (currentStats.streak || 0) + 1,
      todayCount: 1,
      lastActiveDate: currentDate,
    }
  }

  return {
    streak: 1,
    todayCount: 1,
    lastActiveDate: currentDate,
  }
}

export function normalizeStats(stats) {
  const today = getTodayKey()

  if (!stats.lastActiveDate) {
    return stats
  }

  const lastActive = parseLocalDate(stats.lastActiveDate).getTime()
  const todayTime = parseLocalDate(today).getTime()

  if (todayTime - lastActive >= DAY_IN_MS) {
    return {
      ...stats,
      todayCount: 0,
    }
  }

  return stats
}
