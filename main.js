const glob = require('glob')
const fs = require('fs')
const os = require('os')
const path = require('path')
const electron = require('electron')


const BrowserWindow = electron.BrowserWindow
const app = electron.app
const ipc = electron.ipcMain
const shell = electron.shell

var mainWindow = null

ipc.on('print-to-pdf', function (event) {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const win = BrowserWindow.fromWebContents(event.sender)
  // Use default printing options
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})

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
    //  mainWindow.webContents.openDevTools()
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