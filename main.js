const electron = require('electron')
const {app, BrowserWindow, Menu} = require('electron')


// var cmd=require('node-cmd');
// cmd.get('git pull',function(err,data,stderr){
//   console.log(data)
// })


let mainWindow
let showWindow
let barWindow

function createWindow () {
  Menu.setApplicationMenu(null)
  mainWindow = new BrowserWindow({width: 1024, height: 768})
  mainWindow.loadFile('login/login.html')
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createBarWindow () {
  barWindow = new BrowserWindow({width: 1024, height: 768,fullscreen: true})
  //barWindow.webContents.openDevTools()
  barWindow.loadFile('cms/page/home/home.html')
  barWindow.on('closed', function () {
    barWindow = null
    showWindow.close()
    showWindow = null 
  })
}

app.on('ready', createWindow)

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


const ipcMain = require('electron').ipcMain;

ipcMain.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  //event.returnValue = 'pong';
  createBarWindow()
  let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !==0 || display.bounds.y !== 0
  })

  //console.log(externalDisplay)
  if(externalDisplay){
    Menu.setApplicationMenu(null)
    
    showWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      fullscreen: true,
      minimizable:false
    })
    //showWindow.webContents.openDevTools()
    showWindow.loadFile('show/show.html')

  }
  mainWindow.close()
});

ipcMain.on('user-logout', function(event, arg) {
  console.log(arg);  // prints "ping"
  //event.returnValue = 'pong';
  createWindow()
  barWindow.close()
});

let user_name = '';


ipcMain.on('hide-all', ()=>{
 
  showWindow.webContents.send('hide-all');
  //更换用户
});

ipcMain.on('change-user', function(event, arg) {
  user_name = arg
  
  showWindow.webContents.send('change-user',user_name)
  //更换用户
});
ipcMain.on('recharge', function(event, st, num) {
  //充值
  showWindow.webContents.send('recharge',st,num)
});
ipcMain.on('checkin', function(event, st, mid, box, p1, p2, p3, p4) {
  //上机
  if(st == 1){
    showWindow.webContents.send('checkin','st',1)
  }else{
    showWindow.webContents.send('checkin','st',0)
  }
  if(mid != 0){
    showWindow.webContents.send('checkin','checkin_machine_num',mid)
  }
  if(box != 0){
    showWindow.webContents.send('checkin','checkin_machine_box',box)
  }
  if(p1 != 0){
    showWindow.webContents.send('checkin','checkin_peripheral_1',p1)
  }
  if(p2 != 0){
    showWindow.webContents.send('checkin','checkin_peripheral_2',p2)
  }
  if(p3 != 0){
    showWindow.webContents.send('checkin','checkin_peripheral_3',p3)
  }
  if(p4 != 0){
    showWindow.webContents.send('checkin','checkin_peripheral_4',p4)
  }
  
});
ipcMain.on('checkout', function(event, st, data) {
  //下机
    showWindow.webContents.send('checkout',st,data)
});
ipcMain.on('sale', function(event, st, data,money) {

  showWindow.webContents.send('sale',st,data,money)
});

//控制开关机
const ansible_task = require('./ansible_request.js')

//开机
ipcMain.on('open-machine',function(event,ip,mac){
  ansible_task.taskopen(ip,mac)
})

//关机
ipcMain.on('close-machine',function(event,ip){
  ansible_task.task(10,ip)
})

//锁屏
ipcMain.on('clock-machine',function(event,ip){
  ansible_task.task(7,ip)
})
