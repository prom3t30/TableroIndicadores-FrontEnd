<template>
    <div v-if="aplications.INDICADORES && screen.EJEINDICADOR.ver">
        <!--INICIO DIALOGO DE LOADING-->
        <v-overlay :value="dialogLoading"></v-overlay>
        <v-dialog v-model="dialogLoading" hide-overlay persistent width="300">
            <v-card color="warning" dark>
                <v-card-text>
                    Cargando datos...
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!--FIN DIALOGO DE LOADING-->

        <!--Inicio de Busqueda-->
        <v-toolbar-title>Ejecución De La Meta Por Línea</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-container>
            <v-row mt-20>
                <v-col>
                    <v-select :items="lineasProgramaticas" name="lineaProgramatica" item-text="linea" label="Lineas Programáticas" outlined v-model="lineaProgramatica" @change="setyears(lineaProgramatica)"></v-select>
                </v-col>
                <v-col>
                    <v-select :items="years" name="year" label="Año" outlined v-model="year" @change="getIndicadores"></v-select>
                </v-col>
                <v-col>
                    <v-select :items="indicadores" name="indicador" item-text="text" label="Indicadores" outlined v-model="indicador" @change="consultaIndicadores"></v-select>
                </v-col>
                <v-col>
                    <v-btn color="warning" dark class="mb-2" @click="findMetasEsperadas">Ejecución de la Meta</v-btn>
                </v-col>

                <!--Fin de Busqueda-->
                <!--Inicio de dialogEjecucionDeLaMeta -->
                <v-col>
                    <v-dialog v-model="dialogEjecucionDeLaMeta" max-width="900px">
                        <v-card>
                            <v-card-title class="warning" style="color: white">
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row dense>
                                        <div v-for="mes in meses" :key="mes.id">
                                            <v-col cols="12" class="d-flex">
                                                <v-card class="mx-auto" max-width="600">
                                                    <v-card-text>
                                                        <v-row class="flex-column">
                                                            <v-col class="headline" cols="12">
                                                                <h3>{{ mes.mes }}</h3>
                                                                <v-text-field name="metaEsperada" item-text="number" label="Meta Esperada" outlined disabled v-model="mes.metaEsperada" @change="metaEsperada"></v-text-field>
                                                                <v-text-field name="metaEjecutada" label="Meta Ejecutada" type="number" :disabled="esperar || !nowYear || temporal" outlined v-model="mes.metaEjecutada" @change="metaEjecutada"></v-text-field>
                                                            </v-col>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-tooltip bottom v-if="screen.EJEINDICADOR.ver">
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-icon color="indigo" dark v-bind="attrs" :disabled="!nowYear" v-on="on" @click="nuevaEjecucion(mes)">mdi-message-draw</v-icon>
                                                                    </template>
                                                                    <span>Nueva Ejecución</span>
                                                                </v-tooltip>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-icon color="indigo" dark v-bind="attrs" v-on="on" @click="verEjecucion(mes.id)">mdi-tooltip-text</v-icon>
                                                                    </template>
                                                                    <span>Ver Ejecución</span>
                                                                </v-tooltip>
                                                            </v-card-actions>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </div>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-spacer></v-spacer>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn color="warning darken-1" :disabled="!nowYear || temporal" text @click="saveMetasEjecutadasGeneral" v-bind="attrs" v-on="on">Guardar</v-btn>
                                            </template>
                                            <span>Guardar Nueva Ejecución</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn color="warning darken-1" text v-bind="attrs" @click="closeDialogEjecucion" v-on="on">Cancelar</v-btn>
                                            </template>
                                            <span>Cancelar Nueva Ejecución</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-dialog>
                    <!--Fin de dialogEjecucionDeLaMeta -->
                    <!--Inicio de dialogNuevaEjecución -->

                    <v-dialog v-model="dialogNuevaEjecucion" max-width="500">
                        <v-card class="mx-auto" max-width="500">
                            <v-card-title class="warning" style="color: white">
                                <span class="headline">Nueva Ejecución</span>
                            </v-card-title>
                            <v-card-text class="background">
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <h5>Centro de Formacion</h5>
                                            <v-select :items="centros" name="centro" item-text="text" label="Centro" outlined v-model="centro"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <h5>Valor</h5>
                                            <v-text-field v-model="valorMes.metaEjecutada" label="Valor" type="number"> </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="warning darken-1" :disabled="esperar" text @click="saveMetasEjecutadas" v-bind="attrs" v-on="on">Guardar</v-btn>
                                                </template>
                                                <span>Guardar Nueva Ejecución</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn color="warning darken-1" text :disabled="esperar" v-bind="attrs" @click="closeNuevaEjecucion" v-on="on">Cancelar</v-btn>
                                                </template>
                                                <span>Cancelar Nueva Ejecución</span>
                                            </v-tooltip>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogVerEjecucion" max-width="900">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Ver Ejecución</span>
                        </v-card-title>
                        <v-card-text class="background" style="background-color: white">
                            <v-container>
                                <template>
                                    <v-data-table :headers="headers" :items="detallesVerEjecuccion" class="elevation-1"></v-data-table>
                                </template>
                                <v-row>
                                    <v-col>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn color="warning darken-1" :disabled="false" text @click="closeVerEjecucion" v-bind="attrs" v-on="on">Volver</v-btn>
                                            </template>
                                            <span>Volver a ejecución de la meta.</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-dialog>

                    <!--Fin de dialogNuevaEjecución -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script>
