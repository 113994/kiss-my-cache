'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useDailyPlan } from '@/lib/hooks';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';
import { DailyPlanItem } from '@/lib/types';

const TYPE_COLORS: Record<DailyPlanItem['type'], string> = {
  meal: 'bg-orange-100 text-orange-700 border-orange-200',
  workout: 'bg-blue-100 text-blue-700 border-blue-200',
  hydration: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  rest: 'bg-purple-100 text-purple-700 border-purple-200',
};
const TYPE_ICONS: Record<DailyPlanItem['type'], string> = {
  meal: '🍽️', workout: '🏋️', hydration: '💧', rest: '😴',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { plan, goals, toggleItem, completedCount, totalCount } = useDailyPlan(user);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => { if (!loading && !user) router.push('/'); }, [user, loading, router]);

  if (!isClient || loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-neutral-muted">Loading your plan…</p></div>;
  if (!user) return null;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <p className="text-xs text-neutral-muted">{dateStr}</p>
          <h1 className="text-2xl font-bold text-neutral-text">Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}! {user.avatar}</h1>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 mt-5">
        <div className="card-base p-4 bg-gradient-to-br from-brand-primary to-brand-dark text-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm font-medium opacity-90">Today's Completion</p>
              <p className="text-3xl font-bold mt-0.5">{completedCount}/{totalCount}</p>
            </div>
            <div className="text-right text-sm opacity-80">
              <p>{timeStr}</p>
              <p className="text-xs mt-1">{Math.round((completedCount / Math.max(totalCount, 1)) * 100)}% done</p>
            </div>
          </div>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* My Goals */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold text-neutral-text mb-3">My Goals</h2>
        <div className="space-y-3">
          {goals.map(g => (
            <div key={g.goalId} className="card-base p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{g.icon}</span>
                  <span className="font-semibold text-neutral-text text-sm">{g.label}</span>
                </div>
                <span className="text-xs text-neutral-muted">{g.metric}</span>
              </div>
              <div className="h-2 bg-neutral-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary rounded-full transition-all duration-700"
                  style={{ width: `${g.progress}%` }} />
              </div>
              <p className="text-xs text-brand-dark mt-1 text-right font-medium">{g.progress}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Plan */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-neutral-text">Today's Plan</h2>
          <span className="text-xs text-neutral-muted">Tap to check off</span>
        </div>
        <div className="space-y-3">
          {plan.map(item => (
            <button key={item.id} onClick={() => toggleItem(item.id)}
              className={`w-full card-base p-4 text-left transition-all ${item.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.completed ? 'bg-brand-primary border-brand-primary' : 'border-neutral-border'}`}>
                  {item.completed && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-neutral-muted">{item.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type]}`}>
                      {TYPE_ICONS[item.type]} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    {item.duration && <span className="text-xs text-neutral-muted">· {item.duration}</span>}
                  </div>
                  <p className={`font-semibold text-sm mt-1 ${item.completed ? 'line-through text-neutral-muted' : 'text-neutral-text'}`}>{item.title}</p>
                  <p className="text-xs text-neutral-muted mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}