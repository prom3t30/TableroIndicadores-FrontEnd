<template>
  <div v-if="aplications.PARAMETRIZACION && screen.PLATAFORMA.ver">
    <v-data-table
      :headers="headers"
      :items="parametros"
      :search="search"
      sort-by="valor"
      class="elevation-1"
    >
      <template v-slot:top>
        <!--INICIO Seccion de avisos y alertas de la plataforma-->
        <v-snackbar v-model="alert" :timeout="timeout">
          {{ message }}
          <template v-slot:action="{ attrs }">
            <v-btn color="red" text v-bind="attrs" @click="alert = false">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
        <!--FIN Seccion de avisos y alertas de la plataforma-->
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
          <v-toolbar-title>Plataforma </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on"
                >Nueva plataforma</v-btn
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
                        label="Plataforma"
                        :rules="[(v) => !!v || 'Debe digitar un Nombre']"
                      ></v-text-field>
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
                  <span>Cancelar Nueva Plataforma</span>
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
                  <span>Guardar Nueva Plataforma</span>
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
        text: "Plataforma",
        align: "start",
        sortable: true,
        value: "Nombre",
      },
      { text: "Descripción", value: "Descripcion" },
      { text: "Editar/Borrar", value: "actions", sortable: false },
    ],
    parametros: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      created_at: "",
      updated_at: "",
    },
    deletedItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      created_at: "",
      updated_at: "",
    },
    defaultItem: {
      id: 0,
      Nombre: "",
      Descripcion: "",
      created_at: "",
      updated_at: "",
      estado: false,
    },
  }),
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (this.aplications.PARAMETRIZACION && this.screen.PLATAFORMA.ver) {
          axios.get(this.$api + this.$plataforma).then((response) => {
            this.parametros = response.data.data;
            this.dialogLoading = false;
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
      return this.editedIndex === -1 ? "Nueva plataforma" : "Editar plataforma";
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
    initialize() {
      this.dialogLoading = true;
      axios
        .get(this.$api + this.$plataforma)
        .then((response) => {
          this.parametros = response.data.data;
          this.dialogLoading = false;
        })
        .catch((erro) => {
          console.err(erro);
        });
    },
    editItem(item) {
      this.editedIndex = this.parametros.indexOf(item);
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
          .delete(this.$api + this.$plataforma + "/" + this.deletedItem.id)
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
      });
    },
    save() {
      this.dialogLoading = true;
      this.editedItem.Nombre = this.editedItem.Nombre.toUpperCase();
      if (this.editedIndex > -1) {
        axios
          .put(this.$api + this.$plataforma, this.editedItem)
          .then((response) => {
            this.message = "elemento actualizado";
            this.alert = true;
            Object.assign(this.parametros[this.editedIndex], this.editedItem);
            this.dialogLoading = false;
            this.$swal({
              icon: "success",
              title: "Elemento Actualizado",
              confirmButtonColor: "#fb8c00",
            });
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
          .post(this.$api + this.$plataforma, this.editedItem)
          .then((response) => {
            this.message = "elemento adicionado";
            this.alert = true;
            this.editedItem.id = response.data.data.id;
            this.parametros.push(this.editedItem);
            this.dialogLoading = false;
            this.$swal({
              icon: "success",
              title: "Elemento Registrado",
              confirmButtonColor: "#fb8c00",
            });
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