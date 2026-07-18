import { useEffect, useMemo, useRef, useState } from 'react';
import { formatArrayInput, parseArrayInput } from './utils/arrayInput';
import { algorithmContent, algorithmMap, summarizeAlgorithmRun } from './utils/sortAlgorithms';

const ARRAY_MIN = 8;
const ARRAY_MAX = 64;
const SPEED_MIN = 20;
const SPEED_MAX = 300;
const DEFAULT_SIZE = 28;
const DEFAULT_SPEED = 110;

const algorithmKeys = Object.keys(algorithmMap);

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

const getAlgorithmLabel = (value) =>
  algorithmContent[value]?.title ?? value;

const getTallestArrayValue = (array) => Math.max(...array.map((value) => Math.abs(value)), 1);

const createComparisonPlaceholder = (key) => ({
  key,
  comparisons: '-',
  moves: '-',
  steps: '-',
  generationTimeMs: '-',
  resultArray: []
});

const statMetrics = [
  ['comparisons', 'Vergleiche'],
  ['moves', 'Bewegungen'],
  ['steps', 'Schritte']
];

const theoryMetrics = [
  ['bestCase', 'Best Case'],
  ['averageCase', 'Average Case'],
  ['worstCase', 'Worst Case'],
  ['stability', 'Stabilität']
];

const AlgorithmSelect = ({ id, label, value, onChange }) => (
  <label className="field" htmlFor={id}>
    <span>{label}</span>
    <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
      {algorithmKeys.map((key) => (
        <option key={key} value={key}>
          {getAlgorithmLabel(key)}
        </option>
      ))}
    </select>
  </label>
);

const RangeField = ({ id, label, value, displayValue = value, min, max, onChange }) => (
  <label className="field" htmlFor={id}>
    <span>{label}: {displayValue}</span>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
);

const PresetButtons = ({ size, onApply, includeRandom = false }) => (
  <>
    {includeRandom && (
      <button type="button" className="secondary" onClick={() => onApply(createRandomArray(size))}>
        Zufälliges Array
      </button>
    )}
    {presetOptions.map((preset) => (
      <button key={preset.id} type="button" className="secondary" onClick={() => onApply(preset.create(size))}>
        {preset.label}
      </button>
    ))}
  </>
);

const MetricCards = ({ metrics, values, className }) => (
  <>
    {metrics.map(([key, label]) => (
      <article className={className} key={key}>
        <span>{label}</span>
        <strong>{values[key]}</strong>
      </article>
    ))}
  </>
);

const CompactBars = ({ values, idPrefix }) => {
  const tallestValue = getTallestArrayValue(values);

  return (
    <div className="compare-result-chart" aria-label="Sortiertes Ergebnis">
      {values.map((value, index) => (
        <i
          key={`${idPrefix}-${index}-${value}`}
          style={{ height: `${Math.max((Math.abs(value) / tallestValue) * 100, 8)}%` }}
          title={`Wert ${value}`}
          aria-label={`Wert ${value} an Position ${index}`}
        />
      ))}
    </div>
  );
};

