<template>
    <v-card>
    <v-list>
        <v-list-item>
        <v-list-item-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title class="w-100">{{ nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{ nameRol }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="menu = false">Configuracion</v-btn>
      <v-btn color="primary" text @click="loginLogOut">Salir</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import {mapActions, mapState, mapGetters} from 'vuex'
export default {
  name: "UsuarioCard",
  methods : {
    ...mapActions('auth', ['logOut']),
    loginLogOut(){
      this.$router.push('/');
      this.logOut()
    }
  }
};
</script>