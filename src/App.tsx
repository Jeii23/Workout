import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Save,
  X,
  GripVertical,
} from 'lucide-react';

type BaseExercise = {
  id: string;
  name: string;
  sets: number;
  rest: number;
};

type TimeExercise = BaseExercise & {
  type: 'time';
  duration: number;
};

type RepsExercise = BaseExercise & {
  type: 'reps';
  reps: number;
};

type Exercise = TimeExercise | RepsExercise;

type RoutineExercise = Exercise & {
  routineExId: string;
};

type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
};

type View = 'home' | 'exercises' | 'builder' | 'runner';

type ExerciseFormState = {
  name: string;
  type: Exercise['type'];
  duration: number;
  reps: number;
  sets: number;
  rest: number;
};

const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex1', name: 'Isometrica', type: 'time', duration: 60, sets: 2, rest: 60 },
  { id: 'ex2', name: 'Plancha', type: 'time', duration: 60, sets: 2, rest: 30 },
  { id: 'ex3', name: 'Cagar al bosc', type: 'time', duration: 60, sets: 2, rest: 60 },
  { id: 'ex4', name: 'Glutis', type: 'reps', reps: 15, sets: 2, rest: 30 },
  { id: 'ex5', name: 'Aleteos', type: 'time', duration: 45, sets: 2, rest: 60 },
  { id: 'ex6', name: 'Flexions', type: 'reps', reps: 15, sets: 2, rest: 45 },
  { id: 'ex7', name: 'Biceps basic', type: 'reps', reps: 15, sets: 2, rest: 45 },
  { id: 'ex8', name: 'Hombro basic', type: 'reps', reps: 15, sets: 2, rest: 45 },
  { id: 'ex9', name: 'Abdominals cames amunt', type: 'reps', reps: 15, sets: 2, rest: 45 },
];

const PAGE_BG_CLASS = 'min-h-screen bg-slate-950 text-slate-100 p-6';
const PANEL_CLASS =
  'rounded-2xl border border-slate-800 bg-slate-900/70 shadow-[0_20px_45px_rgba(2,6,23,0.45)] backdrop-blur';
const INPUT_CLASS =
  'w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500';
const SELECT_CLASS = `${INPUT_CLASS} appearance-none`;
const MUTED_BUTTON_CLASS =
  'flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition-colors';

type VideoResult = {
  id: string;
  title: string;
  thumbnail: string;
};

type VideoCatalogEntry = VideoResult & {
  keywords: string[];
};

const buildYouTubeThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const VIDEO_LIBRARY: VideoCatalogEntry[] = [
  {
    id: 'ml6cT4AZdqI',
    title: 'HIIT de 20 minutos para todo el cuerpo',
    thumbnail: buildYouTubeThumbnail('ml6cT4AZdqI'),
    keywords: ['hiit', 'intenso', 'cardio', 'rapido'],
  },
  {
    id: 'AAvOKMTpt2Y',
    title: 'Yoga fluido para recuperar energía',
    thumbnail: buildYouTubeThumbnail('AAvOKMTpt2Y'),
    keywords: ['yoga', 'movilidad', 'estiramiento', 'relajacion'],
  },
  {
    id: 'VaoV1PrYft4',
    title: 'Pilates para fortalecer el core',
    thumbnail: buildYouTubeThumbnail('VaoV1PrYft4'),
    keywords: ['pilates', 'core', 'abdomen', 'suave'],
  },
  {
    id: 'UItWltVZZmE',
    title: 'Cardio en casa sin equipo',
    thumbnail: buildYouTubeThumbnail('UItWltVZZmE'),
    keywords: ['cardio', 'sin equipo', 'casa', 'principiante'],
  },
  {
    id: 'Z0X9Wm6jyfY',
    title: 'Rutina dance fitness para quemar calorías',
    thumbnail: buildYouTubeThumbnail('Z0X9Wm6jyfY'),
    keywords: ['dance', 'baile', 'zumba', 'ritmo'],
  },
  {
    id: 'i0ZabxXmH4Y',
    title: 'Entrenamiento de fuerza con mancuernas ligeras',
    thumbnail: buildYouTubeThumbnail('i0ZabxXmH4Y'),
    keywords: ['fuerza', 'mancuernas', 'pesas', 'tonificar'],
  },
  {
    id: 'v7AYKMP6rOE',
    title: 'Yoga para principiantes en 30 minutos',
    thumbnail: buildYouTubeThumbnail('v7AYKMP6rOE'),
    keywords: ['yoga', 'principiante', '30 minutos', 'suave'],
  },
  {
    id: '1skBf6h2ksI',
    title: 'Tabata brutal de 10 minutos',
    thumbnail: buildYouTubeThumbnail('1skBf6h2ksI'),
    keywords: ['tabata', 'rapido', '10 minutos', 'intenso'],
  },
  {
    id: '50kH47ZztHs',
    title: 'Estiramientos guiados para después del entrenamiento',
    thumbnail: buildYouTubeThumbnail('50kH47ZztHs'),
    keywords: ['estiramiento', 'movilidad', 'cooldown', 'flexibilidad'],
  },
  {
    id: 'aKbFZG9V5wM',
    title: 'Cardio box para liberar estrés',
    thumbnail: buildYouTubeThumbnail('aKbFZG9V5wM'),
    keywords: ['box', 'kickboxing', 'golpes', 'estres'],
  },
  {
    id: 'tXOZS3AKKOw',
    title: 'Entrenamiento de abdominales sin dolor de cuello',
    thumbnail: buildYouTubeThumbnail('tXOZS3AKKOw'),
    keywords: ['abs', 'abdominales', 'core', 'suelo'],
  },
  {
    id: 'M8AeV8Jbx3E',
    title: 'Rutina rápida para glúteos y piernas',
    thumbnail: buildYouTubeThumbnail('M8AeV8Jbx3E'),
    keywords: ['gluteos', 'piernas', 'inferior', 'tonificar'],
  },
];

