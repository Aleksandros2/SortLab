# SortLab

[Deutsch](./README.md) | **English**

SortLab is an interactive React visualizer for sorting algorithms. It shows how arrays are sorted step by step and makes comparisons, moves, animation steps, and calculation and step-generation time visible.

## Project Status

Current status: **Stable portfolio version**

This version is intended as a supporting portfolio project. Tests and production build were run successfully locally.

## Main Features

- bar visualization for sorting processes
- separate tabs for visualization and comparison mode
- random arrays with adjustable size
- custom array input with integer validation
- presets for sorted, reversed, and negative values
- controllable animation speed
- color highlighting for comparisons, moves, and sorted values
- comparison mode with two independently selectable algorithms and its own array size
- statistics for comparisons, moves, animation steps, and calculation and step-generation time

## Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Quick Sort
- Heap Sort

## Comparisons And Moves

`Comparisons` counts how often an algorithm compares values.

`Moves` counts operations that change the array. For Bubble Sort, Selection Sort, Quick Sort, and Heap Sort these are real swaps. For Insertion Sort these are shifts and inserting a value into a new position. That is why the metric is not called `swaps`.

## Time Measurement

The displayed time is called **Calculation and step-generation time**. It includes calculating the sorting process and generating the animation steps for the visualization. The values are not scientific benchmarks and depend on the browser, device, and current system state.

## Tech Stack

- React 18
- Vite 5
- JavaScript
- CSS
- Vitest
- GitHub Actions

## Installation

```bash
git clone https://github.com/AleksZyro/SortLab.git
cd SortLab
npm ci
```

## Development Start

```bash
npm run dev
```

## Tests

```bash
npm test
```

Run locally:

- `npm ci`: successful
- `npm test`: successful, 42 tests passed

The tests cover all existing sorting algorithms with an empty array, a single item, already sorted values, reverse sorted values, duplicate values, negative values, correct ascending sorting, and plausible counting of comparisons and moves.

## Production Build

```bash
npm run build
```

Run locally:

- `npm run build`: successful, Vite build created

## Deployment

GitHub Pages is prepared through `.github/workflows/deploy-pages.yml`. The workflow builds with the base path `/SortLab/`, uploads `dist` as a Pages artifact, and deploys to GitHub Pages.

Live demo:

[https://alekszyro.github.io/SortLab/](https://alekszyro.github.io/SortLab/)

If deployment stops working later, this GitHub setting should be checked:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

## Project Structure

```text
SortLab/
|- .github/
|  `- workflows/
|     |- ci.yml
|     `- deploy-pages.yml
|- docs/
|  `- assets/
|     `- sortlab-demo.png
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
|- package-lock.json
|- package.json
|- README.md
`- README_EN.md
```

## Technical Decisions

- The sorting functions generate states for the animation so the UI can display each step.
- The statistic uses `Moves` because not every algorithm only uses real swaps.
- The time measurement is not presented as pure algorithm runtime.
- The tests check the algorithm logic independently from the React interface.
- GitHub Actions uses Node.js 22 and `npm ci`.

## Known Limitations

- The comparison mode shows statistics, but does not animate both algorithms in parallel.
- The time measurement depends on browser and device.
- There are no automated UI tests.
- GitHub Pages is prepared, but the repository setting must be changed manually to GitHub Actions.

## Screenshot

The screenshot was created from the built application after successful `npm ci`, `npm test`, and `npm run build`.

![SortLab overview](docs/assets/sortlab-demo.png)

## Demo Video

The repository currently does not include a demo video or GIF. If a short demo is added later, it should stay around 10 to 20 seconds and remain small enough to avoid unnecessary repository size.

## License Status

No open-source license has been granted. The source code is publicly viewable, but no additional usage rights are granted.

## Repository Metadata Suggestion

- Description: `Interactive React visualizer for comparing sorting algorithms and their operations.`
- Website: `https://alekszyro.github.io/SortLab/`

## User Guide

A beginner-friendly German guide is available here:

[German beginner guide](BENUTZERANLEITUNG.md)
