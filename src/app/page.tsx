'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Dumbbell, TrendingUp, Zap, Activity, Flame, Timer, Target } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useProgress } from '@/hooks/useProgress';
import { formatDuration } from '@/lib/utils';
import { WORKOUT_TYPES } from '@/lib/constants';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { workouts, getRecentWorkouts } = useWorkouts();
  const progress = useProgress(workouts);
  const recentWorkouts = getRecentWorkouts(5);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTypeIcon = (type: string) => {
    const found = WORKOUT_TYPES.find(t => t.value === type);
    return found?.icon || '💪';
  };

  if (!mounted) {
    return (
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="typing-indicator">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here&apos;s your fitness overview.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-value">{progress.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Timer size={24} />
          </div>
          <div>
            <div className="stat-value">{formatDuration(progress.totalDuration)}</div>
            <div className="stat-label">Total Duration</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-value">{progress.totalCalories.toLocaleString()}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Target size={24} />
          </div>
          <div>
            <div className="stat-value">{progress.currentStreak}</div>
            <div className="stat-label">Day Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-grid">
        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Quick Actions</h3>
          <div className="quick-actions">
            <Link href="/chat" className="quick-action">
              <div className="quick-action-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
                <MessageSquare size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>AI Coach</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Chat with FitBot</div>
              </div>
            </Link>
            <Link href="/workouts" className="quick-action">
              <div className="quick-action-icon" style={{ background: 'rgba(57, 255, 20, 0.1)' }}>
                <Dumbbell size={20} color="var(--accent-secondary)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Log Workout</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Track your session</div>
              </div>
            </Link>
            <Link href="/progress" className="quick-action">
              <div className="quick-action-icon" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <TrendingUp size={20} color="var(--accent-purple)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>View Progress</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>See your stats</div>
              </div>
            </Link>
            <div className="quick-action" style={{ cursor: 'default' }}>
              <div className="quick-action-icon" style={{ background: 'rgba(255, 107, 53, 0.1)' }}>
                <Zap size={20} color="var(--accent-tertiary)" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>AI Powered</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Gemini 2.0 Flash</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, fontFamily: 'Inter, sans-serif' }}>Recent Activity</h3>
          {recentWorkouts.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-state-icon">
                <Dumbbell size={28} />
              </div>
              <h3>No workouts yet</h3>
              <p>Start logging your workouts to see your activity here!</p>
              <Link href="/workouts" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
                Log First Workout
              </Link>
            </div>
          ) : (
            <div className="activity-list">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="activity-item">
                  <div className="activity-icon" style={{
                    background: workout.type === 'strength' ? 'rgba(0, 212, 255, 0.1)' :
                      workout.type === 'cardio' ? 'rgba(57, 255, 20, 0.1)' :
                      workout.type === 'hiit' ? 'rgba(255, 107, 53, 0.1)' :
                      'rgba(168, 85, 247, 0.1)'
                  }}>
                    {getTypeIcon(workout.type)}
                  </div>
                  <div className="activity-info">
                    <div className="activity-title">{workout.name}</div>
                    <div className="activity-meta">
                      {format(new Date(workout.date), 'MMM d')} · {formatDuration(workout.duration)} · {workout.caloriesBurned} cal
                    </div>
                  </div>
                  <span className="badge badge-blue">{workout.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, fontFamily: 'Inter, sans-serif' }}>This Week</h3>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {progress.weeklyWorkouts.map((day) => (
            <div key={day.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{
                width: '100%',
                maxWidth: 48,
                height: 120,
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  height: day.count > 0 ? `${Math.min(day.count * 40, 100)}%` : '4px',
                  background: day.count > 0 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'height 0.5s ease',
                  minHeight: 4,
                }} />
              </div>
              <span style={{ fontSize: 12, color: day.count > 0 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: day.count > 0 ? 600 : 400 }}>
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
