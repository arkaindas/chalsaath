'use client';

import React, { useState } from 'react';
import { useCity } from '@/context/CityContext';
import { useLang } from '@/context/LangContext';
import type { City } from '@chalsaath/shared';

export function CitySelector() {
  const { cities, setCity, showCitySelector, loadingCities } = useCity();
  const { t } = useLang();
  const [search, setSearch] = useState('');

  if (!showCitySelector) return null;

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameHi.includes(search)
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-1">
            Chal<span className="text-[var(--accent)]">Saath</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">चलसाथ</p>
          <p className="mt-4 font-medium text-lg">{t('city.selectCity')}</p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{t('city.selectPrompt')}</p>
        </div>

        <input
          type="text"
          placeholder={t('city.searchCity')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="neu-input w-full mb-4"
          autoFocus
        />

        {loadingCities ? (
          <div className="text-center text-[var(--text-secondary)] py-8">{t('common.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-8">{t('city.noCity')}</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((city) => (
              <CityCard key={city.id} city={city} onSelect={setCity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CityCard({ city, onSelect }: { city: City; onSelect: (c: City) => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onSelect(city).catch(() => {});
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="neu-card text-left flex items-center justify-between hover:text-[var(--accent)] transition-colors"
    >
      <div>
        <p className="font-semibold">{city.name}</p>
        <p className="text-sm text-[var(--text-secondary)]">{city.nameHi} · {city.state}</p>
      </div>
      <span className="text-[var(--accent)] text-lg">→</span>
    </button>
  );
}
