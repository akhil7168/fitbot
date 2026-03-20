'use client';

import { useState } from 'react';
import { Plus, Trash2, Dumbbell, X } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { WORKOUT_TYPES, EXERCISE_DATABASE } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import { Exercise } from '@/lib/types';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export default function WorkoutsContent() {
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState<string>('strength');
  const [workoutDate, setWorkoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [workoutDuration, setWorkoutDuration] = useState('45');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: uuidv4(), name: '', sets: 3, reps: 10, weight: 0, unit: 'kg' },
  ]);

  const addExercise = () => {
    setExercises([...exercises, { id: uuidv4(), name: '', sets: 3, reps: 10, weight: 0, unit: 'kg' }]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const resetForm = () => {
    setWorkoutName('');
    setWorkoutType('strength');
    setWorkoutDate(format(new Date(), 'yyyy-MM-dd'));
    setWorkoutDuration('45');
    setWorkoutNotes('');
    setExercises([{ id: uuidv4(), name: '', sets: 3, reps: 10, weight: 0, unit: 'kg' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutName.trim()) return;

    addWorkout({
      name: workoutName.trim(),
      type: workoutType as 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'sports',
      exercises: exercises.filter((ex) => ex.name.trim()),
      date: workoutDate,
      duration: parseInt(workoutDuration) || 45,
      notes: workoutNotes.trim() || undefined,
    });

    resetForm();
    setShowModal(false);
  };

  const getTypeIcon = (type: string) => {
    const found = WORKOUT_TYPES.find((t) => t.value === type);
    return found?.icon || '💪';
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Workouts</h1>
          <p className="page-subtitle">Log and track your training sessions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Log Workout
        </button>
      </div>

      {/* Workout History */}
      {workouts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Dumbbell size={28} />
            </div>
            <h3>No workouts logged</h3>
            <p>Start tracking your training sessions by logging your first workout.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Log Your First Workout
            </button>
          </div>
        </div>
      ) : (
        <div className="workout-list">
          {[...workouts]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-card-left">
                  <div className={`workout-type-icon ${workout.type}`}>
                    {getTypeIcon(workout.type)}
                  </div>
                  <div className="workout-card-info">
                    <h4>{workout.name}</h4>
                    <div className="workout-card-meta">
                      <span>{format(new Date(workout.date), 'MMM d, yyyy')}</span>
                      <span>{formatDuration(workout.duration)}</span>
                      <span>{workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="workout-card-right">
                  <div className="workout-card-stats">
                    <div className="workout-card-calories">{workout.caloriesBurned}</div>
                    <div className="workout-card-cal-label">calories</div>
                  </div>
                  <button
                    className="btn btn-danger btn-icon btn-sm"
                    onClick={() => deleteWorkout(workout.id)}
                    title="Delete workout"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Log Workout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Workout</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="workout-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Workout Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Morning Push Day"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                  >
                    {WORKOUT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={workoutDate}
                    onChange={(e) => setWorkoutDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (min)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    min="1"
                    max="300"
                  />
                </div>
              </div>

              {/* Exercises */}
              <div className="form-group">
                <label className="form-label">Exercises</label>
                <div className="exercise-list">
                  {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="exercise-item">
                      <span className="exercise-number">{index + 1}</span>
                      <div className="exercise-fields">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                          list="exercise-suggestions"
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Sets"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Reps"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Weight"
                          value={exercise.weight}
                          onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <button
                        type="button"
                        className="exercise-remove"
                        onClick={() => removeExercise(exercise.id)}
                        disabled={exercises.length <= 1}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <datalist id="exercise-suggestions">
                  {EXERCISE_DATABASE.map((ex) => (
                    <option key={ex} value={ex} />
                  ))}
                </datalist>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={addExercise}
                >
                  <Plus size={14} />
                  Add Exercise
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="How did the workout feel? Any PRs?"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Dumbbell size={16} />
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
