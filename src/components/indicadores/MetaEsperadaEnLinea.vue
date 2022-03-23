<template>
  <div v-if="aplications.METAS && screen.METASLINEA.ver">
    <v-data-table :headers="headers" :items="parametros" class="elevation-1">
      <template v-slot:top>
        <!--INICIO DE BUSQUEDA-->
        <v-toolbar-title>Meta Esperada En Línea</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-container>
          <v-row mt-20>
            <v-col sm="6" md="4" lg="2">
              <v-select
                :items="lineasProgramaticas"
                name="lineaProgramatica"
                item-text="linea"
                label="Lineas Programáticas"
                outlined
                v-model="lineaProgramatica"
                @change="setyears(lineaProgramatica)"
              ></v-select>
            </v-col>
            <v-col sm="6" md="4" lg="2">
              <v-select
                :items="years"
                name="year"
                label="Año"
                outlined
                v-model="year"
                @change="getIndicadores"
              ></v-select>
            </v-col>
            <v-col sm="6" md="4" lg="2">
              <v-select
                :items="indicadores"
                name="indicador"
                item-text="text"
                label="Indicadores"
                outlined
                v-model="indicador"
                @change="consultaIndicadores"
              ></v-select>
            </v-col>
            <v-col sm="6" md="4" lg="2">
              <v-text-field
                v-model="metaGlobal"
                label="Meta de la línea programatica"
                type="number"
                disabled
              ></v-text-field>
            </v-col>
            <v-col sm="6" md="4" lg="2">
              <v-btn
                color="warning"
                dark
                class="mb-2"
                @click="findMetasEsperadas"
                >Metas Esperadas</v-btn
              >
            </v-col>
            <v-dialog v-model="dialog" max-width="900px">
              <v-card>
                <v-card-title class="warning" style="color: white">
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container fluid>
                    <v-row>
                      <v-col class="border">
                        <h5>Meta de la línea</h5>
                        <strong>{{ metaGlobal }}</strong>
                      </v-col>
                    </v-row>
                    <v-row dense>
                      <div v-for="mes in meses" :key="mes.id">
                        <v-col cols="12" class="d-flex">
                          <v-card class="mx-auto" max-width="600">
                            <v-card-text>
                              <v-row class="flex-column">
                                <v-col class="headline" cols="12">
                                  <h3>{{ mes.mes }}</h3>
                                  <h5><strong>Meta esperada</strong></h5>
                                  <v-text-field
                                    v-model.number="mes.valorMetaEsperada"
                                    label="valor"
                                    type="number"
                                    :disabled="esperar || nowYear"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </div>
                    </v-row>
                    <v-row>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="warning darken-1"
                              :disabled="esperar || nowYear"
                              text
                              @click="save"
                              v-bind="attrs"
                              v-on="on"
                              >Guardar</v-btn
                            >
                          </template>
                          <span>Guardar Nueva Ejecución</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="warning darken-1"
                              text
                              @click="close"
                              :disabled="esperar"
                              v-bind="attrs"
                              v-on="on"
                              >Cancelar</v-btn
                            >
                          </template>
                          <span>Cancelar Nueva Ejecución</span>
                        </v-tooltip>
                      </v-card-actions>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-row>
        </v-container>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