import axios from 'axios'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    name: 'ejecucionindicadores',
    data: () => ({
        dialogLoading: true,
        esperar: false,
        nowYear: null,
        temporal: true,
        dialog: false,
        detallesVerEjecuccion: [],
        dialogEjecucionDeLaMeta: false,
        dialogNuevaEjecucion: false,
        dialogVerEjecucion: false,
        years: [],
        year: null,
        search: '',
        cards: [],
        indicador: null,
        indicadores: [],
        metasEsperadas: [],
        lineaProgramatica: null,
        lineasProgramaticas: [],
        user: null,
        valorMes: {
            centro_id: null,
            id: 1,
            mes: 'Enero',
            metaEsperada: null,
            metaEjecutada: 0,
            user: null,
            idDetalle: null,
        },
        centro: '',
        centros: [],
        ejecutor: '',
        mes: '',
        meses: [
            {
                centro_id: null,
                id: 1,
                mes: 'Enero',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 2,
                mes: 'Febrero',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 3,
                mes: 'Marzo',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 4,
                mes: 'Abril',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 5,
                mes: 'Mayo',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 6,
                mes: 'Junio',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 7,
                mes: 'Julio',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 8,
                mes: 'Agosto',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 9,
                mes: 'Septiembre',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 10,
                mes: 'Octubre',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 11,
                mes: 'Noviembre',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
            {
                centro_id: null,
                id: 12,
                mes: 'Diciembre',
                metaEsperada: null,
                metaEjecutada: 0,
                user: null,
                idDetalle: null,
            },
        ],

        parametros: [],
        headers: [
            { text: 'Centro de Formación', value: 'centro' },
            { text: 'Valor', value: 'valor' },
            { text: 'Ejecutor', value: 'ejecutor' },
        ],
        editedIndex: -1,
        editedItem: {
            id: 0,
            year: '',
            mes: '',
            metaXLinea_id: '',
            valorejecucionesperada: '',
            valorejecucionrealizada: '',
            created_at: '',
            updated_at: '',
        },
        deletedItem: {
            id: 0,
            year: '',
            mes: '',
            metaXLinea_id: '',
            valorejecucionesperada: '',
            valorejecucionrealizada: '',
            created_at: '',
            updated_at: '',
        },
        defaultItem: {
            id: 0,
            year: '',
            mes: '',
            metaXLinea_id: '',
            valorejecucionesperada: '',
            valorejecucionrealizada: '',
            created_at: '',
            updated_at: '',
            estado: false,
        },
    }),
    computed: {
        ...mapGetters('auth', ['dataSession']),
        formTitle() {
            return this.editedIndex === -1 ? 'Ejecución de la Meta' : 'Editar Ejecución de la Meta'
        },
    },
    mounted() {
        if (this.logged) {
            if (this.estado) {
                if (this.aplications.INDICADORES && this.screen.EJEINDICADOR.ver) {
                    this.dialogLoading = true
                    this.ejecutor = this.$ejecutor
                    this.indicadores = []

                    axios.get(this.$api + this.$lineaprogramatica).then((response) => {
                        this.lineasProgramaticas = []
                        for (var item in response.data.data) {
                            this.lineasProgramaticas.push({
                                linea: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })

                    axios.get(this.$api + this.$centros).then((response) => {
                        this.centros = []
                        for (var item in response.data.data) {
                            this.centros.push({
                                text: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })
                    this.dialogLoading = false
                }
            } else {
                this.$router.push('/')
            }
        }
    },
    methods: {
        closeDialogEjecucion() {
            this.dialogEjecucionDeLaMeta = false
        },
        closeNuevaEjecucion() {
            this.dialogNuevaEjecucion = false
            this.findMetasEsperadas()
        },
        closeVerEjecucion() {
            this.dialogVerEjecucion = false
        },
        verEjecucion(item) {
            this.dialogVerEjecucion = true
            var centro_id = this.centro_id
            var valorejecucionrealizada = this.valorejecucionrealizada
            this.detallesVerEjecuccion = []
            axios.post(this.$api + this.$detalleEjecucionIndicador + '/getInforamtionByExecute', { id: item }).then((response) => {
                var detalleEjecucionIndicador = response.data.detalleEjecucionIndicador[0]
                var user = response.data.user
                var centros = response.data.centro
                var com = 0
                for (var i = 0; i < detalleEjecucionIndicador.length; i++) {
                    var nameCenter = centros[i] != null ? centros[i].nombre : 'Sin centro'
                    this.detallesVerEjecuccion.push({
                        centro: nameCenter,
                        valor: detalleEjecucionIndicador[i].valorEjecucionRealizada,
                        ejecutor: user[i].name,
                    })
                }
            })
        },
        nuevaEjecucion(item) {
            this.dialogNuevaEjecucion = true
            this.valorMes.id = item.id
            this.valorMes.mes = item.mes
            this.valorMes.metaEsperada = item.metaEsperada
            this.valorMes.user = item.user
            this.valorMes.idDetalle = item.idDetalle

            this.valorMes.metaEjecutada = 0

            this.centro = null //item.centro_id
        },

        async findMetasEsperadas() {
            this.esperar = true
            var sumaMetaEsperada = 0
            var lineaProgramatica = this.lineaProgramatica
            var indicador = this.indicador
            var year = this.year
            if (lineaProgramatica != null && indicador != null && year != null) {
                await axios
                    .post(this.$api + this.$ejecucionIndicador + '/getMetasEsperadasPorLineaPorAnio', {
                        lineaProgramatica: lineaProgramatica,
                        indicador: indicador,
                        year: year,
                        meses: this.meses,
                    })
                    .then((response) => {
                        this.esperar = false
                        for (var j = 0; j < 12; j++) {
                            sumaMetaEsperada += response.data.mes[j] != null ? parseFloat(response.data.mes[j].valorejecucionesperada) : 0
                        }

                        if (sumaMetaEsperada > 0) {
                            for (var j = 0; j < 12; j++) {
                                this.meses[j].id = response.data.mes[j] != null ? response.data.mes[j].id : null
                                this.meses[j].metaEsperada = response.data.mes[j] != null ? response.data.mes[j].valorejecucionesperada : 0
                                if (response.data.metaEjecutada[j] != null) {
                                    this.meses[j].centro_id = response.data.metaEjecutada[j].centro_id
                                    this.meses[j].idDetalle = response.data.metaEjecutada[j].id
                                }
                                this.meses[j].metaEjecutada = response.data.mes != null ? response.data.mes[j].valorejecucionrealizada : 0
                            }
                            this.dialogEjecucionDeLaMeta = true
                            var fecha = new Date()
                            var isYear = fecha.getFullYear()
                            if (isYear == parseInt(year)) {
                                this.nowYear = true
                            }
                        } else {
                            this.$swal({
                                icon: 'warning',
                                title: 'Aviso',
                                text: 'La línea programática no tiene metas esperadas.',
                                confirmButtonColor: '#fb8c00',
                            })
                        }
                    })
            } else {
                this.dialog = false
                this.$swal({
                    icon: 'error',
                    title: 'Ups...!',
                    text: 'No ha escogido la linea programatica, el año y/o el indicador.',
                    confirmButtonColor: '#fb8c00',
                })
            }
        },
        setyears(item) {
            this.indicadores = []
            this.year = null
            this.dialogLoading = true
            if (item > 0) {
                this.years = []
                axios
                    .post(this.$api + this.$metaPorLinea + '/getYearsByLine', {
                        linea_id: item,
                    })
                    .then((response) => {
                        this.years = response.data
                        this.dialogLoading = false
                    })
            }
        },

        getIndicadores() {
            this.dialogLoading = true
            this.indicadores = []
            axios
                .post(this.$api + this.$metaEsperadaEnLinea + '/getIndicadoresMetaLinea/', { id: this.lineaProgramatica, year: this.year })
                .then((response) => {
                    for (var i = 0; i <= 1000000; i++) {
                        if (response.data[i] != undefined) {
                            this.indicadores.push({
                                text: response.data[i][0].descripcion,
                                value: response.data[i][0].id,
                            })
                        } else {
                            break
                        }
                    }
                    this.dialogLoading = false
                })

                .catch((err) => {
                    this.dialogLoading = false
                })
        },

        metaEjecutada(id) {
            var valorejecucionrealizada = this.valorejecucionrealizada
        },

        metaEsperada(id) {
            var mes = this.mes
            var valorejecucionesperada = this.valorejecucionesperada
            var valorejecucionrealizada = this.valorejecucionrealizada
            axios
                .post(this.$api + this.$ejecucionIndicador + '/metasEsperadasPormes', {
                    mes: mes,
                    year: year,
                    indicador: indicador,
                    valorejecucionesperada: valorejecucionesperada,
                    valorejecucionrealizada: valorejecucionrealizada,
                })
                .then((response) => {
                    for (var i = 0; i <= 11; i++) {
                        this.meses[i].mes = mes
                        this.meses[i].valorejecucionesperada = valorejecucionesperada
                        this.meses[i].valorejecucionrealizada = valorejecucionrealizada
                    }
                })
        },
        consultaIndicadores() {
            var year = this.year
            var indicador = this.indicador
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            this.dialogLoading = true
            if (this.editedIndex > -1) {
                axios
                    .post(this.$api + this.$ejecucionIndicador, {
                        id: id,
                        metaXLinea_id: metaXLinea_id,
                        year: year,
                        mes: mes,
                        valorejecucionesperada: valorejecucionesperada,
                        valorejecucionrealizada: valorejecucionrealizada,
                        estado: estado,
                    })
                    .then((response) => {
                        this.message = 'ejecucion de la meta actualizado'
                        this.alert = true
                        Object.assign(this.parametros[this.editedIndex], this.editedItem)
                        this.dialogLoading = false

                        this.close()
                    })
                    .catch((err) => {
                        this.alert = true
                        this.dialogLoading = false
                        this.close()
                    })
            } else {
                for (var i = 0; i < this.meses.length; i++) {
                    if (this.meses[i].valorMetaEsperada > 0) {
                        this.editedItem.mes = this.meses[i].mes
                        this.editedItem.year = this.meses[i].year
                        this.editedItem.valorejecucionesperada = this.meses[i].valorMetaEsperada
                        this.editedItem.valorejecucionrealizada = this.meses[i].valorejecucionrealizada
                        this.editedItem.metaXLinea_id = this.meses[i].metaXLinea_id
                        axios
                            .post(this.$api + this.$ejecucionIndicador, this.editedItem)
                            .then((response) => {
                                this.message = 'elemento adicionado'
                                this.alert = true
                                this.editedItem.id = response.data.data.id
                                this.parametros.push(this.editedItem)
                                this.dialogLoading = false
                                this.close()
                            })
                            .catch((err) => {
                                this.alert = true
                                this.dialogLoading = false
                                this.close()
                            })
                    }
                }
            }
        },
        saveMetasEjecutadas() {
            this.dialogLoading = true
            this.esperar = true
            var validate = true

            this.dialogLoading = true
            if (validate === true) {
                this.valorMes.centro_id = this.centro
                this.valorMes.user = this.user
                axios
                    .post(this.$api + this.$detalleEjecucionIndicador, this.valorMes)
                    .then((response) => {
                        this.esperar = false
                        this.dialogNuevaEjecucion = false
                        this.alert = true
                        this.message = 'Registro Exitoso'
                        this.$swal({
                            icon: 'success',
                            title: 'Registro exitoso',
                            confirmButtonColor: '#fb8c00',
                        })
                        this.dialogEjecucionDeLaMeta = false
                        this.findMetasEsperadas()
                    })
                    .catch((err) => {
                        this.esperar = false
                        this.alert = true
                        console.log(err.response)
                        alert('Error 500')
                    })
            }
        },
        saveMetasEjecutadasGeneral() {
            var validatesCorrect = true
            this.esperar = true

            for (var i = 0; i < 12; i++) {
                if (parseFloat(this.meses[i].metaEjecutada) < 0) {
                    validatesCorrect = false
                    this.esperar = false
                    this.$swal({
                        icon: 'error',
                        title: 'Ups...!',
                        text: 'El valor de la meta ejecutada del mes ' + this.meses[i].mes + ', debe ser igual o mayor a 0',
                        confirmButtonColor: '#fb8c00',
                    })
                    break
                }
                this.meses[i].user = this.user
            }

            if (validatesCorrect === true) {
                axios.post(this.$api + this.$detalleEjecucionIndicador + '/createDetalleGeneral', this.meses).then((response) => {
                    this.esperar = false
                    this.dialogEjecucionDeLaMeta = false
                    this.$swal({
                        icon: 'success',
                        title: 'Registro exitoso',
                        confirmButtonColor: '#fb8c00',
                    })
                })
            }
        },
    },
}
</script>
