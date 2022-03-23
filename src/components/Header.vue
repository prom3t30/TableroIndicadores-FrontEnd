<template>

    <v-app-bar
      app
      color="warning"
      dark
    >
      <div class="d-flex align-center"
        
      >
        <v-img
          alt="Sennova logo"
          class="shrink mr-2"
          contain
          src="../assets/logo-de-Sena-sin-fondo-Blanco.png"
          transition="scale-transition"
          width="40"
        />

       <v-card-title>GESTION SENNOVA</v-card-title>
      </div>

      <v-spacer></v-spacer>
      <!-- <v-btn icon @click.stop="dialog = true">
        <v-icon>mdi-account</v-icon>
      </v-btn> -->
      <v-menu
        left
        bottom
        :close-on-content-click="false"
      >
      <!-- <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> -->
            <!-- <UsuarioCard></UsuarioCard> -->

<!-- 
        <v-list>
          <v-list-item @click="configuration()">
            <v-list-item-title>Configuración</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item>
        </v-list> -->
      </v-menu>
        <!-- <v-dialog
            v-model="dialog"
            min-height="500"
            max-width="500">
            <Login></Login>
        </v-dialog> -->
    </v-app-bar>


</template>

<script>
import Login from './Login'
import UsuarioCard from './UsuarioCard'

export default {
  name: 'MenuSuperior',
  components: {
    Login,UsuarioCard
  },

  data: () => ({
   
        dialog: false,
      
  }),
  methods:{
    configuration(){
      console.log("configuracion")
    },
    logout(){
      console.log("logout")
    }
  }
};
</script>