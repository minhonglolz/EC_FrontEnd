<template>
  <div class="container-fluid">
    <nav>
      <ul>
        <li
          v-for="(items, index) in classifyList"
          :key="index"
          @click="classifyHandler(items.classify)"
        >
          {{ items.classify }}
        </li>
      </ul>
    </nav>
    <div class="loadingTime"></div>
    <div class="row appContent">
      <div class="navbar col">
        <div class="watchmark">{{ nowintroduction.watchmark }}</div>
        <div class="bookmark">
          <div class="bookmark-circle">{{ currentpage.title }}</div>
          <div class="bookmark-text">{{ currentpage.text }}</div>
        </div>
        <ul>
          <li
            v-for="(items, index) in introduction"
            :key="index"
            @click="clickHandler(index)"
            v-on:mouseover="mousehoverHandload(index)"
            v-show="items.classify === currentClassify"
          >
            <router-link :to="items.url"
              >{{ items.title }}
              <transition name="fade">
                <ul v-show="currentpage.text === 'Sentence'">
                  <li
                    class="subItem"
                    v-for="(sub, index) in items.sub"
                    :key="index"
                  >
                    <router-link :to="sub.url">{{ sub.title }}</router-link>
                  </li>
                </ul>
              </transition>
            </router-link>
          </li>
          <li><a href="https://sels.nkfust.edu.tw/userindex">BackEnd</a></li>
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
      currentClassify: "Learn",
      currentpage: {
        title: "H",
        text: "Home",
      },
      classifyList: [
        {
          classify: "Learn",
        },
        {
          classify: "Review",
        },
        {
          classify: "Test",
        },
      ],
      nowintroduction: {
        watchmark: "H",
        url: "/Home",
        title: "Home",
        content: "Hello!! Welcome to learn English website.",
        sub: [],
        classify: "Learn",
      },
      introduction: [
        {
          watchmark: "H",
          url: "/Home",
          title: "Home",
          content: "Hello!! Welcome to learn English website.",
          sub: [],
          classify: "Learn",
        },
        {
          watchmark: "LS",
          url: "/EnglishChatbot",
          title: "Listen & Speak",
          content:
            "透過和English chatbot對答的方式練習英語聽力及發音根據使用者的英語聽說能力給予最合適的練習語句",
          sub: [],
          classify: "Learn",
        },
        {
          watchmark: "EX",
          url: "/Exercise",
          title: "Exercise",
          content: "Exercise",
          sub: [],
          classify: "Learn",
        },
        {
          watchmark: "T",
          url: "/Translate",
          title: "Translate",
          content:
            "提供中英轉換的翻譯功能且支援語音輸入將使用者輸入的文本翻譯為對應的語言",
          sub: [],
          classify: "Learn",
        },
        {
          watchmark: "V",
          url: "/Vocabulary",
          title: "Vocabulary",
          content:
            "提供查詢單字的功能內容包括音標、例句、同義詞、上位詞和下為詞等資訊",
          sub: [],
          classify: "Learn",
        },
        {
          watchmark: "S",
          url: "/",
          title: "Sentence",
          content: `Practice:提供隨機100句句子，可播放語音、翻譯中文<br/>
          Browsing:可以瀏覽所有已收錄句子，分類為Topics, Level
          `,
          classify: "Learn",
          sub: [
            {
              watchmark: "P",
              url: "/Sentence",
              title: "Practice",
            },
            {
              watchmark: "B",
              url: "/Topics",
              title: "Browsing",
            },
          ],
        },
      ],
    };
  },
  methods: {
    classifyHandler(value) {
      this.currentClassify = value;
    },
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
