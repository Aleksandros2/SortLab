import React, { useEffect, useMemo, useRef, useState } from 'react';
import { algorithmContent, algorithmMap } from './utils/sortAlgorithms';

const ARRAY_MIN = 8;
const ARRAY_MAX = 64;
const SPEED_MIN = 20;
const SPEED_MAX = 300;
const DEFAULT_SIZE = 28;
const DEFAULT_SPEED = 110;
const algorithmOptions = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' }
];

const randomValue = () => Math.floor(Math.random() * 90) + 10;
const createRandomArray = (size) => Array.from({ length: size }, randomValue);
const createIdleState = (array) => ({
  array,
  compared: [],
  swapped: [],
  sorted: [],
  stats: {
    comparisons: 0,
    moves: 0,
    steps: 0
  }
});

const createInitialState = (size) => {
  const array = createRandomArray(size);
  return {
    array,
    visual: createIdleState(array)
  };
};

function App() {
  const initial = useMemo(() => createInitialState(DEFAULT_SIZE), []);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [baseArray, setBaseArray] = useState(() => initial.array);
  const [visualState, setVisualState] = useState(() => initial.visual);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState(0);
  const [isDirty, setIsDirty] = useState(true);
  const timeoutRef = useRef(null);
  const audioContextRef = useRef(null);
  const previousSortedRef = useRef([]);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      return undefined;
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      setIsPaused(false);
      return undefined;
    }

    timeoutRef.current = window.setTimeout(() => {
      setCurrentStep((previous) => previous + 1);
    }, speed);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStep, isPlaying, speed, steps]);

  useEffect(() => {
    if (steps.length === 0) {
      return;
    }

    setVisualState(steps[currentStep]);
  }, [currentStep, steps]);

  useEffect(() => {
    const currentSorted = visualState.sorted;
    const previousSorted = previousSortedRef.current;

    if (!isPlaying) {
      previousSortedRef.current = currentSorted;
      return;
    }

    const newlySorted = currentSorted.filter((index) => !previousSorted.includes(index));
    if (newlySorted.length > 0 && audioContextRef.current) {
      const audioContext = audioContextRef.current;
      const now = audioContext.currentTime;

      newlySorted.forEach((_, order) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const startAt = now + (order * 0.035);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(620 + (order * 45), startAt);
        gainNode.gain.setValueAtTime(0.0001, startAt);
        gainNode.gain.exponentialRampToValueAtTime(0.08, startAt + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.14);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + 0.15);
      });
    }

    previousSortedRef.current = currentSorted;
  }, [isPlaying, visualState.sorted]);

  const explanation = useMemo(() => algorithmContent[algorithm], [algorithm]);
  const tallestValue = useMemo(
    () => Math.max(...visualState.array, 1),
    [visualState.array]
  );

  const resetPlaybackState = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setSteps([]);
    setCurrentStep(0);
    setGenerationTimeMs(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsDirty(true);
    previousSortedRef.current = [];
  };

  const prepareAudio = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
  };

  const generateSteps = () => {
    const selectedAlgorithm = algorithmMap[algorithm];
    const start = performance.now();
    const generatedSteps = selectedAlgorithm(baseArray);
    const end = performance.now();

    setGenerationTimeMs(Number((end - start).toFixed(2)));
    setSteps(generatedSteps);
    setCurrentStep(0);
    setVisualState(generatedSteps[0]);
    setIsDirty(false);
    previousSortedRef.current = generatedSteps[0]?.sorted ?? [];

    return generatedSteps;
  };

  const handleGenerateArray = () => {
    const nextArray = createRandomArray(arraySize);
    setBaseArray(nextArray);
    setVisualState(createIdleState(nextArray));
    resetPlaybackState();
  };

  const handleArraySizeChange = (event) => {
    const nextSize = Number(event.target.value);
    const nextArray = createRandomArray(nextSize);

    setArraySize(nextSize);
    setBaseArray(nextArray);
    setVisualState(createIdleState(nextArray));
    resetPlaybackState();
  };

  const handleAlgorithmChange = (event) => {
    setAlgorithm(event.target.value);
    setVisualState(createIdleState(baseArray));
    resetPlaybackState();
  };

  const handleStart = () => {
    prepareAudio();
    const preparedSteps = !steps.length || isDirty ? generateSteps() : steps;
    if (preparedSteps.length <= 1) {
      return;
    }

    if (currentStep >= preparedSteps.length - 1) {
      setCurrentStep(0);
      setVisualState(preparedSteps[0]);
      previousSortedRef.current = preparedSteps[0]?.sorted ?? [];
    }

    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setGenerationTimeMs(0);
    setSteps([]);
    setVisualState(createIdleState(baseArray));
    setIsDirty(true);
    previousSortedRef.current = [];
  };

  const statusLabel = isPlaying
    ? 'Läuft'
    : isPaused
      ? 'Pausiert'
      : currentStep > 0 && steps.length > 0
        ? 'Bereit zum Fortsetzen'
        : 'Bereit';

  const progress = steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0;

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">SortLab</p>
          <h1>Sortieralgorithmen sichtbar machen</h1>
          <p className="hero-copy">
            Beobachte fünf Sortieralgorithmen Schritt für Schritt, vergleiche ihr Verhalten
            und lies die wichtigsten Eigenschaften direkt im Dashboard.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-chip">
            <span>Status</span>
            <strong>{statusLabel}</strong>
          </div>
          <div className="metric-chip">
            <span>Fortschritt</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="panel controls-panel">
          <div className="panel-head">
            <h2>Steuerung</h2>
            <p>Array, Geschwindigkeit und Algorithmus live anpassen.</p>
          </div>

          <label className="field">
            <span>Algorithmus</span>
            <select value={algorithm} onChange={handleAlgorithmChange}>
              {algorithmOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Array-Grösse: {arraySize}</span>
            <input
              type="range"
              min={ARRAY_MIN}
              max={ARRAY_MAX}
              value={arraySize}
              onChange={handleArraySizeChange}
            />
          </label>

          <label className="field">
            <span>Geschwindigkeit: {speed} ms</span>
            <input
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>

          <div className="button-grid">
            <button type="button" className="primary" onClick={handleGenerateArray}>
              Zufälliges Array
            </button>
            <button type="button" className="primary accent" onClick={handleStart}>
              Sortierung starten
            </button>
            <button type="button" className="secondary" onClick={handlePause} disabled={!isPlaying}>
              Pausieren
            </button>
            <button type="button" className="secondary" onClick={handleReset}>
              Zurücksetzen
            </button>
          </div>
        </section>

        <section className="panel visualizer-panel">
          <div className="panel-head">
            <h2>Balkenvisualisierung</h2>
            <p>Verglichene, bewegte und bereits sortierte Werte werden farblich markiert.</p>
          </div>

          <div className="legend">
            <span><i className="legend-dot base"></i>Normal</span>
            <span><i className="legend-dot compare"></i>Vergleich</span>
            <span><i className="legend-dot swap"></i>Bewegung</span>
            <span><i className="legend-dot sorted"></i>Sortiert</span>
          </div>

          <div className="chart-card">
            <div className="chart">
              {visualState.array.map((value, index) => {
                const isCompared = visualState.compared.includes(index);
                const isSwapped = visualState.swapped.includes(index);
                const isSorted = visualState.sorted.includes(index);
                const normalizedHeight = Math.max((value / tallestValue) * 100, 8);

                const tone = isSorted
                  ? 'sorted'
                  : isSwapped
                    ? 'swap'
                    : isCompared
                      ? 'compare'
                      : 'base';

                return (
                  <div key={`${index}-${value}`} className={`bar-wrap ${tone}`}>
                    <span className="bar-value">{value}</span>
                    <div
                      className={`bar ${tone}`}
                      style={{ height: `${normalizedHeight}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="panel stats-panel">
          <div className="panel-head">
            <h2>Statistiken</h2>
            <p>Live-Metriken auf Basis der aktuellen Sortier-Schritte.</p>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <span>Vergleiche</span>
              <strong>{visualState.stats.comparisons}</strong>
            </article>
            <article className="stat-card">
              <span>Bewegungen</span>
              <strong>{visualState.stats.moves}</strong>
            </article>
            <article className="stat-card">
              <span>Schritte</span>
              <strong>{visualState.stats.steps}</strong>
            </article>
            <article className="stat-card">
              <span>Generierungszeit</span>
              <strong>{generationTimeMs} ms</strong>
            </article>
          </div>
        </aside>

        <section className="panel theory-panel">
          <div className="panel-head">
            <h2>{explanation.title}</h2>
            <p>{explanation.summary}</p>
          </div>

          <div className="theory-grid">
            <article className="info-card">
              <span>Best Case</span>
              <strong>{explanation.bestCase}</strong>
            </article>
            <article className="info-card">
              <span>Average Case</span>
              <strong>{explanation.averageCase}</strong>
            </article>
            <article className="info-card">
              <span>Worst Case</span>
              <strong>{explanation.worstCase}</strong>
            </article>
            <article className="info-card">
              <span>Stabilität</span>
              <strong>{explanation.stability}</strong>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
