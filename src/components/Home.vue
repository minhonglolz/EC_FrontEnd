<template>
  <div class="Home row">
    <div class="bookcontainer col">
      <img class="book" src="../assets/img/book2.png" alt="book" />
    </div>
    <div class="showoff col">
      <div class="homeText">
        <h1>{{ title }}</h1>
        <span v-html="content">{{ content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: ["title", "content"],
  data() {
    return {};
  },
  methods: {},
};
</script>
