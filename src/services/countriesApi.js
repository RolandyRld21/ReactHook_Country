import { REST_COUNTRIES_URL } from "../constants.js";

export async function fetchCountries(signal) {
  const response = await fetch(REST_COUNTRIES_URL, { signal });

  if (!response.ok) {
    throw new Error("Could not load country data. Please try again.");
  }

  const countries = await response.json();
  return countries.map(normalizeCountry).sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeCountry(country) {
  return {
    code: country.cca3,
    name: country.name?.common ?? "Unknown country",
    officialName: country.name?.official ?? "Unknown official name",
    capital: country.capital?.[0] ?? "No capital listed",
    region: country.region || "Other",
    subregion: country.subregion || "No subregion listed",
    population: country.population ?? 0,
    area: country.area ?? 0,
    flag: country.flags?.svg ?? country.flags?.png ?? "",
    flagAlt: country.flags?.alt ?? `Flag of ${country.name?.common ?? "country"}`,
    languages: Object.values(country.languages ?? {}),
    currencies: Object.values(country.currencies ?? {}).map((currency) => currency.name),
  };
}
