<template>
  <div class="showoff col">
    <div class="list">
      Level : {{ LevelText }},{{ annotation[userLevel - 1].text }}，相似度 :
      {{ LESE_vef }}
      <!-- <button @click="deletelocalStorage">刪除紀錄</button> -->
      <button v-show="chatBotStart" :title="'go away'" @click="goaway()">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
    <div class="chatbox">
      <div class="modeBox">
        <button
          v-if="isShowMode"
          @click="modeChange"
          :title="'Mode'"
          class="model-button modeButton_enUS"
        >
          英
        </button>
        <button
          v-else
          @click="modeChange"
          :title="'Mode'"
          class="model-button modeButton_Chi"
        >
          中
        </button>
      </div>
      <div class="chatlogs" ref="chatLogs">
        <div v-for="item in message">
          <div v-if="item.userName == 'chatbot'">
            <div class="chat chatbot">
              <p v-html="item.inputText" class="chatMessage"></p>
            </div>
          </div>
          <div v-if="item.userName == 'user'">
            <div class="chat user">
              <p class="chatMessage">{{ item.inputText }}</p>
            </div>
          </div>
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
        >
          <i class="fas fa-microphone"></i>
        </button>
        <button
          :title="'Voice off'"
          v-show="!micBtn"
          @click="micStop()"
          id="micstop-button"
          class="micstop-button model-button"
        >
          <i class="fas fa-microphone"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnglishChatbot",
  data() {
    return {
      annotation: [
        { text: "初級(Elementary) 相當於國中畢業" },
        { text: "中級(Intermediate) 相當於高中畢業" },
        { text: "中高級(High-Intermediate) 相當於大學畢業" },
        {
          text:
            "高級(Advanced) 相當於大學主修英語畢業或英語系國家進修取得學位者",
        },
        {
          text:
            "優級(Superior) 相當於受過高等教育之母語人士，各種場合均能使用適當策略做最有效的溝通",
        },
      ],
      nowInput: "", // Textarea對話框
      message: [
        {
          userName: "chatbot",
          inputText: `Hello!</br></br>
          To start talking: Click the blue microphone icon and then speak into your microphone.</br></br>
          To stop talking: Click the red microphone icon.</br></br>`,
        },
        {
          userName: "chatbot",
          inputText: "Say   [ Yes ]  when you are ready !",
        },
      ],

      chatBotStart: false, //是否開始語音測試
      firstChat: false, //監測使否為第一句對話
      micBtn: true, //Mic icon color
      synth: window.speechSynthesis, //機器人語音
      userSpeech: new window.SpeechSynthesisUtterance(), //機器人語音
      // recognition: new webkitSpeechRecognition(), // 建立語音辨識物件 webkitSpeechRecognition
      recognition: new window.webkitSpeechRecognition(),
      userLevel: 1, //使用者目前等級
      LevelText: "A1",
      exit: false, //是否離開視窗
      random_question: "", //隨機句子
      user_answer: "", //使用者答案
      FulfillmentText: "", //回櫃句給使用者表現
      LESE_vef: 0,
      correct: 0,
      incorrect: 0,
      getSentbyLevel: new FormData(),
      runtimeTranscription_: "",
      transcription_: [],
      lang_: "en-US",
      isShowMode: true,
    };
  },
  mounted: function () {
    if (localStorage.getItem("userLevel")) {
      this.userLevel = parseInt(localStorage.getItem("userLevel"));
    }

    let Level;
    switch (this.userLevel) {
      case 1:
        Level = "A1";
        break;
      case 2:
        Level = "A2";
        break;
      case 3:
        Level = "B1";
        break;
      case 4:
        Level = "B2";
        break;
      case 5:
        Level = "C1";
        break;
      default:
        break;
    }
    this.LevelText = Level;
    this.getSentbyLevel.append("Level", Level);
  },
  methods: {
    chatUserSent(event) {
      if (
        (this.nowInput === "yes" && this.exit === false) ||
        this.runtimeTranscription_ === "yes"
      ) {
        //判斷是否開始等級測試
        this.chatBotStart = true;
      }
      this.user_answer = this.nowInput;
      if (this.nowInput !== "" && this.nowInput.trim() !== "") {
        this.message.push({
          userName: "user",
          inputText: this.nowInput,
        });
        this.nowInput = "";
        this.scrollTop();
      } else if (
        this.runtimeTranscription_ !== "" &&
        this.runtimeTranscription_.trim() !== ""
      ) {
        this.message.push({
          userName: "user",
          inputText: this.runtimeTranscription_,
        });
        this.nowInput = "";
        this.scrollTop();
      } else {
        this.nowInput = "";
        if (this.exit === true && this.chatBotStart === false) {
          this.chatbotStartInput("Whether to save this record ? yes / no");
          this.chatbotSpeech("Whether to save this record ? yes / no");
        } else {
          this.chatbotSpeech("Say   [ Yes ]  when you are ready !");
        }
      }
      if (this.chatBotStart || this.exit) {
        this.getSent(this.userLevel); //依目前使用者等級呼叫對應句子
        console.log("ss");
      }
      this.scrollTop();
    },
    scrollTop() {
      this.$nextTick(() => {
        this.$refs.chatLogs.scrollTop = this.$refs.chatLogs.scrollHeight; //chatbot視窗滾輪最底部
      });
    },
    goaway() {
      this.exit = true;
      this.chatBotStart = false;
      this.chatbotStartInput("Whether to save this record ? yes / no");
      this.chatbotSpeech("Whether to save this record ? yes / no");
    },
    chatbotStartInput(sent) {
      this.message.push({
        userName: "chatbot",
        inputText: sent,
      });
      this.scrollTop(); //chatbot視窗滾輪最底部
      this.chatbotSpeech("");
    },
    chatbotSpeech(sent) {
      window.speechSynthesis.cancel();
      this.userSpeech.text = sent;
      this.userSpeech.lang = this.lang_; //語音撥放語言
      this.userSpeech.rate = 0.8; //語音速度
      this.synth.speak(this.userSpeech); //播放
    },
    getSent(level) {
      if (this.exit === true && this.user_answer === "yes") {
        console.log("ss");
        localStorage.setItem("userLevel", this.userLevel);
        this.chatbotStartInput("Will save this record thank you");
        this.chatbotSpeech("Will save this record thank you");
        this.firstChat = false;
        this.exit = false;
      } else if (this.exit == true && this.user_answer == "no") {
        this.chatbotStartInput("Will not save this record thank you");
        this.chatbotSpeech("Will not save this record thank you");
        this.firstChat = false;
        this.exit = false;
      }
      if (this.chatBotStart && this.exit !== true) {
        let Level;
        switch (this.userLevel) {
          case 1:
            Level = "A1";
            break;
          case 2:
            Level = "A2";
            break;
          case 3:
            Level = "B1";
            break;
          case 4:
            Level = "B2";
            break;
          case 5:
            Level = "C1";
            break;
          default:
            break;
        }
        this.getSentbyLevel.set("Level", Level);
        this.axios
          .post(
            "https://sels.nkfust.edu.tw/getSentbyLevel",
            this.getSentbyLevel
          )
          .then((response) => {
            this.firstChat = true;
            this.random_question = response.data.data.toLowerCase();
            if (this.lang_ === "zh-TW") {
              // this.random_question = "abandon your life to god.";
              var getSentChinese = new FormData();
              getSentChinese.set("Sent", this.random_question);
              console.log(getSentChinese.get("Sent"));
              this.axios
                .post(
                  "https://sels.nkfust.edu.tw/getSentChinese",
                  getSentChinese
                )
                .then((response) => {
                  if (this.FulfillmentText === "") {
                    console.log(response.data.Chinese);
                    this.chatbotStartInput(response.data.Chinese); //呼叫chatbot視窗顯示
                    this.chatbotSpeech(response.data.Chinese);
                  } else {
                    setTimeout(() => {
                      this.lang_ = "zh-TW";
                      this.chatbotStartInput(response.data.Chinese); //呼叫chatbot視窗顯示
                      this.chatbotSpeech(response.data.Chinese);
                    }, 1500);
                  }
                });
            } else if (this.FulfillmentText === "") {
              this.chatbotStartInput(response.data.data); //呼叫chatbot視窗顯示
              this.chatbotSpeech(response.data.data);
            } else {
              setTimeout(() => {
                this.chatbotStartInput(response.data.data); //呼叫chatbot視窗顯示
                this.chatbotSpeech(response.data.data);
              }, 1500);
            }
          });
      }
    },
    checkUserInput(input) {
      if (this.firstChat === true && this.exit === false) {
        let LESE_detect = {
          level: this.userLevel,
          true_count: this.correct,
          fail_count: this.incorrect,
          random_question: this.random_question.toLowerCase(),
          user_answer: this.user_answer,
          session_id: "123456789",
          language_code: "en",
        };
        let JOSN_LESE_detect = JSON.stringify(LESE_detect);
        this.axios
          .post("https://sels.nkfust.edu.tw/LESE_detect", JOSN_LESE_detect)
          .then((response) => {
            console.log(response.data);
            let Level;
            switch (response.data.data.level) {
              case 1:
                Level = "A1";
                break;
              case 2:
                Level = "A2";
                break;
              case 3:
                Level = "B1";
                break;
              case 4:
                Level = "B2";
                break;
              case 5:
                Level = "C1";
                break;
              default:
                break;
            }

            this.LevelText = Level;
            this.userLevel = response.data.data.level;
            this.correct = response.data.data.true_count;
            this.incorrect = response.data.data.fail_count;
            this.FulfillmentText = response.data.data.Answer.FulfillmentText;
            this.LESE_vef = response.data.data.vef;
            this.lang_ = "en-US"; //必須先改回英文，否則中文會出錯
            this.chatbotStartInput(this.FulfillmentText); // 呼叫回饋句
            this.chatbotSpeech(this.FulfillmentText); // 呼叫回饋句
            this.isShowMode === false
              ? (this.lang_ = "zh-TW")
              : (this.lang_ = "en-US");
          });
      }
    },
    deletelocalStorage() {
      this.LevelText = "A1";
      this.userLevel = 1;
      this.true_count = 0;
      this.fail_count = 0;
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

      // end of transcription
      // this.recognition.addEventListener("end", () => {});
      this.recognition.start();
    },
    micStop() {
      this.recognition.stop();
      this.micBtn = !this.micBtn;
      console.log("stop record");
      this.chatUserSent();
      this.user_answer = this.runtimeTranscription_;
      this.checkUserInput(this.runtimeTranscription_);
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
