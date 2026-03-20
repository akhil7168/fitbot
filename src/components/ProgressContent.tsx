'use client';

import { Activity, Flame, Timer, Target, TrendingUp, Dumbbell } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useProgress } from '@/hooks/useProgress';
import { formatDuration } from '@/lib/utils';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';

const CHART_COLORS = ['#00d4ff', '#39ff14', '#ff6b35', '#a855f7', '#ec4899'];

export default function ProgressContent() {
  const { workouts } = useWorkouts();
  const progress = useProgress(workouts);

  if (workouts.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">Track your fitness journey over time.</p>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <TrendingUp size={28} />
            </div>
            <h3>No data yet</h3>
            <p>Log some workouts to start seeing your progress charts and statistics.</p>
            <Link href="/workouts" className="btn btn-primary" style={{ marginTop: 16 }}>
              <Dumbbell size={16} />
              Log a Workout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: 13,
        }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Progress</h1>
        <p className="page-subtitle">Track your fitness journey over time.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Activity size={24} /></div>
          <div>
            <div className="stat-value">{progress.totalWorkouts}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Timer size={24} /></div>
          <div>
            <div className="stat-value">{formatDuration(progress.totalDuration)}</div>
            <div className="stat-label">Total Duration</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Flame size={24} /></div>
          <div>
            <div className="stat-value">{progress.totalCalories.toLocaleString()}</div>
            <div className="stat-label">Calories Burned</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Target size={24} /></div>
          <div>
            <div className="stat-value">{progress.currentStreak}</div>
            <div className="stat-label">Day Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Monthly Workouts */}
        <div className="chart-card">
          <h3>Monthly Workouts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progress.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="workouts" name="Workouts" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Duration */}
        <div className="chart-card">
          <h3>Monthly Duration (minutes)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progress.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39ff14" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#39ff14" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="duration"
                name="Duration"
                stroke="#39ff14"
                fill="url(#durationGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Type Distribution */}
        {progress.workoutTypeDistribution.length > 0 && (
          <div className="chart-card">
            <h3>Workout Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={progress.workoutTypeDistribution}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                  label={((props: any) => `${props.name || props.type} ${((props.percent || 0) * 100).toFixed(0)}%`) as any}
                  labelLine={false}
                  fontSize={12}
                >
                  {progress.workoutTypeDistribution.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly Activity */}
        <div className="chart-card">
          <h3>This Week</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progress.weeklyWorkouts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Workouts" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
