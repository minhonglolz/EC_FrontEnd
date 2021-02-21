<template>
  <div class="showoff col">
    <div class="vocabularybox">
      <div class="inputbox">
        <textarea
          v-model="inputbox"
          placeholder="Enter or paste vocbulary here"
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
            <span v-for="synonyms in synonymsList" class="synonyms">{{
              synonyms
            }}</span>
          </div>
          <div v-show="antonymsList.length != 0">
            <h4>antonyms</h4>
            <span v-for="antonyms in antonymsList" class="antonyms">{{
              antonyms
            }}</span>
          </div>
          <div v-show="hyponymsList.length != 0">
            <h4>hyponyms</h4>
            <span v-for="hyponyms in hyponymsList" class="hyponyms">{{
              hyponyms
            }}</span>
          </div>
          <div v-show="hypernymsList.length != 0">
            <h4>hypernyms</h4>
            <span v-for="hypernyms in hypernymsList" class="hypernyms">{{
              hypernyms
            }}</span>
          </div>
          <div v-show="engMeaningList.length != 0">
            <h4>Explanation</h4>
            <div v-for="explanation in engMeaningList" class="explanation">
              {{ explanation }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    getVocabulary() {
      this.VgWordFormdata.set("word", this.inputbox);
      this.axios
        .post("https://sels.nkfust.edu.tw/getVgWord", this.VgWordFormdata)
        .then((response) => {
          this.examplesList = null;
          this.synonymsList = null;
          this.antonymsList = null;
          this.hyponymsList = null;
          this.hypernymsList = null;
          this.engMeaningList = null;
          console.log(response.data.data.engMeaning[1]);
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
        });
    },
  },
};
</script>
