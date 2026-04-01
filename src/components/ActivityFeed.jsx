import { formatDateLabel, formatTime } from '../utils/game'

function ActivityFeed({ activityLog }) {
  if (!activityLog.length) {
    return (
      <section className="panel activity-feed">
        <div className="section-heading">
          <h2>Recent Activity</h2>
          <span className="chip chip--muted">No actions yet</span>
        </div>
        <p className="empty-state">Your recycling log will appear here after your first action.</p>
      </section>
    )
  }

  return (
    <section className="panel activity-feed">
      <div className="section-heading">
        <h2>Recent Activity</h2>
        <span className="chip">Live habit feed</span>
      </div>

      <div className="activity-list">
        {activityLog.map((entry) => (
          <article className="activity-item" key={entry.id}>
            <div>
              <p className="activity-item__title">{entry.category} recycled</p>
              <p className="activity-item__meta">
                {formatDateLabel(entry.date)} • {formatTime(entry.timestamp)}
              </p>
            </div>
            <strong>+{entry.points} points</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ActivityFeed
