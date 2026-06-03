import { useCallback, useMemo } from "react";
import { FavoritesContext } from "./FavoritesContext.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export function FavoritesProvider({ children }) {
  const [favoriteCodes, setFavoriteCodes] = useLocalStorage(
    "country-explorer-favorites",
    [],
  );

  const toggleFavorite = useCallback(
    (countryCode) => {
      setFavoriteCodes((currentCodes) =>
        currentCodes.includes(countryCode)
          ? currentCodes.filter((code) => code !== countryCode)
          : [...currentCodes, countryCode],
      );
    },
    [setFavoriteCodes],
  );

  const isFavorite = useCallback(
    (countryCode) => favoriteCodes.includes(countryCode),
    [favoriteCodes],
  );

  const value = useMemo(
    () => ({ favoriteCodes, toggleFavorite, isFavorite }),
    [favoriteCodes, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}
