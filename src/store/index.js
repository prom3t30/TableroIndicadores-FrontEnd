import Vue from 'vue'
import Vuex from 'vuex'
import SecureLS from "secure-ls";
import createPersistedState from 'vuex-persistedstate'
const ls = new SecureLS({ isCompression: false });
import Auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false,
  },
  mutations: {
    toogle (hider) {
        this.drawer = hider
      },
  },
  actions: {
  },
  modules: {
    auth: Auth
  },
  plugins: [
      createPersistedState({
          storage: {
              getItem: key => ls.get(key),
              setItem: (key, value) => ls.set(key, value),
              removeItem: key => ls.remove(key)
          }
      })
  ],
  namespaced : true,
})
