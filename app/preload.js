const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('setUserData', (event, data) => {
  const emailInput = document.getElementById('input-email');
  const passwordInput = document.getElementById('input-password');

  if (!emailInput || !passwordInput) {
    console.error('Input fields not found in DOM');
    return;
  }

  if (data && data.email && data.password) {
    emailInput.value = data.email;
    passwordInput.value = data.password;
  }
});

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, callback)
});
