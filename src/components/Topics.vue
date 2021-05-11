<template>
  <div class="showoff col">
    <div class="topicbox">
      <div class="leftList">
        <ul>
          <p>Classify</p>
          <li @click="topicListHandler()">Topics</li>
          <li
            :title="'根據CERF等級分類為A1,A2,B1,B2,C1,C2'"
            @click="levelListHandler()"
          >
            Level
          </li>
        </ul>
      </div>

      <div class="rightList">
        <div class="rightListNav">
          <button @click="returnHandler()" v-show="currentList !== 'List'">
            <i class="fas fa-arrow-left"></i>
          </button>
        </div>
        <div class="rightListConetnt">
          <ol v-show="rightListisShow">
            <span>
              根據不同的Classify產生不同的細項分類，點選進入該細項分類的句子。
            </span>
            <li
              v-for="(item, index) in rightList[0]"
              :key="item"
              @click="getSentTopics(rightList[0][index])"
            >
              {{ rightList[0][index] }} (全部:{{ rightList[1][index] }} 已處理過
              :{{ rightList[2][index] }} )
            </li>
          </ol>
          <ol v-show="rightSentisShow">
            <span
              >{{ selectTitle }}此分類細項句子總數為：{{
                rightSentList.length
              }}</span
            >
            <li
              @click="getSentbyId(item[0])"
              v-for="item in rightSentList"
              :key="item[0]"
            >
              {{ item[1] }}
            </li>
          </ol>
          <div v-show="rightDeatilsisShow" class="sentDeatils">
            <h6>Content: {{ DeatilsContent }}</h6>
            <h6>Level: {{ DeatilsLevel }}</h6>
            <p>Chinese:{{ DeatilsChinese }}</p>
            <p>Lenght: {{ DeatilsLength }}</p>
            <p>Similarity: {{ DeatilsSimilarity }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //這頁狀態控制寫得不好別噴
  name: "Topics",
  data() {
    return {
      rightListisShow: false, //右邊清單列顯示
      rightSentisShow: false, //右邊句子列顯示
      rightDeatilsisShow: false, //控制右邊顯示是level還是topic，這邊很糟糕請小心服用
      selectTitle: "", //顯示目前選擇的是level還是topic
      currentList: "List", //判斷目前是要顯示List還是Sentence
      isLevel: false, //判斷api要打向level還是topic
      rightList: [], //右邊清單列陣列
      rightSentList: [], //右邊句子列陣列

      //api回傳給個句子的詳細資訊
      DeatilsLevel: null, //等級
      DeatilsContent: null, //內容
      DeatilsChinese: null, //翻譯後的中文
      DeatilsLength: null, //句子長度
      DeatilsSimilarity: null, //相似詞句
    };
  },
  methods: {
    //拿topic句子清單
    topicListHandler() {
      let getSentCount = new FormData();
      getSentCount.set("Source", "all");
      this.axios
        .post("https://sels.nkfust.edu.tw/getSentCount", getSentCount)
        .then((response) => {
          console.log(response.data.data.Topic);
          this.rightList = response.data.data.Topic;
          this.rightListisShow = true;
          this.rightSentisShow = false;
          this.rightDeatilsisShow = false;
          this.isLevel = false;
          this.currentList = "List";
        });
    },
    //拿level句子清單
    levelListHandler() {
      let getSentCount = new FormData();
      getSentCount.set("Source", "all");
      this.axios
        .post("https://sels.nkfust.edu.tw/getSentCount", getSentCount)
        .then((response) => {
          console.log(response.data.data.level);
          this.rightList = response.data.data.level;
          this.rightListisShow = true;
          this.rightSentisShow = false;
          this.rightDeatilsisShow = false;
          this.isLevel = true;
          this.currentList = "Level";
        });
    },

    getSentTopics(value) {
      //拿level分類中的句子
      this.rightSentList = [];
      this.selectTitle = value;
      if (this.isLevel === true) {
        let url = "https://sels.nkfust.edu.tw/getSent";
        let getSent = new FormData();
        console.log(value);
        getSent.set("level", value);
        getSent.set("source", "WordNet");
        this.axios.post(url, getSent).then((response) => {
          this.rightSentList = Object.keys(response.data.Content).map((key) => [
            response.data.Id[key],
            response.data.Content[key],
          ]);
          console.log(this.rightSentList);
          this.rightListisShow = false;
          this.rightSentisShow = true;
          this.rightDeatilsisShow = false;
          this.currentList = "Sent";
        });
      } else {
        //拿topic分類中的句子
        let getSentbyTopic = new FormData();
        getSentbyTopic.set("topic", value);
        console.log(getSentbyTopic);
        let url = "https://sels.nkfust.edu.tw/getSentbyTopic";
        this.axios.post(url, getSentbyTopic).then((response) => {
          this.rightSentList = Object.keys(response.data.Content).map((key) => [
            response.data.Id[key],
            response.data.Content[key],
          ]);
          console.log(this.rightSentList);
          this.rightListisShow = false;
          this.rightSentisShow = true;
          this.rightDeatilsisShow = false;
          this.currentList = "Sent";
        });
      }
    },
    //拿到每個句子的詳細資訊
    getSentbyId(key) {
      let getSentById = new FormData();
      getSentById.set("Id", key);
      this.axios
        .post("https://sels.nkfust.edu.tw/getSentById", getSentById)
        .then((response) => {
          this.DeatilsLevel = response.data.Level;
          this.DeatilsContent = response.data.Content;
          this.DeatilsChinese = response.data.Chinese;
          this.DeatilsLength = response.data.Length;
          this.DeatilsSimilarity = response.data.Similarity;
          this.rightListisShow = false;
          this.rightSentisShow = false;
          this.rightDeatilsisShow = true;
          this.currentList = "Deatils";
        });
    },
    //顯示
    returnHandler() {
      if (this.currentList === "Sent") {
        this.rightListisShow = true;
        this.rightSentisShow = false;
        this.rightDeatilsisShow = false;
        this.currentList = "List";
      } else if (this.currentList === "Deatils") {
        this.rightListisShow = false;
        this.rightSentisShow = true;
        this.rightDeatilsisShow = false;
        this.currentList = "Sent";
      }
    },
  },
};
</script>
