import { useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites.js";
import { formatNumber } from "../utils/formatters.js";

export function CountryDetails({ country, onClose, onHookEvent }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(country.code);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onHookEvent({
          hook: "useEffect cleanup",
          title: "Escape key handled",
          detail:
            "useEffect registered the keydown listener and cleans it up when the modal unmounts.",
        });
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onHookEvent]);

  const handleFavorite = () => {
    toggleFavorite(country.code);
    onHookEvent({
      hook: "useContext + useLocalStorage",
      title: favorite ? "Favorite removed in modal" : "Favorite saved in modal",
      detail:
        "The modal consumes the same favorites context as the cards. useLocalStorage persists the change after refresh.",
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <img src={country.flag} alt={country.flagAlt} />
          <div>
            <p className="eyebrow">{country.region}</p>
            <h2 id="country-details-title">{country.name}</h2>
            <p>{country.officialName}</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close details" onClick={onClose}>
            X
          </button>
        </div>

        <dl className="details-grid">
          <div>
            <dt>Capital</dt>
            <dd>{country.capital}</dd>
          </div>
          <div>
            <dt>Population</dt>
            <dd>{formatNumber(country.population)}</dd>
          </div>
          <div>
            <dt>Area</dt>
            <dd>{formatNumber(country.area)} km2</dd>
          </div>
          <div>
            <dt>Subregion</dt>
            <dd>{country.subregion}</dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>{country.languages.length ? country.languages.join(", ") : "No languages listed"}</dd>
          </div>
          <div>
            <dt>Currencies</dt>
            <dd>{country.currencies.length ? country.currencies.join(", ") : "No currencies listed"}</dd>
          </div>
        </dl>

        <div className="modal-actions">
          <button type="button" onClick={handleFavorite}>
            {favorite ? "Remove favorite" : "Add favorite"}
          </button>
        </div>
      </section>
    </div>
  );
}
