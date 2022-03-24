<template>
    <v-row class="fill-height" v-if="aplications.EVENTOS && screen.GESTIONEVENTOS.ver">
        <!-- ALERTA DE MENSAJES ERRONEOS -->
        <v-snackbar v-model="alert" :timeout="timeout">
            {{ this.message }}
            <template v-slot:action="{ attrs }">
                <v-btn color="red" text v-bind="attrs" @click="alert = false"> Cerrar </v-btn>
            </template>
        </v-snackbar>
        <!-- ALERTA DE MENSAJES ERRONEOS -->

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

        <!--  SELECIONADOR DIA MES SEMANA -->
        <v-col>
            <v-sheet height="64">
                <v-toolbar flat class="m-n3">
                    <v-btn class="mr-4" color="orange white--text" @click="dialog = true">
                        Nuevo evento
                        <v-icon class="ml-2">mdi-calendar-plus</v-icon>
                    </v-btn>
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"> hoy </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                        <v-icon small> mdi-chevron-left </v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-btn fab text small color="grey darken-2" @click="next">
                        <v-icon small> mdi-chevron-right </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                                <span>{{ typeToLabel[type] }}</span>
                                <v-icon right> mdi-menu-down </v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>Día</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Semana</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'month'">
                                <v-list-item-title>Mes</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = '4day'">
                                <v-list-item-title>4 Dias</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-toolbar>
            </v-sheet>
            <!-- SELECIONADOR DIA MES SEMANA -->

            <!-- VUETIFY CALENDARIO -->
            <v-sheet height="535">
                <v-calendar ref="calendar" v-model="focus" color="orange" :events="events" :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange" locale="es" :short-weekdays="false"> </v-calendar>
                <!-- VUETIFY CALENDARIO -->

                <!-- MODAL NUEVO EVENTO -->
                <v-dialog v-model="dialog" max-width="600px">
                    <v-card>
                        <v-card-title class="text-h5 orange text-white"> Agregar evento </v-card-title>

                        <v-container fluid class="mt-n2 mb-0">
                            <v-form ref="form" @submit.prevent="addEvent">
                                <v-text-field name="nombre" v-model="editEvento.nombre" label="Nombre del eveto" textarea autofocus class="m-0" counter="100" :rules="nombreEvento"></v-text-field>
                                <v-textarea name="descripcion" v-model="editEvento.descripcion" label="Descripcion" append-icon="mdi-comment" class="mt-0" counter="500" textarea rows="2" :rules="C_textarea"></v-textarea>
                                <v-row>
                                    <v-col class="col">
                                        <v-text-field name="fechaInicio" v-model="editEvento.fechaInicio" label="Fecha inicio" type="datetime-local" textarea :rules="fecha"></v-text-field>
                                    </v-col>
                                    <v-col class="col">
                                        <v-text-field name="fechaFin" v-model="editEvento.fechaFin" label="Fecha fin" type="datetime-local" textarea :rules="fecha"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-n4">
                                    <v-col cols="6">
                                        <v-text-field name="ubicacion" v-model="editEvento.ubicacion" append-icon="mdi-map-marker" label="Ubicacion" textarea class="mt-0 mb-0"> </v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field label="link" append-icon="mdi-link" v-model="editEvento.link"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-n5">
                                    <v-col cols="9">
                                        <v-file-input name="poster" chips truncate-length="50" label="Foto" counter type="file" @change="getImagen" accept="image/*" class="img"></v-file-input>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-img class="img-fluid" :src="imagenM" height="100"></v-img>
                                    </v-col>
                                </v-row>
                                <v-select :items="items" label="Seleccione una categoria" @change="categoriaSeleccionada"></v-select>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="orange" @click="dialog = false">Cancelar</v-btn>
                                    <v-btn type="submit" text color="orange" @click.stop="dialog = false">Guardar</v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-container>
                    </v-card>
                </v-dialog>
                <!-- FIN DEL FORMULARIO -->

                <!-- FICHA EVENTO -->
                <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
                    <v-card color="grey lighten-4" min-width="350px" max-width="550px" flat>
                        <v-toolbar :color="selectedEvent.color" dark>
                            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                            <v-spacer></v-spacer>
                            <!-- Editar -->
                            <v-btn icon @click.prevent="editEvent(selectedEvent.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <!-- Eliminar -->
                            <v-btn icon @click="deleteEvent(selectedEvent)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <!-- Opciones -->
                            <v-menu bottom right>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon right v-bind="attrs" v-on="on"> mdi-dots-vertical </v-icon>
                                </template>
                                <v-list>
                                    <v-container grid-list-sm>
                                        <v-switch v-model="selectedEvent.estado" :color="selectedEvent.color" :label="selectedEvent.estado ? 'Ocultar' : 'Publicar'" inset prepend-icon="mdi-send-check" :persistent-hint="true" hint="Ocultar/Publiacar" @change="publicEvent(selectedEvent)"></v-switch>
                                    </v-container>
                                </v-list>
                            </v-menu>
                            <!-- Opciones -->
                        </v-toolbar>
                        <v-card-text v-if="currentlyEditing !== selectedEvent.id">
                            <div v-if="selectedEvent.poster" class="font-weight-bold container-fluid">
                                Poster:
                                <a :href="this.rutaImg + this.selectedEvent.poster" target="_blank" rel="noopener noreferrer">
                                    <v-img width="320" height="180" class="card" alt="poster" :src="this.rutaImg + this.selectedEvent.poster"></v-img>
                                </a>
                            </div>
                            <v-card-text>
                                <div class="font-weight-bold">Descripcion:</div>
                                <div class="mb-3" v-html="selectedEvent.details"></div>
                                <div class="mb-2">
                                    <span class="font-weight-bold">Fecha inicio / Fin:</span><br />
                                    <v-icon class="mr-1" color="success">mdi-clock</v-icon>
                                    <time class="text-success mr-2" v-html="selectedEvent.start"></time>
                                    <v-icon class="mr-1" color="error">mdi-clock-check</v-icon>
                                    <time class="text-danger" v-html="selectedEvent.end"></time>
                                </div>
                                <div class="font-weight-bold">Ubicacion:</div>
                                <div class="mb-3" v-html="selectedEvent.ubicacion"></div>
                                <div class="font-weight-bold">Link:</div>
                                <v-chip
                                    ><a class="card-link flex-wrap" target="_blank" :href="'http://' + selectedEvent.link">{{ selectedEvent.link }}</a></v-chip
                                >
                                <div class="font-weight-bold mt-3">Categoria:</div>
                                <div class="mb-3" v-html="selectedEvent.categoria"></div>
                            </v-card-text>
                            <v-card-actions class="mt-n2">
                                <v-spacer></v-spacer>
                                <v-btn text color="orange" @click="selectedOpen = false"> Cerrar </v-btn>
                            </v-card-actions>
                        </v-card-text>

                        <!-- MODIFICAR EVENTO SELECCIONADO -->
                        <v-form v-else>
                            <v-container fluid>
                                <v-text-field name="nombre" v-model="selectedEvent.name" label="Nombre del eveto" textarea class="m-0" counter="50" :rules="nombreEvento"></v-text-field>

                                <v-textarea name="descripcion" v-model="selectedEvent.details" label="Descripcion" append-icon="mdi-comment" class="mt-0" counter="500" textarea rows="2" :rules="C_textarea"></v-textarea>

                                <v-text-field name="ubicacion" v-model="selectedEvent.ubicacion" append-icon="mdi-map-marker" label="Ubicacion" textarea class="mt-0 mb-0"> </v-text-field>

                                <v-text-field label="link" append-icon="mdi-link" v-model="selectedEvent.link"></v-text-field>
                                <v-row class="mt-n5">
                                    <v-col cols="9">
                                        <v-file-input name="poster" chips truncate-length="50" label="Foto" counter type="file" @click:clear="cancelImg" @change="getImagen" accept="image/*" class="img"></v-file-input>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-img v-if="this.editEvento.poster" class="img-fluid" :src="this.editEvento.poster" height="100" width="100%"></v-img>
                                        <v-img v-else class="img-fluid" :src="this.rutaImg + this.selectedEvent.poster" height="100" width="100%"></v-img>
                                    </v-col>
                                </v-row>
                                <v-select :items="items" :label="selectedEvent.categoria" v-model="selectedEvent.categoria" @change="editCategoriaSeleccionada" hint="Seleccione una categoria" :persistent-hint="true"></v-select>
                                <v-card-actions class="mt-n1">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="orange" @click="cancelEdit"> Cancelar </v-btn>
                                    <v-btn text color="orange text-white" @click.prevent="updateEvent(selectedEvent)">Guardar</v-btn>
                                </v-card-actions>
                            </v-container>
                        </v-form>
                    </v-card>
                </v-menu>
                <!-- EVENTO -->
            </v-sheet>
            <!-- VUETIFY CALENDARIO -->
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    name: 'formularioEvento',
    data: () => ({
        C_textarea: [
            (value) => (value || '').length <= 500 || 'Maximo 500 Caracteres',
            (value) => {
                const pattern = /[a-zA-Z-1-9\v]+|(^$)/
                return pattern.test(value) || 'Nombre de evento invalido'
            },
        ],
        nombreEvento: [
            (value) => !!value || 'Este campo es nesesario.',
            (value) => (value || '').length <= 100 || 'Maximo 100 Caracteres',
            (value) => {
                const pattern = /[a-zA-Z-1-9\v]+|(^$)/
                return pattern.test(value) || 'Descripcion del evento invalido'
            },
        ],
        fecha: [(value) => !!value || 'Este campo es nesesario.', (value) => (value || '').length <= 50 || 'La fecha es muy larga'],
        focus: '',
        type: 'month',
        typeToLabel: {
            month: 'Mes',
            week: 'Semana',
            day: 'Dia',
            '4day': '4 Dias',
        },
        imagenM: '',
        rutaImg: '',
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        currentlyEditing: null,
        items: null,
        alert: false,
        user: 0,
        timeout: 5000,
        message: '',
        dialog: false,
        dialogLoading: false,
        dialogAdvertencia: false,
        dialogEstaSeguroDeGuardarLaInformacion: false,
        categoria: null,

        editEvento: {
            nombre: '',
            descripcion: '',
            fechaInicio: '',
            fechaFin: '',
            ubicacion: '',
            link: '',
            poster: '',
            estado: '',
            fechaPublicacion: moment().format('YYYY-MM-DD HH:mm:ss'),
            userPublico: 0,
            categoria: '',
        },
    }),
    mounted() {
        if (this.logged) {
            if (this.estado) {
                if (this.aplications.EVENTOS && this.screen.GESTIONEVENTOS.ver) {
                    this.user = this.dataSession.id
                    this.editEvento.userPublico = this.dataSession.id
                    this.getCategoriaEventos()
                }
            }
        } else {
            this.$router.push('/')
        }
    },
    computed: {
        ...mapGetters('auth', ['dataSession']),
    },
    methods: {
        /* Leer los eventos de la base de datos */
        async updateRange() {
            try {
                this.dialogLoading = true
                await axios
                    .get(this.$api + this.$evento)
                    .then((response) => {
                        this.eventos = response.data[0]
                        this.rutaImg = response.data[1]
                        const events = [] //constante para guardar temporalmente y la que se visualiza
                        for (const i in this.eventos) {
                            let inicio = new Date(this.eventos[i].fechaInicio)
                            let fin = new Date(this.eventos[i].fechaFin)

                            let fechactual = new Date() //el dia de hoy
                            fechactual = moment(fechactual).format('x') //obtine el tiempo desde 1972 hatsta hoy.

                            let fechaI = inicio.getTime()
                            let fechaF = fin.getTime()

                            var colorEvento = ''
                            if (fechactual > fechaI && fechactual > fechaF) {
                                //evento antiguo o pasdo
                                colorEvento = '#9D9D9D' //gris
                            } else if (fechactual < fechaI && fechactual < fechaF) {
                                //evento futuro
                                colorEvento = '#22A7F2' //naranja
                            } else if (fechactual > fechaI && fechactual < fechaF) {
                                //evento presente o fuera de rango
                                colorEvento = '#FB8C00' //
                            }

                            inicio = moment(inicio).format('YYYY-MM-DD HH:mm:ss')
                            fin = moment(fin).format('YYYY-MM-DD HH:mm:ss')

                            events.push({
                                id: this.eventos[i].id,
                                name: this.eventos[i].nombre,
                                details: this.eventos[i].descripcion,
                                start: inicio,
                                end: fin,
                                color: colorEvento,
                                ubicacion: this.eventos[i].ubicacion,
                                link: this.eventos[i].link,
                                poster: this.eventos[i].poster,
                                userPublico: this.eventos[i].userPublico,
                                estado: this.eventos[i].estado,
                                categoria: this.eventos[i].categoria,
                            })
                        }
                        this.events = events
                        this.dialogLoading = false
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            } catch (error) {
                console.log(error)
            }
        },
        async getCategoriaEventos() {
            try {
                axios
                    .get(this.$api + this.$categoriaevento)
                    .then((res) => {
                        this.categoria = res.data.data
                        const categorias = []
                        for (const key in this.categoria) {
                            categorias.push(this.categoria[key].nombre)
                        }
                        this.items = categorias
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            } catch (error) {
                console.log(error)
            }
        },
        editEvent(id) {
            this.currentlyEditing = id
        },
        async deleteEvent(ev) {
            this.dialogLoading = true
            try {
                this.$swal({
                    title: '¿Seguro desea eliminar este evento?',
                    text: 'No podrá revertir esto!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#fb8c00',
                    cancelButtonColor: '#3085d6',
                    cancelButtonText: 'Si, eliminar evento!',
                    confirmButtonText: 'Si, eliminar evento!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios
                            .delete(this.$api + this.$evento + '/' + ev.id)
                            .then((res) => {
                                this.updateRange()
                            })
                            .catch((err) => {
                                console.error(err)
                            })
                        this.selectedOpen = false
                        this.$swal('Eliminado!', 'El evento ha sido eliminado.', 'success')
                        this.dialogLoading = false
                    }
                })
            } catch (error) {
                console.error(error)
            }
        },
        updateEvent(ev) {
            this.dialogLoading = true
            console.log(ev.categoria)
            debugger
            this.message = 'Evento Actualizado'
            try {
                axios
                    .put(this.$api + this.$evento, {
                        id: ev.id,
                        nombre: ev.name,
                        descripcion: ev.descripcion,
                        link: ev.link,
                        ubicacion: ev.ubicacion,
                        categoria: ev.categoria,
                        imgOld: ev.poster,
                        poster: ev.img,
                    })
                    .then((res) => {
                        this.$swal({
                            icon: 'success',
                            title: 'Evento actualizado',
                            confirmButtonColor: '#fb8c00',
                        })
                        this.updateRange()
                        this.resetData()
                        this.alert = true
                        this.alert = this.imagenM = ''
                    })
                    .catch((err) => {
                        console.error(err)
                    })
                this.selectedOpen = false
                this.currentlyEditing = null
            } catch (error) {
                console.error(error)
            }
            this.dialogLoading = false
        },
        async publicEvent(ev) {
            this.dialogLoading = true
            if (ev.estado) {
                this.message = 'Evento Publicado'
            } else {
                this.message = 'Evento Ocultado'
            }
            try {
                axios
                    .put(this.$api + this.$evento, {
                        id: ev.id,
                        estado: ev.estado,
                    })
                    .then((res) => {
                        this.$swal({
                            icon: 'success',
                            title: 'Estado del evento actualizado',
                            confirmButtonColor: '#fb8c00',
                        })
                        this.alert = true
                    })
                    .catch((err) => {
                        console.error(err)
                    })
                this.dialogLoading = false
            } catch (error) {
                console.error(error)
            }
        },
        async addEvent() {
            try {
                if ((this.editEvento.nombre && this.editEvento.fechaInicio && this.editEvento.fechaFin, this.editEvento.categoria)) {
                    this.dialogLoading = true
                    this.editEvento.fechaInicio = moment(this.editEvento.fechaInicio).format('YYYY-MM-DD HH:mm:ss')
                    this.editEvento.fechaFin = moment(this.editEvento.fechaFin).format('YYYY-MM-DD HH:mm:ss')
                    let formdata = new FormData()
                    for (const key in this.editEvento) {
                        formdata.append(key, this.editEvento[key])
                    }
                    axios
                        .post(this.$api + this.$evento, formdata, {
                            headers: { 'content-type': 'multipart/form-data' },
                        })
                        .then((response) => {
                            this.updateRange()
                            this.$swal({
                                icon: 'success',
                                title: 'Evento Registrado',
                                confirmButtonColor: '#fb8c00',
                            })
                            this.message = 'Evento registrado'
                            this.alert = true
                            this.resetData()
                            this.dialogLoading = false
                            this.$refs.form.reset() //resetea los valores del fomulario
                        })
                        .catch((err) => {
                            console.error(err)
                            this.dialogLoading = false
                        })
                } else {
                    this.message = 'Los campos nombre del evento fecha inicial, final y categoria son requeridos'
                    this.alert = true
                }
            } catch (error) {
                console.error(error)
            }
        },
        resetData() {
            this.editEvento.nombre = ''
            this.editEvento.descripcion = ''
            this.editEvento.fechaInicio = ''
            this.editEvento.fechaFin = ''
            this.editEvento.ubicacion = ''
            this.editEvento.link = ''
            this.editEvento.poster = ''
            this.editEvento.categoria = ''
            this.imagenM = ''
        },

        base64(fileObjet) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(fileObjet)
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = (e) => reject(e)
            })
        },

        async getImagen(e) {
            this.base64(e)
                .then((resultado) => {
                    this.imagenM = resultado
                    this.editEvento.poster = this.imagenM //Nuevo evento
                    this.selectedEvent.img = this.imagenM //Editar evento
                })
                .catch((error) => {})
        },

        cancelImg() {
            this.imagenM = null
            this.editEvento.poster = null
        },
        cancelEdit() {
            this.currentlyEditing = null
            this.imagenM = null
            this.editEvento.poster = null
        },

        categoriaSeleccionada(val) {
            this.editEvento.categoria = val
        },
        editCategoriaSeleccionada(val) {
            this.editEvento.categoria = val
        },

        viewDay({ date }) {
            this.focus = date
            this.type = 'day'
        },
        getEventColor(event) {
            return event.color
        },
        setToday() {
            this.focus = ''
        },
        prev() {
            this.$refs.calendar.prev()
        },
        next() {
            this.$refs.calendar.next()
        },
        showEvent({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
            }
            if (this.selectedOpen) {
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            } else {
                open()
            }
            nativeEvent.stopPropagation()
        },
    },
}
</script>
