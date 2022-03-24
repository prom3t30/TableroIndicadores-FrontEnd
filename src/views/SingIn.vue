<template>
    <v-app>
        <Header></Header>
        <Login></Login>
        <Footer></Footer>
    </v-app>
</template>

<script>
import Login from '../components/Login'
import Header from '../components/Header'
import Footer from '../Footer'

export default {
    name: 'Sing',
    components: {
        Header,
        Login,
        Footer,
    },

    data: () => ({
        //
    }),
    methods: {},
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
