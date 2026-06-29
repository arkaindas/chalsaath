'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { useCity } from '@/context/CityContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LangToggle } from '@/components/ui/LangToggle';

export function Header() {
  const { user } = useAuth();
  const { t } = useLang();
  const { selectedCity, openCitySheet } = useCity();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <header
      className="sticky top-0 z-40 px-4 py-3"
      style={{
        background: 'var(--bg-primary)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">
            Chal<span className="text-[var(--accent)]">Saath</span>
          </span>
          <span className="text-xs text-[var(--text-secondary)] font-light">चलसाथ</span>
        </Link>

        {/* City pill */}
        {selectedCity && (
          <button
            onClick={openCitySheet}
            className="hidden sm:flex items-center gap-1 text-sm px-3 py-1.5 rounded-full font-medium transition-colors"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>📍</span>
            <span>{selectedCity.name}</span>
            <span style={{ fontSize: 10 }}>▾</span>
          </button>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">{t('nav.home')}</NavLink>
          <NavLink href="/search">{t('nav.findRide')}</NavLink>
          <NavLink href="/offer">{t('nav.offerRide')}</NavLink>
          {user && (
            <>
              <NavLink href="/my-rides">{t('nav.myRides')}</NavLink>
              <NavLink href="/my-bookings">{t('nav.myBookings')}</NavLink>
              <NavLink href="/alerts">{t('nav.alerts')}</NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink href="/admin">{t('nav.admin')}</NavLink>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-[12px] text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
    >
      {children}
    </Link>
  );
}
