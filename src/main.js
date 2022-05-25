import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
//Permisos y/o privilegios que tiene el usuario dentro de la aplicacion.
import permisos from './plugins/permisos.js'

//Install VueSweetAlert2
Vue.use(VueSweetalert2)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
import 'sweetalert2/dist/sweetalert2.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/main.css'

Vue.config.productionTip = false

//variables de api
Vue.prototype.$api = 'http://localhost:8000/api/'
Vue.prototype.$aplicaciones = 'aplicaciones'
Vue.prototype.$categorias = 'categorias'
Vue.prototype.$pantallas = 'pantallas'
Vue.prototype.$funciones = 'funciones'
Vue.prototype.$privilegios = 'privilegios'
Vue.prototype.$roles = 'roles'
Vue.prototype.$usuarios = 'usuarios'
Vue.prototype.$auth = 'auth'
Vue.prototype.$centros = 'centros'

//prueba subdirector
Vue.prototype.$subdirector = 'subdirector'

Vue.prototype.$unidad = 'unidad'
Vue.prototype.$clasificacion = 'clasificacion'
Vue.prototype.$cliente = 'cliente'
Vue.prototype.$periodicidad = 'periodicidad'
Vue.prototype.$plataforma = 'plataforma'
Vue.prototype.$lineaprogramatica = 'lineaprogramatica'
Vue.prototype.$indicadores = 'indicadores'
Vue.prototype.$ajustemetaglobal = 'ajustemetaglobal'
Vue.prototype.$metaPorLinea = 'metaPorLinea'
Vue.prototype.$ejecucionIndicador = 'ejecucionIndicador'
Vue.prototype.$metaEsperadaEnLinea = 'metaEsperadaEnLinea'
Vue.prototype.$ejecutor = 'Pruebas'
Vue.prototype.$metaGlobal = 'metaGlobal'
Vue.prototype.$indicadorMetaAno = 'indicadorMetaAno'
Vue.prototype.$logOut = 'logOut'
Vue.prototype.$detalleEjecucionIndicador = 'detalleEjecucionIndicador'
Vue.prototype.$evento = 'evento'
Vue.prototype.$categoriaevento = 'categoriaevento'
Vue.prototype.$metalineacentro = 'metalineacentro'
Vue.prototype.$proyectoevaluar = 'proyectoevaluar'
Vue.prototype.$proyectoevaluarCentro = 'proyectoevaluarCentro'
Vue.prototype.$sistemagestion = 'sistemagestion'

Vue.use(permisos)

new Vue({
    router,
    store,
    vuetify,
    permisos,
    render: (h) => h(App),
}).$mount('#app')
