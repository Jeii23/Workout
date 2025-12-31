import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Plus, Edit2, Trash2, ArrowLeft, Save, X } from 'lucide-react';

// Ejercicios predefinidos por defecto
const DEFAULT_EXERCISES = [
  { id: 'ex1', name: 'Flexiones', type: 'reps', reps: 12, sets: 3, rest: 60 },
  { id: 'ex2', name: 'Plancha', type: 'time', duration: 60, sets: 2, rest: 30 },
  { id: 'ex3', name: 'Sentadillas', type: 'reps', reps: 15, sets: 3, rest: 45 },
  { id: 'ex4', name: 'Jumping Jacks', type: 'time', duration: 45, sets: 2, rest: 30 },
  { id: 'ex5', name: 'Zancadas', type: 'reps', reps: 10, sets: 3, rest: 60 },
  { id: 'ex6', name: 'Escaladores', type: 'time', duration: 30, sets: 3, rest: 30 },
];

// Funciones auxiliares
const playBeep = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Componente Biblioteca de Ejercicios
const ExerciseLibrary = ({ exercises, onSave, onBack }) => {
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'time',
    duration: 60,
    reps: 12,
    sets: 3,
    rest: 60
  });

  const handleEdit = (exercise) => {
    setEditingExercise(exercise.id);
    setFormData(exercise);
  };

  const handleDelete = (id) => {
    if (confirm('¿Eliminar este ejercicio?')) {
      onSave(exercises.filter(e => e.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Por favor ingresa un nombre para el ejercicio');
      return;
    }
    if (editingExercise) {
      onSave(exercises.map(e => e.id === editingExercise ? { ...formData, id: editingExercise } : e));
    } else {
      onSave([...exercises, { ...formData, id: `ex${Date.now()}` }]);
    }
    setEditingExercise(null);
    setFormData({ name: '', type: 'time', duration: 60, reps: 12, sets: 3, rest: 60 });
  };

  const handleCancel = () => {
    setEditingExercise(null);
    setFormData({ name: '', type: 'time', duration: 60, reps: 12, sets: 3, rest: 60 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          <ArrowLeft size={20} />
          Volver
        </button>
        <h2 className="text-2xl font-bold">Biblioteca de Ejercicios</h2>
        <div className="w-24"></div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingExercise ? 'Editar Ejercicio' : 'Añadir Nuevo Ejercicio'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Ejercicio</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ej: Flexiones"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="time">Basado en tiempo</option>
              <option value="reps">Basado en repeticiones</option>
            </select>
          </div>

          {formData.type === 'time' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Duración (segundos)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Repeticiones</label>
              <input
                type="number"
                min="1"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Series</label>
            <input
              type="number"
              min="1"
              value={formData.sets}
              onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descanso después de cada serie (segundos, 0 para ninguno)</label>
            <input
              type="number"
              min="0"
              value={formData.rest}
              onChange={(e) => setFormData({ ...formData, rest: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSubmit} className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
              <Save size={20} />
              {editingExercise ? 'Actualizar' : 'Añadir'} Ejercicio
            </button>
            {editingExercise && (
              <button onClick={handleCancel} className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-2">
                <X size={20} />
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Todos los Ejercicios</h3>
        <div className="space-y-3">
          {exercises.map(exercise => (
            <div key={exercise.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{exercise.name}</h4>
                <p className="text-sm text-gray-600">
                  {exercise.type === 'time' 
                    ? `${exercise.duration}s` 
                    : `${exercise.reps} reps`} 
                  × {exercise.sets} series
                  {exercise.rest > 0 && ` | ${exercise.rest}s descanso`}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(exercise)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(exercise.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente Constructor de Rutinas
const RoutineBuilder = ({ exercises, routines, onSave, onBack }) => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [routineName, setRoutineName] = useState('');

  const handleAddExercise = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      setSelectedExercises([...selectedExercises, { ...exercise, routineExId: `${exerciseId}_${Date.now()}` }]);
    }
  };

  const handleRemoveExercise = (routineExId) => {
    setSelectedExercises(selectedExercises.filter(e => e.routineExId !== routineExId));
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim() || selectedExercises.length === 0) {
      alert('Por favor proporciona un nombre para la rutina y añade al menos un ejercicio');
      return;
    }
    const newRoutine = {
      id: `routine${Date.now()}`,
      name: routineName,
      exercises: selectedExercises
    };
    onSave([...routines, newRoutine]);
    setRoutineName('');
    setSelectedExercises([]);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          <ArrowLeft size={20} />
          Volver
        </button>
        <h2 className="text-2xl font-bold">Crear Rutina</h2>
        <div className="w-24"></div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Nombre de la Rutina</label>
        <input
          type="text"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          placeholder="ej: Entrenamiento de Cuerpo Completo"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-sm font-medium mb-2">Añadir Ejercicios</label>
        <select 
          onChange={(e) => { 
            handleAddExercise(e.target.value); 
            e.target.value = ''; 
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un ejercicio para añadir...</option>
          {exercises.map(ex => (
            <option key={ex.id} value={ex.id}>
              {ex.name} - {ex.type === 'time' ? `${ex.duration}s` : `${ex.reps} reps`} × {ex.sets}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Orden de la Rutina</h3>
        {selectedExercises.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No se han añadido ejercicios todavía</p>
        ) : (
          <div className="space-y-3">
            {selectedExercises.map((ex, idx) => (
              <div key={ex.routineExId} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-400">{idx + 1}.</span>
                  <div>
                    <h4 className="font-semibold">{ex.name}</h4>
                    <p className="text-sm text-gray-600">
                      {ex.type === 'time' ? `${ex.duration}s` : `${ex.reps} reps`} × {ex.sets} series
                      {ex.rest > 0 && ` | ${ex.rest}s descanso`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveExercise(ex.routineExId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={handleSaveRoutine}
        disabled={!routineName.trim() || selectedExercises.length === 0}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
      >
        Guardar Rutina
      </button>
    </div>
  );
};

// Componente Ejecutor de Rutina
const RoutineRunner = ({ routine, onBack }) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState('work'); // 'work' o 'rest'
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);

  const currentExercise = routine.exercises[currentExerciseIdx];

  useEffect(() => {
    if (currentExercise && !isComplete) {
      if (phase === 'work' && currentExercise.type === 'time') {
        setTimeRemaining(currentExercise.duration);
      } else if (phase === 'rest') {
        setTimeRemaining(currentExercise.rest);
      }
    }
  }, [currentExerciseIdx, currentSet, phase, currentExercise, isComplete]);

  useEffect(() => {
    if (!isPaused && !isComplete && currentExercise.type === 'time') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            playBeep();
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isPaused && !isComplete && phase === 'rest' && currentExercise.rest > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            playBeep();
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, phase, currentExerciseIdx, currentSet, isComplete]);

  const handlePhaseComplete = () => {
    if (phase === 'work') {
      if (currentExercise.rest > 0) {
        setPhase('rest');
        setTimeRemaining(currentExercise.rest);
      } else {
        moveToNextPhase();
      }
    } else {
      moveToNextPhase();
    }
  };

  const moveToNextPhase = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1);
      setPhase('work');
      if (currentExercise.type === 'time') {
        setTimeRemaining(currentExercise.duration);
      }
    } else {
      if (currentExerciseIdx < routine.exercises.length - 1) {
        setCurrentExerciseIdx(currentExerciseIdx + 1);
        setCurrentSet(1);
        setPhase('work');
      } else {
        setIsComplete(true);
        setIsPaused(true);
        playBeep();
      }
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
  };

  const getNextInfo = () => {
    if (phase === 'work' && currentExercise.rest > 0) {
      return `Siguiente: ${currentExercise.rest}s descanso`;
    } else if (currentSet < currentExercise.sets) {
      return `Siguiente: Serie ${currentSet + 1}`;
    } else if (currentExerciseIdx < routine.exercises.length - 1) {
      return `Siguiente: ${routine.exercises[currentExerciseIdx + 1].name}`;
    } else {
      return '¡Última serie!';
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">¡Entrenamiento Completado! 🎉</h2>
          <p className="text-xl mb-6">¡Excelente trabajo completando {routine.name}!</p>
          <button 
            onClick={onBack}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          <ArrowLeft size={20} />
          Salir del Entrenamiento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">{routine.name}</h2>
        <p className="text-center text-gray-600 mb-6">
          Ejercicio {currentExerciseIdx + 1} de {routine.exercises.length}
        </p>

        <div className={`text-center p-8 rounded-lg mb-6 ${phase === 'work' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
          <h3 className="text-4xl font-bold mb-2">{currentExercise.name}</h3>
          <p className="text-2xl mb-4">
            {phase === 'work' ? 'TRABAJO' : 'DESCANSO'}
          </p>
          <p className="text-xl mb-4">
            Serie {currentSet} de {currentExercise.sets}
          </p>

          {currentExercise.type === 'time' || phase === 'rest' ? (
            <div className="text-6xl font-bold my-6">
              {formatTime(timeRemaining)}
            </div>
          ) : (
            <div className="my-6">
              <p className="text-5xl font-bold mb-6">{currentExercise.reps} reps</p>
              <button
                onClick={handleCompleteSet}
                disabled={isPaused}
                className="bg-green-500 text-white px-12 py-4 rounded-lg hover:bg-green-600 text-2xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Completar Serie
              </button>
            </div>
          )}

          <p className="text-lg text-gray-700 mt-4">{getNextInfo()}</p>
        </div>

        <div className="flex gap-4">
          {isPaused ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 text-xl font-semibold"
            >
              <Play size={24} />
              Iniciar
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2 text-xl font-semibold"
            >
              <Pause size={24} />
              Pausar
            </button>
          )}
          
          <button
            onClick={handleSkip}
            className="flex-1 bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 text-xl font-semibold"
          >
            <SkipForward size={24} />
            Saltar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal de la App
const App = () => {
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem('exercises');
    return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
  });

  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('routines');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState('home');
  const [activeRoutine, setActiveRoutine] = useState(null);

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines));
  }, [routines]);

  const handleDeleteRoutine = (id, e) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta rutina?')) {
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  const handleStartRoutine = (routine) => {
    setActiveRoutine(routine);
    setCurrentView('runner');
  };

  if (currentView === 'exercises') {
    return <ExerciseLibrary exercises={exercises} onSave={setExercises} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'builder') {
    return <RoutineBuilder exercises={exercises} routines={routines} onSave={setRoutines} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'runner' && activeRoutine) {
    return <RoutineRunner routine={activeRoutine} onBack={() => { setCurrentView('home'); setActiveRoutine(null); }} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Aplicación de Rutinas de Entrenamiento</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setCurrentView('exercises')}
            className="bg-blue-500 text-white p-6 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-3 text-xl font-semibold"
          >
            <Edit2 size={24} />
            Gestionar Ejercicios
          </button>
          <button
            onClick={() => setCurrentView('builder')}
            className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 flex items-center justify-center gap-3 text-xl font-semibold"
          >
            <Plus size={24} />
            Crear Rutina
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Mis Rutinas</h2>
          {routines.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay rutinas todavía. ¡Crea tu primera rutina!</p>
          ) : (
            <div className="space-y-3">
              {routines.map(routine => (
                <div key={routine.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{routine.name}</h3>
                    <button
                      onClick={(e) => handleDeleteRoutine(routine.id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {routine.exercises.length} ejercicios
                  </p>
                  <button
                    onClick={() => handleStartRoutine(routine)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-semibold"
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