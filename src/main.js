import { createApp } from "vue";
import router from "./router";
import store from "./store";
import "./style.css";
import App from "./App.vue";
import * as filters from './filters'
import { createHead } from '@vueuse/head'

const head = createHead()
const app = createApp(App).use(head);
app.use(router).use(store).mount("#app");

app.config.globalProperties.$filters = filters
