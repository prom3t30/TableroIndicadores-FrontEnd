<template>
  <div v-if="aplications.CONFIGURACION && screen.CONFIGURAR.ver">
    <div>
      <!--INICIO Seccion de avisos y alertas de la pantalla-->
      <v-snackbar v-model="alert" :timeout="timeout">
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="alert = false"
            >Cerrar</v-btn
          >
        </template>
      </v-snackbar>
      <!--FIN Seccion de avisos y alertas de la pantalla-->
      <!--INICIO DIALOGO DE LOADING-->
      <v-overlay :value="dialogLoading"></v-overlay>
      <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
        <v-card color="warning" dark>
          <v-card-text>
            Cargando datos...
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--FIN DIALOGO DE LOADING-->
      <v-card class="mr-3 ml-3">
        <v-toolbar-title class="ml-3"
          >Configuración de roles y permisos</v-toolbar-title
        >
        <v-toolbar flat color="white">
          <v-select
            class="mt-6"
            :items="aplicaciones"
            label="Aplicaciones"
            @change="changedValueAplicacionSeleccionada"
          ></v-select>
          <v-spacer></v-spacer>
          <v-select
            class="mt-6"
            :items="roles"
            label="Roles"
            @change="changedValueRolSeleccionada"
          ></v-select>
        </v-toolbar>
        <div class="text--primary ml-3">
          En este módulo se realizan las configuracion de permisos para las
          aplicaciones.
        </div>
        <v-container>
          <v-row>
            <v-col sm="6" md="6" lg="6">
              <v-card class="pl-5 pt-3">
                <h3>Pantallas de la aplicación</h3>
                <h1 v-if="pantallasFiltradas.length == 0">
                  Seleccione una aplicación
                </h1>
                <v-radio-group v-model="pantallaSeleccionada">
                  <v-radio
                    v-for="item in pantallasFiltradas"
                    :key="item.value"
                    :label="`${item.text}`"
                    :value="item.value"
                    @click="changedValuePantallaSeleccionada"
                  ></v-radio>
                </v-radio-group>
              </v-card>
            </v-col>

            <v-col sm="6" md="6" lg="6">
              <v-card class="pl-5 pt-3">
                <h3>Privilegios</h3>
                <v-checkbox
                  class="mt-0 mb-0"
                  v-for="item in funciones"
                  :key="item.value"
                  :label="`${item.text}`"
                  :value="item.value"
                  v-model="privilegioSeleccionado"
                  @click="changedPrivilegioSeleccionado"
                ></v-checkbox>
                <v-btn
                  class="ma-2"
                  tile
                  color="success"
                  @click="actualizarPrivilegios"
                >
                  <v-icon left>mdi-pencil</v-icon>Actualizar privilegios
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    alert: false,
    timeout: 5000,
    message: "",
    dialogLoading: true,
    aplicaciones: [],
    roles: [],
    funciones: [],
    aplicacionFiltrada: null,
    pantallasFiltradas: [],
    pantallaSeleccionada: -1,
    rolSeleccionado: null,
    privilegioSeleccionado: [],
  }),
  computed: {
    ...mapGetters("auth", ["dataSession"]),
  },
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (this.aplications.CONFIGURACION && this.screen.CONFIGURAR.ver) {
          axios
            .get(this.$api + this.$aplicaciones)
            .then((response) => {
              this.aplicaciones = [];
              for (var item in response.data.data) {
                this.aplicaciones.push({
                  text: response.data.data[item].Nombre,
                  value: response.data.data[item].id,
                });
              }
            })
            .then(() => {
              axios.get(this.$api + this.$roles).then((response) => {
                this.roles = [];
                for (var item in response.data.data) {
                  this.roles.push({
                    text: response.data.data[item].Nombre,
                    value: response.data.data[item].id,
                  });
                }
              });
            })
            .then(() => {
              axios.get(this.$api + this.$funciones).then((response) => {
                this.dialogLoading = false;
                this.funciones = [];
                for (var item in response.data.data) {
                  this.funciones.push({
                    text: response.data.data[item].Nombre,
                    value: response.data.data[item].id,
                    estado: false,
                  });
                }
              });
            });
        } else {
          this.$router.push("/");
        }
      }
    }
  },
  methods: {
    changedPrivilegioSeleccionado(event) {},
    actualizarPrivilegios: function () {
      var privilegios = this.privilegioSeleccionado.join(",");
      this.dialogLoading = true;
      axios
        .post(this.$api + this.$privilegios + "/setprivilegios", {
          aplicacionId: this.aplicacionFiltrada,
          pantallaId: this.pantallaSeleccionada,
          rolId: this.rolSeleccionado,
          privilegios: privilegios,
        })
        .then((response) => {
          this.message = "privilegios del rol actualizados";
          this.alert = true;
          this.dialogLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    changedValueRolSeleccionada: function (value) {
      this.rolSeleccionado = value;
      this.pantallaSeleccionada = -1;
      this.privilegioSeleccionado = [];
    },
    changedValueAplicacionSeleccionada: function (value) {
      this.aplicacionFiltrada = value;
      this.initializeAplicaciones();
    },
    changedValuePantallaSeleccionada: function () {
      if (this.rolSeleccionado === null) {
        this.message = "Debe seleccionar un rol";
        this.alert = true;
      } else {
        this.dialogLoading = true;
        axios
          .get(
            this.$api +
              this.$privilegios +
              "/getprivilegios/" +
              this.aplicacionFiltrada +
              "/" +
              this.pantallaSeleccionada +
              "/" +
              this.rolSeleccionado
          )
          .then((response) => {
            console.log(response.data.data);
            this.privilegioSeleccionado = [];
            for (var index in response.data.data) {
              if (response.data.data[index].estado === 1) {
                this.privilegioSeleccionado.push(
                  response.data.data[index].funcion_id
                );
              }
            }
            this.dialogLoading = false;
          });
      }
    },
    initializeAplicaciones: function () {
      this.dialogLoading = true;
      axios
        .get(
          this.$api + this.$pantallas + "/indexById/" + this.aplicacionFiltrada
        )
        .then((response) => {
          this.dialogLoading = false;
          this.pantallasFiltradas = [];
          for (var item in response.data.data) {
            this.pantallasFiltradas.push({
              text: response.data.data[item].Nombre,
              value: response.data.data[item].id,
            });
          }
        });
    },
  },
};
</script>