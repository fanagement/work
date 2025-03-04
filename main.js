import puppeteer from 'puppeteer';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';

// Store 인스턴스 생성
const store = new Store();

const __dirname = path.dirname(new URL(import.meta.url).pathname); // __dirname 대체

async function createWindow() {
  // preload 경로 확인 (절대 경로 사용)
  const win = new BrowserWindow({
    title: 'FUZ',
    width: 400,
    height: 400,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(__dirname, 'app/preload.js')
    }
  });

  await win.loadFile(path.join(__dirname, 'app/index.html')); // index.html 파일 로드

  const userData = store.get('userData');

  await win.webContents.send('setUserData', userData); // 데이터 전송

  // win.webContents.openDevTools();
}

app.whenReady().then(async () => {
  await createWindow();

  ipcMain.on('toSave', async (event, data) => {
    const { email, password } = data;
    await automateSave(email, password);
  });

  ipcMain.on('toWork', async (event, data) => {
    const { email, password } = data;
    await automateWork(email, password);
  });

  ipcMain.on('toOut', async (event, data) => {
    const { email, password } = data;
    await automateOut(email, password);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function automateSave(email, password) {
  store.set('userData', { email, password });
}

async function automateWork(email, password) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920, // 원하는 화면 너비
    height: 1080, // 원하는 화면 높이
    deviceScaleFactor: 1 // 화면 해상도
  });

  await page.goto('https://login.office.hiworks.com');

  // 아이디 입력 필드 기다리기
  await page.waitForSelector(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    { visible: true }
  );

  // 아이디 입력
  await page.type(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    email
  );

  // 로그인 버튼 클릭
  await page.click('button.mantine-UnstyledButton-root');

  // 페이지 네비게이션 대기
  await page.waitForNavigation();

  // 비밀번호 입력 필드 기다리기
  await page.waitForSelector(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    { visible: true }
  );

  // 비밀번호 입력
  await page.type(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    password
  );

  // 패스워드 버튼 클릭
  await page.click('button.mantine-UnstyledButton-root');

  await page.waitForNavigation();

  await page.waitForSelector(
    'div.favorite-container > div:nth-child(4) a.menu.office',
    { visible: true }
  );

  await page.click('div.favorite-container > div:nth-child(4) a.menu.office');

  await page.waitForNavigation();

  await page.waitForSelector('ul.division-list > li:nth-child(1) button', {
    visible: true
  });

  await page.click('ul.division-list > li:nth-child(1) button');

  // await browser.close();
}

async function automateOut(email, password) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920, // 원하는 화면 너비
    height: 1080, // 원하는 화면 높이
    deviceScaleFactor: 1 // 화면 해상도
  });

  await page.goto('https://login.office.hiworks.com');

  // 아이디 입력 필드 기다리기
  await page.waitForSelector(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    { visible: true }
  );

  // 아이디 입력
  await page.type(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    email
  );

  // 로그인 버튼 클릭
  await page.click('button.mantine-UnstyledButton-root');

  // 페이지 네비게이션 대기
  await page.waitForNavigation();

  // 비밀번호 입력 필드 기다리기
  await page.waitForSelector(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    { visible: true }
  );

  // 비밀번호 입력
  await page.type(
    'input.mantine-Input-input.mantine-TextInput-input.mantine-p2wiva',
    password
  );

  // 패스워드 버튼 클릭
  await page.click('button.mantine-UnstyledButton-root');

  await page.waitForNavigation();

  await page.waitForSelector(
    'div.favorite-container > div:nth-child(4) a.menu.office',
    { visible: true }
  );

  await page.click('div.favorite-container > div:nth-child(4) a.menu.office');

  await page.waitForNavigation();

  await page.waitForSelector('ul.division-list > li:nth-child(1) button', {
    visible: true
  });

  await page.click('ul.division-list > li:nth-child(2) button');

  page.on('dialog', async (dialog) => {
    await dialog.accept();
    // await dialog.dismiss();
  });

  // await browser.close();
}
