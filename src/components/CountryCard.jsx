import { memo, useCallback } from "react";
import { useFavorites } from "../hooks/useFavorites.js";
import { formatNumber } from "../utils/formatters.js";

function CountryCardComponent({ country, onSelectCountry, onHookEvent }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(country.code);

  const handleOpen = useCallback(() => {
    onSelectCountry(country);
  }, [country, onSelectCountry]);

  const handleFavorite = useCallback(
    (event) => {
      event.stopPropagation();
      toggleFavorite(country.code);
      onHookEvent({
        hook: "useContext + custom hook",
        title: favorite ? "Favorite removed" : "Favorite saved",
        detail:
          "useFavorites reads shared Context state. The provider stores favorites through the custom useLocalStorage hook.",
      });
    },
    [country.code, favorite, onHookEvent, toggleFavorite],
  );

  return (
    <article className="country-card">
      <button className="card-open-button" type="button" onClick={handleOpen}>
        <img src={country.flag} alt={country.flagAlt} loading="lazy" />
        <span className="country-name">{country.name}</span>
        <span className="country-meta">{country.capital}</span>
        <span className="country-meta">{formatNumber(country.population)} people</span>
      </button>
      <button
        className={`favorite-button ${favorite ? "is-favorite" : ""}`}
        type="button"
        aria-label={favorite ? `Remove ${country.name} from favorites` : `Add ${country.name} to favorites`}
        onClick={handleFavorite}
      >
        {favorite ? "Saved" : "Save"}
      </button>
    </article>
  );
}

export const CountryCard = memo(CountryCardComponent);
