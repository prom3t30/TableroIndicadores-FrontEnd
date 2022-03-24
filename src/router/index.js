import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Home from '../views/Home.vue'
import Sing from '../views/SingIn.vue'
import Init from '../App.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Init,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/sing',
        name: 'Sing',
        component: Sing,
    },
    {
        path: '/categorias',
        name: 'Categorias',
        component: () => import('../components/parametrizacion/Categoria.vue'),
    },
    {
        path: '/centros',
        name: 'Centros',
        component: () => import('../components/parametrizacion/Centro.vue'),
    },
    {
        path: '/roles',
        name: 'Roles',
        component: () => import('../components/parametrizacion/Rol.vue'),
    },
    {
        path: '/usuarios',
        name: 'Usuarios',
        component: () => import('../components/parametrizacion/Usuario.vue'),
    },
    {
        path: '/pantallas',
        name: 'Pantallas',
        component: () => import('../components/parametrizacion/Pantalla.vue'),
    },
    {
        path: '/funciones',
        name: 'Funciones',
        component: () => import('../components/parametrizacion/Funcion.vue'),
    },
    {
        path: '/aplicaciones',
        name: 'Aplicaciones',
        component: () => import('../components/parametrizacion/Aplicacion.vue'),
    },
    {
        path: '/clasificacion',
        name: 'Clasificacion',
        component: () => import('../components/parametrizacion/Clasificacion.vue'),
    },
    {
        path: '/lineaprogramatica',
        name: 'Lineaprogramatica',
        component: () => import('../components/parametrizacion/Lineaprogramatica.vue'),
    },
    {
        path: '/plataforma',
        name: 'Plataforma',
        component: () => import('../components/parametrizacion/Plataforma.vue'),
    },
    {
        path: '/periodicidad',
        name: 'Periodicidad',
        component: () => import('../components/parametrizacion/Periodicidad.vue'),
    },
    {
        path: '/cliente',
        name: 'Cliente',
        component: () => import('../components/parametrizacion/Cliente.vue'),
    },
    {
        path: '/unidad',
        name: 'Unidad',
        component: () => import('../components/parametrizacion/Unidad.vue'),
    },
    {
        path: '/configpermisos',
        name: 'ConfigPermisos',
        component: () => import('../components/parametrizacion/ConfigPermisos.vue'),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
    },
    {
        path: '/indicadores',
        name: 'AdministradorDeIndicadores',
        component: () => import('../components/indicadores/Indicadores.vue'),
    },
    {
        path: '/ejecucionIndicadores',
        name: 'EjecucionIndicadores',
        component: () => import('../components/indicadores/EjecucionIndicadores.vue'),
    },
    {
        path: '/metaEsperadaEnLinea',
        name: 'MetaEsperadaEnLinea',
        component: () => import('../components/indicadores/MetaEsperadaEnLinea.vue'),
    },
    {
        path: '/eventos',
        name: 'Eventos',
        component: () => import('../components/eventos/Eventos.vue'),
    },
    {
        path: '/categoriaEventos',
        name: 'CategoriaEventos',
        component: () => import('../components/eventos/CategoriaEventos.vue'),
    },
    {
        path: '/Tecnologicos',
        name: 'Tecnologicos',
        component: () => import('../components/servicios/Tecnologicos.vue'),
    },
    {
        path: '/RepotesTecnologicos',
        name: 'RepotesTecnologicos',
        component: () => import('../components/servicios/RepotesTecnologicos.vue'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
