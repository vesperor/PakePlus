const { app, BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');
const path = require('path');

// 初始化本地存储，默认配置全为空/初始值，无预设名单
const store = new Store({
  name: 'random-call-config',
  defaults: {
    classNum: 1,
    studentCount: 50,
    weightList: [],
    reduceList: [],
    excludeList: [],
    weightValue: 2,
    reduceValue: 0.5
  }
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  mainWindow.loadFile('index.html');
}

// 注册配置读取接口
ipcMain.handle('load-config', () => {
  return store.store;
});

// 注册配置保存接口
ipcMain.handle('save-config', (_, config) => {
  store.set(config);
  return true;
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
