/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import localData from "../../data/cities.json";
const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) {
          // fallback to bundled data when json-server isn't running
          setCities(localData.cities || []);
        } else {
          const data = await res.json();
          // json-server exposes { cities: [...] } when watch file root is used in some setups,
          // but this app expects an array, so handle both shapes gracefully
          setCities(Array.isArray(data) ? data : data.cities || []);
        }
      } catch {
        alert("There was an error loading data...");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) {
        // fallback to bundled data
        const found = (localData.cities || []).find(
          (c) => String(c.id) === String(id)
        );
        setCurrentCity(found || {});
      } else {
        const data = await res.json();
        setCurrentCity(data);
      }
    } catch {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext used outside of the CitiesProvider ");
  return context;
}

export { CitiesProvider, useCities };
