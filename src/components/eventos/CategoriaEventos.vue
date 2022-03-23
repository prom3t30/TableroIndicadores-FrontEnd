<template>
  <v-row class="fill-height" v-if="aplications.EVENTOS && screen.GESTIONEVENTOS.ver">
    <!-- ALERTA DE MENSAJES ERRONEOS -->
    <v-snackbar v-model="alert" :timeout="timeout">
      {{ this.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="alert = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <!-- ALERTA DE MENSAJES ERRONEOS -->

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
    <v-dialog
      v-model="dialog"
      @click:outside="(nuevo = false), (editar = false), (eliminar = false)"
      max-width="500px"
    >
      <!-- CARD PARA NUEVA CATEGORIA -->
      <v-card v-if="nuevo">
        <v-card-title class="warning text-white">
          Nueva Categoria de evento
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              label="Nombre:"
              hint="Nombre de la categoria"
              name="categoria"
              v-model="editEventoCategoria.nombre"
              autofocus
              :rules="nombreEvento"
            ></v-text-field>
            <v-textarea
              label="Descripcion:"
              hint="Descripcion de la categoria del evento"
              v-model="editEventoCategoria.descripcion"
              :rules="C_textarea"
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="(dialog = false), (nuevo = false)"
            text
            color="warning darken-1"
            >Cancelar</v-btn
          >
          <v-btn @click="saveCategory" text color="warning darken-1"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>

      <!-- CARD PARA EDITAR -->
      <v-card v-else-if="editar">
        <v-card-title class="warning text-white">
          Editar categoria del evento
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-text-field
              label="Nombre:"
              hint="Nombre de la categoria"
              name="categoria"
              v-model="editItemCategoria.nombre"
              autofocus
              :rules="nombreEvento"
            ></v-text-field>
            <v-textarea
              label="Descripcion:"
              hint="Descripcion de la categoria del evento"
              v-model="editItemCategoria.descripcion"
              :rules="C_textarea"
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="(dialog = false), (editar = false)"
            text
            color="warning darken-1"
            >Cancelar</v-btn
          >
          <v-btn @click="uploadCategoriaEvento" text color="warning darken-1"
            >Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
      <!-- CARD PARA EDITAR -->

      <!-- CARD PARA ELIMINAR -->
      <v-card v-else>
        <v-card-title class="headline">
          Eliminar categoria de evento
        </v-card-title>
        <v-card-text>Desea borrar la categoria?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="(dialog = false), (eliminar = false)"
            text
            color="warning darken-1"
          >
            Cancelar
          </v-btn>
          <v-btn @click="deleteCategoriaEvento" text>Eliminar</v-btn>
        </v-card-actions>
      </v-card>
      <!-- CARD PARA ELIMINAR -->
    </v-dialog>

    <v-col>
      <v-toolbar flat color="white">
        <v-toolbar-title> Categorías de eventos </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="orange text-white"
          @click="(dialog = true), (nuevo = !nuevo)"
        >
          Nueva Categoria
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="indigo" small class="mr-2" @click="editItem(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            small
            class="mr-2"
            @click="deleteItem(item)"
          >
            <v-icon> mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "formularioEvento",
  data: () => ({
    alert: false,
    user: 0,
    timeout: 5000,
    message: "",
    dialog: false,
    dialogLoading: false,
    dialogAdvertencia: false,
    nuevo: false,
    editar: false,
    eliminar: false,
    search: "",

    C_textarea: [
      (value) => {
        const pattern = /[a-zA-Z-1-9\v]+|(^$)/;
        return pattern.test(value) || "Describcion de la categoria invalia";
      },
    ],

    nombreEvento: [
      (value) => !!value || "Este campo es nesesario.",
      (value) => (value || "").length <= 100 || "Maximo 100 Caracteres",
      (value) => {
        const pattern = /[a-zA-Z-1-9\v]+|(^$)/;
        return pattern.test(value) || "Nombre del la categoria invalido";
      },
    ],

    headers: [
      {
        text: "Categorías de evento",
        align: "start",
        sortable: true,
        value: "nombre",
      },
      { text: "Descripción", value: "descripcion" },
      { text: "Editar/Borrar", value: "actions", sortable: false },
    ],
    items: [],
    editEventoCategoria: {
      id: null,
      nombre: "",
      descripcion: "",
      created_at: null,
      updated_at: null,
      deleted_at: null,
    },
    editItemCategoria: null,
  }),
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (this.aplications.EVENTOS && this.screen.CATEVENTOS.ver) {
          this.getCategorys();
        }
      }
    } else {
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters("auth", ["dataSession"]),
  },
  methods: {
    async getCategorys() {
      try {
        this.dialogLoading = true;
        await axios
          .get(this.$api + this.$categoriaevento)
          .then((res) => {
            this.items = res.data.data;
            this.dialogLoading = false;
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async saveCategory() {
      this.message = "Categoria Guaradada";
      try {
        if (this.editEventoCategoria.nombre) {
          this.dialogLoading = true;
          this.editEventoCategoria.nombre;
          this.editEventoCategoria.descripcion;
          this.dialog = false;
          this.nuevo = false;
          await axios
            .post(this.$api + this.$categoriaevento, this.editEventoCategoria)
            .then((res) => {
              this.getCategorys();
              this.alert = true;
              this.editEventoCategoria.nombre = "";
              this.editEventoCategoria.descripcion = "";
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          this.message = "El nombre de la categoria es nesesario";
          this.alert = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async uploadCategoriaEvento() {
      try {
        this.message = "Categoria actualizada";
        this.dialogLoading = true;
        this.dialog = false;
        this.editar = false;
        this.editEventoCategoria.nombre;
        this.editEventoCategoria.descripcion;
        await axios
          .put(this.$api + this.$categoriaevento, this.editItemCategoria)
          .then((res) => {
            this.getCategorys();
            this.alert = true;
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCategoriaEvento() {
      try {
        this.$swal({
          title: "¿Seguro desea eliminar esta categoria?",
          text: "No podrá revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#fb8c00",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Si, eliminar categoria!",
        }).then((result) => {
          this.dialogLoading = true;
          if (result.isConfirmed) {
            this.dialog = false;
            axios
              .delete(
                this.$api +
                  this.$categoriaevento +
                  "/" +
                  this.editItemCategoria.id
              )
              .then((res) => {
                if (res.status == 204) {
                  this.getCategorys();
                  this.eliminar = false;
                  this.$swal(
                    "Eliminada!",
                    "La categoria ha sido eliminada.",
                    "success"
                  );
                } else {
                  this.$swal(
                    "No fue eliminada!",
                    "La categoria no fue eliminada.",
                    "warninig"
                  );
                }
              })
              .catch((err) => {
                console.error(err);
              });
            this.dialogLoading = false;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    async editItem(item) {
      this.dialog = true;
      this.editar = !this.editar;
      this.editItemCategoria = item;
    },
    async deleteItem(item) {
      this.dialog = true;
      this.eliminar = !this.eliminar;
      this.editItemCategoria = item;
    },
  },
};
</script>
