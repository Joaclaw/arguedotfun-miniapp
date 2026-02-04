'use client';

import UserDashboard from '@/components/UserDashboard';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
        <UserDashboard />
      </div>
      <Navigation />
    </div>
  );
}
