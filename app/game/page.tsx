'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DualWindowLayout } from '@/features/game/components/DualWindowLayout';

export default function GamePage() {
  return (
    <AppShell>
      <div className="flex-1 flex flex-col">
        <DualWindowLayout />
      </div>
    </AppShell>
  );
}
