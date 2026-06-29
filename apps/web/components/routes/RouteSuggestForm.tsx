'use client';

import React, { useState } from 'react';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuButton } from '@/components/ui/NeuButton';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useCity } from '@/context/CityContext';
import { useToast } from '@/components/common/Toast';
import { suggestRoute } from '@chalsaath/shared';

export function RouteSuggestForm({ onSuccess }: { onSuccess?: () => void }) {
  const { t } = useLang();
  const { user } = useAuth();
  const { selectedCity } = useCity();
  const { showToast } = useToast();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromHi, setFromHi] = useState('');
  const [toHi, setToHi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await suggestRoute({
        cityId: selectedCity?.id ?? '',
        from,
        to,
        fromHi,
        toHi,
        submittedBy: user.uid,
        submittedByName: user.name,
        distance: '',
        estimatedTime: '',
        suggestedFareMin: 0,
        suggestedFareMax: 0,
      });
      showToast(t('route.pending'), 'success');
      setFrom(''); setTo(''); setFromHi(''); setToHi('');
      onSuccess?.();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <NeuInput
          label={t('route.from')}
          placeholder="e.g., Indas"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
        <NeuInput
          label={t('route.to')}
          placeholder="e.g., Kolkata"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <NeuInput
          label={t('route.fromHi')}
          placeholder="जैसे: इंदास"
          value={fromHi}
          onChange={(e) => setFromHi(e.target.value)}
        />
        <NeuInput
          label={t('route.toHi')}
          placeholder="जैसे: कोलकाता"
          value={toHi}
          onChange={(e) => setToHi(e.target.value)}
        />
      </div>
      <NeuButton
        type="submit"
        variant="accent"
        disabled={submitting || !from || !to}
      >
        {submitting ? t('common.loading') : t('route.suggestNew')}
      </NeuButton>
    </form>
  );
}
