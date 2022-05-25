<template>
    <div v-if="aplications.CONFIGURACION && screen.USUARIOS.ver">
        <v-data-table :headers="headers" :items="parametros" :search="search" sort-by="valor" class="elevation-1" :loading="cargando" loading-text="Cargando usuarios de la base de datos...">
            <template v-slot:top>
                <!--INICIO Seccion de avisos y alertas de la pantalla-->
                <v-snackbar v-model="alert" :timeout="timeout">
                    {{ message }}
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red" text v-bind="attrs" @click="alert = false"> Cerrar </v-btn>
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
                            <v-btn color="warning darken-1" text @click="dialogAdvertencia = false">No</v-btn>
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
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <!--FIN DIALOGO DE LOADING-->

                <v-toolbar flat color="white">
                    <v-toolbar-title>Usuarios</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-select class="mt-6" :items="roles" label="Rol" @change="changedValueRolSeleccionado"></v-select>
                    <v-spacer></v-spacer>
                    <v-select class="mt-6" :items="aplicaciones" label="Aplicacion" @change="changedValueAplicacionSeleccionada"></v-select>

                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo usuario</v-btn>
                            <v-btn color="warning" dark class="mb-2 mr-5" v-bind="attrs" @click="initialize">
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
                                            <v-text-field v-model="editedItem.nombre" required label="Nombres" :rules="[(v) => !!v || 'Debe digitar un Nombre']"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.documento" value="" required type="number" label="Número de documento" :rules="[(v) => !!v || 'Debe digitar el número de documento']"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-select :items="roles" :rules="[(v) => !!v || 'Debe seleccionar un rol']" label="Rol" @change="changedValueRol" v-model="editedItem.rol_id" required></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.email" type="email" required label="Correo electrónico"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model.number="editedItem.centro" hint="CentroDiligencie el numero del centro al que pertenece" type="number" required label="Diligencie el numero del centro"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="warning darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn color="warning darken-1" :disabled="disabled" @click="saveCreate">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon color="indigo" small class="mr-2" @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn icon color="error" small class="mr-2" @click="showConfirmDelete(item)">
                    <v-icon> mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    data: () => ({
        alert: false,
        timeout: 5000,
        message: '',
        dialog: false,
        cargando: false,
        dialogAdvertencia: false,
        dialogLoading: true,
        search: '',
        headers: [
            {
                text: 'Nombre',
                align: 'start',
                sortable: true,
                value: 'nombre',
            },
            { text: 'Correo electrónico', value: 'email' },
            { text: 'Editar/Borrar', value: 'actions', sortable: false },
        ],
        parametros: [],
        roles: [],
        rolSeleccionado: 0,
        aplicaciones: [],
        aplicacionSeleccionada: 2,
        rolFiltrado: 1,
        editedIndex: -1,
        editedItem: {
            id: 0,
            nombre: '',
            documento: 0,
            rol_id: 0,
            email: null,
            //token:'',
            estado: '',
            centro: null,
            created_at: '',
            updated_at: '',
            rol: {
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
            nombre: '',
            apellido: '',
            celular: '',
            email: '',
            rol_id: 0,
            created_at: '',
            updated_at: '',
            rol: {
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
            id: '',
            nombre: '',
            email: '',
            rol_id: 0,
            created_at: '',
            updated_at: '',
            rol: {
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
                if (this.aplications.CONFIGURACION && this.screen.USUARIOS.ver) {
                    //this.editedItem.token = this.dataSession.token
                    this.cargando = true
                    this.dialogLoading = true
                    axios.get(this.$api + this.$roles).then((response) => {
                        this.roles = []
                        for (var item in response.data.data) {
                            this.roles.push({
                                text: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })

                    axios
                        //.get(this.$api+this.$usuarios+"/getbyrolyaplicacion/"+this.rolFiltrado+"/"+this.aplicacionSeleccionada)
                        .get(this.$api + this.$usuarios)
                        .then((response) => {
                            for (var i = 0; i < response.data.data.length; i++) {
                                this.parametros.push({
                                    centro: response.data.data[i].codigoCentro,
                                    documento: response.data.data[i].cedula,
                                    created_at: response.data.data[i].created_at,
                                    deleted_at: response.data.data[i].deleted_at,
                                    email: response.data.data[i].email,
                                    email_verified_at: response.data.data[i].email_verified_at,
                                    estado: response.data.data[i].estado,
                                    id: response.data.data[i].id,
                                    nombre: response.data.data[i].name,
                                    rol_id: response.data.data[i].rol_id,
                                    updated_at: response.data.data[i].updated_at,
                                })
                            }
                            this.dialogLoading = false
                            this.cargando = false
                        })
                    this.dialogLoading = false
                } else {
                    this.$router.push('/')
                }
            }
        }
    },
    computed: {
        ...mapGetters('auth', ['dataSession']),
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo usuario' : 'Editar usuario'
        },
        disabled() {
            return this.editedItem.Nombree === '' || this.editedItem === '' || this.editedItem.documento == 0 // or === 0
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    methods: {
        changedValueRol: function (value) {
            this.rolSeleccionada = value
        },
        changedValueAplicacionSeleccionada: function (value) {
            this.aplicacionSeleccionada = value
        },
        changedValueRolSeleccionado: function (value) {
            this.rolFiltrado = value
            console.log(value);
            this.parametros = []
            axios.get(this.$api + this.$usuarios + '/getbyrolyaplicacion/' + value).then((response) => {
                for (var i = 0; i < response.data.data.length; i++) {
                    this.parametros.push({
                        cedula: response.data.data[i].cedula,
                        created_at: response.data.data[i].created_at,
                        deleted_at: response.data.data[i].deleted_at,
                        email: response.data.data[i].email,
                        email_verified_at: response.data.data[i].email_verified_at,
                        estado: response.data.data[i].estado,
                        id: response.data.data[i].id,
                        nombre: response.data.data[i].name,
                        rol_id: response.data.data[i].rol_id,
                        updated_at: response.data.data[i].updated_at,
                    })
                }
            })
        },
        initialize() {
            this.parametros = []
            this.dialogLoading = true
            axios
                .get(this.$api + this.$usuarios)
                .then((response) => {
                    for (var i = 0; i < response.data.data.length; i++) {
                        this.parametros.push({
                            centro: response.data.data[i].centro,
                            cedula: response.data.data[i].cedula,
                            created_at: response.data.data[i].created_at,
                            deleted_at: response.data.data[i].deleted_at,
                            email: response.data.data[i].email,
                            email_verified_at: response.data.data[i].email_verified_at,
                            estado: response.data.data[i].estado,
                            id: response.data.data[i].id,
                            nombre: response.data.data[i].name,
                            rol_id: response.data.data[i].rol_id,
                            updated_at: response.data.data[i].updated_at,
                        })
                    }
                    this.dialogLoading = false
                })
                .catch((erro) => {
                    console.err(erro)
                })
        },

        editItem(item) {
            this.editedIndex = this.parametros.indexOf(item)
            this.rolSeleccionado = item.rol_id
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        showConfirmDelete(item) {
            this.deletedItem = item
            this.dialogAdvertencia = true
        },

        deleteItem() {
            const index = this.parametros.indexOf(this.deletedItem)
            this.dialogAdvertencia = false
            if (this.parametros.splice(index, 1)) {
                axios.delete(this.$api + this.$usuarios + '/' + this.deletedItem.id).then((response) => {
                    this.message = 'elemento eliminado'
                    this.alert = true
                })
            }
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                this.rolSeleccionado = null
            })
        },

        save() {
            if (this.rolSeleccionado != null) this.editedItem.rol_id = this.rolSeleccionado
            else {
                this.message = 'Debe seleccionar un rol'
                this.alert = true
                return
            }

            this.dialogLoading = true
            this.editedItem.nombre = this.editedItem.nombre.toUpperCase()
            if (this.editedIndex > -1) {
                this.$swal('entro')
                axios
                    .put(this.$api + this.$usuarios, this.editedItem)
                    .then((response) => {
                        this.message = 'usuario actualizado'
                        this.alert = true
                        Object.assign(this.parametros[this.editedIndex], this.editedItem)
                        this.dialogLoading = false
                        this.close()
                    })
                    .catch((err) => {
                        this.alert = true
                        this.message = err.response.data.errors.nombre[0]
                        this.dialogLoading = false
                        this.close()
                    })
            } else {
                this.editedItem.estado = true
                axios
                    .post(this.$api + this.$usuarios, this.editedItem)
                    .then((response) => {
                        this.message = 'usuario creado'
                        this.alert = true
                        this.editedItem.id = response.data.data.id
                        this.editedItem.rol.nombre = this.aplicaciones.filter((x) => x.value === this.aplicacionSeleccionada).map((x) => x.text)
                        this.parametros.push(this.editedItem)
                        this.dialogLoading = false
                        this.close()
                    })
                    .catch((err) => {
                        this.alert = true
                        this.message = err.response.data.errors.Nombre[0]
                        this.dialogLoading = false
                        this.close()
                    })
            }
        },
        saveCreate() {
            var name = this.editedItem.nombre
            var email = this.editedItem.email
            const centro = this.editedItem.centro
            console.log(this.editedItem.rol);
            if (name.length > 0) {
                if (name.length > 0) {
                    if (!name.includes('0') && !name.includes('1') && !name.includes('2') && !name.includes('3') && !name.includes('4') && !name.includes('5') && !name.includes('6') && !name.includes('7') && !name.includes('8') && !name.includes('9')) {
                        if (this.editedItem.documento > 0 && parseFloat(this.editedItem.documento) % 1 == 0) {
                            if (this.editedItem.rol_id > 0) {
                                if (email.length > 0) {
                                    if (email.includes('@sena.edu.co')) {
                                        this.editedItem.email = this.editedItem.email.replace(/ /g, '')
                                        this.editedItem.email = this.editedItem.email.toLowerCase()
                                        var rol = ''
                                        //Descripción del rol
                                        if (this.editedItem.rol_id == 1) {
                                            rol = 'Administrador'
                                        } else {
                                            if (this.editedItem.rol_id == 2) {
                                                rol = 'Gestor del presupuesto'
                                            } else {
                                                if (this.editedItem.rol_id == 3) {
                                                    rol = 'Gestor de linea'
                                                } else {
                                                    if (this.editedItem.rol_id == 4) {
                                                        rol = 'Consulta'
                                                    }
                                                }
                                            }
                                        }
                                        this.$swal({
                                            title: '¿Realizar el registro?',
                                            html:
                                                `
                                <p>Nombre: ` +
                                                name +
                                                `</p>
                                <p>Documento: ` +
                                                this.editedItem.documento +
                                                `</p>
                                <p>E-mail: ` +
                                                this.editedItem.email +
                                                `</p>
                                <p>Rol: ` +
                                                this.editedItem.rol +
                                                `</p>
                        `,
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#fb8c00',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Registrar',
                                            cancelButtonText: 'Cancelar',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                this.dialogLoading = true
                                                console.log(this.editedItem);
                                                axios
                                                    .post(this.$api + this.$usuarios, this.editedItem)
                                                    .then((response) => {
                                                        this.$swal({
                                                            icon: 'success',
                                                            title: 'Registro exitoso.',
                                                            confirmButtonColor: '#fb8c00',
                                                        })

                                                        this.dialogLoading = false
                                                        this.close()
                                                        this.initialize()
                                                    })
                                                    .catch((err) => {
                                                        this.dialogLoading = false
                                                        this.$swal({
                                                            icon: 'error',
                                                            title: 'Ups...!',
                                                            text: err.response.data,
                                                            confirmButtonColor: '#fb8c00',
                                                        })
                                                    })
                                            }
                                        })
                                    } else {
                                        this.$swal({
                                            icon: 'error',
                                            title: 'Ups...!',
                                            text: 'El correo electrónico digitado no pertenece al dominio "@sena.edu.co"',
                                        })
                                    }
                                } else {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Ups...!',
                                        text: 'No ha ingresado el correo electrónico.',
                                    })
                                }
                            } else {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Ups...!',
                                    text: 'No ha escogido un rol.',
                                })
                            }
                        } else {
                            this.$swal({
                                icon: 'error',
                                title: 'Ups...!',
                                text: 'El número  del documento debe ser entero y positivo.',
                            })
                        }
                    } else {
                        this.$swal({
                            icon: 'error',
                            title: 'Ups...!',
                            text: 'Los nombres y apellidos no pueden contener números.',
                        })
                    }
                } else {
                    this.$swal({
                        icon: 'error',
                        title: 'Ups...!',
                        text: 'Falto por digitar el apellido.',
                    })
                }
            } else {
                this.$swal({
                    icon: 'error',
                    title: 'Ups...!',
                    text: 'Falto por digitar el nombre.',
                })
            }
        },
    },
}
</script>
