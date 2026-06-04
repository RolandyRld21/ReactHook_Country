# Country Explorer

A country explorer built as a **React Hooks proof of concept**. The app uses
real data from the REST Countries API and demonstrates every major hook in a
practical feature, not only in isolated examples.

The project is intentionally similar in structure to a movie/TMDB explorer:
an API layer loads external data, cards display results, filters control the
list, a modal shows details, and custom hooks keep the business logic separate
from the UI.

**Stack:** React 19 - Vite - [REST Countries API](https://restcountries.com/)

---

## Features

- Fetches real country data from REST Countries
- Search by country name or capital
- Filter countries by region
- Sort by name, population, or area
- Save and remove favorite countries
- Favorites persist after page refresh through `localStorage`
- Detail modal with flag, official name, capital, population, area, languages, and currencies
- Statistics for visible countries, total population, favorite count, and largest match
- Loading, error, retry, and empty states
- Keyboard interaction: `Escape` closes the details modal
- Reset button clears filters and focuses the search input again
- Live hook activity panel explaining which React hook behavior each action demonstrates

---

## Project structure

```txt
src/
|-- constants.js              # API URL and sort options
|
|-- services/
|   `-- countriesApi.js       # API layer: fetch and response normalizer
|
|-- hooks/
|   |-- useCountries.js       # Custom hook: API state with useReducer/useEffect
|   |-- useCountryFilters.js  # Custom hook: derived filtering, sorting, and stats
|   |-- useFavorites.js       # Custom hook: reads favorites from Context
|   `-- useLocalStorage.js    # Custom hook: persistent state in localStorage
|
|-- context/
|   |-- FavoritesContext.js   # Shared favorites context object
|   `-- FavoritesProvider.jsx # Provider that exposes favorite actions
|
|-- components/
|   |-- SearchControls.jsx    # Search input, region filter, sort, favorite toggle
|   |-- CountryGrid.jsx       # Results grid and empty state
|   |-- CountryCard.jsx       # Memoized country card with favorite action
|   |-- CountryDetails.jsx    # Keyboard-accessible details modal
|   |-- StatsPanel.jsx        # Derived statistics display
|   |-- StatusLine.jsx        # Loading, error, retry, and result count
|   `-- HookActivityPanel.jsx # Educational hook activity viewer
|
|-- App.jsx                   # Main orchestrator: wires hooks, state, and components
|-- App.css                   # App layout, cards, modal, controls, responsive styles
`-- index.css                 # Global styles and base reset
```

---

## Getting started

**Prerequisites:** Node.js 18 or newer

```bash
git clone <repo-url>
cd <project-folder>
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates the production build in `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint checks |

No API key or `.env` file is required because REST Countries provides public
read-only data.

---

## React Hooks - in depth

This is the core purpose of the project. Each hook is used for a real app
behavior that can be demonstrated from the interface.

### `useState` - local UI state

Used in `App.jsx` for the values that belong to the current screen: search
text, selected region, selected sort option, favorites-only mode, selected
country modal, and hook activity history.

```jsx
const [query, setQuery] = useState("");
const [region, setRegion] = useState("all");
const [sortBy, setSortBy] = useState("name");
const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
const [selectedCountry, setSelectedCountry] = useState(null);
```

These values are kept in the main orchestrator because they directly control
what the user sees.

---

### `useReducer` - complex async state

Used inside `useCountries` because API loading has multiple related states:
`countries`, `loading`, and `error`. A reducer keeps those transitions in one
predictable flow.

```js
const initialState = {
  countries: [],
  loading: false,
  error: null,
};

function countriesReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return { countries: action.payload, loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
```

Without `useReducer`, the API logic would need several separate `useState`
calls that must always stay synchronized.

---

### `useEffect` - side effects and cleanup

Used to load countries when the app starts. The request is connected to an
`AbortController`, so cleanup can cancel it if the component unmounts.

```jsx
useEffect(() => {
  const controller = new AbortController();
  loadCountries(controller.signal);

  return () => controller.abort();
}, [loadCountries]);
```

Also used in `CountryDetails.jsx` to attach the `Escape` key listener and
remove it when the modal closes.

```jsx
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onClose, onHookEvent]);
```

The cleanup functions are important because they prevent stale requests or
event listeners from staying active after the UI changes.

---

### `useRef` - DOM reference without re-render

Used in `App.jsx` to keep a direct reference to the search input. When the user
clicks `Reset`, the filters are cleared and the input receives focus again.

```jsx
const searchInputRef = useRef(null);

const handleClearFilters = useCallback(() => {
  setQuery("");
  setRegion("all");
  setSortBy("name");
  setShowFavoritesOnly(false);
  searchInputRef.current?.focus();
}, [recordHookEvent]);
```

Changing a ref does not trigger a re-render, which makes it useful for
imperative DOM actions such as focusing an input.

---

### `useCallback` - stable function references

Used for event handlers that are passed to child components or used as effect
dependencies. This keeps function references stable unless their dependencies
actually change.

```jsx
const handleSelectCountry = useCallback(
  (country) => {
    setSelectedCountry(country);
  },
  [recordHookEvent],
);

