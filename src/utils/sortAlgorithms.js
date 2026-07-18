const baseStats = {
  comparisons: 0,
  moves: 0,
  steps: 0
};

const cloneState = ({ array, compared = [], swapped = [], sorted = [], stats }) => ({
  array: [...array],
  compared: [...compared],
  swapped: [...swapped],
  sorted: [...sorted],
  stats: { ...stats }
});

const sortedFromSet = (set) => Array.from(set).sort((left, right) => left - right);
const sortedHead = (length) => Array.from({ length }, (_, index) => index);
const sortedTail = (array, length) =>
  Array.from({ length }, (_, offset) => array.length - 1 - offset);

const markAllSorted = (array, stats) =>
  cloneState({
    array,
    sorted: sortedHead(array.length),
    stats
  });

const pushFinalStateIfNeeded = (steps, array, stats) => {
  if (steps.length === 0) {
    return [markAllSorted(array, stats)];
  }

  const lastStep = steps[steps.length - 1];
  const allSorted = sortedHead(array.length);
  const alreadyComplete =
    lastStep.sorted.length === allSorted.length &&
    lastStep.sorted.every((value, index) => value === allSorted[index]);

  if (!alreadyComplete) {
    steps.push(markAllSorted(array, stats));
  }

  return steps;
};

const createRecorder = (array, stats, { recordSteps = true, getSorted = () => [] } = {}) => {
  const steps = recordSteps ? [cloneState({ array, stats })] : [];

  const push = (overrides = {}) => {
    if (!recordSteps) {
      return;
    }

    steps.push(
      cloneState({
        array,
        sorted: getSorted(),
        stats,
        ...overrides
      })
    );
  };

  return {
    steps,
    push,
    finish: () => pushFinalStateIfNeeded(steps, array, stats)
  };
};

const countComparison = (stats) => {
  stats.comparisons += 1;
  stats.steps += 1;
};

const countMove = (stats) => {
  stats.moves += 1;
  stats.steps += 1;
};

const bubbleSort = (source, options = {}) => {
  const array = [...source];
  const stats = { ...baseStats };
  const recorder = createRecorder(array, stats, options);

  for (let end = array.length - 1; end > 0; end -= 1) {
    let swappedInPass = false;

    for (let index = 0; index < end; index += 1) {
      countComparison(stats);
      recorder.push({
        compared: [index, index + 1],
        sorted: sortedTail(array, array.length - 1 - end)
      });

      if (array[index] > array[index + 1]) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
        countMove(stats);
        swappedInPass = true;
        recorder.push({
          compared: [index, index + 1],
          swapped: [index, index + 1],
          sorted: sortedTail(array, array.length - 1 - end)
        });
      }
    }

    recorder.push({ sorted: sortedTail(array, array.length - end) });

    if (!swappedInPass) {
      break;
    }
  }

  return recorder.finish();
};

const selectionSort = (source, options = {}) => {
  const array = [...source];
  const stats = { ...baseStats };
  const recorder = createRecorder(array, stats, options);

  for (let start = 0; start < array.length; start += 1) {
    let minIndex = start;

    for (let index = start + 1; index < array.length; index += 1) {
      countComparison(stats);
      recorder.push({
        compared: [minIndex, index],
        sorted: sortedHead(start)
      });

      if (array[index] < array[minIndex]) {
        minIndex = index;
      }
    }

    if (minIndex !== start) {
      [array[start], array[minIndex]] = [array[minIndex], array[start]];
      countMove(stats);
      recorder.push({
        swapped: [start, minIndex],
        sorted: sortedHead(start)
      });
    }

    recorder.push({ sorted: sortedHead(start + 1) });
  }

  return recorder.finish();
};

const insertionSort = (source, options = {}) => {
  const array = [...source];
  const stats = { ...baseStats };
  const recorder = createRecorder(array, stats, options);

  for (let index = 1; index < array.length; index += 1) {
    const value = array[index];
    let position = index - 1;

    recorder.push({
      compared: [index],
      sorted: sortedHead(index)
    });

    while (position >= 0) {
      countComparison(stats);
      recorder.push({
        compared: [position, position + 1],
        sorted: sortedHead(index)
      });

      if (array[position] <= value) {
        break;
      }

      array[position + 1] = array[position];
      countMove(stats);
      recorder.push({
        swapped: [position, position + 1],
        sorted: sortedHead(index)
      });

      position -= 1;
    }

    const targetPosition = position + 1;
    const movedToNewPosition = targetPosition !== index;

    if (movedToNewPosition) {
      array[targetPosition] = value;
      countMove(stats);
    }

    recorder.push({
      swapped: movedToNewPosition ? [targetPosition] : [],
      sorted: sortedHead(index + 1)
    });
  }

  return recorder.finish();
};

