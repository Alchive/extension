<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import browser from 'webextension-polyfill'
import {Problem, MetaData} from "~/types/problemData";
const memo = ref('')
const isRef = ref(false)
const title = ref('')
const number = ref('')
const state = ref('')
const isCorrect = ref(false)
const color = ref('#000000')
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzE2MTIyMTE1LCJleHAiOjE3MTYxNjUzMTV9.NmHsixqLDFSuwp-dTCBdFD_FIzAytUyim3udQk_9q1Q'
let metaData:MetaData | null = null; // 전역 변수로 선언
let platform:string = ''


browser.storage.local.get().then((item) => {
  console.log('스토리지 값', item.popupData)

  title.value = item.popupData.title
  number.value = item.popupData.number
  state.value = item.popupData.state

  if(parseInt(state.value) <= 100){
    state.value = ' 틀렸습니다 '
    isCorrect.value = false
    color.value = '#ff0000'
  }
  else if(state.value === '100.0'){
    state.value = ' 맞았습니다 '
    isCorrect.value = true
    color.value = '#00992B'
  }
}).catch((error) => {
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

// document.addEventListener('DOMContentLoaded', function() {
//   // 팝업이 로드된 후에 메시지를 수신하는 이벤트 핸들러를 설정합니다.
//   browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === 'sendPopup') {
//       console.log('popup에 도착:', message.data)
//       // 팝업으로부터 받은 데이터 처리
//       sendResponse('data match!')
//     }
//   });
// });

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'sendPopup') {
    metaData = message.data.bojData
    platform = message.data.flatform
    console.log("background부터 온 데이터",metaData)
    sendResponse('data match!')
  }
});

// let problemNumber:number
function saveData() {
  if(metaData){
    const problemData: Problem = {
      problemNumber: parseInt(metaData.problemId),
      problemTitle: metaData.title,
      problemUrl: metaData.problemLink,
      problemDescription: metaData.problem_description,
      problemDifficulty: metaData.levelWithLv,
      problemPlatform: platform,
      algorithmNames: ["Algorithm1"],
      problemMemo: memo.value,
      problemState: state.value,
      solutionInfo:{
        content: "?",
        code: metaData.code,
        codeLanguage: metaData.language,
        codeCorrect: isCorrect.value,
        codeMemory: metaData.memory,
        codeTime: metaData.runtime
      }

    };
    console.log(problemData)
    postData(problemData)
    memo.value = ''
    //popup 닫기
    // return data
  }
  else{
    console.log('metaData가 없습니다.')
  }
}
const baseUrl = 'http://localhost:8080/api/v1'

function postData(problemRequest:Problem) {
  axios.post(`${baseUrl}/problems/submit`, problemRequest, {
    headers:{
      authorization:`Bearer+ ${token}`
    }
  }).then((response) => {
    console.log(response)
    browser.windows.getCurrent().then((window) => {
      if (window) {
        const windowId = window.id as number;
        console.log('현재 창',windowId)
        browser.windows.remove(windowId);
      } else {
        console.log('현재 창을 찾을 수 없습니다.');
      }
    }).catch((error) => {
      console.error('창을 가져오는 중 오류 발생:', error);
    });
  }).catch((error: Error) => {
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
    <div class="inline-block font-black text-[25px] text-[#004AB9]" @click="openMainPage()">
      <router-link to="/main">
        Alchive
      </router-link>
    </div>
    <div class="mt-[12px] mb-[12px] w-[100%] border-t-[1.5px] border-[#EEEEEE] border-solid" />
    <div class="m-[0_0_12px_0] flex flex-row justify-between w-[100%] box-sizing-border">
      <div class="inline-block break-words font-semibold text-[12px]" :style="{ color: color }">
        {{ number }}. {{ title }}
      </div>
      <div
        class="shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[5px] bg-[#EEEEEE] flex flex-row justify-center p-[2px_3px] box-sizing-border"
      >
        <span class="break-words font-semibold text-[10px] " :style="{ color: color }"> {{ state }} </span>
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
      class="shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] rounded-[5px] hover:text-[#004AB9]  bg-[#EEEEEE] flex flex-row text-[#2F2F2F] justify-center mt-1 p-[4px_14px] box-sizing-border"
    >
      <span class="cursor-pointer break-words font-medium text-[12px] hover:font-700" @click="saveData()"> 저장하기 </span>
    </div>
  </div>
</template>
