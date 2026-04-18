'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useCommunity } from '@/lib/hooks';
import { BottomNav } from '@/components/BottomNav';
import { useEffect, useState } from 'react';
import { CommunityActivity } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils';

function ActivityCard({ activity, onLike, isPrivate }: { activity: CommunityActivity; onLike: (id: string) => void; isPrivate: boolean }) {
  const typeColors: Record<CommunityActivity['type'], string> = {
    workout: 'bg-blue-100 text-blue-700',
    meal: 'bg-orange-100 text-orange-700',
    milestone: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="card-base p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-xl flex-shrink-0">
          {activity.userAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-neutral-text">{activity.username}</p>
            <p className="text-xs text-neutral-muted">{formatDistanceToNow(new Date(activity.timestamp))}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[activity.type]} inline-block mt-1`}>
            {activity.type}
          </span>
          <p className="font-medium text-neutral-text mt-2">{activity.title}</p>
          <p className="text-sm text-neutral-muted mt-0.5">{activity.detail}</p>
          {activity.isGPS && !isPrivate && (
            <p className="text-xs text-brand-primary mt-1">📍 Route shared</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-neutral-border">
        <button onClick={() => onLike(activity.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activity.liked ? 'bg-brand-light text-brand-primary' : 'text-neutral-muted hover:bg-neutral-bg'}`}>
          {activity.liked ? '❤️' : '🤍'} {activity.likes}
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { feed, groups, likePost, toggleGroup } = useCommunity();
  const [isClient, setIsClient] = useState(false);
  const [tab, setTab] = useState<'feed' | 'groups'>('feed');

  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => { if (!loading && !user) router.push('/'); }, [user, loading, router]);

  if (!isClient || loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-neutral-muted">Loading…</p></div>;
  if (!user) return null;

  const isPrivate = user.privacyLevel === 'private';
  const isLocked = isPrivate;

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-neutral-border z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-text">Community</h1>
        </div>
        <div className="flex border-b border-neutral-border">
          {(['feed', 'groups'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-neutral-muted'}`}>
              {t === 'feed' ? '📰 Feed' : '👥 Groups'}
            </button>
          ))}
        </div>
      </div>

      {isLocked ? (
        <div className="px-6 py-16 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-lg font-bold text-neutral-text mb-2">Social features are locked</h2>
          <p className="text-sm text-neutral-muted mb-6">Your privacy is set to <strong>Private</strong>. Change it in Profile to join the community.</p>
          <button onClick={() => router.push('/profile')} className="btn-primary px-6">Update Privacy Settings</button>
        </div>
      ) : tab === 'feed' ? (
        <div className="px-6 mt-4 space-y-4">
          {feed.map(activity => (
            <ActivityCard key={activity.id} activity={activity} onLike={likePost} isPrivate={isPrivate} />
          ))}
        </div>
      ) : (
        <div className="px-6 mt-4 space-y-3">
          <p className="text-sm text-neutral-muted">Discover and join groups that match your goals</p>
          {groups.map(g => (
            <div key={g.id} className="card-base p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">{g.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-text text-sm">{g.name}</p>
                <p className="text-xs text-neutral-muted mt-0.5">{g.description}</p>
                <p className="text-xs text-brand-primary mt-1">{g.members} members</p>
              </div>
              <button onClick={() => toggleGroup(g.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${g.joined ? 'bg-brand-light text-brand-primary border border-brand-primary' : 'bg-brand-primary text-white'}`}>
                {g.joined ? 'Joined ✓' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}