const quickSort = (source, options = {}) => {
  const array = [...source];
  const stats = { ...baseStats };
  const finalized = new Set();
  const recorder = createRecorder(array, stats, {
    ...options,
    getSorted: () => sortedFromSet(finalized)
  });

  const partition = (low, high) => {
    const pivotValue = array[high];
    let storeIndex = low;

    for (let index = low; index < high; index += 1) {
      countComparison(stats);
      recorder.push({ compared: [index, high] });

      if (array[index] < pivotValue) {
        if (index !== storeIndex) {
          [array[index], array[storeIndex]] = [array[storeIndex], array[index]];
          countMove(stats);
          recorder.push({ compared: [index, high], swapped: [index, storeIndex] });
        }

        storeIndex += 1;
      }
    }

    if (storeIndex !== high) {
      [array[storeIndex], array[high]] = [array[high], array[storeIndex]];
      countMove(stats);
      recorder.push({ swapped: [storeIndex, high] });
    }

    finalized.add(storeIndex);
    recorder.push();
    return storeIndex;
  };

  const sort = (low, high) => {
    if (low > high) {
      return;
    }

    if (low === high) {
      finalized.add(low);
      recorder.push();
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, array.length - 1);
  return recorder.finish();
};

const heapSort = (source, options = {}) => {
  const array = [...source];
  const stats = { ...baseStats };
  const finalized = new Set();
  const recorder = createRecorder(array, stats, {
    ...options,
    getSorted: () => sortedFromSet(finalized)
  });

  const heapify = (heapSize, rootIndex) => {
    let currentRoot = rootIndex;

    while (true) {
      const leftChild = (currentRoot * 2) + 1;
      const rightChild = leftChild + 1;
      let largest = currentRoot;

      if (leftChild < heapSize) {
        countComparison(stats);
        recorder.push({ compared: [largest, leftChild] });

        if (array[leftChild] > array[largest]) {
          largest = leftChild;
        }
      }

      if (rightChild < heapSize) {
        countComparison(stats);
        recorder.push({ compared: [largest, rightChild] });

        if (array[rightChild] > array[largest]) {
          largest = rightChild;
        }
      }

      if (largest === currentRoot) {
        return;
      }

      [array[currentRoot], array[largest]] = [array[largest], array[currentRoot]];
      countMove(stats);
      recorder.push({ swapped: [currentRoot, largest] });
      currentRoot = largest;
    }
  };

  for (let start = Math.floor(array.length / 2) - 1; start >= 0; start -= 1) {
    heapify(array.length, start);
  }

  for (let end = array.length - 1; end > 0; end -= 1) {
    [array[0], array[end]] = [array[end], array[0]];
    countMove(stats);
    finalized.add(end);
    recorder.push({ swapped: [0, end] });
    heapify(end, 0);
  }

  if (array.length > 0) {
    finalized.add(0);
  }

  return recorder.finish();
};

export const algorithmMap = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  heap: heapSort
};

export const summarizeAlgorithmRun = (algorithmKey, source) => {
  const start = performance.now();
  const [finalState] = algorithmMap[algorithmKey](source, { recordSteps: false });
  const end = performance.now();

  return {
    key: algorithmKey,
    comparisons: finalState.stats.comparisons,
    moves: finalState.stats.moves,
    steps: finalState.stats.steps,
    generationTimeMs: Number((end - start).toFixed(2)),
    resultArray: finalState.array
  };
};

export const algorithmContent = {
  bubble: {
    title: 'Bubble Sort',
    summary:
      'Bubble Sort vergleicht benachbarte Elemente und verschiebt grössere Werte Schritt für Schritt nach rechts.',
    bestCase: 'O(n) bei bereits sortiertem Array',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    stability: 'Stabil'
  },
  selection: {
    title: 'Selection Sort',
    summary:
      'Selection Sort sucht in jedem Durchlauf das kleinste verbleibende Element und setzt es an die nächste freie Position.',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    stability: 'Nicht stabil'
  },
  insertion: {
    title: 'Insertion Sort',
    summary:
      'Insertion Sort baut schrittweise einen sortierten Bereich auf und fügt jedes neue Element an der passenden Stelle ein.',
    bestCase: 'O(n) bei fast sortierten Daten',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    stability: 'Stabil'
  },
  quick: {
    title: 'Quick Sort',
    summary:
      'Quick Sort wählt ein Pivot-Element, teilt das Array in kleinere und grössere Werte auf und sortiert diese Teilbereiche rekursiv.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    stability: 'Nicht stabil'
  },
  heap: {
    title: 'Heap Sort',
    summary:
      'Heap Sort baut zuerst einen Max-Heap auf und verschiebt danach das jeweils grösste Element an das Ende des Arrays.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    stability: 'Nicht stabil'
  }
};
