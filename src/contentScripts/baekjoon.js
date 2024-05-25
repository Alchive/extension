/* eslint-disable no-unused-vars */
// communication example: send previous tab title from background page
import browser from 'webextension-polyfill'

// browser.runtime.onMessage.addListener('tab-prev', ({ data }) => {
//   console.log(`[vitesse-webext] Navigate from page "${data}"`)
//   return Promise.resolve({ response: 'Hi from content script' })
// })

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // const { type, tabId } = request

  if (request.type === 'tab-prev') {
    console.log('hi', sender)
    sendResponse({ farewell: 'goodbye' })
  }

  else { return false }
})

// /**
//  * escape된 문자열을 unescape하여 반환합니다.
//  * @param {string} text - unescape할 문자열
//  * @returns {string} - unescape된 문자열
//  */

/**
 * url에 해당하는 html 문서를 가져오는 함수
 * @param url: url 주소
 * @returns html document
 */
/*
  문제 제출 맞음 여부를 확인하는 함수
  2초마다 문제를 파싱하여 확인
*/
let loader

const currentUrl = window.location.href
let flatform = ''
// 프로그래머스 연습 문제 주소임을 확인하고, 맞다면 로더를 실행
if (currentUrl.includes('/learn/courses/30') && currentUrl.includes('lessons'))
  flatform = 'programmers'
  startLoader(flatform)

function startLoader(flatform) {
  loader = setInterval(async () => {
    // 기능 Off시 작동하지 않도록 함
    // const enable = await checkEnable()
    // if (!enable) {
    //   stopLoader()
    // }
    // 제출 후 채점하기 결과가 성공적으로 나왔다면 코드를 파싱하고, 업로드를 시작한다
    // if (getSolvedResult().includes('정답')) {
    //   console.log('문제를 풀이했습니다.')
    //   stopLoader()
    //   try {
    //     const bojData = await parseData()
    //     console.log('데이터 추출', bojData)
    //     // await beginUpload(bojData)
    //   }
    //   catch (error) {
    //     console.log(error)
    //   }
    // }
    if (getSolvedResult()) {
      stopLoader()
      try {
        const bojData = await parseData()
        // const popupData = { title: bojData.title, number: bojData.problemId, state: bojData.result_message }
        await sendDataToBackground({bojData, flatform})
        // await sendDataToPopup({bojData, flatform})
        // await sendDataToPopup(popupData)
        // await browser.runtime.sendMessage('openPopup')
        console.log('데이터 추출', bojData)
        // await beginUpload(bojData)
      }
      catch (error) {
        console.log(error)
      }
    }
  }, 2000)
}

function stopLoader() {
  clearInterval(loader)
}

function getSolvedResult() {
  const result = document.querySelector('div.modal-header > h4')
  console.log('정답 문구', result)
  if (result)
    return result.innerText
  return ''
}

/* 파싱 직후 실행되는 함수 깃에 업로드 */
// async function beginUpload(bojData) {
//   console.log('bojData', bojData)
//   if (isNotEmpty(bojData)) {
//     startUpload()
//
//     const stats = await getStats()
//     const hook = await getHook()
//
//     const currentVersion = stats.version
//     /* 버전 차이가 발생하거나, 해당 hook에 대한 데이터가 없는 경우 localstorage의 Stats 값을 업데이트하고, version을 최신으로 변경한다 */
//     if (isNull(currentVersion) || currentVersion !== getVersion() || isNull(await getStatsSHAfromPath(hook)))
//       await versionUpdate()
//
//     /* 현재 제출하려는 소스코드가 기존 업로드한 내용과 같다면 중지 */
//     cachedSHA = await getStatsSHAfromPath(`${hook}/${bojData.directory}/${bojData.fileName}`)
//     calcSHA = calculateBlobSHA(bojData.code)
//     log('cachedSHA', cachedSHA, 'calcSHA', calcSHA)
//     if (cachedSHA === calcSHA) {
//       markUploadedCSS(stats.branches, bojData.directory)
//       console.log(`현재 제출번호를 업로드한 기록이 있습니다. problemIdID ${bojData.problemId}`)
//       return
//     }
//     /* 신규 제출 번호라면 새롭게 커밋  */
//     await uploadOneSolveProblemOnGit(bojData, markUploadedCSS)
//   }
// }
//
// async function versionUpdate() {
//   log('start versionUpdate')
//   const stats = await updateLocalStorageStats()
//   // update version.
//   stats.version = getVersion()
//   await saveStats(stats)
//   log('stats updated.', stats)
// }

