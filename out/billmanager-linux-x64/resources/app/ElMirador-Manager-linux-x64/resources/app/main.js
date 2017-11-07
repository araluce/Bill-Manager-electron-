const {app, BrowserWindow} = require('electron');

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/views/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

exports.openWindow = (filename) => {
  let win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(`file://${__dirname}/views/` + filename + `/` + filename + `.html`);
};