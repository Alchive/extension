import browser from 'webextension-polyfill'
// import { onMessage } from 'webext-bridge/background'
// only on dev mode

if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  // import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
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

    const popupData = {
      title: message.data.title,
      number: message.data.problemId,
      state: message.data.score,
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
      })
    }
  }
  sendResponse()
})

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
