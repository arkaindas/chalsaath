'use client';

import React, { useState } from 'react';
import { useCity } from '@/context/CityContext';
import { useLang } from '@/context/LangContext';
import type { City } from '@chalsaath/shared';

export function CityBottomSheet() {
  const { cities, selectedCity, setCity, showCitySheet, closeCitySheet } = useCity();
  const { t } = useLang();
  const [search, setSearch] = useState('');

  if (!showCitySheet) return null;

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameHi.includes(search)
  );

  return (
    <>
      <div
        onClick={closeCitySheet}
        style={{
          position: 'fixed', inset: 0, zIndex: 9990,
          background: 'rgba(0,0,0,0.4)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9991,
          background: 'var(--bg-primary)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '24px',
          maxHeight: '70vh',
          overflowY: 'auto',
          boxShadow: '0 -6px 24px rgba(0,0,0,0.15)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{t('city.changeCity')}</h2>
          <button
            onClick={closeCitySheet}
            style={{ fontSize: 20, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder={t('city.searchCity')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="neu-input w-full mb-4"
        />

        <div className="flex flex-col gap-3">
          {filtered.map((city) => (
            <button
              key={city.id}
              onClick={() => setCity(city)}
              className="neu-card text-left flex items-center justify-between transition-colors"
              style={selectedCity?.id === city.id ? { color: 'var(--accent)' } : {}}
            >
              <div>
                <p className="font-semibold">{city.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{city.nameHi} · {city.state}</p>
              </div>
              {selectedCity?.id === city.id && <span className="text-[var(--accent)]">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
