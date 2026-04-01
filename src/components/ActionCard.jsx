function ActionCard({ category, points, icon, hint, onClick }) {
  return (
    <button className="action-card" onClick={() => onClick(category)}>
      <div className="action-card__header">
        <span className="action-card__icon">{icon}</span>
        <span className="action-card__points">+{points} pts</span>
      </div>
      <h3>{category}</h3>
      <p>{hint}</p>
    </button>
  )
}

export default ActionCard
