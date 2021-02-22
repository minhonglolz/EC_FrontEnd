<template>
  <div class="showoff col">
    <div class="topicbox">
      <div class="leftList">
        <ul>
          <li @click="topicListHandler()">Topic</li>
          <li @click="levelListHandler()">Level</li>
        </ul>
      </div>

      <div class="rightList">
        <div class="rightListNav">
          <button @click="returnHandler()" v-show="currentList !== 'List'">
            <i class="fas fa-arrow-left"></i>
          </button>
        </div>
        <div class="rightListConetnt">
          <ul v-show="rightListisShow">
            <li
              @click="getSentTopics(item)"
              v-for="item in rightList"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
          <ul v-show="rightSentisShow">
            <li
              @click="getSentbyId(item[0])"
              v-for="item in rightSentList"
              :key="item[0]"
            >
              {{ item[1] }}
            </li>
          </ul>
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
  name: "Topic",
  data() {
    return {
      rightListisShow: false,
      rightSentisShow: false,
      rightDeatilsisShow: false,
      currentList: "List",
      isLevel: false,
      rightList: [],
      rightSentList: [],
      DeatilsLevel: null,
      DeatilsContent: null,
      DeatilsChinese: null,
      DeatilsLength: null,
      DeatilsSimilarity: null,
    };
  },
  methods: {
    topicListHandler() {
      this.axios
        .post("https://sels.nkfust.edu.tw/getTopics")
        .then((response) => {
          this.rightList = response.data.topics;
          this.rightListisShow = true;
          this.rightSentisShow = false;
          this.rightDeatilsisShow = false;
          this.isLevel = false;
          this.currentList = "List";
        });
    },
    levelListHandler() {
      this.rightList = ["A1", "A2", "B1", "B2", "C1", "C2"];
      this.rightListisShow = true;
      this.rightSentisShow = false;
      this.rightDeatilsisShow = false;
      this.isLevel = true;
      this.currentList = "List";
    },
    getSentTopics(value) {
      this.rightSentList = [];
      if (this.isLevel === true) {
        let url = "https://sels.nkfust.edu.tw/getSent";
        let getSent = new FormData();
        getSent.set("level", value);
        getSent.set("source", "WordNet");

        this.axios.post(url, getSent).then((response) => {
          console.log(response.data);
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
        let getSentbyTopic = new FormData();
        getSentbyTopic.set("topic", value);
        console.log(getSentbyTopic);
        let url = "https://sels.nkfust.edu.tw/getSentbyTopic";
        this.axios.post(url, getSentbyTopic).then((response) => {
          console.log(response.data);
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
