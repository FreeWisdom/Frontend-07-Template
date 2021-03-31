import HelloWord from "./HelloWord.vue";
import Vue from "Vue";

new Vue({
    el: "#app",
    render: h => h(HelloWord)
});