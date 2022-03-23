<template>
  <v-app>
    <MenuSuperior></MenuSuperior>
    <v-main>
      <Menu></Menu>
      
    </v-main>
      <Footer></Footer>
  </v-app>
</template>

<script>
import Menu from '../components/Menu'
import MenuSuperior from '../components/MenuSuperior'
import Dashboard from '../components/Dashboard'
import Footer from '../Footer'



export default {
  name: 'Home',
  components: {
   Menu, Dashboard, MenuSuperior, Footer 
  },

  data: () => ({
    //
  }),
  methods:{

  }
};
</script>
<style scoped>
  .color-sena{
    background-color: #fb8c00 !important;
    
  }
  .color-texto-sena{color:white;}
</style>