const handleRetry = useCallback(() => {
  refresh();
}, [recordHookEvent, refresh]);
```

`CountryCard` is memoized, so stable handlers help prevent unnecessary child
renders when unrelated state changes.

---

### `useMemo` - memoized derived values

Used in `useCountryFilters` to compute values derived from the API response and
the current filters: available regions, filtered countries, sorting, and
statistics.

```jsx
const filteredCountries = useMemo(() => {
  const normalizedQuery = query.trim().toLowerCase();

  return countries
    .filter((country) => {
      const matchesSearch =
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.capital.toLowerCase().includes(normalizedQuery);
      const matchesRegion = region === "all" || country.region === region;
      const matchesFavorite = !showFavoritesOnly || favoriteSet.has(country.code);

      return matchesSearch && matchesRegion && matchesFavorite;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}, [countries, favoriteSet, query, region, showFavoritesOnly, sortBy]);
```

The statistics panel is also derived with `useMemo`, so the values are
recomputed only when the filtered list changes.

---

### `useContext` - shared favorites state

Used for favorites because both country cards and the details modal need access
to the same state. The app avoids prop drilling by exposing favorites through
`FavoritesProvider`.

```jsx
const { favoriteCodes, toggleFavorite, isFavorite } = useFavorites();
```

`useFavorites` is a custom hook wrapper around `useContext`, which keeps the
component code clean and gives a clear error if it is used outside the provider.

---

### `useDeferredValue` - smoother searching

Used in `App.jsx` so the input value updates immediately while the country list
uses a deferred version of the query.

```jsx
const deferredQuery = useDeferredValue(query);

const { filteredCountries, regions, stats } = useCountryFilters({
  countries,
  query: deferredQuery,
  region,
  sortBy,
  favoriteSet,
  showFavoritesOnly,
});
```

This is useful when a large list is filtered while the user is typing.

---

### `useDebugValue` - labels for custom hooks

Used inside custom hooks to make them easier to inspect in React DevTools.

```jsx
useDebugValue(state.loading ? "Loading countries" : `${state.countries.length} countries`);
useDebugValue(`${filteredCountries.length} visible countries`);
```

This does not change the UI, but it improves debugging and shows that the
custom hooks are intentionally designed.

---

### Custom hooks - reusable logic

The custom hooks keep `App.jsx` focused on orchestration while reusable logic
stays in dedicated files.

**`useCountries`** combines `useReducer`, `useEffect`, `useCallback`, and
`useDebugValue`:

```jsx
const { countries, loading, error, refresh } = useCountries(recordHookEvent);
```

**`useCountryFilters`** combines `useMemo` and `useDebugValue`:

```jsx
const { filteredCountries, regions, stats } = useCountryFilters({
  countries,
  query,
  region,
  sortBy,
  favoriteSet,
  showFavoritesOnly,
});
```

**`useLocalStorage`** combines `useState`, `useEffect`, and `useCallback`:

```jsx
const [favoriteCodes, setFavoriteCodes] = useLocalStorage(
  "country-explorer-favorites",
  [],
);
```

**`useFavorites`** wraps `useContext`:

```jsx
const { isFavorite, toggleFavorite } = useFavorites();
```

---

## Data flow

```txt
User types / selects filter / toggles favorites
        |
        v
App.jsx (useState for UI state, useDeferredValue for search)
        |
        v
useCountries (useReducer + useEffect)
        |
        v
services/countriesApi.js (fetches and normalizes REST Countries data)
        |
        v
useCountryFilters (useMemo for search, region, favorites, sorting, stats)
        |
        v
CountryGrid -> CountryCard[]
        |
        +--> user opens a card
                 |
                 v
            CountryDetails modal
                 |
                 +--> Escape key handled with useEffect cleanup
                 +--> favorite action shared through useContext
```

### API response normalization

The app does not use the raw REST Countries response directly in components.
`countriesApi.js` maps each country into a simpler object:

```js
{
  code,
  name,
  officialName,
  capital,
  region,
  subregion,
  population,
  area,
  flag,
  flagAlt,
  languages,
  currencies,
}
```

This keeps UI components easier to read because they receive predictable data.

---

## Manual proof-of-concept verification

| Hook | What to check in the app |
|------|---------------------------|
| `useState` | Type in search, change region/sort, toggle favorites-only, open and close a modal |
| `useReducer` | Reload country data and observe loading, success, error, and retry behavior |
| `useEffect` | Countries load on start; `Escape` closes the modal; cleanup removes listeners |
| `useRef` | Click `Reset` and the search input receives focus |
| `useCallback` | Handlers are passed to child components and reused between renders |
| `useMemo` | Filtered list, available regions, sorting, and stats update only from their dependencies |
| `useContext` | Save a favorite from a card and see the same state inside the details modal |
| `useDeferredValue` | Typing stays responsive while the list updates from the deferred query |
| `useDebugValue` | Inspect custom hooks in React DevTools to see debug labels |
| Custom hooks | API loading, filtering, persistence, and favorites are separated from UI components |

The hook activity panel is educational by design. React hooks do not expose a
built-in label every time an interaction happens; the app records the action
and displays which hook behavior that action demonstrates.

---

## Known limitations

- The app depends on REST Countries being available.
- Favorites are stored only in the current browser through `localStorage`.
- There is no backend, login system, or shared user account.
- REST Countries data can vary by country, so the API layer provides fallback
  values such as "No capital listed" or "No currencies listed".
- The app is focused on React Hooks as a proof of concept, not on advanced
  routing or server-side rendering.
