const glob = require('glob')
const fs = require('fs')
const os = require('os')
const path = require('path')
const electron = require('electron')


const BrowserWindow = electron.BrowserWindow
const app = electron.app
const ipcMain = electron.ipcMain
const shell = electron.shell

var mainWindow = null
var workerWindow = null

function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()

  function createWindow () {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      transparent: true,
      frame: false
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.jQuery = mainWindow.$ = module.exports
    mainWindow.$ = mainWindow.jQuery = require('./node_modules/jquery/dist/jquery.min.js')
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()

    let contents = mainWindow.webContents
    contents.toggleDevTools()

    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

ipcMain.on("printPDF", (event, content) => {
  mainWindow.webContents.send("printPDF", content);
});
// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf');
  // Use default printing options
  mainWindow.webContents.printToPDF({pageSize: 'A4', landscape: true, marginsType: 0, css: './assets/css/print.css', printBackground: true}, function (error, data) {
      if (error) throw error
      fs.writeFile(pdfPath, data, function (error) {
          if (error) {
              throw error
          }
          shell.openItem(pdfPath)
          event.sender.send('wrote-pdf', pdfPath)
      })
  })
});

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

initialize()