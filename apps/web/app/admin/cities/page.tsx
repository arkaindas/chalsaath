'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { getAllCities, createCity, updateCity, type City } from '@chalsaath/shared';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuToggle } from '@/components/ui/NeuToggle';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const generateCityId = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

interface CityFormState {
  id: string;
  name: string;
  nameHi: string;
  state: string;
  isActive: boolean;
}

const emptyForm: CityFormState = { id: '', name: '', nameHi: '', state: '', isActive: true };

export default function AdminCitiesPage() {
  const { t } = useLang();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [idTouched, setIdTouched] = useState(false);
  const [form, setForm] = useState<CityFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CityFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin';

  const load = () => {
    setLoading(true);
    getAllCities()
      .then((c) => setCities(c.sort((a, b) => a.name.localeCompare(b.name))))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="neu-card text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="font-semibold">Superadmin access only.</p>
        </div>
      </div>
    );
  }

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, id: idTouched ? f.id : generateCityId(name) }));
  };

  const handleIdChange = (id: string) => {
    setIdTouched(true);
    setForm((f) => ({ ...f, id: generateCityId(id) }));
  };

  const resetAddForm = () => {
    setForm(emptyForm);
    setIdTouched(false);
    setShowAdd(false);
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.state) return;

    if (cities.some((c) => c.id === form.id)) {
      showToast('A city with this ID already exists.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createCity(form.id, {
        name: form.name,
        nameHi: form.nameHi,
        state: form.state,
        isActive: form.isActive,
        adminUids: [],
        totalRides: 0,
      });
      showToast('City added!', 'success');
      resetAddForm();
      load();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (city: City) => {
    setEditingId(city.id);
    setEditForm({ id: city.id, name: city.name, nameHi: city.nameHi, state: city.state, isActive: city.isActive });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    try {
      await updateCity(editingId, {
        name: editForm.name,
        nameHi: editForm.nameHi,
        state: editForm.state,
        isActive: editForm.isActive,
      });
      showToast('City updated!', 'success');
      setEditingId(null);
      load();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (city: City) => {
    try {
      await updateCity(city.id, { isActive: !city.isActive });
      setCities((prev) => prev.map((c) => (c.id === city.id ? { ...c, isActive: !c.isActive } : c)));
      showToast(city.isActive ? 'City deactivated.' : 'City activated.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">{t('admin.cities')}</h1>
        <NeuButton size="sm" variant="accent" onClick={() => setShowAdd(!showAdd)}>
          + Add New City
        </NeuButton>
      </div>

      {showAdd && (
        <form onSubmit={handleAddCity} className="neu-card grid sm:grid-cols-2 gap-4">
          <NeuInput
            label="City name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            placeholder="Mumbai"
          />
          <NeuInput
            label="City ID (slug)"
            value={form.id}
            onChange={(e) => handleIdChange(e.target.value)}
            required
            placeholder="mumbai"
          />
          <NeuInput
            label="Hindi name"
            value={form.nameHi}
            onChange={(e) => setForm((f) => ({ ...f, nameHi: e.target.value }))}
            placeholder="मुंबई"
          />
          <NeuInput
            label="State"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            required
            placeholder="Maharashtra"
          />
          <div className="sm:col-span-2 flex items-center justify-between">
            <NeuToggle
              checked={form.isActive}
              onChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
              label="Active"
            />
            <div className="flex gap-2">
              <NeuButton type="button" size="sm" onClick={resetAddForm}>
                {t('common.cancel')}
              </NeuButton>
              <NeuButton type="submit" variant="accent" size="sm" disabled={submitting}>
                {submitting ? t('common.loading') : t('common.save')}
              </NeuButton>
            </div>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {cities.map((city) =>
          editingId === city.id ? (
            <form key={city.id} onSubmit={handleSaveEdit} className="neu-card grid sm:grid-cols-2 gap-4">
              <NeuInput
                label="City name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <NeuInput label="City ID" value={editForm.id} disabled />
              <NeuInput
                label="Hindi name"
                value={editForm.nameHi}
                onChange={(e) => setEditForm((f) => ({ ...f, nameHi: e.target.value }))}
              />
              <NeuInput
                label="State"
                value={editForm.state}
                onChange={(e) => setEditForm((f) => ({ ...f, state: e.target.value }))}
                required
              />
              <div className="sm:col-span-2 flex items-center justify-between">
                <NeuToggle
                  checked={editForm.isActive}
                  onChange={(checked) => setEditForm((f) => ({ ...f, isActive: checked }))}
                  label="Active"
                />
                <div className="flex gap-2">
                  <NeuButton type="button" size="sm" onClick={() => setEditingId(null)}>
                    {t('common.cancel')}
                  </NeuButton>
                  <NeuButton type="submit" variant="accent" size="sm" disabled={submitting}>
                    {submitting ? t('common.loading') : t('common.save')}
                  </NeuButton>
                </div>
              </div>
            </form>
          ) : (
            <div key={city.id} className="neu-card flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold flex items-center gap-2">
                  🏙️ {city.name}
                  <NeuBadge variant={city.isActive ? 'success' : 'danger'}>
                    {city.isActive ? 'Active' : 'Inactive'}
                  </NeuBadge>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {city.nameHi} · {city.state} · id: {city.id}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <NeuButton size="sm" onClick={() => startEdit(city)}>
                  {t('common.edit')}
                </NeuButton>
                <NeuButton
                  size="sm"
                  variant={city.isActive ? 'danger' : 'accent'}
                  onClick={() => handleToggleActive(city)}
                >
                  {city.isActive ? 'Deactivate' : 'Activate'}
                </NeuButton>
              </div>
            </div>
          )
        )}
        {cities.length === 0 && <p className="text-center text-[var(--text-secondary)] py-6">No cities yet.</p>}
      </div>
    </div>
  );
}
