'use client';

import { useState, useEffect } from 'react';
import { getApprovedRoutes, type Route } from '@chalsaath/shared';

export function useApprovedRoutes(cityId?: string) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedRoutes(cityId)
      .then(setRoutes)
      .finally(() => setLoading(false));
  }, [cityId]);

  return { routes, loading };
}