import { mapActions, mapState, mapGetters } from "vuex";
import LineaprogramaticaVue from "../parametrizacion/Lineaprogramatica.vue";
export default {
  data: () => ({
    esperar: false,
    nowYear: true,
    logged: null,

    dialog: false,
    years: [],
    year: null,
    search: "",
    cards: [],
    indicador: null,
    indicadores: [],
    metaPorLinea: "",
    metasPorLinea: [],
    metaGlobal: null,
    user: null,
    lineaProgramatica: null,
    lineasProgramaticas: [],
    metaEsperada: "",
    valorEjecucionEsperada: [],
    mes: "",
    meses: [
      {
        id: 1,
        mes: "Enero",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 2,
        mes: "Febrero",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 3,
        mes: "Marzo",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 4,
        mes: "Abril",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 5,
        mes: "Mayo",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 6,
        mes: "Junio",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 7,
        mes: "Julio",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 8,
        mes: "Agosto",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 9,
        mes: "Septiembre",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 10,
        mes: "Octubre",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 11,
        mes: "Noviembre",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
      {
        id: 12,
        mes: "Diciembre",
        valorMetaEsperada: null,
        metaXLinea_id: null,
        valorejecucionrealizada: null,
        year: null,
        user: null,
      },
    ],

    parametros: [],
    headers: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      created_at: "",
      updated_at: "",
      year: "",
      mes: "",
      metaXLinea_id: "",
      valorejecucionesperada: "",
    },
    deletedItem: {
      id: 0,
      created_at: "",
      updated_at: "",
      year: "",
      mes: "",
      metaXLinea_id: "",
      valorejecucionesperada: "",
    },
    defaultItem: {
      id: 0,
      created_at: "",
      updated_at: "",
      estado: false,
      year: "",
      mes: "",
      metaXLinea_id: "",
      valorejecucionesperada: "",
    },
  }),
  computed: {
    ...mapGetters("auth", ["dataSession"]),
    formTitle() {
      return this.editedIndex === -1
        ? "Metas Esperadas"
        : "Editar Metas Esperadas";
    },
  },
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (this.aplications.METAS && this.screen.METASLINEA.ver) {
          this.indicadores = [];
          this.user = this.dataSession.id;
          axios.get(this.$api + this.$lineaprogramatica).then((response) => {
            this.lineasProgramaticas = [];
            for (var item in response.data.data) {
              this.lineasProgramaticas.push({
                linea: response.data.data[item].Nombre,
                value: response.data.data[item].id,
              });
            }
          });
        }
      }
    } else {
      this.$router.push("/");
    }
  },
  methods: {
    valorMetaEsperada() {
      var valorEjecucionEsperada = this.valorEjecucionEsperada;
      axios
        .post(this.$api + this.$metaEsperadaEnLinea + "/valorMetaEsperada/", {
          valorEjecucionEsperada: valorEjecucionEsperada,
        })
        .then((response) => {});
    },
    findMetasEsperadas() {
      this.esperar = true;
      var lineaProgramatica = this.lineaProgramatica;
      var indicador = this.indicador;
      var year = this.year;
      if (lineaProgramatica != null && indicador != null && year != null) {
        for (var i = 0; i <= 11; i++) {
          this.meses[i].metaXLinea_id = null;
          this.meses[i].year = year;
          this.meses[i].valorMetaEsperada = null;
          this.meses[i].valorejecucionrealizada = null;
        }

        axios
          .post(
            this.$api +
              this.$metaEsperadaEnLinea +
              "/getMetasEsperadasPorLineaPorAnio",
            {
              lineaProgramatica: lineaProgramatica,
              indicador: indicador,
              year: year,
              meses: this.meses,
            }
          )
          .then((response) => {
            for (var i = 0; i <= 11; i++) {
              this.meses[i].metaXLinea_id = response.data.metaPorLinea[0].id;
              this.meses[i].year = year;
              this.meses[i].valorMetaEsperada =
                response.data.mes[i] != null
                  ? response.data.mes[i].valorejecucionesperada
                  : 0;
              this.meses[i].valorejecucionrealizada =
                response.data.mes[i] != null
                  ? response.data.mes[i].valorejecucionrealizada
                  : 0;
            }
            this.esperar = false;
            console.log(response);
          });
        this.dialog = true;

        var fecha = new Date();
        var thisYear = fecha.getFullYear();

    if (year == thisYear) {
          this.nowYear = false;
        }
      } else {
        this.dialog = false;
        this.$swal({
          icon: "error",
          title: "Ups...!",
          text: "No ha escogido la linea programatica, el año y/o el indicador.",
          confirmButtonColor: "#fb8c00",
        });
      }
    },
    setyears(item) {
      this.indicadores = [];
      this.year = null;
      this.dialogLoading = true;
      if (item > 0) {
        this.years = [];
        axios
          .post(this.$api + this.$metaPorLinea + "/getYearsByLine", {
            linea_id: item,
          })
          .then((response) => {
            this.years = response.data;
          });
      }
    },
    getIndicadores() {
      this.indicadores = [];
      axios
        .post(
          this.$api + this.$metaEsperadaEnLinea + "/getIndicadoresMetaLinea/",
          { id: this.lineaProgramatica, year: this.year }
        )
        .then((response) => {
          for (var i = 0; i <= 1000000; i++) {
            if (response.data[i] != undefined) {
              this.indicadores.push({
                text: response.data[i][0].descripcion,
                value: response.data[i][0].id,
              });
            } else {
              break;
            }
          }
          this.dialogLoading = false;
        })
        .catch((err) => {
          this.dialogLoading = false;
        });
    },
    consultaLineasProgramaticas() {
      var lineaProgramatica = this.lineasProgramaticas;
    },
    consultaIndicadores() {
      var year = this.year;
      var indicador = this.indicador;
      axios
        .post(this.$api + this.$metaPorLinea + "/getlineMeta", {
          linea_id: this.lineaProgramatica,
          year: this.year,
          indicador_id: this.indicador,
        })
        .then((response) => {
          this.metaGlobal = response.data.metaLinea;
        });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      var metaPorLinea = this.metaPorLinea;
      var lineaProgramatica = this.lineaProgramatica;
      var idIndicador = this.indicador_id;
      if (this.editedIndex > -1) {
        this.dialogLoading = true;
        axios
          .post(this.$api + this.$ejecucionIndicador)
          .then((response) => {
            this.message = "Meta Esperada En línea";
            this.alert = true;
            Object.assign(this.parametros[this.editedIndex], this.editedItem);
            this.dialogLoading = false;
            this.close();
          })
          .catch((err) => {
            this.alert = true;
            this.dialogLoading = false;
            this.close();
          });
      } else {
        this.dialogLoading = true;
        var com = 0;
        var requeridos = true;
        this.esperar = true;
        if (requeridos === true) {
          for (var i = 0; i < this.meses.length; i++) {
            com += this.meses[i].valorMetaEsperada;
            this.meses[i].user = this.user;
          }

          if (this.metaGlobal == com) {
            axios
              .post(this.$api + this.$ejecucionIndicador, this.meses)
              .then((response) => {
                this.esperar = false;
                this.dialogLoading = false;
                this.alert = true;
                this.message = "Metas adicionadas";

                this.parametros.push(this.editedItem);
                this.close();
                this.$swal({
                  icon: "success",
                  title: "Metas adicionadas",
                  confirmButtonColor: "#fb8c00",
                });
              })
              .catch((err) => {
                this.esperar = false;
                this.alert = true;
                this.$swal({
                  icon: "error",
                  title: "Ups...!",
                  text: "ERROR 500",
                  confirmButtonColor: "#fb8c00",
                });
                this.dialogLoading = false;
                this.close();
              });
          } else {
            if (this.metaGlobal > com) {
              this.$swal({
                icon: "error",
                title: "Ups...!",
                html:
                  `
                                <p>El valor total de la suma de las metas esperadas es menor a la meta de la línea programática.</p>
                                <p >Meta de la Línea programática: ` +
                  this.metaGlobal +
                  `</p>
                                <p >Meta acumulada de la línea programática: ` +
                  com +
                  `</p>
                            `,
                confirmButtonColor: "#fb8c00",
              });
              this.esperar = false;
            } else {
              this.$swal({
                icon: "error",
                title: "Ups...!",
                html:
                  `
                                <p>El valor total de la suma de las metas esperadas es mayor a la meta de la línea programática.</p>
                                <p >Meta de la Línea programática: ` +
                  this.metaGlobal +
                  `</p>
                                <p >Meta acumulada de la línea programática: ` +
                  com +
                  `</p>
                            `,
                confirmButtonColor: "#fb8c00",
              });
              this.esperar = false;
            }
          }
        }
      }
    },
  },
};
</script>