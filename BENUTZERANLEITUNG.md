# SortLab Benutzeranleitung fuer Anfaenger

Diese Anleitung ist fuer Personen gedacht, die Sortieralgorithmen noch nicht kennen oder keine Informatik-Erfahrung haben.

## Was ist SortLab?

SortLab ist eine Website, die zeigt, wie ein Computer Zahlen sortiert.

Statt nur Code zu lesen, sieht man farbige Balken. Jeder Balken steht fuer eine Zahl. Wenn ein Algorithmus laeuft, sieht man, wie die Balken verglichen und vertauscht werden.

## Was kann man damit lernen?

Mit SortLab kann man verstehen:

- wie Sortieralgorithmen grundsaetzlich funktionieren
- warum manche Algorithmen schneller sind als andere
- was Vergleiche und Swaps bedeuten
- wie sich ein unsortiertes Array Schritt fuer Schritt veraendert

## Starten

Wenn du das Projekt lokal starten willst:

```bash
git clone https://github.com/Aleksandros2/sortlab.git
cd sortlab
npm install
npm run dev
```

Danach zeigt das Terminal eine Adresse an, meistens:

```text
http://localhost:5173
```

Diese Adresse im Browser oeffnen.

## Bedienung

### 1. Array erzeugen

Am Anfang wird ein zufaelliges Array angezeigt. Dieses Array besteht aus Balken mit unterschiedlicher Hoehe.

Wenn du ein neues Array moechtest, klicke auf den Button zum Neu-Erzeugen des Arrays.

### 2. Algorithmus auswaehlen

Waehle einen Sortieralgorithmus aus, zum Beispiel:

```text
Bubble Sort
Selection Sort
Insertion Sort
Quick Sort
Heap Sort
```

### 3. Sortierung starten

Klicke auf den Start-Button.

Jetzt beginnt SortLab, das Array Schritt fuer Schritt zu sortieren.

### 4. Geschwindigkeit aendern

Mit dem Geschwindigkeitsregler kannst du einstellen, ob die Animation langsam oder schnell laufen soll.

Langsam ist besser zum Lernen. Schnell ist besser, wenn du nur das Ergebnis sehen moechtest.

### 5. Werte beobachten

Waerend der Sortierung zeigt SortLab Statistiken an, zum Beispiel:

- Vergleiche
- Swaps
- Schritte
- Laufzeit

Diese Werte helfen dir zu verstehen, wie aufwendig ein Algorithmus ist.

## Was bedeuten die wichtigsten Begriffe?

### Array

Ein Array ist eine Liste von Werten. In SortLab wird diese Liste als Balken dargestellt.

### Sortieren

Sortieren bedeutet, die Werte in die richtige Reihenfolge zu bringen, zum Beispiel von klein nach gross.

### Vergleich

Ein Vergleich bedeutet: Der Algorithmus prueft zwei Werte und entscheidet, welcher groesser oder kleiner ist.

### Swap

Ein Swap bedeutet: Zwei Werte tauschen ihren Platz.

### Laufzeit

Die Laufzeit zeigt, wie lange der Algorithmus gebraucht hat.

## Empfehlung zum Lernen

1. Starte mit **Bubble Sort**, weil dieser Algorithmus leicht zu verstehen ist.
2. Stelle die Geschwindigkeit langsam ein.
3. Beobachte, welche Balken verglichen und vertauscht werden.
4. Vergleiche danach Bubble Sort mit Quick Sort oder Heap Sort.

## Haeufige Fragen

### Warum bewegen sich die Balken?

Die Balken bewegen sich, weil der Algorithmus Werte vergleicht und vertauscht.

### Warum sind manche Algorithmen schneller?

Manche Algorithmen brauchen weniger Vergleiche und Swaps. Deshalb sind sie bei groesseren Arrays schneller.

### Muss ich programmieren koennen?

Nein. SortLab ist dafuer gedacht, dass man Sortieralgorithmen visuell verstehen kann.

### Was ist das Ziel?

Am Ende sollen alle Balken sortiert sein, also von klein nach gross angeordnet.
