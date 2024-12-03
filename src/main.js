import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import router from './router';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(Antd);
app.use(createPinia()); 
app.use(router);


app.mount('#app');
