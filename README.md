# SortLab

**Deutsch** | [English](./README_EN.md)

SortLab ist ein interaktiver Visualizer für Sortieralgorithmen. Das Projekt zeigt Schritt für Schritt, wie verschiedene Algorithmen ein Array sortieren, und macht Vergleiche, Bewegungen, Schritte und die Zeit zur Schrittgenerierung sichtbar.

## Projektstatus

Aktueller Stand: **stabile Portfolio-Version**

Die Version ist als ergänzendes Portfolio-Projekt gedacht. Sie ist funktional, getestet und gebaut, aber bewusst kleiner gehalten als grössere Hauptprojekte.

## Hauptfunktionen

- interaktive Visualisierung von Sortieralgorithmen
- zufällige Arrays mit einstellbarer Grösse
- eigene Array-Eingabe mit Validierung für ganze Zahlen
- Preset-Arrays für sortierte, umgekehrte, fast sortierte, doppelte und negative Werte
- steuerbare Animationsgeschwindigkeit
- farbliche Markierung von Vergleichen, Bewegungen und sortierten Werten
- Erklärmodus mit kurzer Beschreibung des aktuellen Animationsschritts
- Vergleichsmodus für zwei Algorithmen auf demselben Array
- Statistik für Vergleiche, Bewegungen, Animationsschritte und Schrittgenerierungszeit
- kurzer Lernbereich mit Laufzeitklassen und Stabilität

## Algorithmen

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

Getestet werden alle enthaltenen Sortieralgorithmen mit leeren Arrays, einzelnen Werten, bereits sortierten Arrays, umgekehrt sortierten Arrays, doppelten Werten und negativen Werten. Zusätzlich werden Bewegungszählung und Array-Eingabevalidierung geprüft.

Zuletzt ausgeführte lokale Resultate:

- `npm install`: erfolgreich, mit 6 gemeldeten Sicherheitsmeldungen in Abhängigkeiten
- `npm test`: erfolgreich, 42 Tests bestanden
- `npm run build`: erfolgreich, Vite-Build erstellt

Die CI in `.github/workflows/ci.yml` führt bei Push und Pull Request ebenfalls Installation, Tests und Build aus.

## Projektstruktur

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

## Technische Entscheidungen

- React und Vite werden für eine einfache, schnelle Single-Page-App genutzt.
- Die Sortierfunktionen erzeugen Animationsschritte, damit die UI jeden Zustand anzeigen kann.
- Eigene Eingaben werden vor der Übernahme geprüft, damit nur ganze Zahlen im unterstützten Bereich visualisiert werden.
- Die Statistik `Bewegungen` ersetzt die frühere Bezeichnung `Swaps`, weil Insertion Sort Werte verschiebt und nicht nur Elemente vertauscht.
- Die angezeigte Zeit ist die Berechnungs- und Schrittgenerierungszeit. Sie ist kein reiner Algorithmus-Benchmark, weil auch das Erzeugen der Animationsdaten enthalten ist.
- Vitest testet die Sortierlogik unabhängig von der React-Oberfläche.
- GitHub Actions prüft Tests und Build automatisch für neue Änderungen.

## Bekannte Einschränkungen

- Die Zeitmessung hängt vom Browser, Gerät und aktuellen Systemzustand ab.
- Die App misst die Schrittgenerierung, nicht die reine algorithmische Laufzeit.
- Es gibt noch keine automatisierten UI- oder Screenshot-Tests.
- Der Vergleichsmodus vergleicht Statistikwerte, aber animiert nicht beide Algorithmen parallel.

## Screenshot

Noch kein Screenshot im Repository enthalten.

Empfehlung: Ein guter Screenshot zeigt die Desktop-Ansicht während einer laufenden Sortierung, idealerweise mit Quick Sort oder Heap Sort, sichtbarer Balkenvisualisierung, Statistikbereich und Algorithmus-Erklärung.

## Demo

Aktuell ist keine Live-Demo veröffentlicht.

Optional würde sich eine GitHub-Pages- oder Vercel-Demo eignen. Vor einer Veröffentlichung sollte zuerst entschieden werden, ob SortLab öffentlich als Nebenprojekt gezeigt werden soll.

## Lizenz

Es ist aktuell keine Lizenz festgelegt. Ohne bewusste Lizenzentscheidung wurde keine Lizenzdatei ergänzt.

## Portfolio-Empfehlung

- Repository-Beschreibung: `Interactive sorting visualizer with React, Vite, animations, algorithm stats, and Vitest coverage.`
- GitHub-Topics: `react`, `vite`, `javascript`, `sorting-algorithms`, `algorithm-visualizer`, `vitest`, `portfolio-project`
- Positionierung: Als ergänzendes Projekt geeignet, besonders zur Demonstration von Algorithmusverständnis, State-Management und sauberer Nachdokumentation.

## Benutzeranleitung

Eine einfache Anleitung für Personen ohne Informatik-Vorwissen findest du hier:

[Benutzeranleitung für Anfänger](BENUTZERANLEITUNG.md)
