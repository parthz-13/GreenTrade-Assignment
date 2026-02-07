import "./StatsCard.css";

function StatsCard({ title, value, icon, trend, color = "primary" }) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon-wrapper">{icon}</div>
      <div className="stats-content">
        <span className="stats-title">{title}</span>
        <span className="stats-value">{value}</span>
        {trend && (
          <span
            className={`stats-trend ${trend > 0 ? "positive" : "negative"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
