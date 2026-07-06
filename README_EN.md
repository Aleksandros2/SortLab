# SortLab

[Deutsch](./README.md) | **English**

SortLab is an interactive visualizer for sorting algorithms. It shows step by step how different algorithms sort an array and makes comparisons, movements, animation steps, and step-generation time visible.

## Project Status

Current status: **stable portfolio version**

This version is intended as a supporting portfolio project. It is functional, tested, and buildable, but intentionally smaller than larger main projects.

## Main Features

- interactive sorting visualization
- random arrays with adjustable size
- custom array input with validation for integers
- preset arrays for sorted, reversed, nearly sorted, duplicate, and negative values
- controllable animation speed
- color highlighting for comparisons, movements, and sorted values
- explanation mode with a short description of the current animation step
- comparison mode for two algorithms on the same array
- statistics for comparisons, movements, animation steps, and step-generation time
- short learning section with time complexity and stability

## Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Quick Sort
- Heap Sort

## Installation

```bash
git clone https://github.com/Aleksandros2/SortLab.git
cd SortLab
npm install
```

## Start

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

The tests cover all included sorting algorithms with empty arrays, single-item arrays, already sorted arrays, reverse sorted arrays, duplicate values, and negative values. They also check the movement statistics and custom array input validation.

Latest local results:

- `npm install`: successful, with 6 reported dependency security advisories
- `npm test`: successful, 42 tests passed
- `npm run build`: successful, Vite build created

The CI workflow in `.github/workflows/ci.yml` also runs installation, tests, and build on push and pull request.

## Project Structure

```text
SortLab/
|- .github/
|  `- workflows/
|     `- ci.yml
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- styles.css
|  `- utils/
|     |- arrayInput.js
|     |- arrayInput.test.js
|     |- sortAlgorithms.js
|     `- sortAlgorithms.test.js
|- index.html
|- package.json
|- README.md
`- README_EN.md
```

## Technical Decisions

- React and Vite are used for a simple and fast single-page app.
- The sorting functions generate animation steps so the UI can display each state.
- Custom input is validated before it is applied, so only supported integer values are visualized.
- The statistic `movements` replaces the previous `swaps` label because Insertion Sort shifts values and does not only swap elements.
- The displayed time is calculation and step-generation time. It is not a pure algorithm benchmark because animation data generation is included.
- Vitest tests the sorting logic independently from the React interface.
- GitHub Actions checks tests and build automatically for new changes.

## Known Limitations

- The displayed time depends on the browser, device, and current system load.
- The app measures step generation, not pure algorithm runtime.
- There are no automated UI or screenshot tests yet.
- The comparison mode compares statistics, but does not animate both algorithms in parallel.

## Screenshot

No screenshot is included in the repository yet.

Recommendation: A good screenshot should show the desktop view during an active sort, ideally with Quick Sort or Heap Sort, visible bar visualization, statistics, and the algorithm explanation.

## Demo

No live demo is published at the moment.

An optional GitHub Pages or Vercel demo would fit this project. Before publishing, decide whether SortLab should be shown publicly as a supporting portfolio project.

## License

No license is currently defined. No license file was added without an explicit license decision.

## Portfolio Recommendation

- Repository description: `Interactive sorting visualizer with React, Vite, animations, algorithm stats, and Vitest coverage.`
- GitHub topics: `react`, `vite`, `javascript`, `sorting-algorithms`, `algorithm-visualizer`, `vitest`, `portfolio-project`
- Positioning: Suitable as a supporting project, especially to show algorithm understanding, state management, and clean documentation.

## User Guide

A beginner-friendly German guide is available here:

[German beginner guide](BENUTZERANLEITUNG.md)