const DEFAULT_VIDEO_LIBRARY: VideoResult[] = VIDEO_LIBRARY;

const HAS_YOUTUBE_API_KEY = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY);

const mockSearchVideos = (query: string): VideoResult[] => {
  const normalized = normalizeText(query);
  if (!normalized) {
    return DEFAULT_VIDEO_LIBRARY;
  }

  const tokens = normalized.split(' ').filter(Boolean);
  const scored = VIDEO_LIBRARY.map((entry) => {
    const titleNormalized = normalizeText(entry.title);
    let score = 0;

    tokens.forEach((token) => {
      if (titleNormalized.includes(token)) {
        score += 2;
      }
      if (entry.keywords.some((keyword) => keyword.includes(token) || token.includes(keyword))) {
        score += 3;
      }
    });

    return { entry, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry);

  return scored.length > 0 ? scored : DEFAULT_VIDEO_LIBRARY;
};

const searchYoutubeVideos = async (query: string): Promise<VideoResult[]> => {
  const normalized = query.trim();
  if (!normalized) {
    return [];
  }
  if (!HAS_YOUTUBE_API_KEY) {
    return mockSearchVideos(normalized);
  }

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string;

  const params = new URLSearchParams({
    key: apiKey,
    q: normalized,
    part: 'snippet',
    type: 'video',
    maxResults: '8',
    safeSearch: 'strict',
  });

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Respuesta inválida de YouTube');
    }
    const data: {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          title?: string;
          thumbnails?: {
            medium?: { url?: string };
            default?: { url?: string };
          };
        };
      }>;
    } = await response.json();

    const items = data.items ?? [];
    const formatted = items
      .map((item) => {
        const videoId = item.id?.videoId;
        const title = item.snippet?.title;
        const thumbnail = item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url;
        if (!videoId || !title || !thumbnail) {
          return null;
        }
        return { id: videoId, title, thumbnail } satisfies VideoResult | null;
      })
      .filter((value): value is VideoResult => Boolean(value));

    return formatted.length > 0 ? formatted : mockSearchVideos(normalized);
  } catch (error) {
    console.warn('Fallo al consultar la API de YouTube, usando datos simulados', error);
    return mockSearchVideos(normalized);
  }
};

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
};

const playBeep = () => {
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);

  setTimeout(() => {
    if (audioContext.state !== 'closed') {
      audioContext.close();
    }
  }, 750);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getTimedExerciseTotalSeconds = (exercise: RoutineExercise) => {
  if (exercise.type !== 'time') {
    return 0;
  }

  const totalWork = Math.max(0, exercise.duration) * Math.max(1, exercise.sets);
  const restBlocks = Math.max(0, exercise.sets - 1);
  const totalRest = Math.max(0, exercise.rest) * restBlocks;
  return totalWork + totalRest;
};

