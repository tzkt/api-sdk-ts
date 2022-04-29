import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(VueCompositionApi);
Vue.use(Buefy);

/*eslint no-unexpected-multiline: "off"*/
(async () => {
  return new Vue({
    render: h => h(App)
  }).$mount('#app');
})();
