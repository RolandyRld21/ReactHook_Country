# Country Explorer

A React Hooks proof-of-concept app that explores real country data from the
REST Countries API. The project focuses on using React hooks in practical,
visible ways: async loading, derived state, memoized handlers, persistent
favorites, filtering, sorting, and a details modal.
The app also includes a small live hook viewer that explains which hook concept
is demonstrated by each interaction.

Stack: React 19, Vite, CSS3, REST Countries API

## Features

- Real API data fetched from REST Countries
- Search by country name or capital
- Filter countries by region
- Sort by name, population, or area
- Country details modal with flag, capital, languages, currencies, region, and area
- Favorites saved across page refreshes with localStorage
- Statistics for visible countries, total population, favorites, and largest match
- Loading, error, empty, and retry states
- Search input focus reset with DOM ref
- Escape key closes the details modal
- Live hook activity panel showing which hook behavior each action demonstrates

## Technology Stack

- Framework: React 19
- Build Tool: Vite
- Styling: CSS3
- State Management: React Hooks
- API: REST Countries
- Persistence: localStorage

## Project Structure

```txt
src/
|-- components/
|   |-- CountryCard.jsx       # Memoized country card, favorite action
|   |-- CountryDetails.jsx    # Modal, Escape key effect cleanup
|   |-- CountryGrid.jsx       # Results grid and empty state
|   |-- HookActivityPanel.jsx # Live educational hook activity viewer
|   |-- SearchControls.jsx    # Controlled inputs, filters, sorting
|   |-- StatsPanel.jsx        # Derived statistics display
|   `-- StatusLine.jsx        # Loading, error, retry, result count
|-- context/
|   |-- FavoritesContext.js   # Shared context object
|   `-- FavoritesProvider.jsx # Provider for favorites
|-- hooks/
|   |-- useCountries.js       # useReducer, useEffect, useCallback, useDebugValue
|   |-- useCountryFilters.js  # useMemo, useDebugValue for filtered results
|   |-- useFavorites.js       # useContext wrapper for favorites
|   `-- useLocalStorage.js    # Persistent state custom hook
|-- services/
|   `-- countriesApi.js       # API fetch and response normalization
|-- utils/
|   `-- formatters.js         # Number formatting helper
|-- App.jsx                   # Main orchestrator, UI state, useDeferredValue
|-- App.css                   # App layout and component styles
`-- main.jsx                  # React entry point
```

## React Hooks In Depth

### useState - local UI state

Used in `App.jsx` for search text, selected region, selected sort option,
favorites-only mode, the selected country modal, and the hook activity history.

```jsx
const [query, setQuery] = useState("");
const [region, setRegion] = useState("all");
const [selectedCountry, setSelectedCountry] = useState(null);
```

### useReducer - async country loading state

Used in `hooks/useCountries.js` because loading countries has related states:
countries, loading, and error. A reducer keeps those transitions predictable.

```jsx
case "LOAD_SUCCESS":
  return { countries: action.payload, loading: false, error: null };
```

### useEffect - side effects and cleanup

Used to fetch countries when the app starts. The effect also aborts the request
if the component unmounts.

```jsx
useEffect(() => {
  const controller = new AbortController();
  loadCountries(controller.signal);

  return () => controller.abort();
}, [loadCountries]);
```

Also used in `useLocalStorage` to sync favorites with localStorage and in the
details modal to close with Escape and remove the event listener during cleanup.

### useMemo - expensive derived values

Used in `hooks/useCountryFilters.js` to avoid recalculating filtered countries,
regions, and statistics on every render.

```jsx
const filteredCountries = useMemo(() => {
  return countries.filter(...).sort(...);
}, [countries, favoriteSet, query, region, showFavoritesOnly, sortBy]);
```

### useCallback - stable event handlers

Used for actions such as clearing filters, selecting a country, retrying API
loading, and toggling favorites.

```jsx
const handleClearFilters = useCallback(() => {
  setQuery("");
  setRegion("all");
  setSortBy("name");
  setShowFavoritesOnly(false);
  searchInputRef.current?.focus();
}, []);
```

### useRef - DOM focus

Used to focus the search input after filters are cleared.

```jsx
const searchInputRef = useRef(null);
searchInputRef.current?.focus();
```

### useContext - shared favorites state

Used in `hooks/useFavorites.js` so country cards and the details modal
can access favorites without passing props through every component.

```jsx
const { favoriteCodes, toggleFavorite, isFavorite } = useFavorites();
```

### useDeferredValue - smoother searching

Used in `App.jsx` so typing in the search field stays responsive while the
filtered list updates from a deferred query value.

```jsx
const deferredQuery = useDeferredValue(query);
```

### useDebugValue - custom hook labels

Used inside custom hooks to make debugging easier in React DevTools.

```jsx
useDebugValue(`${filteredCountries.length} visible countries`);
```

### Custom Hooks

- `useCountries`: loads real API data and exposes loading, error, countries, and retry
- `useCountryFilters`: computes regions, filtered results, sorting, and stats
- `useLocalStorage`: stores favorites across refreshes
- `useFavorites`: wraps `useContext` so components can read and update favorites cleanly

## Manual PoC Verification

Since this is a React Hooks PoC, testing is manual. Verify each hook behavior
from the UI:

| Hook | What to check |
| --- | --- |
| `useState` | Type in the search box, change region/sort, toggle favorites-only, and open/close a country modal. The UI updates immediately. |
| `useEffect` | Countries load when the app starts; the details modal closes with `Escape`; favorites remain after page refresh through localStorage sync. |
| `useReducer` | API loading moves through clear states: loading, success, or error. The `Retry` button triggers the loading flow again. |
| `useMemo` | Search, filter, sort, regions, and statistics are recalculated only when their inputs change. |
| `useCallback` | Handlers such as reset filters, select country, close modal, and toggle favorite are memoized and passed safely to child components. |
| `useRef` | Click `Reset` after typing in the search box; the search input receives focus again. |
| `useContext` | Save a country from a card, then open its details modal. Both places read the same favorites state without prop drilling. |
| `useDeferredValue` | Type quickly in the search box. Input typing stays responsive while the country list updates from the deferred search value. |
| `useDebugValue` | Open React DevTools and inspect the custom hooks; debug labels show country loading/filter information. |
| Custom hooks | `useCountries`, `useCountryFilters`, `useLocalStorage`, and `useFavorites` isolate reusable logic from UI components. |

The hook activity panel is intentionally educational. React hooks do not expose
a built-in runtime label when an action happens; the app records the user action
and displays the hook behavior that action demonstrates.

## Getting Started

```txt
npm install
npm run dev
```

Open the local Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

## API

This app uses REST Countries:

```txt
https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,languages,currencies,cca3,area
```

The API is used only for reading public country information.

## Limitations

- The app depends on REST Countries being available.
- Favorites are stored only in the current browser with localStorage.
- There is no backend or user account system.
- The app requests 10 fields because the REST Countries `all` endpoint limits filtered requests.
