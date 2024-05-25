import browser from 'webextension-polyfill'
// import {MetaData} from "~/types/problemData";
// import { onMessage } from 'webext-bridge/background'
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
    console.log('메세지 받음')
    // 지금은 이렇게 페이지가 열리지만 나중에는 option.html활용해서 플로팅버튼 누르는 이벤트 발생시켜서 저장페이지 띄워지도록..?
    // browser.windows.create({
    //   url: '../dist/popup/index.html',
    //   type: 'popup',
    //   height: 290,
    //   width: 300,
    //   top: 100,
    //   left: 1300,
    // })
  }
  else if (message.type === 'sendProblemData') {
    // eslint-disable-next-line no-console
    console.log('sendProblemData 받음', message.data)
    const postData = message.data
    const data = message.data.bojData
    // const flatform = message.data.flatform

    const popupData = {
      title: data.title,
      number: data.problemId,
      state: data.score,
    }

    // popup페이지에서 데이터들을 동적으로 나태내기위해 저장
    browser.storage.local.set({ popupData }).then(() => {
      console.log('OK', popupData)
    })
      .catch((error) => {
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
        // console.log(postData)
        if (window && window.id) {
          // 팝업 창이 열려 있는 경우 0.1초 뒤에 메세지를 보냄
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
    console.log('background->popup으로 보낸 후 응답', message);
  }).catch((error: string) => {
    console.error('background->popup sending error:', error);
  });
}
// async function fetchProblemDescriptionById(problemId: number) {
//   return fetch(`https://www.acmicpc.net/problem/${problemId}`)
//     .then(res => res.text())
//     .then((html) => {
//       const doc = new DOMParser().parseFromString(html, 'text/html')
//       // console.log(doc)
//       return (doc)
//     })
// }

// Error fetching problem description: TypeError: Cannot read properties of undefined (reading 'fingerprint')
// async function fetchProblemDescriptionById(problemId: number) {
//   try {
//     // 웹페이지의 HTML을 가져오기
//     const response = await fetch(`https://www.acmicpc.net/problem/${problemId}`)
//     const html = await response.json()
//     console.log('?')
//     console.log(response.json())
//
//     // content script로 HTML을 전달
//     const result = await sendMessage('parse-html', { html })
//     return result
//   }
//   catch (error) {
//     console.error('Error fetching problem description:', error)
//     throw error
//   }
// }
// browser.tabs.onActivated.addListener(() => {
//   browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//     const tab = tabs[0]
//     // eslint-disable-next-line no-console
//     console.log(tab)
//     if (tab && tab.id) {
//       // console.log('tabId', tab.id)
//       // Change the problemId value to the appropriate problem ID
//       const problemId = 17828
//
//       fetchProblemDescriptionById(problemId).then((doc) => {
//         // Do something with the fetched problem description
//         // eslint-disable-next-line no-console
//         console.log('doc:', doc)
//       }).catch((error) => {
//         console.error('Error fetching problem description:', error)
//       })
//     }
//   })
// })

// let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
// browser.tabs.onActivated.addListener(async ({ tabId }) => {
//   if (!previousTabId) {
//     previousTabId = tabId
//     return
//   }
//
//   // let tab: Tabs.Tab
//
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     previousTabId = tabId
//   }
//   catch {
//     return
//   }

//   browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//     const tab = tabs[0]

//     console.log('currentTab', tab)
//     if (tab && tab.id) {

//       console.log('tabId', tab.id)
//       Change the problemId value to the appropriate problem ID
//       const problemId = 17828
//
//       fetchProblemDescriptionById(problemId).then((doc) => {
//         // Do something with the fetched problem description
//         // eslint-disable-next-line no-console
//         console.log('doc:', doc)
//       }).catch((error) => {
//         console.error('Error fetching problem description:', error)
//       })
//     }
//     const response = browser.tabs.sendMessage(tab.id, { type: 'tab-prev' })
//     console.log('Message from the content script:', response)
//     const response = await chrome.tabs.sendMessage(tab.id, { greeting: 'hello' })
//   })
//
//   console.log('previous tab', tab)
//   sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
//   const tabURL = tab.url
// })
//
// onMessage('get-current-tab', async () => {
//   try {
//     const tab = await browser.tabs.get(previousTabId)
//     return {
//       title: tab?.title,
//     }
//   }
//   catch {
//     return {
//       title: undefined,
//     }
//   }
// })
