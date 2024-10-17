<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import browser from 'webextension-polyfill'
import {ProblemData, MetaData, SolutionInfo, SolutionStatus} from "~/types/problemData";
const memo = ref('')
const isRef = ref(false)
const title = ref('')
const number = ref('')
const state = ref('')
const isCorrect = ref('')
const color = ref('#000000')
let metaData:MetaData | null = null; // 전역 변수로 선언
let platform:string = ''

browser.storage.local.get().then((item) => {
  title.value = item.popupData.title
  number.value = item.popupData.number
  state.value = item.popupData.state

  if(parseInt(state.value) <= 100){
    state.value = ' 틀렸습니다 '
    isCorrect.value = '오답'
    color.value = '#ff0000'
  }
  else if(state.value === '100.0'){
    state.value = ' 맞았습니다 '
    isCorrect.value = '정답'
    color.value = '#00992B'
  }
}).catch((error) => {
    console.log(`Error: ${error}`)
  })

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'sendPopup') {
    metaData = message.data.bojData;
    platform = message.data.flatform.toUpperCase();

    sendResponse('data match!');
  }
});

function saveData() {
  if(metaData){
    const problemData:ProblemData = {
      problemCreateRequest: {
        number: parseInt(metaData.problemId),
        title: metaData.title,
        content: metaData.problem_description,
        url: metaData.problemLink,
        difficulty: metaData.levelWithLv,
        platform: platform,
        algorithms: ["none"]
      },
      memo: memo.value || "",
      description: 'no', // 사용자 오답 기록
      status: isCorrect.value ? SolutionStatus.CORRECT : SolutionStatus.INCORRECT,
    };

    const problemCode: SolutionInfo = {
      content: metaData.code,
      language: metaData.language.toUpperCase(),
      description: `이 문제는 ${metaData.title} 문제의 솔루션입니다.`,
      status: isCorrect.value ? SolutionStatus.CORRECT : SolutionStatus.INCORRECT,
      memory: parseFloat(metaData.memory),
      time: parseFloat(metaData.runtime),
      submitAt: metaData.dateInfo,
    };

    postData(problemData, problemCode);
    memo.value = ''
  }
  else{
    console.log('metaData가 없습니다.')
  }
}

const baseUrl = 'http://localhost:8080/api/v1'
const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0IiwiaWF0IjoxNzI5MTA2NDAyLCJleHAiOjE3MjkxNDk2MDJ9.wzUmO0OaVDcQ_c45CBVEmbRgJ3muwWWkDAVdrFsIVlI'
function postData(problemRequest:ProblemData, problemCode:SolutionInfo) {
  axios.post(`${baseUrl}/boards`, problemRequest, {
    headers:{
      authorization:`Bearer ${token}`
    }
  }).then((response) => {
    const boardId = response.data.data.id;
    return postSolutions(problemCode, boardId);
  }).then(() => {
    browser.windows.getCurrent().then((window) => {
      if (window?.id) {
        browser.windows.remove(window.id);
      }
    }).catch((error) => {
      console.error("창 닫는 중 오류 발생:", error);
    });
  }).catch((error) => {
    console.error("데이터 전송 중 오류 발생:", error);
  });
}

function postSolutions(problemCode:SolutionInfo, boardId:number) {
  axios.post(`${baseUrl}/solutions/${boardId}`, problemCode, {
    headers:{
      authorization:`Bearer ${token}`
    }
  });
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
      <span class="cursor-pointer break-words font-medium text-[12px] hover:font-700" @click="saveData"> 저장하기 </span>
    </div>
  </div>
</template>
