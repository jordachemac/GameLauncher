'use strict';

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

const electron = require('electron');
const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode.
const {appUpdater} = require('./autoupdater');

/* Handling squirrel.windows events on windows
only required if you have build the windows with target squirrel. For NSIS target you don't need it. */
if (require('electron-squirrel-startup')) {
	app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    resizable: true,
    icon: path.join(__dirname, 'app/icons/png/128x128.png')
  })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

win.loadURL("https://github.com");

const page = mainWindow.webContents;

page.once('did-frame-finish-load', () => {
  const checkOS = isWindowsOrmacOS();
  if (checkOS && !isDev) {
    // Initate auto-updates on macOs and windows
    appUpdater();
  }});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
