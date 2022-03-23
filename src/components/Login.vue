<template>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
          >
            <v-card class="elevation-20">
              <v-toolbar
                color="warning"
                dark
                flat
              >

                <v-img
                    name="logoLogin"
                    alt="Sennova logo"
                    class="shrink mr-2"
                    contain
                    src="../assets/logo-de-Sena-sin-fondo-Blanco.png"
                    transition="scale-transition"
                    width="40"
                />

                <v-spacer></v-spacer>
                <v-toolbar-title>GESTION SENNOVA</v-toolbar-title>
              
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Correo"
                    name="login"
                    prepend-icon="mdi-account"
                    type="mail"
                    v-model.trim="loginForm.email" 
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model.trim="loginForm.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col>
                    <!-- <v-btn color="warning">Olvidó su contraseña</v-btn> -->
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col>
                    <v-btn color="warning" @click="loginAuth">Ingresar</v-btn>
                  </v-col>
                  
                  
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  
  export default {
    name:'Login',
    components:{},
    data() {
      return {
        loginForm: {
          email: '',
          password: ''
        },
        showLoginForm: true,
        showPasswordReset: false
      }
    },
    methods:{
      ...mapActions('auth', ['login']),
      loginAuth(){
        if(this.loginForm.email.includes('@')){
          if(this.loginForm.password != '')
          {
            
            this.login({email:this.loginForm.email, password: this.loginForm.password})
          }else{
             this.$swal({
               icon: 'error',
               title: 'Oops...',
               text: 'No ingreso su contraseña'

             });
          }
        }else{
          this.$swal({
            icon: 'error',
            title: 'Oops...',
            text: 'No ingreso su cuenta de correo electronico'

          });
        }
         
         
      }
      
    }
  }
  
</script>