const getRemainingSecondsForCurrentTimedExercise = (
  exercise: RoutineExercise,
  state: { currentSet: number; phase: 'work' | 'rest'; timeRemaining: number },
) => {
  if (exercise.type !== 'time') {
    return 0;
  }

  const totalSets = Math.max(1, exercise.sets);
  const restDuration = Math.max(0, exercise.rest);
  const completedSets = Math.min(
    totalSets,
    Math.max(0, state.phase === 'rest' ? state.currentSet : state.currentSet - 1),
  );

  if (state.phase === 'work') {
    let remaining = state.timeRemaining;
    const setsRemainingAfterCurrent = Math.max(0, totalSets - completedSets - 1);
    if (setsRemainingAfterCurrent > 0) {
      remaining += exercise.duration * setsRemainingAfterCurrent;
      if (restDuration > 0) {
        remaining += restDuration * setsRemainingAfterCurrent;
      }
    }
    return remaining;
  }

  let remaining = state.phase === 'rest' ? state.timeRemaining : 0;
  const setsRemaining = Math.max(0, totalSets - completedSets);
  if (setsRemaining > 0) {
    remaining += exercise.duration * setsRemaining;
    if (restDuration > 0) {
      remaining += restDuration * Math.max(0, setsRemaining - 1);
    }
  }

  return remaining;
};

