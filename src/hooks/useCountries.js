import { useCallback, useDebugValue, useEffect, useReducer } from "react";
import { fetchCountries } from "../services/countriesApi.js";

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const noop = () => {};

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

export function useCountries(onHookEvent = noop) {
  const [state, dispatch] = useReducer(countriesReducer, initialState);

  const loadCountries = useCallback(async (signal) => {
    dispatch({ type: "LOAD_START" });
    onHookEvent({
      hook: "useEffect + useReducer",
      title: "Countries loading started",
      detail:
        "useEffect starts the API request. useReducer stores the loading, success, and error states in one predictable flow.",
    });

    try {
      const countries = await fetchCountries(signal);
      dispatch({ type: "LOAD_SUCCESS", payload: countries });
      onHookEvent({
        hook: "useReducer",
        title: "Countries loaded",
        detail:
          "The reducer handled LOAD_SUCCESS and saved the API result in React state.",
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      dispatch({ type: "LOAD_ERROR", payload: error.message });
      onHookEvent({
        hook: "useReducer",
        title: "Country loading failed",
        detail:
          "The reducer handled LOAD_ERROR, so the UI can show the retry state.",
      });
    }
  }, [onHookEvent]);

  useEffect(() => {
    const controller = new AbortController();
    loadCountries(controller.signal);

    return () => controller.abort();
  }, [loadCountries]);

  useDebugValue(state.loading ? "Loading countries" : `${state.countries.length} countries`);

  return {
    ...state,
    refresh: loadCountries,
  };
}
