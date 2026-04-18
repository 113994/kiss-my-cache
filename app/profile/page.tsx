'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';
import { PrivacyLevel } from '@/lib/types';

const GOAL_LABELS: Record<string, { label: string; icon: string }> = {
  'weight-loss': { label: 'Weight Loss', icon: '⬇️' },
  'energy': { label: 'More Energy', icon: '⚡' },
  'sleep': { label: 'Better Sleep', icon: '😴' },
  'strength': { label: 'Strength', icon: '💪' },
  'mental-wellness': { label: 'Mental Wellness', icon: '🧘' },
  'flexibility': { label: 'Flexibility', icon: '🤸' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateUser } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [editingPrivacy, setEditingPrivacy] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => { if (!loading && !user) router.push('/'); }, [user, loading, router]);

  if (!isClient || loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-neutral-muted">Loading…</p></div>;
  if (!user) return null;

  const privacyInfo: Record<PrivacyLevel, { icon: string; label: string; desc: string }> = {
    private: { icon: '🔒', label: 'Private', desc: 'Only you see your data' },
    followers: { icon: '👥', label: 'Followers Only', desc: 'Social features enabled' },
    everyone: { icon: '🌍', label: 'Everyone', desc: 'Fully public' },
  };

  const handleLogout = () => { if (confirm('Log out?')) { logout(); router.push('/'); } };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-text">Profile</h1>
        </div>
      </div>

      {/* Avatar & Name */}
      <div className="px-6 mt-6">
        <div className="card-base p-6 text-center">
          <div className="text-6xl mb-3">{user.avatar}</div>
          <h2 className="text-2xl font-bold text-neutral-text">{user.name}</h2>
          <p className="text-neutral-muted text-sm">{user.email}</p>
          {user.age && <p className="text-neutral-muted text-xs mt-1">Age {user.age}{user.gender ? ` · ${user.gender}` : ''}</p>}
        </div>
      </div>

      {/* Privacy */}
      <div className="px-6 mt-4">
        <h3 className="font-semibold text-neutral-text mb-3">Privacy Settings</h3>
        {!editingPrivacy ? (
          <button onClick={() => setEditingPrivacy(true)} className="w-full card-base p-4 flex items-center gap-3 text-left">
            <span className="text-2xl">{privacyInfo[user.privacyLevel].icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-neutral-text">{privacyInfo[user.privacyLevel].label}</p>
              <p className="text-xs text-neutral-muted">{privacyInfo[user.privacyLevel].desc}</p>
            </div>
            <span className="text-neutral-muted text-sm">Edit →</span>
          </button>
        ) : (
          <div className="space-y-2">
            {(Object.entries(privacyInfo) as [PrivacyLevel, typeof privacyInfo[PrivacyLevel]][]).map(([level, info]) => (
              <button key={level} onClick={() => { updateUser({ privacyLevel: level }); setEditingPrivacy(false); }}
                className={`w-full card-base p-4 flex items-center gap-3 text-left transition-all ${user.privacyLevel === level ? 'border-brand-primary border-2' : ''}`}>
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-neutral-text">{info.label}</p>
                  <p className="text-xs text-neutral-muted">{info.desc}</p>
                </div>
                {user.privacyLevel === level && <span className="ml-auto text-brand-primary">✓</span>}
              </button>
            ))}
            <button onClick={() => setEditingPrivacy(false)} className="btn-secondary w-full text-sm py-2">Cancel</button>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="px-6 mt-6">
        <h3 className="font-semibold text-neutral-text mb-3">Health Goals</h3>
        <div className="flex flex-wrap gap-2">
          {user.healthGoals.map(g => (
            <span key={g} className="px-3 py-1.5 bg-brand-light text-brand-dark text-xs font-semibold rounded-full">
              {GOAL_LABELS[g]?.icon} {GOAL_LABELS[g]?.label || g}
            </span>
          ))}
        </div>
      </div>

      {/* Dietary */}
      {user.dietaryRestrictions?.length > 0 && (
        <div className="px-6 mt-4">
          <h3 className="font-semibold text-neutral-text mb-3">Dietary Restrictions</h3>
          <div className="flex flex-wrap gap-2">
            {user.dietaryRestrictions.map(d => (
              <span key={d} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full capitalize">{d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {user.physicalLimitations && (
        <div className="px-6 mt-4">
          <h3 className="font-semibold text-neutral-text mb-2">Physical Limitations</h3>
          <p className="text-sm text-neutral-muted">{user.physicalLimitations}</p>
        </div>
      )}

      {/* Social features summary */}
      <div className="px-6 mt-6">
        <h3 className="font-semibold text-neutral-text mb-3">Social Features</h3>
        <div className="card-base p-4">
          {([
            { feature: 'Activity Sharing', allowed: user.privacyLevel !== 'private' },
            { feature: 'Route Sharing (GPS activities)', allowed: user.privacyLevel !== 'private' },
            { feature: 'Join / Create Groups', allowed: user.privacyLevel !== 'private' },
            { feature: 'Follow Other Users', allowed: user.privacyLevel !== 'private' },
            { feature: 'Community Feed', allowed: user.privacyLevel !== 'private' },
          ]).map(row => (
            <div key={row.feature} className="flex items-center justify-between py-2 border-b border-neutral-border last:border-0">
              <span className="text-sm text-neutral-text">{row.feature}</span>
              <span className={`text-sm font-bold ${row.allowed ? 'text-brand-primary' : 'text-red-400'}`}>
                {row.allowed ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-muted mt-2">Note: Non-GPS activities always share only duration & type — no location data.</p>
      </div>

      {/* Logout */}
      <div className="px-6 mt-8">
        <button onClick={handleLogout} className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-colors">
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
