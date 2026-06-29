'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import type { Route } from '@chalsaath/shared';

const ROUTES_VISIBLE = 8;

export function RouteChips({ routes }: { routes: Route[] }) {
  const { lang } = useLang();
  const [showAll, setShowAll] = useState(false);

  if (routes.length === 0) return null;

  const visibleRoutes = showAll ? routes : routes.slice(0, ROUTES_VISIBLE);
  const hasMore = routes.length > ROUTES_VISIBLE;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {visibleRoutes.map((route) => {
          const fromLabel = lang === 'hi' ? route.fromHi : route.from;
          const toLabel = lang === 'hi' ? route.toHi : route.to;
          return (
            <Link
              key={route.id}
              href={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
              className="neu-card-sm !py-2 !px-4 text-sm font-medium hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              {fromLabel} → {toLabel}
            </Link>
          );
        })}
      </div>
      {hasMore && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          className="text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity self-start"
        >
          {showAll ? 'Show less ↑' : `Show all ${routes.length} routes ↓`}
        </button>
      )}
    </div>
  );
}
