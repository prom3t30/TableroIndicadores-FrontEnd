<template>
    <v-app>
        <MenuSuperior v-if="logged || estado"></MenuSuperior>
        <Header v-if="!logged || !estado"></Header>
        <v-main>
            <Menu v-if="logged || estado"></Menu>
            <div v-if="!logged || !estado" class="w-50 m-auto mt-5">
                <Login v-if="!logged || !estado"></Login>
            </div>

            <router-view class="pl-15"> </router-view>
        </v-main>
        <Footer></Footer>
    </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

import Menu from './components/Menu'
import MenuSuperior from './components/MenuSuperior'
import Dashboard from './components/Dashboard'
import Footer from './Footer'
import Login from './components/Login'
import Sing from './views/SingIn'
import Header from './components/Header'

export default {
    name: 'App',
    components: {
        Header,
        Login,
        Menu,
        Dashboard,
        MenuSuperior,
        Footer,
        Sing,
    },
    computed: {
        ...mapGetters('auth', ['dataSession']),
    },
}
</script>
<style scoped>
.color-sena {
    background-color: #fb8c00 !important;
}
.color-texto-sena {
    color: white;
}
</style>
