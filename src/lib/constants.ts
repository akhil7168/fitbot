import { SuggestedPrompt } from './types';

export const FITNESS_SYSTEM_PROMPT = `You are FitBot AI, an expert fitness and nutrition coach with deep knowledge across all areas of physical wellness. You are friendly, motivating, and evidence-based in your advice.

Your expertise covers:

**Exercise Science & Training:**
- Strength training (hypertrophy, powerlifting, calisthenics, Olympic lifting)
- Cardiovascular training (running, cycling, swimming, HIIT, LISS)
- Flexibility and mobility (yoga, stretching, foam rolling)
- Sports-specific training and athletic performance
- Periodization, progressive overload, and training program design
- Proper exercise form and injury prevention
- Recovery strategies (sleep, deloading, active recovery)

**Nutrition & Diet:**
- Macronutrient optimization (protein, carbs, fats)
- Meal planning and meal prep strategies
- Popular diet approaches (Mediterranean, keto, intermittent fasting, plant-based)
- Pre/post-workout nutrition timing
- Hydration strategies
- Supplement guidance (creatine, protein powder, vitamins)
- Calorie counting and TDEE calculations

**Body Composition & Goals:**
- Fat loss strategies (caloric deficit, metabolic adaptation)
- Muscle building (bulking, lean gaining)
- Body recomposition
- Setting realistic fitness goals
- Tracking progress effectively

**Wellness & Lifestyle:**
- Sleep optimization for recovery
- Stress management and its impact on fitness
- Creating sustainable habits
- Warming up and cooling down properly
- Dealing with plateaus and motivation

Guidelines for your responses:
1. Always prioritize safety - recommend consulting a healthcare professional for medical concerns
2. Give specific, actionable advice with concrete examples
3. Use encouraging and motivating language
4. When providing workout plans, format them clearly with sets, reps, and rest periods
5. Back up claims with exercise science principles
6. Adapt advice based on the user's stated experience level
7. Keep responses concise but comprehensive - use formatting (headers, lists, bold) for readability
8. If asked about something outside fitness/nutrition, politely redirect to your area of expertise
9. Provide alternatives and modifications for exercises when relevant
10. Always emphasize the importance of consistency and progressive overload`;

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: '💪',
    title: 'Build a Workout Plan',
    prompt: 'Create a 4-day upper/lower split workout plan for intermediate lifters focused on building muscle',
  },
  {
    icon: '🥗',
    title: 'Nutrition Guidance',
    prompt: 'What should I eat before and after a workout for maximum muscle growth?',
  },
  {
    icon: '🔥',
    title: 'Fat Loss Strategy',
    prompt: 'What\'s the most effective and sustainable approach to lose body fat while preserving muscle?',
  },
  {
    icon: '🏃',
    title: 'Cardio Programming',
    prompt: 'How should I structure my cardio training if I also lift weights 4 days a week?',
  },
  {
    icon: '📊',
    title: 'Track My Progress',
    prompt: 'What metrics should I track to measure my fitness progress beyond just scale weight?',
  },
  {
    icon: '🧘',
    title: 'Recovery & Mobility',
    prompt: 'What\'s a good daily stretching and mobility routine to improve flexibility and prevent injuries?',
  },
];

export const WORKOUT_TYPES = [
  { value: 'strength', label: 'Strength Training', icon: '🏋️' },
  { value: 'cardio', label: 'Cardio', icon: '🏃' },
  { value: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { value: 'hiit', label: 'HIIT', icon: '⚡' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
] as const;

export const EXERCISE_DATABASE = [
  // Strength
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Chin-ups', 'Dips', 'Lunges', 'Leg Press',
  'Lat Pulldown', 'Cable Rows', 'Bicep Curls', 'Tricep Extensions',
  'Lateral Raises', 'Face Pulls', 'Romanian Deadlifts', 'Hip Thrusts',
  'Leg Curls', 'Leg Extensions', 'Calf Raises', 'Plank',
  // Cardio
  'Running', 'Cycling', 'Swimming', 'Rowing', 'Jump Rope',
  'Stair Climber', 'Elliptical', 'Walking',
  // Flexibility
  'Yoga Flow', 'Static Stretching', 'Foam Rolling', 'Dynamic Stretching',
  // HIIT
  'Burpees', 'Mountain Climbers', 'Box Jumps', 'Kettlebell Swings',
  'Battle Ropes', 'Sprint Intervals',
];

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/chat', label: 'AI Coach', icon: 'MessageSquare' },
  { href: '/workouts', label: 'Workouts', icon: 'Dumbbell' },
  { href: '/progress', label: 'Progress', icon: 'TrendingUp' },
] as const;
