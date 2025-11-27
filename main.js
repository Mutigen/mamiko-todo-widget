const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const dataPath = path.join(app.getPath('userData'), 'todos.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    x: 50,
    y: 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  
  // Optional: DevTools öffnen für Debugging
  // mainWindow.webContents.openDevTools();
}

// Daten laden
ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return { activeTasks: [], completedTasks: [] };
  } catch (error) {
    console.error('Fehler beim Laden:', error);
    return { activeTasks: [], completedTasks: [] };
  }
});

// Daten speichern
ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    return { success: false, error: error.message };
  }
});

// App-Fenster schließen
ipcMain.on('close-app', () => {
  app.quit();
});

// App-Fenster minimieren
ipcMain.on('minimize-app', () => {
  mainWindow.minimize();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
