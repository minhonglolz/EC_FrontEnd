<template>
  <div class="showoff col">
    <div class="translatebox">
      <div class="inputbox">
        <textarea
          @keydown="getTranslateDebounced"
          v-model.trim="inputbox"
          placeholder="Enter or paste sentence here."
        >
        </textarea>
        <button @click="clearInput" v-show="isShow" class="closeBtn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="outputbox">
        <textarea v-model="outputbox" readonly></textarea>
      </div>
      <div class="micbox">
        <button @click="micStart" v-if="micBtn">
          <i class="fas fa-microphone micStart"></i>
        </button>
        <button v-else>
          <i @click="micStop" class="fas fa-microphone micStop"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GrammarCheck",
  //資料狀態列
  data() {
    return {
      isShow: false, //清空文字按鈕
      micBtn: true, //麥克風按鈕
      inputbox: "",
      outputbox: "",
      EngFormData: new FormData(), //checkSentGrammar() api
      recognition: new window.webkitSpeechRecognition(), //語音辨識api
      runtimeTranscription_: "", //語音辨識產出結果
    };
  },
  // _.debounce用意防止過多次的api請求 https://lodash.com/ 文件參考
  created() {
    this.getTranslateDebounced = _.debounce(this.getTranslate, 400);
  },
  methods: {
    getTranslateDebounced() {},

    //清除textarea
    clearInput() {
      this.inputbox = "";
      this.outputbox = "";
      this.isShow = false;
    },

    //文法檢查api
    getTranslate() {
      if (this.inputbox !== "") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.EngFormData.set("sent-in", this.inputbox);
      this.axios
        .post("https://sels.nkfust.edu.tw/checkSentGrammar", this.EngFormData)
        .then((response) => {
          let data = response.data.data;
          if (data.checkedSent === this.inputbox) {
            this.outputbox = "No error !";
          } else {
            this.outputbox = data.checkedSent;
          }
        });
    },

    //麥克風開始監測
    micStart() {
      // initialisation of voicereco
      this.micBtn = !this.micBtn;
      this.recognition.lang = this.leftLang === "中文" ? "zh-tw" : "en-US";
      this.recognition.interimResults = true;

      // event current voice reco word
      this.recognition.addEventListener("result", (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        this.runtimeTranscription_ = text;
      });
      this.recognition.start();
    },

    //麥克風停止監測
    micStop() {
      this.recognition.stop();
      this.micBtn = !this.micBtn;
      this.isShow = true;
      this.inputbox = this.runtimeTranscription_;
      this.getTranslate();
      console.log("stop record");
    },
  },
};
</script>
