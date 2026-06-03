import { CountryCard } from "./CountryCard.jsx";

export function CountryGrid({
  countries,
  loading,
  onSelectCountry,
  onClearFilters,
  onHookEvent,
}) {
  if (!loading && countries.length === 0) {
    return (
      <section className="empty-state">
        <h2>No countries found</h2>
        <p>Try another search, region, or favorite filter.</p>
        <button type="button" onClick={onClearFilters}>
          Clear filters
        </button>
      </section>
    );
  }

  return (
    <section className="country-grid" aria-label="Countries">
      {countries.map((country) => (
        <CountryCard
          key={country.code}
          country={country}
          onSelectCountry={onSelectCountry}
          onHookEvent={onHookEvent}
        />
      ))}
    </section>
  );
}
