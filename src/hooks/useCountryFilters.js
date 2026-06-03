import { useDebugValue, useMemo } from "react";

export function useCountryFilters({
  countries,
  query,
  region,
  sortBy,
  favoriteSet,
  showFavoritesOnly,
}) {
  const regions = useMemo(() => {
    const uniqueRegions = new Set(countries.map((country) => country.region));
    return ["all", ...Array.from(uniqueRegions).sort()];
  }, [countries]);

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
      .sort((a, b) => {
        if (sortBy === "population-desc") return b.population - a.population;
        if (sortBy === "population-asc") return a.population - b.population;
        if (sortBy === "area-desc") return b.area - a.area;
        return a.name.localeCompare(b.name);
      });
  }, [countries, favoriteSet, query, region, showFavoritesOnly, sortBy]);

  const stats = useMemo(() => {
    const totalPopulation = filteredCountries.reduce(
      (sum, country) => sum + country.population,
      0,
    );
    const biggestCountry = filteredCountries.reduce(
      (biggest, country) => (country.population > biggest.population ? country : biggest),
      { name: "None", population: 0 },
    );

    return {
      visibleCountries: filteredCountries.length,
      totalPopulation,
      biggestCountry,
    };
  }, [filteredCountries]);

  useDebugValue(`${filteredCountries.length} visible countries`);

  return { filteredCountries, regions, stats };
}
