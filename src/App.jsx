import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatArrayInput, parseArrayInput } from './utils/arrayInput';
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

const presetOptions = [
  {
    id: 'sorted',
    label: 'Sortiert',
    create: (size) => Array.from({ length: size }, (_, index) => index + 1)
  },
  {
    id: 'reversed',
    label: 'Umgekehrt',
    create: (size) => Array.from({ length: size }, (_, index) => size - index)
  },
  {
    id: 'duplicates',
    label: 'Duplikate',
    create: (size) => Array.from({ length: size }, (_, index) => [12, 28, 12, 45, 28, 7][index % 6])
  },
  {
    id: 'nearly',
    label: 'Fast sortiert',
    create: (size) => Array.from({ length: size }, (_, index) => index + 1).map((value, index, array) => {
      if (index === Math.floor(size / 2)) {
        return array[Math.max(0, index - 1)];
      }

      if (index === Math.max(0, Math.floor(size / 2) - 1)) {
        return array[Math.floor(size / 2)];
      }

      return value;
    })
  },
  {
    id: 'negative',
    label: 'Negative Werte',
    create: (size) => Array.from({ length: size }, (_, index) => ((index % 2 === 0 ? 1 : -1) * ((index * 7) % 41)))
  }
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

const getAlgorithmLabel = (value) =>
  algorithmOptions.find((option) => option.value === value)?.label ?? value;

const describeStep = (step, previousStep) => {
  if (!step) {
    return 'Bereit für die nächste Sortierung.';
  }

  if (step.swapped.length > 0) {
    const values = step.swapped.map((index) => step.array[index]).join(' und ');
    return step.swapped.length > 1
      ? `Bewege Werte an den Positionen ${step.swapped.join(' und ')}. Aktuelle Werte: ${values}.`
      : `Setze ${values} an Position ${step.swapped[0]}.`;
  }

  if (step.compared.length > 0) {
    const values = step.compared.map((index) => step.array[index]).join(' und ');
    return step.compared.length > 1
      ? `Vergleiche ${values}.`
      : `Prüfe den Wert ${values}.`;
  }

  if (previousStep && step.sorted.length > previousStep.sorted.length) {
    return `${step.sorted.length} von ${step.array.length} Positionen sind als sortiert markiert.`;
  }

  if (step.sorted.length === step.array.length && step.array.length > 0) {
    return 'Das Array ist vollständig sortiert.';
  }

  return 'Der aktuelle Zustand wird angezeigt.';
};

function App() {
  const initial = useMemo(() => createInitialState(DEFAULT_SIZE), []);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [compareAlgorithm, setCompareAlgorithm] = useState('quick');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [baseArray, setBaseArray] = useState(() => initial.array);
  const [arrayInput, setArrayInput] = useState(() => formatArrayInput(initial.array));
  const [arrayInputError, setArrayInputError] = useState('');
  const [visualState, setVisualState] = useState(() => initial.visual);
  const [steps, setSteps] = useState([]);
  const [comparisonRows, setComparisonRows] = useState([]);
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
    () => Math.max(...visualState.array.map((value) => Math.abs(value)), 1),
    [visualState.array]
  );
  const previousStep = currentStep > 0 ? steps[currentStep - 1] : undefined;
  const stepDescription = describeStep(visualState, previousStep);
  const progress = steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0;
  const statusLabel = isPlaying
    ? 'Läuft'
    : isPaused
      ? 'Pausiert'
      : currentStep > 0 && steps.length > 0
        ? 'Bereit zum Fortsetzen'
        : 'Bereit';

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

  const applyArray = (nextArray) => {
    setBaseArray(nextArray);
    setArraySize(Math.min(Math.max(nextArray.length, ARRAY_MIN), ARRAY_MAX));
    setArrayInput(formatArrayInput(nextArray));
    setArrayInputError('');
    setVisualState(createIdleState(nextArray));
    setComparisonRows([]);
    resetPlaybackState();
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
    applyArray(createRandomArray(arraySize));
  };

  const handlePreset = (preset) => {
    applyArray(preset.create(arraySize));
  };

  const handleApplyInput = () => {
    const result = parseArrayInput(arrayInput);

    if (result.error) {
      setArrayInputError(result.error);
      return;
    }

    applyArray(result.values);
  };

  const handleArraySizeChange = (event) => {
    const nextSize = Number(event.target.value);
    setArraySize(nextSize);
    applyArray(createRandomArray(nextSize));
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

  const handleCompare = () => {
    const algorithmsToCompare = [algorithm, compareAlgorithm];
    const rows = algorithmsToCompare.map((algorithmKey) => {
      const start = performance.now();
      const generatedSteps = algorithmMap[algorithmKey](baseArray);
      const end = performance.now();
      const finalState = generatedSteps[generatedSteps.length - 1];

      return {
        key: algorithmKey,
        label: getAlgorithmLabel(algorithmKey),
        comparisons: finalState.stats.comparisons,
        moves: finalState.stats.moves,
        steps: finalState.stats.steps,
        generationTimeMs: Number((end - start).toFixed(2))
      };
    });

    setComparisonRows(rows);
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">SortLab</p>
          <h1>Sortieralgorithmen sichtbar machen</h1>
          <p className="hero-copy">
            Beobachte fünf Sortieralgorithmen Schritt für Schritt, arbeite mit eigenen Zahlen
            und vergleiche zwei Verfahren auf demselben Array.
          </p>
        </div>
        <div className="hero-metrics" aria-label="Aktueller Status">
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
        <section className="panel controls-panel" aria-labelledby="controls-title">
          <div className="panel-head">
            <h2 id="controls-title">Steuerung</h2>
            <p>Array, Geschwindigkeit und Algorithmus live anpassen.</p>
          </div>

          <label className="field" htmlFor="algorithm-select">
            <span>Algorithmus</span>
            <select id="algorithm-select" value={algorithm} onChange={handleAlgorithmChange}>
              {algorithmOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="array-size">
            <span>Array-Grösse: {arraySize}</span>
            <input
              id="array-size"
              type="range"
              min={ARRAY_MIN}
              max={ARRAY_MAX}
              value={arraySize}
              onChange={handleArraySizeChange}
            />
          </label>

          <label className="field" htmlFor="speed">
            <span>Geschwindigkeit: {speed} ms</span>
            <input
              id="speed"
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>

          <div className="field">
            <label htmlFor="array-input">Eigene Werte</label>
            <textarea
              id="array-input"
              value={arrayInput}
              onChange={(event) => {
                setArrayInput(event.target.value);
                setArrayInputError('');
              }}
              rows={3}
              aria-describedby="array-input-help"
            />
            <p id="array-input-help" className={arrayInputError ? 'field-error' : 'field-hint'}>
              {arrayInputError || 'Ganze Zahlen mit Komma, Leerschlag oder Semikolon trennen.'}
            </p>
            <button type="button" className="secondary full-width" onClick={handleApplyInput}>
              Werte übernehmen
            </button>
          </div>

          <div className="preset-grid" aria-label="Array Presets">
            {presetOptions.map((preset) => (
              <button key={preset.id} type="button" className="secondary" onClick={() => handlePreset(preset)}>
                {preset.label}
              </button>
            ))}
          </div>

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

        <section className="panel visualizer-panel" aria-labelledby="visualizer-title">
          <div className="panel-head split-head">
            <div>
              <h2 id="visualizer-title">Balkenvisualisierung</h2>
              <p>Verglichene, bewegte und bereits sortierte Werte werden farblich markiert.</p>
            </div>
            <div className="step-counter">
              Schritt {steps.length > 0 ? currentStep + 1 : 0}/{steps.length}
            </div>
          </div>

          <div className="legend" aria-label="Legende">
            <span><i className="legend-dot base"></i>Normal</span>
            <span><i className="legend-dot compare"></i>Vergleich</span>
            <span><i className="legend-dot swap"></i>Bewegung</span>
            <span><i className="legend-dot sorted"></i>Sortiert</span>
          </div>

          <div className="explain-box" aria-live="polite">
            <span>Erklärmodus</span>
            <strong>{stepDescription}</strong>
          </div>

          <div className="chart-card">
            <div className="chart">
              {visualState.array.map((value, index) => {
                const isCompared = visualState.compared.includes(index);
                const isSwapped = visualState.swapped.includes(index);
                const isSorted = visualState.sorted.includes(index);
                const normalizedHeight = Math.max((Math.abs(value) / tallestValue) * 100, 8);

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
                      aria-label={`Wert ${value} an Position ${index}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="panel stats-panel" aria-labelledby="stats-title">
          <div className="panel-head">
            <h2 id="stats-title">Statistiken</h2>
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

        <section className="panel compare-panel" aria-labelledby="compare-title">
          <div className="panel-head">
            <h2 id="compare-title">Vergleichsmodus</h2>
            <p>Zwei Algorithmen sortieren dasselbe Array und werden nach Statistikwerten verglichen.</p>
          </div>

          <div className="compare-controls">
            <label className="field" htmlFor="compare-select">
              <span>Zweiter Algorithmus</span>
              <select
                id="compare-select"
                value={compareAlgorithm}
                onChange={(event) => setCompareAlgorithm(event.target.value)}
              >
                {algorithmOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="primary" onClick={handleCompare}>
              Vergleich berechnen
            </button>
          </div>

          <div className="comparison-grid">
            {(comparisonRows.length > 0 ? comparisonRows : [algorithm, compareAlgorithm].map((key) => ({
              key,
              label: getAlgorithmLabel(key),
              comparisons: '-',
              moves: '-',
              steps: '-',
              generationTimeMs: '-'
            }))).map((row) => (
              <article className="compare-card" key={`${row.key}-${row.label}`}>
                <h3>{row.label}</h3>
                <dl>
                  <div>
                    <dt>Vergleiche</dt>
                    <dd>{row.comparisons}</dd>
                  </div>
                  <div>
                    <dt>Bewegungen</dt>
                    <dd>{row.moves}</dd>
                  </div>
                  <div>
                    <dt>Schritte</dt>
                    <dd>{row.steps}</dd>
                  </div>
                  <div>
                    <dt>Generierungszeit</dt>
                    <dd>{row.generationTimeMs} ms</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="panel theory-panel" aria-labelledby="theory-title">
          <div className="panel-head">
            <h2 id="theory-title">{explanation.title}</h2>
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
