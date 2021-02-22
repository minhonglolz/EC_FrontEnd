import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import EnglishChatbot from "../components/EnglishChatbot.vue";
import Translate from "../components/Translate.vue";
import Vocabulary from "../components/Vocabulary.vue";
import Sentence from "../components/Sentence.vue";
import Topic from "../components/Topic.vue";

Vue.use(Router);
export default new Router({
    mode: "history",
    routes: [{
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
            path: "/Topic",
            name: "Topic",
            component: Topic,
        },
    ],
});