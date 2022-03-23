<template>
  <div v-if="aplications.CONFIGURACION && screen.PANTALLAS.ver">
    <v-data-table
      :headers="headers"
      :items="parametros"
      :search="search"
      sort-by="valor"
      class="elevation-1"
    >
      <template v-slot:top>
        <!--INICIO Seccion de avisos y alertas de la pantalla-->
        <v-snackbar v-model="alert" :timeout="timeout">
          {{ message }}
          <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="alert = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
        <!--FIN Seccion de avisos y alertas de la pantalla-->
        <!--INICIO DIALOGO DE ADVERTENCIA DE BORRADO/EDICION-->
        <v-dialog v-model="dialogAdvertencia" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Borrar el registro</v-card-title>
            <v-card-text>Desea borrar el registro?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="warning darken-1"
                text
                @click="dialogAdvertencia = false"
                >No</v-btn
              >
              <v-btn color="danger darken-1" text @click="deleteItem">Si</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--FIN DIALOGO DE ADVERTENCIA DE BORRADO/EDICION-->
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
        <v-toolbar flat color="white">
          <v-toolbar-title>Pantallas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-select
            class="mt-6"
            :items="aplicaciones"
            label="Aplicaciones"
            @change="changedValueAplicacionSeleccionada"
          ></v-select>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on"
                >Nueva pantalla</v-btn
              >
              <v-btn
                color="warning"
                dark
                class="mb-2 mr-5"
                v-bind="attrs"
                @click="initialize"
              >
                <v-icon dark>mdi-update</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="warning" style="color: white">
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.Nombre"
                        label="Pantalla"
                        :rules="[(v) => !!v || 'Debe digitar un Nombre']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-select
                        :items="aplicaciones"
                        :rules="[
                          (v) => !!v || 'Debe seleccionar una aplicación',
                        ]"
                        label="Aplicaciones"
                        @change="changedValueAplicacion"
                        v-model="aplicacionSeleccionada"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.Descripcion"
                        label="Descripción"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="warning darken-1"
                      text
                      @click="close"
                      v-bind="attrs"
                      v-on="on"
                      >Cancelar</v-btn
                    >
                  </template>
                  <span>Cancelar Nueva Pantalla</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="warning darken-1"
                      :disabled="false"
                      text
                      @click="save"
                      v-bind="attrs"
                      v-on="on"
                      >Guardar</v-btn
                    >
                  </template>
                  <span>Guardar Nueva Pantalla</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon color="indigo" small class="mr-2" @click="editItem(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          color="error"
          small
          class="mr-2"
          @click="showConfirmDelete(item)"
        >
          <v-icon> mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
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
    dialog: false,
    dialogAdvertencia: false,
    dialogLoading: true,
    search: "",
    headers: [
      {
        text: "Pantalla",
        align: "start",
        sortable: true,
        value: "Nombre",
      },
      { text: "Descripción", value: "Descripcion" },
      { text: "Aplicacion", value: "aplicacion.Nombre" },
      { text: "Editar/Borrar", value: "actions", sortable: false },
    ],
    parametros: [],
    aplicaciones: [],
    aplicacionSeleccionada: null,
    aplicacionFiltrada: 0,
    editedIndex: -1,
    editedItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      aplicacion_id: 0,
      created_at: "",
      updated_at: "",
      aplicacion: {
        id: 0,
        Nombre: null,
        estado: null,
        Descripcion: null,
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    },
    deletedItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      aplicacion_id: 0,
      created_at: "",
      updated_at: "",
      aplicacion: {
        id: 0,
        Nombre: null,
        estado: null,
        Descripcion: null,
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    },
    defaultItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      aplicacion_id: 0,
      created_at: "",
      updated_at: "",
      aplicacion: {
        id: 0,
        Nombre: null,
        estado: null,
        Descripcion: null,
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    },
  }),
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (this.aplications.CONFIGURACION && this.screen.CONFIGURAR.ver) {
          axios
            .get(this.$api + this.$aplicaciones)
            .then((response) => {
              console.log("carga aplicaciones");
              this.aplicaciones = [];
              for (var item in response.data.data) {
                this.aplicaciones.push({
                  text: response.data.data[item].Nombre,
                  value: response.data.data[item].id,
                });
              }
            })
            .then(() => {
              axios
                .get(
                  this.$api +
                    this.$pantallas +
                    "/indexById/" +
                    this.aplicacionFiltrada
                )
                .then((response) => {
                  this.parametros = response.data.data;
                  this.dialogLoading = false;
                });
            });
        } else {
          this.$router.push("/");
        }
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["dataSession"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nueva pantalla" : "Editar pantalla";
    },
    disabled() {
      return this.editedItem.Nombre.length === 0; // or === 0
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    changedValueAplicacion: function (value) {
      this.aplicacionSeleccionada = value;
    },
    changedValueAplicacionSeleccionada: function (value) {
      this.aplicacionFiltrada = value;
      this.initialize();
    },
    initialize() {
      this.dialogLoading = true;
      axios
        .get(
          this.$api + this.$pantallas + "/indexById/" + this.aplicacionFiltrada
        )
        .then((response) => {
          this.parametros = response.data.data;
          this.dialogLoading = false;
        })
        .catch((erro) => {
          console.err(erro);
        });
    },
    editItem(item) {
      console.log(item);
      this.editedIndex = this.parametros.indexOf(item);
      this.aplicacionSeleccionada = item.aplicacion_id;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    showConfirmDelete(item) {
      this.deletedItem = item;
      this.dialogAdvertencia = true;
    },
    deleteItem() {
      const index = this.parametros.indexOf(this.deletedItem);
      this.dialogAdvertencia = false;
      if (this.parametros.splice(index, 1)) {
        axios
          .delete(this.$api + this.$pantallas + "/" + this.deletedItem.id)
          .then((response) => {
            this.message = "elemento eliminado";
            this.alert = true;
          });
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.aplicacionSeleccionada = null;
      });
    },
    save() {
      if (this.aplicacionSeleccionada != null)
        this.editedItem.aplicacion_id = this.aplicacionSeleccionada;
      else {
        this.message = "Debe seleccionar una aplicación";
        this.alert = true;
        return;
      }

      this.dialogLoading = true;
      this.editedItem.Nombre = this.editedItem.Nombre.toUpperCase();
      if (this.editedIndex > -1) {
        axios
          .put(this.$api + this.$pantallas, this.editedItem)
          .then((response) => {
            this.message = "elemento actualizado";
            this.alert = true;
            Object.assign(this.parametros[this.editedIndex], this.editedItem);
            this.dialogLoading = false;
            this.close();
          })
          .catch((err) => {
            this.alert = true;
            this.message = err.response.data.errors.Nombre[0];
            this.dialogLoading = false;
            this.close();
          });
      } else {
        this.editedItem.estado = true;
        axios
          .post(this.$api + this.$pantallas, this.editedItem)
          .then((response) => {
            this.message = "elemento adicionado";
            this.alert = true;
            this.editedItem.id = response.data.data.id;
            this.editedItem.aplicacion.Nombre = this.aplicaciones
              .filter((x) => x.value === this.aplicacionSeleccionada)
              .map((x) => x.text);
            this.parametros.push(this.editedItem);
            this.dialogLoading = false;
            this.close();
          })
          .catch((err) => {
            this.alert = true;
            this.message = err.response.data.errors.Nombre[0];
            this.dialogLoading = false;
            this.close();
          });
      }
    },
  },
};
</script>