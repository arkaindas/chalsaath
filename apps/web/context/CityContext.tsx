'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCities, updateUser, type City } from '@chalsaath/shared';
import { useAuth } from '@/context/AuthContext';

const CITY_STORAGE_KEY = 'chalsaath_city';

interface CityContextValue {
  selectedCity: City | null;
  cities: City[];
  loadingCities: boolean;
  setCity: (city: City) => Promise<void>;
  showCitySelector: boolean;
  setShowCitySelector: (show: boolean) => void;
  showCitySheet: boolean;
  openCitySheet: () => void;
  closeCitySheet: () => void;
}

const CityContext = createContext<CityContextValue>({
  selectedCity: null,
  cities: [],
  loadingCities: true,
  setCity: async () => {},
  showCitySelector: false,
  setShowCitySelector: () => {},
  showCitySheet: false,
  openCitySheet: () => {},
  closeCitySheet: () => {},
});

export function CityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showCitySheet, setShowCitySheet] = useState(false);

  useEffect(() => {
    getCities()
      .then((fetched) => {
        setCities(fetched);

        const stored = localStorage.getItem(CITY_STORAGE_KEY);
        if (stored) {
          const found = fetched.find((c) => c.id === stored);
          if (found) {
            setSelectedCity(found);
          } else {
            setShowCitySelector(true);
          }
        } else {
          setShowCitySelector(true);
        }
      })
      .finally(() => setLoadingCities(false));
  }, []);

  const setCity = useCallback(async (city: City) => {
    setSelectedCity(city);
    localStorage.setItem(CITY_STORAGE_KEY, city.id);
    setShowCitySelector(false);
    setShowCitySheet(false);
    if (user?.uid) {
      await updateUser(user.uid, { selectedCity: city.id }).catch(() => {});
    }
  }, [user]);

  const openCitySheet = () => setShowCitySheet(true);
  const closeCitySheet = () => setShowCitySheet(false);

  return (
    <CityContext.Provider value={{
      selectedCity,
      cities,
      loadingCities,
      setCity,
      showCitySelector,
      setShowCitySelector,
      showCitySheet,
      openCitySheet,
      closeCitySheet,
    }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
