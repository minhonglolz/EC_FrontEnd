<template>
  <div class="container-fluid">
    <div class="loadingTime"></div>
    <div class="row">
      <div class="navbar col">
        <div class="watchmark">{{ nowintroduction.watchmark }}</div>
        <div class="bookmark">
          <div class="bookmark-circle">{{ currentpage.title }}</div>
          <div class="bookmark-text">{{ currentpage.text }}</div>
        </div>
        <ul class="pb-5">
          <li @click="clickHandler(0)" v-on:mouseover="mousehoverHandload(0)">
            <router-link :to="'/Home'">Home</router-link>
          </li>
          <li @click="clickHandler(1)" v-on:mouseover="mousehoverHandload(1)">
            <router-link :to="'/EnglishChatbot'">Listen & Speak</router-link>
          </li>
          <li @click="clickHandler(2)" v-on:mouseover="mousehoverHandload(2)">
            <router-link :to="'/Translate'">Translate</router-link>
          </li>
          <li @click="clickHandler(3)" v-on:mouseover="mousehoverHandload(3)">
            <router-link :to="'/Vocabulary'">Vocabulary</router-link>
          </li>
          <li @click="clickHandler(4)" v-on:mouseover="mousehoverHandload(4)">
            <router-link :to="'/sentence'">Sentence</router-link>
          </li>
          <li @click="clickHandler(5)" v-on:mouseover="mousehoverHandload(5)">
            <router-link :to="'/Topic'">Topic</router-link>
          </li>
          <li>
            <a
              @click="clickHandler(6)"
              v-on:mouseover="mousehoverHandload(6)"
              href="https://sels.nkfust.edu.tw/userindex"
              >Backend</a
            >
          </li>
        </ul>
      </div>
      <router-view
        :title="nowintroduction.title"
        :content="nowintroduction.content"
      />
    </div>
  </div>
</template>

<script>
window.onload = function () {
  var loadTime =
    window.performance.timing.domContentLoadedEventEnd -
    window.performance.timing.navigationStart;
  document.querySelector(".loadingTime").innerHTML =
    "Page load time is " + loadTime / 1000 + "s";
};
import Home from "./components/Home";
export default {
  name: "App",
  data() {
    return {
      msg: "sss",
      currentpage: {
        title: "H",
        text: "Home",
      },
      nowintroduction: {
        watchmark: "H",
        title: "Home",
        content: "Hello!! Welcome to learn English website.",
      },
      introduction: [
        {
          watchmark: "H",
          title: "Home",
          content: "Hello!! Welcome to learn English website.",
        },
        {
          watchmark: "LS",
          title: "Listen & Speak",
          content:
            "透過和English chatbot對答的方式練習英語聽力及發音根據使用者的英語聽說能力給予最合適的練習語句",
        },
        {
          watchmark: "T",
          title: "Translate",
          content:
            "提供中英轉換的翻譯功能且支援語音輸入將使用者輸入的文本翻譯為對應的語言",
        },
        {
          watchmark: "V",
          title: "Vocabulary",
          content:
            "提供查詢單字的功能內容包括音標、例句、同義詞、上位詞和下為詞等資訊",
        },
        {
          watchmark: "S",
          title: "Sentence",
          content: "提供隨機100句句子，可播放語音、翻譯中文",
        },
        {
          watchmark: "TC",
          title: "Topic",
          content: "Topic",
        },
        {
          watchmark: "B",
          title: "Backend",
          content: "使用者可以由此查看更多更詳細的後端分析資訊",
        },
      ],
    };
  },
  methods: {
    mousehoverHandload(value) {
      this.nowintroduction.watchmark = this.introduction[value].watchmark;
      this.nowintroduction.title = this.introduction[value].title;
      this.nowintroduction.content = this.introduction[value].content;
    },
    clickHandler(value) {
      this.currentpage.title = this.introduction[value].watchmark;
      this.currentpage.text = this.introduction[value].title;
    },
  },
  computed: {},
  components: {
    Home,
  },
};
</script>

<style>
@import "bootstrap";
@import "./assets/css/style.css";
@import "./assets/css/chatbot.css";
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
