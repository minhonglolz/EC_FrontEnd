<template>
  <div class="showoff col">
    <div class="chatbox">
      <div class="chatlogs" ref="chatLogs">
        <div v-for="item in message" :key="item">
          <div v-if="item.userName == 'chatbot'">
            <div class="chat chatbot">
              <p
                @click="chatbotSpeech(item.inputText)"
                v-html="item.inputText"
                class="chatMessage"
              ></p>
            </div>
          </div>
          <div v-if="item.userName == 'user'">
            <div class="chat user">
              <p class="chatMessage">
                {{ item.inputText }}
              </p>
            </div>
          </div>
        </div>
        <div v-show="!ExerciseStart">
          <v-select v-model="userLevel" :options="levelOption"> </v-select>
          <button
            :disabled="userLevel === ''"
            class="startButton"
            :class="{
              startButtonDisable: userLevel === '' || userLevel === null,
            }"
            @click="ExerciseStartToggle(), ExerciseGetSent()"
          >
            Start
          </button>
        </div>
      </div>
      <div class="chatprompt"></div>
      <div class="chat-form">
        <!-- <textarea
          v-model="nowInput"
          id="sentTextarea"
          v-on:keydown.enter.prevent="chatUserSent(), checkUserInput(nowInput)"
          >{{ nowInput }}</textarea
        >
        <button
          id="sent-button"
          class="sent-button model-button"
          @click="chatUserSent(), checkUserInput(nowInput)"
        >
          <i class="fas fa-paper-plane"></i>
        </button> -->
        <button
          :title="'Voice on'"
          v-show="micBtn"
          @click="micStart()"
          id="micstart-button"
          class="micstart-button model-button"
          :disabled="isdisabled"
        >
          <i class="fas fa-microphone"></i>
        </button>
        <button
          :title="'Voice off'"
          v-show="!micBtn"
          @click="micStop()"
          id="micstop-button"
          class="micstop-button model-button"
          :disabled="isdisabled"
        >
          <i class="fas fa-microphone"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
export default {
  name: "Exercise",
  data() {
    return {
      nowInput: "", // Textarea對話框
      message: [
        {
          userName: "chatbot",
          inputText: `Hello!</br></br>
          Please select the level you want to Exercise`,
        },
      ],
      levelOption: ["A1", "A2", "B1", "B2", "C1", "C2"],
      isdisabled: true,
      ExerciseStart: false, //是否開始語音測試
      micBtn: true, //Mic icon color
      synth: window.speechSynthesis, //機器人語音
      userSpeech: new window.SpeechSynthesisUtterance(), //機器人語音
      // recognition: new webkitSpeechRecognition(), // 建立語音辨識物件 webkitSpeechRecognition
      recognition: new window.webkitSpeechRecognition(),
      userLevel: "", //使用者目前等級
      ExerciseArray: [], //隨機句子
      user_answer: "", //使用者答案
      FulfillmentText: "", //回櫃句給使用者表現
      currentSent: 0,
      correct: 0, //正確數量
      incorrect: 0, //錯誤數量
      getSentbyLevel: new FormData(),
      runtimeTranscription_: "",
      transcription_: [],
      lang_: "en-US",
      isShowMode: true,
    };
  },
  methods: {
    ExerciseStartToggle() {
      this.ExerciseStart = true;
    },
    ExerciseGetSent() {
      var n = 3;
      while (n < 27) {
        let getSentbyChar = new FormData();
        getSentbyChar.set("Char", n);
        getSentbyChar.set("Level", this.userLevel);
        this.axios
          .post("https://sels.nkfust.edu.tw/getSentbyChar", getSentbyChar)
          .then((response) => {
            console.log(response.data.Content[0]);
            this.ExerciseArray.push(
              response.data.Content[0],
              response.data.Content[1]
            );
            if (this.ExerciseArray.length >= 16) {
              this.ExerciseArray.sort(function (a, b) {
                return a.length - b.length;
              });
              this.ExerciseOutput();
            }
          });
        n += 3;
      }
    },
    ExerciseOutput() {
      this.chatbotStartInput(this.ExerciseArray[this.currentSent]);
      this.chatbotSpeech(this.ExerciseArray[this.currentSent]);
      this.isdisabled = false;
    },
    ExercoseUserInput(sentin) {
      console.log(sentin);
      let LESE_detect = {
        level: this.userLevel,
        true_count: 0,
        fail_count: 0,
        random_question: this.ExerciseArray[this.currentSent].toLowerCase(),
        user_answer: sentin,
        session_id: "123456789",
        language_code: "en",
      };
      let JOSN_LESE_detect = JSON.stringify(LESE_detect);
      this.axios
        .post("https://sels.nkfust.edu.tw/LESE_detect", JOSN_LESE_detect)
        .then((response) => {
          console.log(response.data);
          let FulfillmentText = response.data.data.Answer.FulfillmentText;
          // this.chatbotStartInput("Similarity:" + response.data.data.vef);
          this.lang_ = "en-US"; //必須先改回英文，否則中文會出錯
          this.currentSent++;
          this.ExerciseOutput();
        });
    },
    //chatbot視窗滾輪最底部
    scrollTop() {
      this.$nextTick(() => {
        this.$refs.chatLogs.scrollTop = this.$refs.chatLogs.scrollHeight;
      });
    },
    //push新的句子進陣列
    chatbotStartInput(sent) {
      this.message.push({
        userName: "chatbot",
        inputText: sent,
      });
      this.scrollTop();
      this.chatbotSpeech("");
    },
    chatUserSent() {
      this.message.push({
        userName: "user",
        inputText: this.runtimeTranscription_,
      });
      this.nowInput = "";
      this.scrollTop();
    },
    //語音api輸出
    chatbotSpeech(sent) {
      window.speechSynthesis.cancel();
      this.userSpeech.text = sent;
      this.userSpeech.lang = this.lang_; //語音撥放語言
      this.userSpeech.rate = 0.8; //語音速度
      this.synth.speak(this.userSpeech); //播放
    },
    checkUserInput(input) {
      if (this.firstChat === true && this.exit === false) {
      }
    },
    micStart() {
      // initialisation of voicereco
      this.micBtn = !this.micBtn;
      this.recognition.lang = this.lang_;
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
      console.log("stop record");
      this.chatUserSent();
      this.user_answer = this.runtimeTranscription_;
      this.ExercoseUserInput(this.runtimeTranscription_);
    },
    // 更改模式
    modeChange() {
      this.isShowMode = !this.isShowMode;
      this.isShowMode === false
        ? (this.lang_ = "zh-TW")
        : (this.lang_ = "en-US");
    },
  },
};
window.speechSynthesis.cancel(); //每次重新整理視窗取消上次撥放中的語音
</script>

<style></style>