// /* TODO: 하나의 데이터만 가져오는 구조이므로 page를 계속적으로
//   아래 있는 네이베이션바의 "다음"버튼이 비활성화 될때까지 반복으로 진행한다.
//   진행하며 존재하는 알고리즘 카드인 div.col-item > div.card-algorithm > a 의 href 속성값을 가져와 리스트화하고,
//   이를 차후 fetch GET를 진행하여 작성한 알고리즘을 가져와 github에 업로드를 진행한다.
//   */
// function get_all_problems() {}

// findHtmlDocumentByUrl('https://school.programmers.co.kr/learn/courses/30/lessons/301647')
// async function findHtmlDocumentByUrl(currentUrl) {
//   return fetch(currentUrl, { method: 'GET' })
//     .then(html => html.text())
//     .then((text) => {
//       const parser = new DOMParser()
//       const document = parser.parseFromString(text, 'text/html')
//       console.log('findHtmlDocumentByUrl', document)
//       // parseData(document)
//       return document
//     })
// }

/*
  문제가 맞았다면 문제 관련 데이터를 파싱하는 함수의 모음입니다.
  모든 해당 파일의 모든 함수는 parseData()를 통해 호출됩니다.
*/

/*
  bojData를 초기화하는 함수로 문제 요약과 코드를 파싱합니다.
  - directory : 레포에 기록될 폴더명
  - message : 커밋 메시지
  - fileName : 파일명
  - readme : README.md에 작성할 내용
  - code : 소스코드 내용
*/
// 백준 문제 데이터 파싱하기
function convertSingleCharToDoubleChar(text) {
  // singleChar to doubleChar mapping
  const map = {
    '!': '！',
    '%': '％',
    '&': '＆',
    '(': '（',
    ')': '）',
    '*': '＊',
    '+': '＋',
    ',': '，',
    '-': '－',
    '.': '．',
    '/': '／',
    ':': '：',
    ';': '；',
    '<': '＜',
    '=': '＝',
    '>': '＞',
    '?': '？',
    '@': '＠',
    '[': '［',
    '\\': '＼',
    ']': '］',
    '^': '＾',
    '_': '＿',
    '`': '｀',
    '{': '｛',
    '|': '｜',
    '}': '｝',
    '~': '～',
    ' ': ' ', // 공백만 전각문자가 아닌 FOUR-PER-EM SPACE로 변환
  }
  return text.replace(/[!%&()*+,\-./:;<=>?@[\]^_`{|}~ ]/g, (m) => {
    return map[m]
  })
}

// util.js
function getDateString(date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`
}
async function parseData() {
  const link = document.querySelector('head > meta[name$=url]').content.replace(/\?.*/g, '').trim()
  const problemId = document.querySelector('div.main > div.lesson-content').getAttribute('data-lesson-id')
  const level = document.querySelector('body > div.main > div.lesson-content').getAttribute('data-challenge-level')
  const division = [...document.querySelector('ol.breadcrumb').childNodes]
    .filter(x => x.className !== 'active')
    .map(x => x.innerText)
  // .filter((x) => !x.includes('코딩테스트'))
    .map(x => convertSingleCharToDoubleChar(x))
    .reduce((a, b) => `${a}/${b}`)
  const title = document.querySelector('.algorithm-title .challenge-title').textContent.replace(/\\n/g, '').trim()
  const problem_description = document.querySelector('div.guide-section-description > div.markdown').innerHTML
  const language_extension = document.querySelector('div.editor > ul > li.nav-item > a').innerText.split('.')[1]
  const code = document.querySelector('textarea#code').value || ''
  const result_message
      = [...document.querySelectorAll('#output .console-message')]
        .map(node => node.textContent)
        .filter(text => text.includes(':'))
        .reduce((cur, next) => (cur ? `${cur},${next}` : next), '') || 'Empty'
  const [runtime, memory] = [...document.querySelectorAll('td.result.passed')]
    .map(x => x.innerText)
    .map(x => x.replace(/[^., 0-9a-zA-Z]/g, '').trim())
    .map(x => x.split(', '))
    .reduce((x, y) => (Number(x[0]) > Number(y[0]) ? x : y), ['0.00ms', '0.0MB'])
    .map(x => x.replace(/(?<=[0-9])(?=[A-Za-z])/, ' '))

  /* 프로그래밍 언어별 폴더 정리 옵션을 위한 언어 값 가져오기 */
  const language = document.querySelector('div#tour7 > button').textContent.trim()

  return makeData({ link, problemId, level, title, problem_description, division, language_extension, code, result_message, runtime, memory, language })
}

async function makeData(origin) {
  const { link, problem_description, problemId, level, result_message, division, language_extension, title, runtime, memory, code, language } = origin
  // const directory = await getDirNameByOrgOption(`프로그래머스/${level}/${problemId}.${convertSingleCharToDoubleChar(title)}`, language)
  const levelWithLv = `${level}`.includes('lv') ? level : `lv${level}`.replace('lv', 'Lv.')
  const message = `[${levelWithLv}] Title: ${title}, Time: ${runtime}, Memory: ${memory} -BaekjoonHub`
  // const fileName = `${convertSingleCharToDoubleChar(title)}.${language_extension}`
  const dateInfo = getDateString(new Date(Date.now()))
  // result_message에서 score 추출
  const startIndex = result_message.indexOf('합계: ') + 4
  const endIndex = result_message.indexOf(' /')
  const score = result_message.substring(startIndex, endIndex)
  let problemLink = link;
  console.log(link)
  if (link.includes('programmers')){
    console.log('link transforming..')
    problemLink = `${link}learn/courses/30/lessons/${problemId}`;
  }

  // prettier-ignore
  // const readme
  //     = `# [${levelWithLv}] ${title} - ${problemId} \n\n`
  //     + `[문제 링크](${link}) \n\n`
  //     + `### 성능 요약\n\n`
  //     + `메모리: ${memory}, `
  //     + `시간: ${runtime}\n\n`
  //     + `### 구분\n\n`
  //     + `${division.replace('/', ' > ')}\n\n`
  //     + `### 채점결과\n\n`
  //     + `${result_message}\n\n`
  //     + `### 제출 일자\n\n`
  //     + `${dateInfo}\n\n`
  //     + `### 문제 설명\n\n`
  //     + `${problem_description}\n\n`
  //     + `> 출처: 프로그래머스 코딩 테스트 연습, https://school.programmers.co.kr/learn/challenges`
  return { problemLink, title, problemId, problem_description, levelWithLv, score, dateInfo, code, memory, runtime, language }
}

function sendDataToBackground(data) {
  browser.runtime.sendMessage({ type: 'sendProblemData', data }).then((message) => {
    console.log('sendDataToBackground 응답:', message)
  }).catch((error) => {
    console.error('Error sending message:', error)
  })
}

// function sendDataToPopup(data){
//   browser.runtime.sendMessage({ type: 'sendDataToPopup', data }).then((message) => {
//     console.log('보내는 data',data)
//     console.log('sendDataToPopup 응답:', message)
//   }).catch((error) => {
//     console.error('Error sending message:', error)
//   })
// }