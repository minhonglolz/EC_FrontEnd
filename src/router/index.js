import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import EnglishChatbot from "../components/EnglishChatbot.vue";
import Translate from "../components/Translate.vue";
import GrammarCheck from "../components/GrammarCheck.vue";
import Vocabulary from "../components/Vocabulary.vue";
import Sentence from "../components/Sentence.vue";
import Topics from "../components/Topics.vue";
import Exercise from "../components/Exercise.vue";

Vue.use(Router);
export default new Router({
  base: "/EC_FrontEnd",
  mode: "history",
  routes: [
    {
      path: "/",
      name: "/",
      component: Home,
    },
    {
      path: "/Home",
      name: "/",
      component: Home,
    },
    {
      path: "/EnglishChatbot",
      name: "/EnglishChatbot",
      component: EnglishChatbot,
    },
    {
      path: "/Translate",
      name: "/Translate",
      component: Translate,
    },
    {
      path: "/GrammarCheck",
      name: "/GrammarCheck",
      component: GrammarCheck,
    },
    {
      path: "/Vocabulary",
      name: "Voccabulary",
      component: Vocabulary,
    },
    {
      path: "/Sentence",
      name: "Sentence",
      component: Sentence,
    },
    {
      path: "/Topics",
      name: "Topics",
      component: Topics,
    },
    {
      path: "/Exercise",
      name: "Exercise",
      component: Exercise,
    },
  ],
});
