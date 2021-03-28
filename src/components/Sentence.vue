<template>
  <div class="showoff col">
    <div class="prompt">
      <i class="fas fa-mouse"></i>
      <p>點擊卡片切換中文</p>
    </div>
    <div class="sentencebox vld-parent" ref="loadingContainer">
      <div class="sentence" @click.self="show = !show">
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
      isLoading: false,
      mode: "out-in",
      synth: window.speechSynthesis, //機器人語音
      userSpeech: new window.SpeechSynthesisUtterance(), //機器人語音
      show: true,
      isShow: true,
      SentencesList: [],
      ChiSentence: "",
      CurrentSentence: 0,
      EngFormData: new FormData(),
    };
  },
  created() {
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
    window.speechSynthesis.cancel();
  },
  computed: {
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
    Nexthandler() {
      this.CurrentSentence += 1;
    },
    Previoushandler() {
      this.CurrentSentence -= 1;
    },
    SentenceSpeaker() {
      window.speechSynthesis.cancel();
      this.userSpeech.text = this.SentencesList[this.CurrentSentence];
      this.userSpeech.lang = "en-US"; //語音撥放語言
      this.userSpeech.rate = 0.6; //語音速度
      this.synth.speak(this.userSpeech); //播放
    },
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