function App() {
  const initialArray = useMemo(() => createRandomArray(DEFAULT_SIZE), []);
  const [activeTab, setActiveTab] = useState('visualizer');

  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [baseArray, setBaseArray] = useState(initialArray);
  const [arrayInput, setArrayInput] = useState(() => formatArrayInput(initialArray));
  const [arrayInputError, setArrayInputError] = useState('');
  const [visualState, setVisualState] = useState(() => createIdleState(initialArray));
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState(0);
  const [isDirty, setIsDirty] = useState(true);

  const [compareLeftAlgorithm, setCompareLeftAlgorithm] = useState('bubble');
  const [compareRightAlgorithm, setCompareRightAlgorithm] = useState('quick');
  const [compareArray, setCompareArray] = useState(() => createRandomArray(DEFAULT_SIZE));
  const [comparisonRows, setComparisonRows] = useState([]);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      return undefined;
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
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
    if (steps.length > 0) {
      setVisualState(steps[currentStep]);
    }
  }, [currentStep, steps]);

  const explanation = useMemo(() => algorithmContent[algorithm], [algorithm]);
  const arraySize = baseArray.length;
  const compareArraySize = compareArray.length;
  const tallestValue = useMemo(
    () => getTallestArrayValue(visualState.array),
    [visualState.array]
  );
  const isPaused = !isPlaying && currentStep > 0 && currentStep < steps.length - 1;
  const progress = steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 0;
  const statusLabel = isPlaying
    ? 'Läuft'
    : isPaused
      ? 'Pausiert'
      : currentStep > 0 && steps.length > 0
        ? 'Bereit zum Fortsetzen'
        : 'Bereit';
  const comparisonDisplayRows = useMemo(
    () => [compareLeftAlgorithm, compareRightAlgorithm].map((algorithmKey) => (
      comparisonRows.find((row) => row.key === algorithmKey) ?? createComparisonPlaceholder(algorithmKey)
    )),
    [compareLeftAlgorithm, compareRightAlgorithm, comparisonRows]
  );

  const resetPlaybackState = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setSteps([]);
    setCurrentStep(0);
    setGenerationTimeMs(0);
    setIsPlaying(false);
    setIsDirty(true);
  };

  const applyArray = (nextArray) => {
    setBaseArray(nextArray);
    setArrayInput(formatArrayInput(nextArray));
    setArrayInputError('');
    setVisualState(createIdleState(nextArray));
    resetPlaybackState();
  };

  const applyCompareArray = (nextArray) => {
    setCompareArray(nextArray);
    setComparisonRows([]);
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

    return generatedSteps;
  };

  const handleApplyInput = () => {
    const result = parseArrayInput(arrayInput);

    if (result.error) {
      setArrayInputError(result.error);
      return;
    }

    applyArray(result.values);
  };

  const handleStart = () => {
    const preparedSteps = !steps.length || isDirty ? generateSteps() : steps;
    if (preparedSteps.length <= 1) {
      return;
    }

    if (currentStep >= preparedSteps.length - 1) {
      setCurrentStep(0);
      setVisualState(preparedSteps[0]);
    }

    setIsPlaying(true);
  };

  const handleReset = () => {
    resetPlaybackState();
    setVisualState(createIdleState(baseArray));
  };

  const handleCompare = () => {
    setComparisonRows(
      [compareLeftAlgorithm, compareRightAlgorithm].map((algorithmKey) => ({
        ...summarizeAlgorithmRun(algorithmKey, compareArray)
      }))
    );
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">SortLab</p>
          <h1>Sortieralgorithmen sichtbar machen</h1>
          <p className="hero-copy">
            Simuliere einzelne Sortierungen oder vergleiche zwei Verfahren in einem getrennten Modus.
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

      <nav className="mode-tabs" aria-label="Ansicht wählen">
        <button
          type="button"
          className={activeTab === 'visualizer' ? 'active' : ''}
          onClick={() => setActiveTab('visualizer')}
        >
          Balkenvisualisierung
        </button>
        <button
          type="button"
          className={activeTab === 'compare' ? 'active' : ''}
          onClick={() => setActiveTab('compare')}
        >
          Vergleichsmodus
        </button>
      </nav>

      {activeTab === 'visualizer' ? (
        <main className="dashboard">
          <section className="panel controls-panel" aria-labelledby="controls-title">
            <div className="panel-head">
              <h2 id="controls-title">Steuerung</h2>
              <p>Array, Geschwindigkeit und Algorithmus für die Simulation anpassen.</p>
            </div>

            <AlgorithmSelect
              id="algorithm-select"
              label="Algorithmus"
              value={algorithm}
              onChange={(nextAlgorithm) => {
                setAlgorithm(nextAlgorithm);
                setVisualState(createIdleState(baseArray));
                resetPlaybackState();
              }}
            />

            <RangeField
              id="array-size"
              label="Array-Grösse"
              value={arraySize}
              min={ARRAY_MIN}
              max={ARRAY_MAX}
              onChange={(size) => applyArray(createRandomArray(size))}
            />

            <RangeField
              id="speed"
              label="Geschwindigkeit"
              value={speed}
              displayValue={`${speed} ms`}
              min={SPEED_MIN}
              max={SPEED_MAX}
              onChange={setSpeed}
            />

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
              <button type="button" className="secondary" onClick={handleApplyInput}>
                Werte übernehmen
              </button>
            </div>

            <div className="preset-grid" aria-label="Array Presets">
              <PresetButtons size={arraySize} onApply={applyArray} />
            </div>

            <div className="button-grid">
              <button type="button" className="primary" onClick={() => applyArray(createRandomArray(arraySize))}>
                Zufälliges Array
              </button>
              <button type="button" className="primary" onClick={handleStart}>
                Sortierung starten
              </button>
              <button type="button" className="secondary" onClick={() => setIsPlaying(false)} disabled={!isPlaying}>
                Pausieren
              </button>
              <button type="button" className="secondary" onClick={handleReset}>
                Zurücksetzen
              </button>
            </div>
          </section>

          <section className="panel visualizer-panel" aria-labelledby="visualizer-title">
            <div className="panel-head">
              <div>
                <h2 id="visualizer-title">Balkenvisualisierung</h2>
              </div>
            </div>

            <div className="legend" aria-label="Legende">
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
              <MetricCards metrics={statMetrics} values={visualState.stats} className="stat-card" />
              <article className="stat-card">
                <span>Berechnungs- und Schrittgenerierungszeit</span>
                <strong>{generationTimeMs} ms</strong>
              </article>
            </div>
          </aside>

          <section className="panel theory-panel" aria-labelledby="theory-title">
            <div className="panel-head">
              <h2 id="theory-title">{explanation.title}</h2>
              <p>{explanation.summary}</p>
            </div>

            <div className="theory-grid">
              <MetricCards metrics={theoryMetrics} values={explanation} className="info-card" />
            </div>
          </section>
        </main>
      ) : (
        <main className="compare-workspace">
          <section className="panel compare-panel" aria-labelledby="compare-title">
            <div className="panel-head">
              <h2 id="compare-title">Vergleichsmodus</h2>
              <p>Zwei unabhängig gewählte Algorithmen sortieren dasselbe Vergleichs-Array.</p>
            </div>

            <div className="compare-controls">
              <AlgorithmSelect
                id="compare-left-select"
                label="Algorithmus A"
                value={compareLeftAlgorithm}
                onChange={(value) => {
                  setCompareLeftAlgorithm(value);
                  setComparisonRows([]);
                }}
              />
              <AlgorithmSelect
                id="compare-right-select"
                label="Algorithmus B"
                value={compareRightAlgorithm}
                onChange={(value) => {
                  setCompareRightAlgorithm(value);
                  setComparisonRows([]);
                }}
              />
              <RangeField
                id="compare-array-size"
                label="Array-Grösse"
                value={compareArraySize}
                min={ARRAY_MIN}
                max={ARRAY_MAX}
                onChange={(size) => applyCompareArray(createRandomArray(size))}
              />
              <button type="button" className="primary" onClick={handleCompare}>
                Vergleich berechnen
              </button>
            </div>

            <div className="compare-presets" aria-label="Vergleichs-Array Presets">
              <PresetButtons size={compareArraySize} onApply={applyCompareArray} includeRandom />
            </div>

            <div className="array-preview">
              <span>Vergleichs-Array</span>
              <strong>{compareArray.slice(0, 18).join(', ')}{compareArray.length > 18 ? ' ...' : ''}</strong>
            </div>

            <div className="comparison-grid">
              {comparisonDisplayRows.map((row, rowIndex) => (
                <article className="compare-card" key={`${row.key}-${rowIndex}`}>
                  <h3>{getAlgorithmLabel(row.key)}</h3>
                  {row.resultArray.length > 0 && <CompactBars values={row.resultArray} idPrefix={row.key} />}
                  <dl>
                    {statMetrics.map(([key, label]) => (
                      <div key={key}>
                        <dt>{label}</dt>
                        <dd>{row[key]}</dd>
                      </div>
                    ))}
                    <div>
                      <dt>Berechnungs- und Schrittgenerierungszeit</dt>
                      <dd>{row.generationTimeMs} ms</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
