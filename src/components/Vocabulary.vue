<template>
  <div class="showoff col">
    <div class="vocabularybox">
      <div class="inputbox">
        <textarea
          v-model="inputbox"
          placeholder="Enter or paste vocbulary here."
        >
        </textarea>
      </div>
      <div class="searchbox">
        <button @click="getVocabulary()">
          <i class="fas fa-search"></i>search
        </button>
      </div>
      <div v-show="isShow" class="outputbox">
        <div class="vocabularyOutput">
          <h4>{{ origin }}</h4>
          <h5>{{ Meaning }}</h5>
          <h6>{{ POS }}</h6>
          <h6>US {{ phonetic }}</h6>
          <div class="level">{{ Level }}</div>
        </div>
        <div class="otherPOS vocabularyOutput">
          <div v-show="synonymsList.length != 0">
            <h4>synonyms</h4>
            <span
              v-for="(synonyms, index) in synonymsList"
              class="synonyms"
              :key="index"
              >{{ synonyms }}</span
            >
          </div>
          <div v-show="antonymsList.length != 0">
            <h4>antonyms</h4>
            <span
              v-for="(antonyms, index) in antonymsList"
              class="antonyms"
              :key="index"
              >{{ antonyms }}</span
            >
          </div>
          <div v-show="hyponymsList.length != 0">
            <h4>hyponyms</h4>
            <span
              v-for="(hyponyms, index) in hyponymsList"
              class="hyponyms"
              :key="index"
              >{{ hyponyms }}</span
            >
          </div>
          <div v-show="hypernymsList.length != 0">
            <h4>hypernyms</h4>
            <span
              v-for="(hypernyms, index) in hypernymsList"
              class="hypernyms"
              :key="index"
              >{{ hypernyms }}</span
            >
          </div>
          <div v-show="engMeaningList.length != 0">
            <h4>Explanation</h4>
            <div
              v-for="(explanation, index) in engMeaningList"
              class="explanation"
              :key="index"
            >
              {{ explanation }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);
export default {
  name: "Vocabulary",
  data() {
    return {
      isShow: false,
      inputbox: "",
      VgWordFormdata: new FormData(), //POST Formdata
      origin: "null", //翻譯單字
      Meaning: "null", //翻譯結果
      Level: "null", //單字等級
      POS: "null", //詞性
      phonetic: "null", //音標
      examplesList: new Array(), //範例
      synonymsList: new Array(), //相似詞
      antonymsList: new Array(), //反義詞
      hyponymsList: new Array(), //下位詞
      hypernymsList: new Array(), //上位詞
      engMeaningList: new Array(), //單字解釋
    };
  },
  methods: {
    //單字api
    getVocabulary() {
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
      this.VgWordFormdata.set("word", this.inputbox);
      this.axios
        .post("https://sels.nkfust.edu.tw/getVgWord", this.VgWordFormdata)
        .then((response) => {
          console.log(response.data.data.result.length);
          if (response.data.data.result.length === 0) {
            this.origin = "Error";
            loader.hide();
            this.isShow = true;
          } else {
            loader.hide();
            this.examplesList = null;
            this.synonymsList = null;
            this.antonymsList = null;
            this.hyponymsList = null;
            this.hypernymsList = null;
            this.engMeaningList = null;
            this.origin = this.inputbox;
            this.Level = response.data.data.Level;
            this.phonetic = response.data.data.phonetic;
            this.Meaning = response.data.data.result[0].Meaning;
            this.POS = response.data.data.result[0].POS;
            this.synonymsList = response.data.data.synonyms;
            this.antonymsList = response.data.data.antonyms;
            this.hyponymsList = response.data.data.hyponyms;
            this.hypernymsList = response.data.data.hypernyms;
            this.engMeaningList = response.data.data.engMeaning[1];
            this.isShow = true;
          }
        });
    },
  },
};
</script>
