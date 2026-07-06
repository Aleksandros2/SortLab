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

const markAllSorted = (array, stats) =>
  cloneState({
    array,
    sorted: array.map((_, index) => index),
    stats
  });

const pushFinalStateIfNeeded = (steps, array, stats) => {
  const lastStep = steps[steps.length - 1];
  const allSorted = array.map((_, index) => index);
  const alreadyComplete =
    lastStep.sorted.length === allSorted.length &&
    lastStep.sorted.every((value, index) => value === allSorted[index]);

  if (!alreadyComplete) {
    steps.push(markAllSorted(array, stats));
  }

  return steps;
};

const bubbleSort = (source) => {
  const array = [...source];
  const stats = { ...baseStats };
  const steps = [cloneState({ array, stats })];

  for (let end = array.length - 1; end > 0; end -= 1) {
    let swappedInPass = false;

    for (let index = 0; index < end; index += 1) {
      stats.comparisons += 1;
      stats.steps += 1;
      steps.push(
        cloneState({
          array,
          compared: [index, index + 1],
          sorted: Array.from({ length: array.length - 1 - end }, (_, offset) => array.length - 1 - offset),
          stats
        })
      );

      if (array[index] > array[index + 1]) {
        [array[index], array[index + 1]] = [array[index + 1], array[index]];
        stats.moves += 1;
        stats.steps += 1;
        swappedInPass = true;

        steps.push(
          cloneState({
            array,
            compared: [index, index + 1],
            swapped: [index, index + 1],
            sorted: Array.from({ length: array.length - 1 - end }, (_, offset) => array.length - 1 - offset),
            stats
          })
        );
      }
    }

    steps.push(
      cloneState({
        array,
        sorted: Array.from({ length: array.length - end }, (_, offset) => array.length - 1 - offset),
        stats
      })
    );

    if (!swappedInPass) {
      break;
    }
  }

  return pushFinalStateIfNeeded(steps, array, stats);
};

const selectionSort = (source) => {
  const array = [...source];
  const stats = { ...baseStats };
  const steps = [cloneState({ array, stats })];

  for (let start = 0; start < array.length; start += 1) {
    let minIndex = start;

    for (let index = start + 1; index < array.length; index += 1) {
      stats.comparisons += 1;
      stats.steps += 1;

      steps.push(
        cloneState({
          array,
          compared: [minIndex, index],
          sorted: Array.from({ length: start }, (_, offset) => offset),
          stats
        })
      );

      if (array[index] < array[minIndex]) {
        minIndex = index;
      }
    }

    if (minIndex !== start) {
      [array[start], array[minIndex]] = [array[minIndex], array[start]];
      stats.moves += 1;
      stats.steps += 1;

      steps.push(
        cloneState({
          array,
          swapped: [start, minIndex],
          sorted: Array.from({ length: start }, (_, offset) => offset),
          stats
        })
      );
    }

    steps.push(
      cloneState({
        array,
        sorted: Array.from({ length: start + 1 }, (_, offset) => offset),
        stats
      })
    );
  }

  return pushFinalStateIfNeeded(steps, array, stats);
};

const insertionSort = (source) => {
  const array = [...source];
  const stats = { ...baseStats };
  const steps = [cloneState({ array, stats })];

  for (let index = 1; index < array.length; index += 1) {
    const value = array[index];
    let position = index - 1;

    steps.push(
      cloneState({
        array,
        compared: [index],
        sorted: Array.from({ length: index }, (_, offset) => offset),
        stats
      })
    );

    while (position >= 0) {
      stats.comparisons += 1;
      stats.steps += 1;

      steps.push(
        cloneState({
          array,
          compared: [position, position + 1],
          sorted: Array.from({ length: index }, (_, offset) => offset),
          stats
        })
      );

      if (array[position] <= value) {
        break;
      }

      array[position + 1] = array[position];
      stats.moves += 1;
      stats.steps += 1;

      steps.push(
        cloneState({
          array,
          swapped: [position, position + 1],
          sorted: Array.from({ length: index }, (_, offset) => offset),
          stats
        })
      );

      position -= 1;
    }

    const targetPosition = position + 1;
    const movedToNewPosition = targetPosition !== index;

    if (movedToNewPosition) {
      array[targetPosition] = value;
      stats.moves += 1;
      stats.steps += 1;
    }

    steps.push(
      cloneState({
        array,
        swapped: movedToNewPosition ? [targetPosition] : [],
        sorted: Array.from({ length: index + 1 }, (_, offset) => offset),
        stats
      })
    );
  }

  return pushFinalStateIfNeeded(steps, array, stats);
};

