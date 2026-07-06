# SortLab Benutzeranleitung für Anfänger

Diese Anleitung ist für Personen gedacht, die Sortieralgorithmen noch nicht kennen oder wenig Informatik-Erfahrung haben.

## Was ist SortLab?

SortLab ist eine Website, die zeigt, wie ein Computer Zahlen sortiert.

Statt nur Code zu lesen, sieht man farbige Balken. Jeder Balken steht für eine Zahl. Wenn ein Algorithmus läuft, sieht man, wie die Balken verglichen und bewegt werden.

## Was kann man damit lernen?

Mit SortLab kann man verstehen:

- wie Sortieralgorithmen grundsätzlich funktionieren
- warum manche Algorithmen schneller sind als andere
- was Vergleiche und Bewegungen bedeuten
- wie sich ein unsortiertes Array Schritt für Schritt verändert

## Starten

Wenn du das Projekt lokal starten willst:

```bash
git clone https://github.com/Aleksandros2/SortLab.git
cd SortLab
npm install
npm run dev
```

Danach zeigt das Terminal eine Adresse an, meistens:

```text
http://localhost:5173
```

Diese Adresse im Browser öffnen.

## Bedienung

### 1. Array erzeugen

Am Anfang wird ein zufälliges Array angezeigt. Dieses Array besteht aus Balken mit unterschiedlicher Höhe.

Wenn du ein neues Array möchtest, klicke auf den Button zum Neu-Erzeugen des Arrays.

### 2. Algorithmus auswählen

Wähle einen Sortieralgorithmus aus, zum Beispiel:

```text
Bubble Sort
Selection Sort
Insertion Sort
Quick Sort
Heap Sort
```

### 3. Sortierung starten

Klicke auf den Start-Button.

Jetzt beginnt SortLab, das Array Schritt für Schritt zu sortieren.

### 4. Geschwindigkeit ändern

Mit dem Geschwindigkeitsregler kannst du einstellen, ob die Animation langsam oder schnell laufen soll.

Langsam ist besser zum Lernen. Schnell ist besser, wenn du nur das Ergebnis sehen möchtest.

### 5. Werte beobachten

Während der Sortierung zeigt SortLab Statistiken an, zum Beispiel:

- Vergleiche
- Bewegungen
- Schritte
- Generierungszeit

Diese Werte helfen dir zu verstehen, wie aufwendig ein Algorithmus und seine Visualisierung sind.

## Was bedeuten die wichtigsten Begriffe?

### Array

Ein Array ist eine Liste von Werten. In SortLab wird diese Liste als Balken dargestellt.

### Sortieren

Sortieren bedeutet, die Werte in die richtige Reihenfolge zu bringen, zum Beispiel von klein nach gross.

### Vergleich

Ein Vergleich bedeutet: Der Algorithmus prüft zwei Werte und entscheidet, welcher grösser oder kleiner ist.

### Bewegung

Eine Bewegung bedeutet: Der Algorithmus verändert das Array. Das kann ein Tausch von zwei Werten sein oder, wie bei Insertion Sort, eine Verschiebung.

### Generierungszeit

Die Generierungszeit zeigt, wie lange SortLab gebraucht hat, um die Sortierung zu berechnen und alle Animationsschritte zu erzeugen. Sie ist kein reiner Algorithmus-Benchmark.

## Empfehlung zum Lernen

1. Starte mit **Bubble Sort**, weil dieser Algorithmus leicht zu verstehen ist.
2. Stelle die Geschwindigkeit langsam ein.
3. Beobachte, welche Balken verglichen und bewegt werden.
4. Vergleiche danach Bubble Sort mit Quick Sort oder Heap Sort.

## Häufige Fragen

### Warum bewegen sich die Balken?

Die Balken bewegen sich, weil der Algorithmus Werte vergleicht und die Reihenfolge verändert.

### Warum sind manche Algorithmen schneller?

Manche Algorithmen brauchen weniger Vergleiche oder Bewegungen. Deshalb sind sie bei grösseren Arrays oft schneller.

### Muss ich programmieren können?

Nein. SortLab ist dafür gedacht, dass man Sortieralgorithmen visuell verstehen kann.

### Was ist das Ziel?

Am Ende sollen alle Balken sortiert sein, also von klein nach gross angeordnet.
