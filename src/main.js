import { createApp, VueElement } from 'vue';
import Login from './login.vue';
import DashBoard from './dashboard.vue';
import * as CookieTool from "./cookietool"

import { 
    provideFluentDesignSystem,
    fluentButton,
    fluentOption,
    fluentListbox,
    fluentCard,
    fluentTextField
} from '@fluentui/web-components';

provideFluentDesignSystem()
    .register(
        fluentButton(),
        fluentOption(),
        fluentListbox(),
        fluentCard(),
        fluentTextField()
    );

if (CookieTool.getCookie("token") == "") {
    createApp(Login).mount('#app');
    document.getElementById("TitleText").innerText = "Astral Player Account"
}
else{
    createApp(DashBoard).mount('#app');
}