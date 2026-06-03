import { SORT_OPTIONS } from "../constants.js";

export function SearchControls({
  inputRef,
  query,
  region,
  sortBy,
  regions,
  showFavoritesOnly,
  onQueryChange,
  onRegionChange,
  onSortChange,
  onFavoritesOnlyChange,
  onClearFilters,
}) {
  return (
    <section className="controls-panel" aria-label="Country filters">
      <label className="field field-wide">
        <span>Search country or capital</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Romania, Tokyo, Brazil..."
        />
      </label>

      <label className="field">
        <span>Region</span>
        <select value={region} onChange={(event) => onRegionChange(event.target.value)}>
          {regions.map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName === "all" ? "All regions" : regionName}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="toggle-field">
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={(event) => onFavoritesOnlyChange(event.target.checked)}
        />
        <span>Favorites only</span>
      </label>

      <button className="secondary-button" type="button" onClick={onClearFilters}>
        Reset
      </button>
    </section>
  );
}
