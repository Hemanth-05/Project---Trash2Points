function MetricCard({ icon, label, value, accent = 'green', detail }) {
  return (
    <article className={`metric-card metric-card--${accent}`}>
      <div className="metric-card__icon">{icon}</div>
      <div>
        <p className="metric-card__label">{label}</p>
        <h3>{value}</h3>
        {detail ? <p className="metric-card__detail">{detail}</p> : null}
      </div>
    </article>
  )
}

export default MetricCard
