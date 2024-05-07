<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import browser from 'webextension-polyfill'

const title = ref('')
const number = ref('')
const state = ref('')

browser.storage.local.get().then((item) => {
  console.log('스토리지 값', item.popupData)

  title.value = item.popupData.title
  number.value = item.popupData.number
  state.value = item.popupData.state

  if(state.value === '0.0'){
    state.value = ' 틀렸습니다 '
  }
  else if(state.value === '100.0'){
    state.value = ' 맞았습니다 '
  }
})
  .catch((error) => {
    console.log(`Error: ${error}`)
  })

// browser.storage.local.get(['title', 'number', 'state'])
//     .then((result) => {
//       title.value = result.title || ''
//       number.value = result.number || ''
//       state.value = result.state || ''
//     })
//     .catch((error) => {
//       console.error('스토리지에서 값 가져오는 중 오류 발생:', error)
//     })

console.log('storage 값', title, number, state)

// popup <-> background 통신 실패코드
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'sendDataToPopup') {
//     title.value = message.data.title
//     number.value = message.data.problemId
//     state.value = message.data.result_message
//
//     if (message.data) {
//       console.log('popup에 도착:', message.data)
//       sendResponse('data match!!')
//     }
//   }
// })
const memo = ref('')
const isRef = ref(false)

function onSave() {
  const algorithmnData = {
    problemNumber: 0,
    problemTitle: 'test',
    problemDifficulty: 'Lv1',
    problemPlatform: 'baekjoon',
    problemState: 'correct',
    algorithmName: ['DP', 'BFS'],
    codeContent: 'testest',
    codeCorrect: isRef.value,
    codeTime: '123',
    codeMemory: '123',
    memo: memo.value,
  }

  // eslint-disable-next-line no-console
  console.log(algorithmnData)

  const baseUrl = 'http://localhost:8080/api/v1'
  // post 요청
  // eslint-disable-next-line no-console
  console.log(algorithmnData)
  axios.post(`${baseUrl}/problems/submit`, algorithmnData)
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
    })
    .catch((error: Error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
}
function openMainPage() {
  browser.tabs.create({ url: 'http://localhost:5173/main' })
}

</script>

<template>
  <div
    class="shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] rounded-[10px] bg-[#FFFFFF] flex flex-col w-[300px] h-[257px] items-center p-[15px]"
  >
    <div class="inline-block font-black text-[25px] text-[#004AB9]" @click="openMainPage">
      <router-link to="/main">
        Alchive
      </router-link>
    </div>
    <div class="mt-[12px] mb-[12px] w-[100%] border-t-[1.5px] border-[#EEEEEE] border-solid" />
    <div class="m-[0_0_12px_0] flex flex-row justify-between w-[100%] box-sizing-border">
      <div class="inline-block break-words font-semibold text-[12px] text-[#00992B]">
        {{ number }}. {{ title }}
      </div>
      <div
        class="shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[5px] bg-[#EEEEEE] flex flex-row justify-center p-[2px_3px] box-sizing-border"
      >
        <span class="break-words font-semibold text-[10px] text-[#00992B]"> {{ state }} </span>
      </div>
    </div>
    <textarea
      v-model="memo"
      placeholder="메모를 입력하세요."
      class="focus:text-black resize-none shadow-[0px_0px_3px_0px_rgba(0,0,0,0.25)] rounded-[10px] bg-[#EEEEEE] m-[0_0_4px_0] px-3 py-2 w-[100%] h-[40%] box-sizing-border break-words font-medium text-[12px] text-[#A0A0A0]"
    />
    <div class="my-1 flex flex-row justify-between w-[100%] px-1 box-sizing-border">
      <div class="flex flex-row justify-center items-center box-sizing-border">
        <input
          id="Refcode"
          v-model="isRef"
          type="checkbox"
          class="w-[9px] h-[9px] mr-1 text-indigo-600 border-gray-300 rounded-sm focus:ring-indigo-500"
        >
        <label
          for="Refcode"
          class="break-words font-medium text-[10px] text-[#676767]"
        >
          참고한 코드인가요?
        </label>
      </div>
      <div class="break-words font-medium text-[10px] text-[#A0A0A0]">
        0/100
      </div>
    </div>
    <div
      class="shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[5px] bg-[#EEEEEE] flex flex-row justify-center mt-1 p-[4px_14px] box-sizing-border"
    >
      <span class="break-words font-medium text-[12px] text-[#2F2F2F]" @click="onSave"> 저장하기 </span>
    </div>
  </div>
</template>
