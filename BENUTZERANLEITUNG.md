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
- wie sich zwei Algorithmen auf demselben Array unterscheiden
- wie sich ein unsortiertes Array Schritt für Schritt verändert

## Starten

Wenn du das Projekt lokal starten willst:

```bash
git clone https://github.com/AleksZyro/SortLab.git
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

Du kannst auch eigene Zahlen eingeben, zum Beispiel:

```text
5, 2, -1, 8
```

SortLab akzeptiert ganze Zahlen. Wenn eine Eingabe nicht passt, zeigt die App eine Fehlermeldung.

### 2. Presets verwenden

Mit den Preset-Buttons kannst du typische Testfälle schnell laden:

- sortiert
- umgekehrt
- negative Werte

### 3. Algorithmus auswählen

Wähle einen Sortieralgorithmus aus, zum Beispiel:

```text
Bubble Sort
Selection Sort
Insertion Sort
Quick Sort
Heap Sort
```

### 4. Sortierung starten

Klicke auf den Start-Button.

Jetzt beginnt SortLab, das Array Schritt für Schritt zu sortieren.

### 5. Geschwindigkeit ändern

Mit dem Geschwindigkeitsregler kannst du einstellen, ob die Animation langsam oder schnell laufen soll.

Langsam ist besser zum Lernen. Schnell ist besser, wenn du nur das Ergebnis sehen möchtest.

### 6. Werte beobachten

Während der Sortierung zeigt SortLab Statistiken an, zum Beispiel:

- Vergleiche
- Bewegungen
- Schritte
- Berechnungs- und Schrittgenerierungszeit

Diese Werte helfen dir zu verstehen, wie aufwendig ein Algorithmus und seine Visualisierung sind.

### 7. Algorithmen vergleichen

Wechsle oben in den Tab **Vergleichsmodus**. Dort wählst du zwei Algorithmen unabhängig von der Simulation aus. Du kannst zusätzlich die Array-Grösse und ein Preset für den Vergleich einstellen. Danach berechnet SortLab beide Algorithmen mit demselben Vergleichs-Array und zeigt die Werte nebeneinander an.

## Was bedeuten die wichtigsten Begriffe?

### Array

Ein Array ist eine Liste von Werten. In SortLab wird diese Liste als Balken dargestellt.

### Sortieren

Sortieren bedeutet, die Werte in die richtige Reihenfolge zu bringen, zum Beispiel von klein nach gross.

### Vergleich

Ein Vergleich bedeutet: Der Algorithmus prüft zwei Werte und entscheidet, welcher grösser oder kleiner ist.

### Bewegung

Eine Bewegung bedeutet: Der Algorithmus verändert das Array. Das kann ein Tausch von zwei Werten sein oder, wie bei Insertion Sort, eine Verschiebung.

### Berechnungs- und Schrittgenerierungszeit

Die Berechnungs- und Schrittgenerierungszeit zeigt, wie lange SortLab gebraucht hat, um die Sortierung zu berechnen und alle Animationsschritte zu erzeugen. Sie ist kein reiner Algorithmus-Benchmark.

## Empfehlung zum Lernen

1. Starte mit **Bubble Sort**, weil dieser Algorithmus leicht zu verstehen ist.
2. Stelle die Geschwindigkeit langsam ein.
3. Beobachte, welche Balken verglichen und bewegt werden.
4. Nutze danach den Vergleichsmodus mit Quick Sort oder Heap Sort.

## Häufige Fragen

### Warum bewegen sich die Balken?

Die Balken bewegen sich, weil der Algorithmus Werte vergleicht und die Reihenfolge verändert.

### Warum sind manche Algorithmen schneller?

Manche Algorithmen brauchen weniger Vergleiche oder Bewegungen. Deshalb sind sie bei grösseren Arrays oft schneller.

### Muss ich programmieren können?

Nein. SortLab ist dafür gedacht, dass man Sortieralgorithmen visuell verstehen kann.

### Was ist das Ziel?

Am Ende sollen alle Balken sortiert sein, also von klein nach gross angeordnet.
