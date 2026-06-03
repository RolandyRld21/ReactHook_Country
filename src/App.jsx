import { useCallback, useMemo, useRef, useState, useDeferredValue } from "react";
import "./App.css";
import { CountryDetails } from "./components/CountryDetails.jsx";
import { CountryGrid } from "./components/CountryGrid.jsx";
import { HookActivityPanel } from "./components/HookActivityPanel.jsx";
import { SearchControls } from "./components/SearchControls.jsx";
import { StatsPanel } from "./components/StatsPanel.jsx";
import { StatusLine } from "./components/StatusLine.jsx";
import { FavoritesProvider } from "./context/FavoritesProvider.jsx";
import { useCountries } from "./hooks/useCountries.js";
import { useCountryFilters } from "./hooks/useCountryFilters.js";
import { useFavorites } from "./hooks/useFavorites.js";

const initialHookEvent = {
  id: 0,
  hook: "PoC ready",
  title: "Interact with the app",
  detail:
    "Search, filter, save a favorite, open a country, or press Escape in the modal to see which React hook behavior is being demonstrated.",
};

function CountryExplorer() {
  const searchInputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hookEvents, setHookEvents] = useState([initialHookEvent]);
  const deferredQuery = useDeferredValue(query);

  const recordHookEvent = useCallback((event) => {
    setHookEvents((currentEvents) => [
      { id: crypto.randomUUID(), ...event },
      ...currentEvents,
    ].slice(0, 5));
  }, []);

  const { countries, loading, error, refresh } = useCountries(recordHookEvent);
  const { favoriteCodes } = useFavorites();

  const favoriteSet = useMemo(() => new Set(favoriteCodes), [favoriteCodes]);
  const { filteredCountries, regions, stats } = useCountryFilters({
    countries,
    query: deferredQuery,
    region,
    sortBy,
    favoriteSet,
    showFavoritesOnly,
  });

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
      recordHookEvent({
        hook: "useState + useDeferredValue",
        title: "Search text changed",
        detail:
          "useState stores the input value. useDeferredValue lets the list update from a deferred version of that value.",
      });
    },
    [recordHookEvent],
  );

  const handleRegionChange = useCallback(
    (value) => {
      setRegion(value);
      recordHookEvent({
        hook: "useState + useMemo",
        title: "Region filter changed",
        detail:
          "useState stores the selected region. useMemo recalculates the filtered country list and statistics from that input.",
      });
    },
    [recordHookEvent],
  );

  const handleSortChange = useCallback(
    (value) => {
      setSortBy(value);
      recordHookEvent({
        hook: "useState + useMemo",
        title: "Sort option changed",
        detail:
          "useState stores the sort option. useMemo reuses the sorted result until countries, filters, or sorting change.",
      });
    },
    [recordHookEvent],
  );

  const handleFavoritesOnlyChange = useCallback(
    (checked) => {
      setShowFavoritesOnly(checked);
      recordHookEvent({
        hook: "useState + useContext",
        title: "Favorites-only filter toggled",
        detail:
          "useState stores this checkbox. useContext provides the shared favorites list used by the filter.",
      });
    },
    [recordHookEvent],
  );

  const handleClearFilters = useCallback(() => {
    setQuery("");
    setRegion("all");
    setSortBy("name");
    setShowFavoritesOnly(false);
    searchInputRef.current?.focus();
    recordHookEvent({
      hook: "useRef + useCallback",
      title: "Filters reset",
      detail:
        "useCallback keeps the reset handler stable. useRef points to the search input so focus can return there.",
    });
  }, [recordHookEvent]);

  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);
      recordHookEvent({
        hook: "useState + useCallback",
        title: `${country.name} details opened`,
        detail:
          "useState stores the selected country. useCallback keeps the selection handler stable for memoized cards.",
      });
    },
    [recordHookEvent],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedCountry(null);
    recordHookEvent({
      hook: "useState + useCallback",
      title: "Details modal closed",
      detail:
        "useState clears the selected country, which removes the modal from the screen.",
    });
  }, [recordHookEvent]);

  const handleRetry = useCallback(() => {
    recordHookEvent({
      hook: "useReducer + useEffect",
      title: "Country loading retried",
      detail:
        "The retry calls the custom loading function. useReducer moves the API state through loading, success, or error.",
    });
    refresh();
  }, [recordHookEvent, refresh]);

  return (
    <main className="app-shell">
      <section className="hero-band" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">React Hooks proof of concept</p>
          <h1 id="page-title">Country Explorer</h1>
          <p className="hero-copy">
            Explore real country data from REST Countries with searching,
            filtering, sorting, favorites, and a keyboard-friendly details view.
          </p>
        </div>
        <StatsPanel stats={stats} favoriteCount={favoriteCodes.length} />
      </section>

      <SearchControls
        inputRef={searchInputRef}
        query={query}
        region={region}
        sortBy={sortBy}
        regions={regions}
        showFavoritesOnly={showFavoritesOnly}
        onQueryChange={handleQueryChange}
        onRegionChange={handleRegionChange}
        onSortChange={handleSortChange}
        onFavoritesOnlyChange={handleFavoritesOnlyChange}
        onClearFilters={handleClearFilters}
      />

      <StatusLine
        loading={loading}
        error={error}
        resultCount={filteredCountries.length}
        totalCount={countries.length}
        onRetry={handleRetry}
      />

      <CountryGrid
        countries={filteredCountries}
        loading={loading}
        onSelectCountry={handleSelectCountry}
        onClearFilters={handleClearFilters}
        onHookEvent={recordHookEvent}
      />

      {selectedCountry && (
        <CountryDetails
          country={selectedCountry}
          onClose={handleCloseDetails}
          onHookEvent={recordHookEvent}
        />
      )}

      <HookActivityPanel events={hookEvents} />
    </main>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <CountryExplorer />
    </FavoritesProvider>
  );
}

export default App;
