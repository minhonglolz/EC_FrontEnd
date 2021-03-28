<template>
  <div class="showoff col">
    <div class="list">
      Level : {{ Level }}
      <!-- <button @click="deletelocalStorage">刪除紀錄</button> -->
      <button v-show="ListenSpkerStart" :title="'go away'" @click="goAway()">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
    <div class="chatbox">
      <div class="chatlogs" ref="chatLogs">
        <div v-for="(item, index) in message" :key="index">
          <div v-if="item.userName == 'chatbot'">
            <div class="chat chatbot">
              <p @click="chatbotSpeech(item.content)" class="chatMessage">
                {{ item.content }} <i class="fas fa-volume-up"></i>
              </p>
            </div>
          </div>
          <div v-if="item.userName == 'user'">
            <div class="chat user">
              <p class="chatMessage">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
        <v-select v-show="!ListenSpkerStart" v-model="mode" :options="modeList">
        </v-select>
        <button
          :disabled="mode === null"
          class="startButton"
          :class="{
            startButtonDisable: mode === null,
          }"
          v-show="!ListenSpkerStart"
          @click="ListenSpkerStartHandler()"
        >
          Start
        </button>
        <button
          class="stopButton"
          v-show="!ListenSpkerStart"
          @click="reStartLeel()"
        >
          Restart Level
        </button>
      </div>
      <div class="chatprompt"></div>
      <div class="chat-form">
        <button
          :disabled="!ListenSpkerStart"
          :class="{
            startButtonDisable: !ListenSpkerStart,
          }"
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
window.speechSynthesis.cancel(); //每次重新整理視窗取消上次撥放中的語音

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
      message: [
        //chatbot預設訊息
        {
          userName: "chatbot",
          content: "Please choose a mode",
        },
        // {
        //   userName: "chatbot",
        //   content: `
        //   To start talking: Click the blue microphone icon and then speak into your microphone.`,
        // },
        // {
        //   userName: "chatbot",
        //   content: `To stop talking: Click the red microphone icon.`,
        // },
        // {
        //   userName: "chatbot",
        //   content: "Press start to practice the sentences produced",
        // },
      ],
      modeList: ["聽英說英", "聽中說英", "聽英說中"],
      mode: null,
      //chatbot
      ListenSpkerStart: false, //對話機器人是否開始
      Level: "A1", //使用者目前等級
      userMicSent: "", //使用者答案
      EnglishchatbotQuestion: "", //英文句子
      ChinesechatbotQuestion: "", //中文句子
      giveBackSentence: false, //使否等待回饋句
      giveBackContent: "", //回櫃句給使用者表現文字
      totalCorrect: 0, //正確次數總數
      totalInCorrect: 0, //錯誤次數總數
      correct: 0, //目前正確次數
      incorrect: 0, //目前錯誤次數
      LESE_vef: 0, //相似度

      //語音api
      synth: window.speechSynthesis,
      Synthesis: new window.SpeechSynthesisUtterance(),
      listenLang: "en-US",

      //錄音api
      recognition: new window.webkitSpeechRecognition(),
      getMicContent: "", //Mic錄音結果

      //DOM
      micBtn: true, //Mic icon color
      //-------------------------------------------//
    };
  },
  mounted: function () {
    ///localStorgae本機紀錄
    if (localStorage.getItem("Level")) {
      this.Level = localStorage.getItem("Level");
    }
  },
  methods: {
    //語音機器人開始
    ListenSpkerStartHandler() {
      this.ListenSpkerStart = true;
      this.message = [];
      this.getSent(this.Level);
    },
    //將輸入加入陣列顯示在畫面
    chatLogsSent(name, value) {
      this.message.push({
        userName: name,
        content: value,
      });
      this.scrollTop();
    },
    //離開並保存這次的紀錄
    goAway() {
      this.ListenSpkerStart = false;
      localStorage.setItem("Level", this.Level);
      this.chatLogsSent("chatbot", "This record has been saved");
      this.chatbotSpeech("This record has been saved");
    },
    //刪除localStorgae紀錄
    reStartLeel() {
      this.Level = "A1";
      localStorage.setItem("Level", this.Level);
      this.ListenSpkerStartHandler();
    },
    //chatbot視窗滾輪最底部
    scrollTop() {
      this.$nextTick(() => {
        this.$refs.chatLogs.scrollTop = this.$refs.chatLogs.scrollHeight;
      });
    },
    //語音機器人播放
    chatbotSpeech(sent) {
      window.speechSynthesis.cancel();
      this.Synthesis.text = sent;
      this.Synthesis.lang = this.listenLang; //語音撥放語言
      this.Synthesis.rate = 0.8; //語音速度
      this.synth.speak(this.Synthesis); //播放
    },
    //取得句子api
    getSent(Level) {
      let getSentbyLevel = new FormData(); //回傳api的FormData格式 （set）
      this.giveBackSentence = false;
      getSentbyLevel.set("Level", Level);
      if (this.ListenSpkerStartHandler) {
        this.axios
          .post("https://sels.nkfust.edu.tw/getSentbyLevel", getSentbyLevel)
          .then((response) => {
            this.EnglishchatbotQuestion = response.data.data.Content[0];
            this.ChinesechatbotQuestion = response.data.data.Chinese[0];
          })
          .then(() => {
            if (this.mode === "聽英說英") {
              this.listenLang = "en-US";
              this.speakLang = "en-US";
              this.chatLogsSent("chatbot", this.EnglishchatbotQuestion); //呼叫chatbot視窗顯示
              this.chatbotSpeech(this.EnglishchatbotQuestion);
            } else if (this.mode === "聽中說英") {
              this.listenLang = "zh-TW";
              this.speakLang = "en-US";
              this.chatLogsSent("chatbot", this.ChinesechatbotQuestion); //呼叫chatbot視窗顯示
              this.chatbotSpeech(this.ChinesechatbotQuestion);
            } else if (this.mode === "聽英說中") {
              this.listenLang = "en-US";
              this.speakLang = "zh-TW";
              this.chatLogsSent("chatbot", this.EnglishchatbotQuestion); //呼叫chatbot視窗顯示
              this.chatbotSpeech(this.EnglishchatbotQuestion);
            }
            this.EnglishchatbotQuestion = this.EnglishchatbotQuestion.toLowerCase();
          });
      }
      // }
    },
    //回傳使用者的答案給api辨識
    checkUserSent() {
      let LESE_detect = {
        level: this.Level, //A1,A2,B1...
        true_count: this.correct, //0,1,2,3
        fail_count: this.incorrect,
        random_question: this.EnglishchatbotQuestion.toLowerCase(),
        user_answer: this.getMicContent.toLowerCase(),
        session_id: "123456789",
        language_code: "en",
      };
      let JOSN_LESE_detect = JSON.stringify(LESE_detect);
      this.axios
        .post("https://sels.nkfust.edu.tw/LESE_detect", JOSN_LESE_detect)
        .then((response) => {
          this.Level = response.data.data.level;
          this.correct = response.data.data.true_count;
          this.incorrect = response.data.data.fail_count;
          this.giveBackContent = response.data.data.Answer.FulfillmentText;
          this.LESE_vef = response.data.data.vef;
          if (
            response.data.data.ErrorWord.length !== 0 &&
            this.listenLang !== "zh-TW"
          ) {
            this.chatLogsSent(
              "chatbot",
              "Mistake : " + response.data.data.ErrorWord
            );
          }
          this.chatLogsSent("chatbot", this.giveBackContent); // 呼叫回饋句
          this.chatbotSpeech(this.giveBackContent); // 播放回饋句
          this.giveBackSentence = true;
          this.Synthesis.onend = () => {
            if (this.giveBackSentence === true) this.getSent(this.Level);
          };
        });
      // }
    },
    //麥克風開始
    micStart() {
      this.getMicContent = "";
      this.micBtn = !this.micBtn;
      this.recognition.lang = this.listenLang;
      this.recognition.interimResults = true;

      // event current voice reco word
      this.recognition.addEventListener("result", (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        this.getMicContent = text;
      });
      this.recognition.start();
    },
    //麥克風結束
    micStop() {
      this.recognition.stop();
      this.micBtn = !this.micBtn;
      if ((this.listenLang = "zh-TW")) {
        this.chatLogsSent("chatbot", "Answer : " + this.EnglishchatbotQuestion);
      }
      this.checkUserSent(this.getMicContent);
      this.chatLogsSent("user", this.getMicContent);
    },
  },
};
</script>
