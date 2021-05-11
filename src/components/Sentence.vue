<template>
  <div class="showoff col">
    <div class="prompt">
      <button @click.self="show = !show" class="sent-button model-button mb-2">
        <i class="fas fa-mouse"></i> 中/英轉換
      </button>
    </div>
    <div class="sentencebox vld-parent" ref="loadingContainer">
      <div class="sentence">
        <transition name="fade" mode="out-in">
          <template>
            <h4 key="Eng" v-if="show">
              {{ SentencesList[CurrentSentence] }}
            </h4>
            <h4 key="Chi" v-else>{{ ChiSentence }}</h4>
          </template>
        </transition>
      </div>
    </div>

    <div class="SentenceBtnBar">
      <button
        @click="Previoushandler(), TranslateHandler()"
        :disabled="PreviousDisableHandler"
      >
        <i class="fas fa-caret-left"></i>
      </button>
      <p class="CurrentNumber">
        {{ CurrentSentence + 1 }} / {{ SentencesList.length }}
      </p>
      <button
        @click="Nexthandler(), TranslateHandler()"
        :disabled="NextDisableHandler"
      >
        <i class="fas fa-caret-right"></i>
      </button>
      <div @click="SentenceSpeaker" class="SpeakerBtn">
        <i class="fas fa-volume-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Translate from "./Translate.vue";
import Vue from "vue";
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);
export default {
  components: { Translate },
  name: "Sentence",
  data() {
    return {
      isLoading: false, //Loading畫面是否顯示
      mode: "out-in", //vue動畫模式
      synth: window.speechSynthesis, //機器人語音
      userSpeech: new window.SpeechSynthesisUtterance(), //機器人語音
      show: true, //切換顯示中文或英文
      SentencesList: [], //一開始和api拿100句陣列
      ChiSentence: "", //英文句子翻譯成中文
      CurrentSentence: 0, //顯示目前句子在第幾句
      EngFormData: new FormData(), //api
    };
  },
  created() {
    //文件參考 https://github.com/ankurk91/vue-loading-overlay
    let loader = this.$loading.show({
      // Optional parameters
      canCancel: false,
      color: "#0984e3",
      loader: "dots", //spinner/dots/bars
      width: 50,
      height: 50,
      backgroundColor: "#ffffff",
      isFullPage: false,
      container: this.$refs.loadingContainer,
      opacity: 0.5,
    });
    this.axios
      .post("https://sels.nkfust.edu.tw/getRandSent")
      .then((response) => {
        loader.hide();
        this.SentencesList = [...response.data.data];
        this.EngFormData.set(
          "sent_input",
          this.SentencesList[this.CurrentSentence]
        );
        this.axios
          .post("https://sels.nkfust.edu.tw/sent_translate", this.EngFormData)
          .then((response) => {
            this.ChiSentence = response.data.translate;
          });
      });
  },
  mounted() {
    //每次載入時取消語音播放
    window.speechSynthesis.cancel();
  },
  computed: {
    //檢查按鈕是否顯示
    NextDisableHandler() {
      if (this.CurrentSentence < 99) {
        return (this.NextBtnDisable = false);
      } else {
        return (this.NextBtnDisable = true);
      }
    },
    PreviousDisableHandler() {
      if (this.CurrentSentence > 0) {
        return (this.PreviousBtnDisable = false);
      } else {
        return (this.PreviousBtnDisable = true);
      }
    },
  },
  methods: {
    //下一句按鈕
    Nexthandler() {
      this.CurrentSentence += 1;
    },
    //上一句按鈕
    Previoushandler() {
      this.CurrentSentence -= 1;
    },
    //語音機器人播放
    SentenceSpeaker() {
      window.speechSynthesis.cancel();
      this.userSpeech.text = this.SentencesList[this.CurrentSentence];
      this.userSpeech.lang = "en-US"; //語音撥放語言
      this.userSpeech.rate = 0.6; //語音速度
      this.synth.speak(this.userSpeech); //播放
    },
    //翻譯api
    TranslateHandler() {
      this.EngFormData.set(
        "sent_input",
        this.SentencesList[this.CurrentSentence]
      );
      this.axios
        .post("https://sels.nkfust.edu.tw/sent_translate", this.EngFormData)
        .then((response) => {
          this.ChiSentence = response.data.translate;
        });
    },
  },
};
</script>