const ExerciseLibrary: React.FC<{
  exercises: Exercise[];
  onSave: (nextExercises: Exercise[]) => void;
  onBack: () => void;
}> = ({ exercises, onSave, onBack }) => {
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExerciseFormState>({
    name: '',
    type: 'time',
    duration: 60,
    reps: 12,
    sets: 3,
    rest: 60,
  });

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise.id);
    setFormData({
      name: exercise.name,
      type: exercise.type,
      duration: exercise.type === 'time' ? exercise.duration : 60,
      reps: exercise.type === 'reps' ? exercise.reps : 12,
      sets: exercise.sets,
      rest: exercise.rest,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este ejercicio?')) {
      onSave(exercises.filter((e) => e.id !== id));
    }
  };

  const buildExerciseFromForm = (): Exercise => {
    const sanitizedName = formData.name.trim();
    const base = {
      name: sanitizedName,
      sets: Math.max(1, formData.sets),
      rest: Math.max(0, formData.rest),
    };

    return formData.type === 'time'
      ? {
          ...base,
          type: 'time',
          duration: Math.max(1, formData.duration),
          id: editingExercise ?? `ex${Date.now()}`,
        }
      : {
          ...base,
          type: 'reps',
          reps: Math.max(1, formData.reps),
          id: editingExercise ?? `ex${Date.now()}`,
        };
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa un nombre para el ejercicio');
      return;
    }

    const nextExercise = buildExerciseFromForm();

    if (editingExercise) {
      onSave(exercises.map((e) => (e.id === editingExercise ? nextExercise : e)));
    } else {
      onSave([...exercises, nextExercise]);
    }

    setEditingExercise(null);
    setFormData({ name: '', type: 'time', duration: 60, reps: 12, sets: 3, rest: 60 });
  };

  const handleCancel = () => {
    setEditingExercise(null);
    setFormData({ name: '', type: 'time', duration: 60, reps: 12, sets: 3, rest: 60 });
  };

  return (
    <div className={PAGE_BG_CLASS}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className={MUTED_BUTTON_CLASS} type="button">
            <ArrowLeft size={20} />
            Volver
          </button>
          <h2 className="text-2xl font-bold text-slate-100">Biblioteca de Ejercicios</h2>
          <div className="w-24" />
        </div>

        <div className={`${PANEL_CLASS} p-6`}>
          <h3 className="text-xl font-semibold mb-4 text-slate-100">
            {editingExercise ? 'Editar Ejercicio' : 'Añadir Nuevo Ejercicio'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-name">
                Nombre del Ejercicio
              </label>
              <input
                id="exercise-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={INPUT_CLASS}
                placeholder="ej: Flexiones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-type">
                Tipo
              </label>
              <select
                id="exercise-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Exercise['type'] })}
                className={SELECT_CLASS}
              >
                <option value="time">Basado en tiempo</option>
                <option value="reps">Basado en repeticiones</option>
              </select>
            </div>

            {formData.type === 'time' ? (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-duration">
                  Duración (segundos)
                </label>
                <input
                  id="exercise-duration"
                  type="number"
                  min={1}
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-reps">
                  Repeticiones
                </label>
                <input
                  id="exercise-reps"
                  type="number"
                  min={1}
                  value={formData.reps}
                  onChange={(e) =>
                    setFormData({ ...formData, reps: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className={INPUT_CLASS}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-sets">
                Series
              </label>
              <input
                id="exercise-sets"
                type="number"
                min={1}
                value={formData.sets}
                onChange={(e) =>
                  setFormData({ ...formData, sets: Math.max(1, Number(e.target.value) || 1) })
                }
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300" htmlFor="exercise-rest">
                Descanso después de cada serie (segundos, 0 para ninguno)
              </label>
              <input
                id="exercise-rest"
                type="number"
                min={0}
                value={formData.rest}
                onChange={(e) =>
                  setFormData({ ...formData, rest: Math.max(0, Number(e.target.value) || 0) })
                }
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                type="button"
              >
                <Save size={20} />
                {editingExercise ? 'Actualizar' : 'Añadir'} Ejercicio
              </button>
              {editingExercise && (
                <button
                  onClick={handleCancel}
                  className="px-6 bg-slate-800 text-slate-200 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2"
                  type="button"
                >
                  <X size={20} />
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`${PANEL_CLASS} p-6`}>
          <h3 className="text-xl font-semibold mb-4 text-slate-100">Todos los Ejercicios</h3>
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-100">{exercise.name}</h4>
                  <p className="text-sm text-slate-400">
                    {exercise.type === 'time' ? `${exercise.duration}s` : `${exercise.reps} reps`} × {exercise.sets} series
                    {exercise.rest > 0 && ` | ${exercise.rest}s descanso`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded"
                    type="button"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoutineBuilder: React.FC<{
  exercises: Exercise[];
  routines: Routine[];
  onSave: (nextRoutines: Routine[]) => void;
  onBack: () => void;
  editingRoutine?: Routine | null;
}> = ({ exercises, routines, onSave, onBack, editingRoutine }) => {
  const createSelectedExercisesSnapshot = (routine?: Routine | null) =>
    routine ? routine.exercises.map((exercise) => ({ ...exercise })) : [];

  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>(() =>
    createSelectedExercisesSnapshot(editingRoutine),
  );
  const [routineName, setRoutineName] = useState(() => editingRoutine?.name ?? '');

  useEffect(() => {
    if (editingRoutine) {
      setRoutineName(editingRoutine.name);
      setSelectedExercises(createSelectedExercisesSnapshot(editingRoutine));
    } else {
      setRoutineName('');
      setSelectedExercises([]);
    }
  }, [editingRoutine]);

  const isEditing = Boolean(editingRoutine);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, routineExId: string) => {
    event.dataTransfer.setData('text/plain', routineExId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetId: string | null) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) {
      return;
    }

    setSelectedExercises((prev) => {
      const sourceIndex = prev.findIndex((ex) => ex.routineExId === sourceId);
      if (sourceIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);

      if (targetId) {
        let targetIndex = next.findIndex((ex) => ex.routineExId === targetId);
        if (targetIndex === -1) {
          next.push(moved);
        } else {
          next.splice(targetIndex, 0, moved);
        }
      } else {
        next.push(moved);
      }

      return next;
    });
  };

  const handleAddExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (exercise) {
      setSelectedExercises((prev) => [
        ...prev,
        {
          ...exercise,
          routineExId: `${exerciseId}_${Date.now()}`,
        },
      ]);
    }
  };

  const handleRemoveExercise = (routineExId: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.routineExId !== routineExId));
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim() || selectedExercises.length === 0) {
      alert('Por favor proporciona un nombre para la rutina y añade al menos un ejercicio');
      return;
    }

    if (isEditing && editingRoutine) {
      const updatedRoutine: Routine = {
        ...editingRoutine,
        name: routineName.trim(),
        exercises: selectedExercises,
      };
      onSave(routines.map((routine) => (routine.id === editingRoutine.id ? updatedRoutine : routine)));
    } else {
      const newRoutine: Routine = {
        id: `routine${Date.now()}`,
        name: routineName.trim(),
        exercises: selectedExercises,
      };
      onSave([...routines, newRoutine]);
    }

    setRoutineName('');
    setSelectedExercises([]);
    onBack();
  };

  return (
    <div className={PAGE_BG_CLASS}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className={MUTED_BUTTON_CLASS} type="button">
            <ArrowLeft size={20} />
            Volver
          </button>
          <h2 className="text-2xl font-bold text-slate-100">{isEditing ? 'Editar Rutina' : 'Crear Rutina'}</h2>
          <div className="w-24" />
        </div>

        <div className={`${PANEL_CLASS} p-6 space-y-4`}>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300" htmlFor="routine-name">
              Nombre de la Rutina
            </label>
            <input
              id="routine-name"
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="ej: Entrenamiento de Cuerpo Completo"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300" htmlFor="exercise-selector">
              Añadir Ejercicios
            </label>
            <select
              id="exercise-selector"
              onChange={(e) => {
                handleAddExercise(e.target.value);
                e.currentTarget.value = '';
              }}
              className={SELECT_CLASS}
              value=""
            >
              <option value="">Selecciona un ejercicio para añadir...</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} - {ex.type === 'time' ? `${ex.duration}s` : `${ex.reps} reps`} × {ex.sets}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${PANEL_CLASS} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-slate-100">Orden de la Rutina</h3>
            {selectedExercises.length > 1 && <span className="text-sm text-slate-400">Arrastra los ejercicios para reordenar</span>}
          </div>
          {selectedExercises.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No se han añadido ejercicios todavía</p>
          ) : (
            <div className="space-y-3" onDragOver={handleDragOver}>
              {selectedExercises.map((ex, idx) => (
                <div
                  key={ex.routineExId}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/50"
                  draggable
                  onDragStart={(event) => handleDragStart(event, ex.routineExId)}
                  onDrop={(event) => handleDrop(event, ex.routineExId)}
                  onDragOver={handleDragOver}
                >
                  <div className="flex items-center gap-3">
                    <button className="p-1 rounded text-slate-500 hover:text-slate-200" type="button">
                      <GripVertical size={18} />
                    </button>
                    <span className="font-bold text-slate-500">{idx + 1}.</span>
                    <div>
                      <h4 className="font-semibold text-slate-100">{ex.name}</h4>
                      <p className="text-sm text-slate-400">
                        {ex.type === 'time' ? `${ex.duration}s` : `${ex.reps} reps`} × {ex.sets} series
                        {ex.rest > 0 && ` | ${ex.rest}s descanso`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(ex.routineExId)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div
                className="p-4 border border-dashed border-slate-700 rounded-xl text-center text-slate-400"
                onDrop={(event) => handleDrop(event, null)}
                onDragOver={handleDragOver}
              >
                Soltar aquí para mover al final
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSaveRoutine}
          disabled={!routineName.trim() || selectedExercises.length === 0}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed font-semibold transition-colors"
          type="button"
        >
          {isEditing ? 'Actualizar Rutina' : 'Guardar Rutina'}
        </button>
      </div>
    </div>
  );
};

const RoutineRunner: React.FC<{
  routine: Routine;
  onBack: () => void;
}> = ({ routine, onBack }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest'>('work');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [videoQuery, setVideoQuery] = useState('');
  const [videoResults, setVideoResults] = useState<VideoResult[]>(DEFAULT_VIDEO_LIBRARY);
  const [isSearchingVideo, setIsSearchingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isVideoFocused = Boolean(selectedVideo) && !isPaused;
  const totalTimedSeconds = useMemo(
    () => routine.exercises.reduce((total, exercise) => total + getTimedExerciseTotalSeconds(exercise), 0),
    [routine.exercises],
  );

  const remainingTimedSeconds = useMemo(() => {
    if (isComplete) {
      return 0;
    }

    let remaining = 0;
    routine.exercises.forEach((exercise, idx) => {
      if (exercise.type !== 'time') {
        return;
      }

      if (idx < currentExerciseIdx) {
        return;
      }

      if (idx > currentExerciseIdx) {
        remaining += getTimedExerciseTotalSeconds(exercise);
        return;
      }

      remaining += getRemainingSecondsForCurrentTimedExercise(exercise, {
        currentSet,
        phase,
        timeRemaining,
      });
    });

    return remaining;
  }, [routine.exercises, currentExerciseIdx, currentSet, phase, timeRemaining, isComplete]);

  const elapsedTimedSeconds = Math.min(
    totalTimedSeconds,
    Math.max(0, totalTimedSeconds - remainingTimedSeconds),
  );

  const currentExercise = routine.exercises[currentExerciseIdx];

  useEffect(() => {
    if (!currentExercise || isComplete) return;

    if (phase === 'work') {
      if (currentExercise.type === 'time') {
        setTimeRemaining(currentExercise.duration);
      } else {
        setTimeRemaining(0);
      }
    } else {
      setTimeRemaining(currentExercise.rest);
    }
  }, [currentExerciseIdx, currentSet, phase, currentExercise, isComplete]);

  useEffect(() => {
    if (isPaused || isComplete || !currentExercise) {
      return undefined;
    }

    const shouldRunTimer =
      (phase === 'work' && currentExercise.type === 'time') ||
      (phase === 'rest' && currentExercise.rest > 0);

    if (!shouldRunTimer) {
      return undefined;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          playBeep();
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, phase, currentExerciseIdx, currentSet, isComplete, currentExercise]);

  const moveToNextPhase = () => {
    const exercise = routine.exercises[currentExerciseIdx];
    if (!exercise) return;

    if (currentSet < exercise.sets) {
      setCurrentSet((prev) => prev + 1);
      setPhase('work');
      if (exercise.type === 'time') {
        setTimeRemaining(exercise.duration);
      }
    } else if (currentExerciseIdx < routine.exercises.length - 1) {
      setCurrentExerciseIdx((prev) => prev + 1);
      setCurrentSet(1);
      setPhase('work');
    } else {
      setIsComplete(true);
      setIsPaused(true);
      playBeep();
    }
  };

  const handlePhaseComplete = () => {
    const exercise = routine.exercises[currentExerciseIdx];
    if (!exercise) return;

    const hasMoreSets = currentSet < exercise.sets;

    if (phase === 'work') {
      if (hasMoreSets && exercise.rest > 0) {
        setPhase('rest');
        setTimeRemaining(exercise.rest);
      } else {
        moveToNextPhase();
      }
    } else {
      moveToNextPhase();
    }
  };

  const handleCompleteSet = () => {
    playBeep();
    handlePhaseComplete();
  };

  const handleSkip = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    moveToNextPhase();
  };

  const handleStart = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const getNextInfo = () => {
    if (!currentExercise) {
      return '';
    }

    const hasMoreSets = currentSet < currentExercise.sets;

    if (phase === 'work' && currentExercise.rest > 0 && hasMoreSets) {
      return `Siguiente: ${currentExercise.rest}s descanso`;
    }
    if (hasMoreSets) {
      return `Siguiente: Serie ${currentSet + 1}`;
    }
    if (currentExerciseIdx < routine.exercises.length - 1) {
      return `Siguiente: ${routine.exercises[currentExerciseIdx + 1].name}`;
    }
    return '¡Última serie!';
  };

  const handleVideoSearch = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    if (!videoQuery.trim()) {
      setVideoError('Ingresa un término de búsqueda para encontrar videos.');
      setVideoResults(DEFAULT_VIDEO_LIBRARY);
      return;
    }

    setIsSearchingVideo(true);
    setVideoError(null);
    try {
      const results = await searchYoutubeVideos(videoQuery);
      setVideoResults(results);
      if (results.length === 0) {
        setVideoError('No se encontraron videos. Prueba con otra frase.');
      }
    } catch (error) {
      console.error('Error al buscar videos, usando sugerencias locales', error);
      setVideoError('No se pudo realizar la búsqueda, usando sugerencias locales.');
      setVideoResults(DEFAULT_VIDEO_LIBRARY);
    } finally {
      setIsSearchingVideo(false);
    }
  };

  const handleSelectVideo = (video: VideoResult) => {
    setSelectedVideo(video);
  };

  if (isComplete) {
    return (
      <div className={PAGE_BG_CLASS}>
        <div className="max-w-2xl mx-auto">
          <div className={`${PANEL_CLASS} p-8 text-center`}>
            <h2 className="text-3xl font-bold text-emerald-400 mb-4">¡Entrenamiento Completado! 🎉</h2>
            <p className="text-xl mb-6 text-slate-200">¡Excelente trabajo completando {routine.name}!</p>
            <button
              onClick={onBack}
              className="bg-indigo-500 text-white px-8 py-3 rounded-xl hover:bg-indigo-600 text-lg font-semibold"
              type="button"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return null;
  }

  return (
    <div className={PAGE_BG_CLASS}>
      <div className="runner-shell space-y-4">
        <button onClick={onBack} className={MUTED_BUTTON_CLASS} type="button">
          <ArrowLeft size={20} />
          Salir del Entrenamiento
        </button>
        <div className="runner-layout">
          <section className="video-pane">
            <div
              className={`${PANEL_CLASS} runner-panel-card p-6 gap-4 video-panel${isVideoFocused ? ' video-panel--focused' : ''}`}
            >
              {!isVideoFocused && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-1">Video motivacional</h2>
                  <p className="text-sm text-slate-400">
                    Busca en YouTube y elige un video para que te acompañe durante toda la rutina.
                  </p>
                </div>
              )}

              <div className={`video-pane-scroll${isVideoFocused ? ' video-pane-scroll--focused' : ''}`}>
                {!isVideoFocused && (
                  <>
                    <form className="flex flex-col gap-3" onSubmit={handleVideoSearch}>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          value={videoQuery}
                          onChange={(event) => setVideoQuery(event.target.value)}
                          placeholder="ej: entrenamiento hiit 15 minutos"
                          className={INPUT_CLASS}
                        />
                        <button
                          type="submit"
                          className="sm:w-auto w-full px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:bg-slate-700"
                          disabled={isSearchingVideo}
                        >
                          {isSearchingVideo ? 'Buscando…' : 'Buscar'}
                        </button>
                      </div>
                    </form>

                    {!HAS_YOUTUBE_API_KEY && (
                      <p className="text-xs text-slate-400 bg-slate-800/70 border border-slate-700 rounded-lg p-3">
                        Estás usando la biblioteca local de videos. Añade <code className="bg-slate-900 px-1 rounded">VITE_YOUTUBE_API_KEY</code> en un archivo
                        <code className="bg-slate-900 px-1 rounded">.env</code> para obtener resultados reales directamente desde YouTube.
                      </p>
                    )}

                    {videoError && <p className="text-sm text-rose-300">{videoError}</p>}
                  </>
                )}

                <div className={`video-pane-grid${isVideoFocused ? ' video-pane-grid--focused' : ''}`}>
                  <div className="video-player-shell">
                    {selectedVideo ? (
                      <iframe
                        key={selectedVideo.id}
                        src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                        title={selectedVideo.title}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="video-player-placeholder">
                        <p className="text-lg font-semibold mb-2">Sincroniza un video</p>
                        <p className="text-sm text-slate-300">
                          Realiza una búsqueda y selecciona un video. Se reproducirá continuamente hasta que termines la rutina.
                        </p>
                      </div>
                    )}
                  
                  </div>

                  <div
                    className={`video-results-card${isVideoFocused ? ' video-results-card--hidden' : ''}`}
                    aria-hidden={isVideoFocused}
                  >
                    <h3 className="text-base font-semibold text-slate-200 mb-2">Resultados</h3>
                    <div className="video-results-list">
                      {videoResults.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          className={`video-option${selectedVideo?.id === video.id ? ' video-option--active' : ''}`}
                          onClick={() => handleSelectVideo(video)}
                        >
                          <img src={video.thumbnail} alt={`Miniatura del video ${video.title}`} loading="lazy" />
                          <div>
                            <p className="video-option__title">{video.title}</p>
                            <p className="video-option__subtitle">
                              {selectedVideo?.id === video.id ? 'Reproduciendo ahora' : 'Pulsa para reproducir'}
                            </p>
                          </div>
                        </button>
                      ))}
                      {videoResults.length === 0 && (
                        <p className="text-sm text-slate-400">Empieza a escribir para obtener sugerencias.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="routine-pane">
            <div className={`${PANEL_CLASS} runner-panel-card p-6 lg:p-8`}>
              <div className="routine-pane-scroll">
                <div>
                  <h2 className="text-2xl font-bold text-center mb-2">{routine.name}</h2>
                  <p className={`text-center text-slate-400 ${totalTimedSeconds > 0 ? 'mb-1' : 'mb-6'}`}>
                    Ejercicio {currentExerciseIdx + 1} de {routine.exercises.length}
                  </p>
                  {totalTimedSeconds > 0 && (
                    <p className="text-center text-slate-500 text-sm mb-6">
                      {formatTime(elapsedTimedSeconds)} de {formatTime(totalTimedSeconds)}
                    </p>
                  )}
                </div>

                <div
                  className={`text-center p-8 rounded-2xl border border-slate-800 ${
                    phase === 'work' ? 'bg-indigo-500/10' : 'bg-amber-500/10'
                  }`}
                >
                  <h3 className="text-4xl font-bold mb-2 text-slate-100">{currentExercise.name}</h3>
                  <p className="text-2xl mb-4 text-slate-300">{phase === 'work' ? 'TRABAJO' : 'DESCANSO'}</p>
                  <p className="text-xl mb-4 text-slate-300">
                    Serie {currentSet} de {currentExercise.sets}
                  </p>

                  {currentExercise.type === 'time' || phase === 'rest' ? (
                    <div className="text-6xl font-bold my-6 text-slate-100">{formatTime(timeRemaining)}</div>
                  ) : (
                    <div className="my-6">
                      <p className="text-5xl font-bold mb-6 text-slate-100">{currentExercise.reps} reps</p>
                      <button
                        onClick={handleCompleteSet}
                        disabled={isPaused}
                        className="bg-emerald-500 text-white px-12 py-4 rounded-xl hover:bg-emerald-600 text-2xl font-semibold disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                        type="button"
                      >
                        Completar Serie
                      </button>
                    </div>
                  )}

                  <p className="text-lg text-slate-300 mt-4">{getNextInfo()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row routine-controls">
                {isPaused ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 bg-emerald-500 text-white py-4 rounded-xl hover:bg-emerald-600 flex items-center justify-center gap-2 text-xl font-semibold"
                    type="button"
                  >
                    <Play size={24} />
                    Iniciar
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex-1 bg-amber-500 text-white py-4 rounded-xl hover:bg-amber-600 flex items-center justify-center gap-2 text-xl font-semibold"
                    type="button"
                  >
                    <Pause size={24} />
                    Pausar
                  </button>
                )}

                <button
                  onClick={handleSkip}
                  className="flex-1 bg-indigo-500 text-white py-4 rounded-xl hover:bg-indigo-600 flex items-center justify-center gap-2 text-xl font-semibold"
                  type="button"
                >
                  <SkipForward size={24} />
                  Saltar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const initialExercises = useMemo<Exercise[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_EXERCISES;
    const saved = window.localStorage.getItem('exercises');
    return saved ? (JSON.parse(saved) as Exercise[]) : DEFAULT_EXERCISES;
  }, []);

  const initialRoutines = useMemo<Routine[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem('routines');
    return saved ? (JSON.parse(saved) as Routine[]) : [];
  }, []);

  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [routineBeingEdited, setRoutineBeingEdited] = useState<Routine | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('exercises', JSON.stringify(exercises));
    }
  }, [exercises]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('routines', JSON.stringify(routines));
    }
  }, [routines]);

  const handleDeleteRoutine = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta rutina?')) {
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleCreateRoutine = () => {
    setRoutineBeingEdited(null);
    setCurrentView('builder');
  };

  const handleEditRoutine = (routine: Routine, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setRoutineBeingEdited(routine);
    setCurrentView('builder');
  };

  const handleStartRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setCurrentView('runner');
  };

  const handleExitBuilder = () => {
    setRoutineBeingEdited(null);
    setCurrentView('home');
  };

  if (currentView === 'exercises') {
    return <ExerciseLibrary exercises={exercises} onSave={setExercises} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'builder') {
    return (
      <RoutineBuilder
        exercises={exercises}
        routines={routines}
        onSave={setRoutines}
        onBack={handleExitBuilder}
        editingRoutine={routineBeingEdited}
      />
    );
  }

  if (currentView === 'runner' && activeRoutine) {
    return <RoutineRunner routine={activeRoutine} onBack={() => { setCurrentView('home'); setActiveRoutine(null); }} />;
  }

  return (
    <div className={PAGE_BG_CLASS}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-slate-100">Aplicación de Rutinas de Entrenamiento</h1>
          <p className="text-slate-400">Crea, organiza y ejecuta tus sesiones con un ambiente nocturno relajado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('exercises')}
            className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-900/40 hover:from-indigo-600/30 hover:to-slate-900/70 text-left p-6 flex items-center justify-between"
            type="button"
          >
            <div>
              <p className="text-sm uppercase tracking-wide text-indigo-300">Biblioteca</p>
              <p className="text-2xl font-semibold text-slate-100">Gestionar Ejercicios</p>
            </div>
            <Edit2 size={28} className="text-indigo-300" />
          </button>

          <button
            onClick={handleCreateRoutine}
            className="rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-600/20 to-slate-900/60 hover:from-emerald-500/30 hover:to-slate-900/70 text-left p-6 flex items-center justify-between"
            type="button"
          >
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-300">Rutinas</p>
              <p className="text-2xl font-semibold text-slate-100">Crear Rutina</p>
            </div>
            <Plus size={28} className="text-emerald-300" />
          </button>
        </div>

        <div className={`${PANEL_CLASS} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Mis Rutinas</h2>
            <span className="text-sm text-slate-400">{routines.length} creadas</span>
          </div>
          {routines.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay rutinas todavía. ¡Crea tu primera rutina!</p>
          ) : (
            <div className="space-y-3">
              {routines.map((routine) => (
                <div key={routine.id} className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-100">{routine.name}</h3>
                      <p className="text-sm text-slate-400">{routine.exercises.length} ejercicios</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleEditRoutine(routine, e)}
                        className="p-2 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/10 rounded"
                        type="button"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRoutine(routine.id, e)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartRoutine(routine)}
                    className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 flex items-center justify-center gap-2 font-semibold"
                    type="button"
                  >
                    <Play size={20} />
                    Comenzar Entrenamiento
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;