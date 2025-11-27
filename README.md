# macOS Todo Widget

Ein modernes Desktop-Widget für macOS zum Verwalten von Aufgaben.

<img width="352" height="503" alt="mamiko todo app2" src="https://github.com/user-attachments/assets/8f65659a-1707-459e-9a41-56e48dca2873" />
<img width="352" height="503" alt="mamiko todo app1" src="https://github.com/user-attachments/assets/e1d37516-f23e-4574-83a9-a3e95f98c51b" />


## Features

- ✅ Maximal 10 aktive Tasks gleichzeitig
- ⭕ Anklickbare Kreise zum Abhaken von Aufgaben
- 💾 Lokale Speicherung aller erledigten Tasks
- 🎨 Modernes, transparentes Design
- 📱 Always-on-top Widget
- 🔄 Automatisches Verschwinden erledigter Tasks
- 📊 Übersicht über erledigte Aufgaben

## Installation

### Schritt 1: Node.js installieren
Falls noch nicht installiert, lade Node.js von [nodejs.org](https://nodejs.org/) herunter und installiere es.

### Schritt 2: Dependencies installieren
Öffne das Terminal und navigiere in den Projekt-Ordner:
```bash
cd /Volumes/CrucialX10/Projects/todo-widget
npm install
```

### Schritt 3: Widget starten
```bash
npm start
```

## Verwendung

### Tasks hinzufügen
1. Gib deine Aufgabe in das Eingabefeld ein
2. Drücke Enter oder klicke auf den + Button
3. Maximal 10 aktive Tasks sind erlaubt

### Tasks erledigen
1. Klicke auf den Kreis links neben der Aufgabe
2. Die Aufgabe wird animiert entfernt
3. Sie wird automatisch in den erledigten Tasks gespeichert

### Erledigte Tasks anzeigen
1. Klicke auf den Button "Erledigte anzeigen"
2. Siehe alle erledigten Aufgaben mit Zeitstempel
3. Optional: Lösche alle erledigten Tasks

### Widget bewegen
- Ziehe das Widget am oberen Bereich (Header)

### Widget schließen/minimieren
- Minimieren: Klicke auf den gelben Button
- Schließen: Klicke auf den roten Button

## Datenspeicherung

Alle Daten werden lokal gespeichert unter:
- macOS: `~/Library/Application Support/macos-todo-widget/todos.json`

Die Datei enthält:
- `activeTasks`: Array aller aktiven Aufgaben
- `completedTasks`: Array aller erledigten Aufgaben mit Zeitstempel

## Anpassungen

### Design ändern
Bearbeite die Datei `styles.css` für:
- Farben (Gradient im Header)
- Größe des Widgets
- Schriftarten
- Animationen

### Maximale Task-Anzahl ändern
In `renderer.js`, Zeile 4:
```javascript
const MAX_TASKS = 10; // Ändere diese Zahl
```

### Widget-Position beim Start
In `main.js`, Zeilen 10-11:
```javascript
x: 50,  // X-Position
y: 50,  // Y-Position
```

## Troubleshooting

**Widget erscheint nicht:**
- Prüfe, ob Node.js korrekt installiert ist: `node --version`
- Stelle sicher, dass alle Dependencies installiert sind: `npm install`

**Daten werden nicht gespeichert:**
- Überprüfe die Schreibrechte im Application Support Ordner

## Technologie-Stack

- Electron (Desktop-Framework)
- HTML/CSS/JavaScript
- Node.js File System (für lokale Speicherung)

## Lizenz

MIT - Frei verwendbar für persönliche und kommerzielle Projekte.

---

Entwickelt von MAMIKO | MUT-i-GEN
