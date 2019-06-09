// Modules to control application life and create native browser window
const {app, Menu, shell, BrowserWindow} = require('electron');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const { fork } = require('child_process')
const ps = fork(`${__dirname}/app.js`)

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    resizable: false,
    width: 900,
    height: 640,
    title: "Chatting B-05",
    frame: true,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false
    }
  })
  mainWindow.loadURL('http://localhost:8080');

  //mainWindow.webContents.openDevTools();
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


  app.on('closed', () => {
    // window 객체에 대한 참조해제. 여러 개의 창을 지원하는 앱이라면
    // 창을 배열에 저장할 수 있습니다. 이곳은 관련 요소를 삭제하기에 좋은 장소입니다.
    mainWindow = null
  })

// 이 메서드는 Electron이 초기화를 마치고
// 브라우저 창을 생성할 준비가 되었을 때  호출될 것입니다.
// 어떤 API는 이 이벤트가 나타난 이후에만 사용할 수 있습니다.
app.on('ready', createWindow)

// 모든 창이 닫혔을 때 종료.
app.on('window-all-closed', () => {
  // macOS에서는 사용자가 명확하게 Cmd + Q를 누르기 전까지는
  // 애플리케이션이나 메뉴 바가 활성화된 상태로 머물러 있는 것이 일반적입니다.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서는 dock 아이콘이 클릭되고 다른 윈도우가 열려있지 않았다면
  // 앱에서 새로운 창을 다시 여는 것이 일반적입니다.
  if (mainWindow === null) {
    createWindow()
  }
})
