import browser from 'webextension-polyfill'
// only on dev mode

if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  // import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener(async() => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
  // for (const cs of chrome.runtime.getManifest().content_scripts) {
  //   for (const tab of await chrome.tabs.query({url: cs.matches})) {
  //     if (tab.url.match(/(chrome|chrome-extension):\/\//gi)) {
  //       continue;
  //     }
  //     chrome.scripting.executeScript({
  //       files: cs.js,
  //       target: {tabId: tab.id, allFrames: cs.all_frames},
  //       injectImmediately: cs.run_at === 'document_start',
  //       // world: cs.world, // uncomment if you use it in manifest.json in Chrome 111+
  //     });
  //   }
  // }
})

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'openPopup') {
    console.log('');
  }
  else if (message.type === 'sendProblemData') {
    // eslint-disable-next-line no-console
    const postData = message.data
    const data = message.data.bojData
    // const flatform = message.data.flatform

    const popupData = {
      title: data.title,
      number: data.problemId,
      state: data.score,
    }

    browser.storage.local.set({ popupData }).then(() => {
      console.log('OK', popupData)
    }).catch((error) => {
        console.log(error)
    })

    // 데이터 저장 후 팝업 창 띄움
    if (popupData) {
      browser.windows.create({
        url: '../dist/popup/index.html',
        type: 'popup',
        height: 285,
        width: 300,
        top: 75,
        left: 1300,
      }).then((window) => {
        if (window && window.id) {
          setTimeout(() => {
            sendMessageToPopup(postData)
          }, 500);
        } else {
          console.error('팝업 창이 닫혔습니다.')
        }
      }).catch((error) => {
        console.error('팝업 열기 에러:', error)
      });
    }

    //API 통신
  }
  sendResponse()
})

// contentscript에서 받은 파일을 background로
const sendMessageToPopup = (data:any) =>{
  browser.runtime.sendMessage({ type: 'sendPopup', data }).then((message: string) => {
    // console.log('background->popup으로 보낸 후 응답', message);
  }).catch((error: string) => {
    // console.error('background->popup sending error:', error);
  });
}