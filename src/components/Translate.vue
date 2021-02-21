<template>
  <div class="showoff col">
    <div class="translatebox">
      <div class="inputbox">
        <textarea
          @keydown="getTranslateDebounced"
          v-model.trim="inputbox"
          placeholder="Enter or paste text here"
        >
        </textarea>
        <button @click="clearInput" v-show="isShow" class="closeBtn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="exchangebox">
        <span>{{ leftLang }}</span>
        <button @click="TramslateChange">
          <i class="fas fa-exchange-alt"></i>
        </button>
        <span>{{ rightLang }}</span>
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
  name: "Translate",
  data() {
    return {
      isShow: false,
      micBtn: true,
      leftLang: "英文",
      rightLang: "中文",
      inputbox: "",
      outputbox: "",
      EngFormData: new FormData(),
      recognition: new window.webkitSpeechRecognition(),
      runtimeTranscription_: "",
    };
  },
  created() {
    this.getTranslateDebounced = _.debounce(this.getTranslate, 400);
  },
  methods: {
    getTranslateDebounced() {},
    clearInput() {
      this.inputbox = "";
      this.outputbox = "";
      this.isShow = false;
    },
    getTranslate() {
      if (this.inputbox !== "") {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.EngFormData.set("sent_input", this.inputbox);
      this.axios
        .post("https://sels.nkfust.edu.tw/sent_translate", this.EngFormData)
        .then((response) => {
          console.log(response.data);
          if (
            response.data.translate !== "Sorry,We can not detect this language"
          ) {
            this.outputbox = response.data.translate;
          } else {
            this.outputbox = "";
          }
          if (response.data.lang === "中文") {
            this.leftLang = "中文";
            this.rightLang = "英文";
          } else if (response.data.lang === "英文") {
            this.leftLang = "英文";
            this.rightLang = "中文";
          }
        });
    },
    TramslateChange() {
      let temp = this.leftLang;
      this.leftLang = this.rightLang;
      this.rightLang = temp;
      this.inputbox = this.outputbox;
      this.getTranslate();
    },
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