const quickSort = (source) => {
  const array = [...source];
  const stats = { ...baseStats };
  const steps = [cloneState({ array, stats })];
  const finalized = new Set();

  const pushState = (overrides = {}) => {
    steps.push(
      cloneState({
        array,
        sorted: sortedFromSet(finalized),
        stats,
        ...overrides
      })
    );
  };

  const partition = (low, high) => {
    const pivotValue = array[high];
    let storeIndex = low;

    for (let index = low; index < high; index += 1) {
      stats.comparisons += 1;
      stats.steps += 1;
      pushState({ compared: [index, high] });

      if (array[index] < pivotValue) {
        if (index !== storeIndex) {
          [array[index], array[storeIndex]] = [array[storeIndex], array[index]];
          stats.moves += 1;
          stats.steps += 1;
          pushState({ compared: [index, high], swapped: [index, storeIndex] });
        }

        storeIndex += 1;
      }
    }

    if (storeIndex !== high) {
      [array[storeIndex], array[high]] = [array[high], array[storeIndex]];
      stats.moves += 1;
      stats.steps += 1;
      pushState({ swapped: [storeIndex, high] });
    }

    finalized.add(storeIndex);
    pushState();
    return storeIndex;
  };

  const sort = (low, high) => {
    if (low > high) {
      return;
    }

    if (low === high) {
      finalized.add(low);
      pushState();
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, array.length - 1);
  return pushFinalStateIfNeeded(steps, array, stats);
};

const heapSort = (source) => {
  const array = [...source];
  const stats = { ...baseStats };
  const steps = [cloneState({ array, stats })];
  const finalized = new Set();

  const pushState = (overrides = {}) => {
    steps.push(
      cloneState({
        array,
        sorted: sortedFromSet(finalized),
        stats,
        ...overrides
      })
    );
  };

  const heapify = (heapSize, rootIndex) => {
    let currentRoot = rootIndex;

    while (true) {
      const leftChild = (currentRoot * 2) + 1;
      const rightChild = leftChild + 1;
      let largest = currentRoot;

      if (leftChild < heapSize) {
        stats.comparisons += 1;
        stats.steps += 1;
        pushState({ compared: [largest, leftChild] });

        if (array[leftChild] > array[largest]) {
          largest = leftChild;
        }
      }

      if (rightChild < heapSize) {
        stats.comparisons += 1;
        stats.steps += 1;
        pushState({ compared: [largest, rightChild] });

        if (array[rightChild] > array[largest]) {
          largest = rightChild;
        }
      }

      if (largest === currentRoot) {
        return;
      }

      [array[currentRoot], array[largest]] = [array[largest], array[currentRoot]];
      stats.moves += 1;
      stats.steps += 1;
      pushState({ swapped: [currentRoot, largest] });
      currentRoot = largest;
    }
  };

  for (let start = Math.floor(array.length / 2) - 1; start >= 0; start -= 1) {
    heapify(array.length, start);
  }

  for (let end = array.length - 1; end > 0; end -= 1) {
    [array[0], array[end]] = [array[end], array[0]];
    stats.moves += 1;
    stats.steps += 1;
    finalized.add(end);
    pushState({ swapped: [0, end] });
    heapify(end, 0);
  }

  if (array.length > 0) {
    finalized.add(0);
  }

  return pushFinalStateIfNeeded(steps, array, stats);
};

export const algorithmMap = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  heap: heapSort
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
