function Leaderboard({ leaderboard }) {
  return (
    <section className="panel leaderboard-panel">
      <div className="section-heading">
        <h2>Community Leaderboard</h2>
        <span className="chip">Friendly competition</span>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry) => (
          <article
            key={`${entry.name}-${entry.rank}`}
            className={`leaderboard-row ${entry.isCurrentUser ? 'leaderboard-row--active' : ''}`}
          >
            <div className="leaderboard-row__identity">
              <span className="leaderboard-rank">#{entry.rank}</span>
              <div>
                <p>
                  {entry.name}
                  {entry.isCurrentUser ? ' (You)' : ''}
                </p>
                <span>{entry.apartment}</span>
              </div>
            </div>
            <strong>{entry.points} pts</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Leaderboard
