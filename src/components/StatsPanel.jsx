import { formatNumber } from "../utils/formatters.js";

export function StatsPanel({ stats, favoriteCount }) {
  return (
    <aside className="stats-panel" aria-label="Explorer statistics">
      <div>
        <span className="stat-label">Visible</span>
        <strong>{formatNumber(stats.visibleCountries)}</strong>
      </div>
      <div>
        <span className="stat-label">Population</span>
        <strong>{formatNumber(stats.totalPopulation)}</strong>
      </div>
      <div>
        <span className="stat-label">Favorites</span>
        <strong>{formatNumber(favoriteCount)}</strong>
      </div>
      <div>
        <span className="stat-label">Largest match</span>
        <strong>{stats.biggestCountry.name}</strong>
      </div>
    </aside>
  );
}
