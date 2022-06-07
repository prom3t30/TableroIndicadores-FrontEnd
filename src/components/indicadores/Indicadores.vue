<template>
    <div v-once v-if="aplications.CONFIGURACION && screen.ADMININDICADORES.ver">
        <v-data-table :headers="headers" :items="parametros" :search="search" sort-by="valor" class="elevation-1">
            <template v-slot:top>
                <!--MI MODAL-->
                <b-modal ref="my-modal" hide-footer title="Editar Meta" size="lg" body-bg-variant="warning" header-bg-variant="warning" header-text-variant="light">
                    <v-card>
                        <!--                         <v-card-title class="warning" style="color: black">
                            <span class="headline">Editar Meta</span>
                        </v-card-title> -->
                        <v-card-text>
                            <v-container>
                                <v-row style="display: none">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editarMetaLinCentro.idmeta" type="text" label="id" disabled> </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row style="display: none">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editarMetaLinCentro.centro_id" type="text" label="ID DEL CENTRO" disabled> </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editarMetaLinCentro.Nombre" type="text" label="Nombre del centro" disabled></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row style="display: none">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editarMetaLinCentro.metaxlinea" type="text" label="Meta de la linea programatica" disabled></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editarMetaLinCentro.metaCentro" type="number" label="Meta del centro" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn style="background-color: #fb8c00" text @click="hideModal">Cancelar</v-btn>
                            <v-btn style="background-color: #4caf50" @click="editMetLinea">Guardar</v-btn>
                        </v-card-actions>
                    </v-card>
                </b-modal>
                <!--MI MODAL-->

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

                <!--INICIO Seccion de avisos y alertas de la indicadores-->
                <v-snackbar v-model="alert" :timeout="timeout">
                    {{ message }}
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red" text v-bind="attrs" @click="alert = false">Cerrar</v-btn>
                    </template>
                </v-snackbar>
                <!--FIN Seccion de avisos y alertas de la indicadores-->

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

                <!--INICIO DE BUSQUEDA-->
                <v-toolbar flat color="white">
                    <v-toolbar-title>Filtrar:</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-row class="mt-5">
                        <v-col cols="12" sm="12" md="6">
                            <v-select :items="years" :rules="[(v) => !!v || 'Debe seleccionar una año']" label="Año" @change="getIndicadores(yearSelected)" v-model="yearSelected"></v-select>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Indicador" single-line hide-details></v-text-field>
                        </v-col>
                    </v-row>

                    <v-spacer></v-spacer>

                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                    <!--FIN  DE BUSQUEDA-->

                    <!--INICIO DE META GLOBAL-->

                    <v-dialog v-model="dialogMetaGlobal">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Meta global</span>
                        </v-card-title>
                        <v-card-text class="background">
                            <v-container>
                                <v-row>
                                    <v-col sm="12" md="6">
                                        <h5>Año.</h5>
                                        <v-text-field type="number" disabled v-model="newMetaGlobal.year"> </v-text-field>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col sm="12" md="6">
                                        <h5>Meta global</h5>
                                        <v-text-field type="number" v-model="newMetaGlobal.metaGlobal"> </v-text-field>
                                    </v-col>
                                </v-row>
                                <v-btn color="warning darken-1" :disabled="false" text @click="closeDialogMetaGlobal">Cancelar</v-btn>
                                <v-btn color="warning darken-1" :disabled="false" text @click="saveMetaGLobal">Guardar</v-btn>
                            </v-container>
                        </v-card-text>
                    </v-dialog>

                    <!--FIN DE META GLOBAL-->

                    <!--INICIO DE DIALOGO DE ACCIONES -->
                    <v-dialog v-model="dialogAsignacionMetaPorLinea">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Asignación Meta Por Línea</span>
                        </v-card-title>
                        <v-card-text class="background">
                            <v-container>
                                <v-row>
                                    <v-col sm="4">
                                        <h5>Año</h5>
                                        <strong v-if="rowForChange">{{ yearSelected }}</strong>
                                    </v-col>
                                    <v-col sm="8">
                                        <h5>Importante</h5>
                                        <strong v-if="metaAcumulada < metaGlobal || metaAcumulada > metaGlobal">Se ha ajustado la meta global del indicador, por lo que se recomienda ajustar la asignación de las metas por línea.</strong>
                                    </v-col>
                                    <v-col sm="4">
                                        <h5>Indicador</h5>
                                        <strong v-if="rowForChange">{{ rowForChange.descripcion }}</strong>
                                    </v-col>
                                    <v-col sm="4">
                                        <h5>Meta Global</h5>
                                        <strong v-if="rowForChange">{{ rowForChange.metaGlobal }}</strong>
                                    </v-col>
                                    <v-col sm="4" :class="metaAcumulada < metaGlobal ? 'metaacumulada-menor' : metaAcumulada > metaGlobal ? 'metaacumulada-mayor' : 'metaacumulada-igual'">
                                        <h5>Meta Acumulada</h5>
                                        {{ sumatoria }}
                                    </v-col>
                                </v-row>
                                <v-row class="mb-0 p-0">
                                    <v-col cols="4">
                                        <h5 class="p-0">Línea Programática</h5>
                                    </v-col>
                                    <v-col cols="4">
                                        <h5 class="">Meta Por Linea <span style="margin-left: 48px"></span>Meta Por centro</h5>
                                    </v-col>
                                </v-row>

                                <v-row v-for="lineaProgramatica of lineaProgramaticas" :key="lineaProgramatica.id">
                                    <v-col cols="12" class="d-flex align-content-center mb-0 mt-0 p-0">
                                        <v-col cols="4">
                                            <v-checkbox v-model="lineaProgramatica.selected" :label="lineaProgramatica.linea" color="red darken-3"></v-checkbox>
                                        </v-col>
                                        <v-col cols="2" class="d-flex align-content-center mt-0">
                                            <input v-model.number="lineaProgramatica.metaxlinea" type="number" single-line hide-details class="d-flex align-content-center p-0" />
                                        </v-col>
                                        <v-col cols="2" class="d-flex align-content-center flex-wrap">
                                            <v-dialog v-model="dialogCentroxlinea" :retain-focus="false" persistent max-width="1300px">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn :class="lineaProgramatica.metaxlinea > 0 ? '' : 'v-btn--disabled'" color="primary" dark v-bind="attrs" v-on="on" @click="getCentros(lineaProgramatica)">
                                                        <span>acaaa</span>
                                                        <v-icon>mdi-office-building-outline</v-icon>
                                                    </v-btn>
                                                </template>

                                                <v-card>
                                                    <v-card-title class="warning" style="color: white">
                                                        <span class="headline">Meta por centro - {{ lineaSelected.linea }} </span>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-container>
                                                            <v-row>
                                                                <v-col cols="12">
                                                                    <v-row>
                                                                        <h5>
                                                                            Meta de la linea programatica:
                                                                            <span class="orange--text font-weight-bold">{{ lineaSelected.metaxlinea }}</span>
                                                                        </h5>
                                                                    </v-row>
                                                                    <v-row v-for="(mc, index) in MetaCentros.mporcentro" :key="mc.id">
                                                                        <v-col cols="6" class="text-center">
                                                                            <p>Centro de formación</p>
                                                                            <!--TODO: No se permite que los centros de formación se repitan en un mismo registro de asignación de metas por centro de formación con base en la línea programática y el indicador. -->
                                                                            <v-autocomplete label="Seleccione un centro" :items="centros" v-model="mc.centro" @change="cambio(centros, mc.centro, index)" color="blue-grey lighten-2" item-value="id" item-text="Nombre" item-disabled="selected" return-object clearable autocomplete></v-autocomplete>
                                                                        </v-col>
                                                                        <v-col cols="6" class="text-center">
                                                                            <p>Meta</p>
                                                                            <v-text-field label="Meta aspiracion del centro" v-model.number="mc.metaCentro" :rules="[(v) => !!v || 'La meta esperada es requerida.']" :error-messages="validarMeta(lineaSelected.metaxlinea, mc.metaCentro)" clearable type="number" single-line></v-text-field>
                                                                        </v-col>
                                                                    </v-row>
                                                                    <v-tooltip bottom>
                                                                        <template v-slot:activator="{ on, attrs }">
                                                                            <v-btn @click="addInputCentro" color="success" icon outlined class="mr-3" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon> </v-btn>
                                                                        </template>
                                                                        <span>Agregar centro</span>
                                                                    </v-tooltip>

                                                                    <v-tooltip bottom>
                                                                        <template v-slot:activator="{ on, attrs }">
                                                                            <v-btn @click="removeInputCentro" color="error" icon outlined v-bind="attrs" v-on="on"><v-icon>mdi-minus</v-icon> </v-btn>
                                                                        </template>
                                                                        <span>Remover centro</span>
                                                                    </v-tooltip>
                                                                </v-col>
                                                            </v-row>

                                                            <!-- mi tabla de prueba  -->
                                                            <v-row>
                                                                <table class="table table-striped table-hover sticky-header">
                                                                    <thead>
                                                                        <tr>
                                                                            <th style="display: none">ID</th>
                                                                            <th>Centro de formación</th>
                                                                            <th>Meta</th>
                                                                            <th>Editar</th>
                                                                            <!-- <th>Borrar</th> -->
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr v-for="item in List" :key="item.id">
                                                                            <th style="display: none">{{ item.id }}</th>
                                                                            <th>{{ item.Nombre }}</th>
                                                                            <th>{{ item.metaCentro }}</th>
                                                                            <th>
                                                                                <button color="indigo" id="show-btn" @click="showModal(item)" class="btn-warning">
                                                                                    <v-icon>mdi-pencil</v-icon>
                                                                                </button>
                                                                            </th>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </v-row>
                                                            <!-- mi tabla de prueba  -->
                                                        </v-container>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="blue darken-1" text @click="closeDialogLineaCentro"> Cancelar </v-btn>
                                                        <v-btn color="blue darken-1" text @click="saveMetaLineaCentro(lineaSelected)"> Guardar </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                            <!-- FIN MODAL2 -->
                                        </v-col>
                                    </v-col>
                                    <v-divider inset class="mt-0"></v-divider>
                                </v-row>
                                <v-row>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn :disabled="metaAcumulada != metaGlobal" color="warning darken-1" text @click="estaSeguroDeGuardarLaInformacion">Guardar infomación </v-btn>
                                        <v-dialog v-model="dialogEstaSeguroDeGuardarLaInformacion" class="w-25">
                                            <v-card>
                                                <v-card-title>¿Esta seguro de guardar la información?</v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="warning" :disabled="false" text @click="saveMetaPorLinea">SI</v-btn>
                                                    <v-btn color="warning" text @click="closeDialogEstaSeguroDeGuardarLaInformacion">NO</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn color="warning" text @click="closeMetaPorLinea">Cancelar</v-btn>
                                    </v-card-actions>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-dialog>
                    <v-dialog v-model="dialogAjusteALaMetaGlobal">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Ajuste a la Meta Global</span>
                        </v-card-title>
                        <v-card-text class="background">
                            <v-container>
                                <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                        <h4>Nueva Meta</h4>
                                        <v-text-field v-model="valorNuevaMeta" label="Nueva Meta" type="number" single-line hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="6" sm="6" md="6">
                                        <h4>Aprobado</h4>
                                        <v-radio-group v-model="selectaprobado">
                                            <v-radio label="SI" value="SI"></v-radio>
                                            <v-radio label="NO" value="NO"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="warning darken-1" :disabled="false" text @click="estaSeguroDeGuardarLaInformacion">Guardar</v-btn>
                                        <v-dialog v-model="dialogEstaSeguroDeGuardarLaInformacion">
                                            <v-card>
                                                <v-card-title>¿Esta seguro de guardar la información?</v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="warning" :disabled="false" text @click="saveNuevaMeta">SI</v-btn>
                                                    <v-btn color="warning" text @click="closeDialogEstaSeguroDeGuardarLaInformacion">NO</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn color="warning" text @click="closeNuevaMeta">Cancelar</v-btn>
                                    </v-card-actions>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-dialog>
                    <v-dialog v-model="dialogEditarIndicador">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Editar Indicador</span>
                        </v-card-title>
                        <v-card-text class="background">
                            <v-container>
                                <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                        <h5>Indicador</h5>
                                        <input v-if="rowForChange" type="text" v-model="rowForChange.descripcion" />
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="warning darken-1" :disabled="false" text @click="estaSeguroDeGuardarLaInformacion">Guardar</v-btn>
                                        <v-dialog v-model="dialogEstaSeguroDeGuardarLaInformacion">
                                            <v-card>
                                                <v-card-title>¿Esta seguro de guardar la información?</v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="warning" :disabled="false" text @click="saveIndicador">SI</v-btn>
                                                    <v-btn color="warning" text @click="closeDialogEstaSeguroDeGuardarLaInformacion">NO</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn color="warning" text @click="closeIndicador">Cancelar</v-btn>
                                    </v-card-actions>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-dialog>
                    <v-dialog v-model="dialogEstado">
                        <v-card-title class="warning" style="color: white">
                            <span class="headline">Estado</span>
                        </v-card-title>
                        <v-card-text class="background">
                            <v-container>
                                <v-row>
                                    <v-col cols="6" sm="6" md="6">
                                        <h4>Estado</h4>
                                        <v-radio-group v-model="selectestado">
                                            <v-radio label="Activo" value="Activo"></v-radio>
                                            <v-radio label="Inactivo" value="Inactivo"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="warning darken-1" :disabled="false" text @click="estaSeguroDeGuardarLaInformacion">Guardar</v-btn>
                                        <v-dialog v-model="dialogEstaSeguroDeGuardarLaInformacion">
                                            <v-card>
                                                <v-card-title>¿Esta seguro de guardar la información?</v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="warning" :disabled="false" text @click="saveEstado">SI</v-btn>
                                                    <v-btn color="warning" text @click="closeDialogEstaSeguroDeGuardarLaInformacion">NO</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                        <v-btn color="warning" text @click="closeEstado">Cancelar</v-btn>
                                    </v-card-actions>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-dialog>
                    <!--FIN DE DIALOGO DE ACCIONES -->
                    <!------------campos Nuevo Indicador------------->
                    <v-dialog v-model="dialog" max-width="900px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on">NUEVO</v-btn>
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
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="categorias" :rules="[(v) => !!v || 'Debe seleccionar una categoria']" label="Categorias" @change="changedValueCategoria" v-model="categoriaSeleccionada"></v-select>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="clasificacion" :rules="[(v) => !!v || 'Debe seleccionar una clasificacion']" label="Clasificación" @change="changedValueClasificacion" v-model="clasificacionSeleccionada"></v-select>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="cliente" :rules="[(v) => !!v || 'Debe seleccionar un cliente']" label="Cliente" @change="changedValueCliente" v-model="clienteSeleccionado"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="periodicidad" :rules="[(v) => !!v || 'Debe seleccionar una periodicidad']" label="Periodicidad" @change="changedValuePeriocidad" v-model="periocidadSeleccionada"></v-select>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="plataforma" :rules="[(v) => !!v || 'Debe seleccionar una plataforma']" label="Plataforma" @change="changedValuePlataforma" v-model="plataformaSeleccionada"></v-select>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-select :items="unidad" :rules="[(v) => !!v || 'Debe seleccionar una unidad']" label="Unidad" @change="changedValueUnidad" v-model="unidadSeleccionada"></v-select>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-textarea v-model="editedItem.descripcion" label="Descripción"> </v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="6" sm="6" md="6">
                                            <v-checkbox v-model="editedItem.estado" label="Estado" color="red darken-3" hide-details></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="warning darken-1" text @click="close" v-bind="attrs" v-on="on">Cancelar</v-btn>
                                    </template>
                                    <span>Cancelar el indicador</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="warning darken-1" :disabled="false" text @click="save" v-bind="attrs" v-on="on">Guardar</v-btn>
                                    </template>
                                    <span>Guardar indicador</span>
                                </v-tooltip>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <!------------Fin campos Nuevo Indicador------------->
            <!------------ Iconos de Acciones------------->
            <template v-slot:[`item.actions`]="{ item }" v-if="showTable">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="indigo" small class="mr-2" :disabled="!item.metaGlobal > 0 || !nowYear || item.estado == 'Inactivo' || item.estado == 0 || item.estado == false" v-bind="attrs" v-on="on" @click="asignacionMetaPorLinea(item)">
                            <v-icon>mdi-clipboard-text</v-icon>
                        </v-btn>
                    </template>
                    <span>Asignación meta por linea</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="indigo" small class="mr-2" :disabled="!item.metaGlobal > 0 || !nowYear || item.estado == 'Inactivo' || item.estado == 0 || item.estado == false" v-bind="attrs" v-on="on" @click="ajusteALaMetaGlobal(item)">
                            <v-icon>mdi-camera-timer</v-icon>
                        </v-btn>
                    </template>
                    <span>Ajuste a la meta global</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="indigo" small class="mr-2" v-bind="attrs" v-on="on" :disabled="item.estado == 'Inactivo' || item.estado == 0 || item.estado == false" @click="editarIndicador(item)">
                            <v-icon>mdi-tooltip-edit</v-icon>
                        </v-btn>
                    </template>
                    <span>Editar indicador</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="indigo" small class="mr-2" v-bind="attrs" v-on="on" @click="cambioDeEstado(item)">
                            <v-icon>mdi-key-change</v-icon>
                        </v-btn>
                    </template>
                    <span>Cambiar estado</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="indigo" small class="mr-2" v-bind="attrs" v-on="on" :disabled="item.metaGlobal > 0 || item.estado == 'Inactivo' || item.estado == 0 || item.estado == false" @click="openMetaGlobal(item)">
                            <v-icon>mdi-tooltip-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Asignar meta global</span>
                </v-tooltip>
            </template>
            <!----------Fin Iconos de Acciones------------->
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
    data: () => ({
        newMetaGlobal: {
            id: null,
            year: null,
            metaGlobal: 0,
            user: null,
        },
        //objeto que almacena los datos que pasamos del boton editar
        editarMetaLinCentro: { Nombre: '', metaCentro: '', idmeta: '', centro_id: '' },
        //id para editar  datos que pasamos del boton editar
        idmetacentro: '',

        globalMeta: [],
        nowYear: false,
        years: [],
        showTable: false,
        yearSelected: '',
        logged: null,
        alert: false,
        user: 0,
        timeout: 5000,
        message: '',
        checkbox1: '',
        dialog: false,
        dialogCentroxlinea: false,
        selectaprobado: 'SI',
        selectestado: 'Activo',
        dialogAdvertencia: false,
        dialogLoading: true,
        dialogAsignacionMetaPorLinea: false,
        dialogAjusteALaMetaGlobal: false,
        dialogEditarIndicador: false,
        dialogEstado: false,
        dialogMetaGlobal: false,
        dialogEstaSeguroDeGuardarLaInformacion: false,
        valorNuevaMeta: '',
        lineaProgramatica: '',
        lineaProgramaticas: [],
        centros: [],
        centrosBackup: [],
        ves: 0,
        MetaCentros: {
            mporcentro: [{ centro: '', metaCentro: '' }],
            usuarioCreacion: null,
            metaxLinea_id: null,
            metaxlinea: null,
        },
        lineaSelected: {},
        indicador_id: '',
        indicador: '',
        metaGlobal: 0,
        metaGlobalUnit: 0,
        metaAcumulada: 0,
        linea_id: '',
        rowForChange: null,
        search: '',
        headers: [
            { text: 'Indicador', value: 'descripcion' },
            { text: 'Meta Global', value: 'metaGlobal' },
            { text: 'Periodicidad', value: 'periodicidad.Nombre' },
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        /*
        metasxLinProgramatica: '',
        metasxLinProgramaticas: [], */

        // objeto que recibe los valores de la consulta para mostrar
        // las metas por centro
        List: [],
        List2: [],
        categorias: [],
        categoriaSeleccionada: null,

        clasificacion: [],
        clasificacionSeleccionada: null,

        cliente: [],
        clienteSeleccionado: null,

        periodicidad: [],
        periocidadSeleccionada: null,

        plataforma: [],
        plataformaSeleccionada: null,

        unidad: [],
        unidadSeleccionada: null,

        parametros: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            indicador_id: '',
            linea_id: '',
            clasificacion_id: 0,
            categoria_id: 0,
            cliente_id: 0,
            plataforma_id: 0,
            periodicidad_id: 0,
            unidad_id: 0,
            descripcion: '',
            metaGlobal: 0,
            estado: true,
            usuarioCreacion: '',
            usuarioModificacion: '',
            periodicidad: {
                id: 0,
                Nombre: '',
                Descripcion: '',
                estado: null,
                deleted_at: null,
                updated_at: '',
                created_a: '',
            },
        },
        deletedItem: {
            id: 0,
            indicador_id: '',
            linea_id: '',
            clasificacion_id: 0,
            categoria_id: 0,
            cliente_id: 0,
            plataforma_id: 0,
            periodicidad_id: 0,
            unidad_id: 0,
            descripcion: '',
            metaGlobal: 0,
            estado: true,
            usuarioCreacion: '',
            usuarioModificacion: '',
            created_at: '',
            updated_at: '',
            periodicidad: {
                id: 0,
                Nombre: '',
                Descripcion: '',
                estado: null,
                deleted_at: null,
                updated_at: '',
                created_a: '',
            },
        },
        defaultItem: {
            id: 0,
            indicador_id: '',
            linea_id: '',
            clasificacion_id: 0,
            categoria_id: 0,
            cliente_id: 0,
            plataforma_id: 0,
            periodicidad_id: 0,
            unidad_id: 0,
            descripcion: '',
            metaGlobal: 0,
            estado: true,
            usuarioCreacion: '',
            usuarioModificacion: '',
            created_at: '',
            updated_at: '',
            periodicidad: {
                id: 0,
                Nombre: '',
                Descripcion: '',
                estado: null,
                deleted_at: null,
                updated_at: '',
                created_a: '',
            },
        },
    }),
    mounted() {
        if (this.logged) {
            if (this.estado) {
                if (this.aplications.CONFIGURACION && this.screen.ADMININDICADORES.ver) {
                    this.user = this.dataSession.id

                    this.getYearsIndi()

                    axios.get(this.$api + this.$periodicidad).then((response) => {
                        this.periodicidad = []
                        for (var item in response.data.data) {
                            this.periodicidad.push({
                                text: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })

                    axios.get(this.$api + this.$plataforma).then((response) => {
                        this.plataforma = []
                        for (var item in response.data.data) {
                            this.plataforma.push({
                                text: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })
                    axios.get(this.$api + this.$unidad).then((response) => {
                        this.unidad = []
                        for (var item in response.data.data) {
                            this.unidad.push({
                                text: response.data.data[item].Nombre,
                                value: response.data.data[item].id,
                            })
                        }
                    })

                    this.getLineaprogramatica()

                    var fecha = new Date()
                    this.yearSelected = fecha.getFullYear()
                    this.initialize()

                    this.getCategorias()
                    this.getClasificacion()
                    this.getCliente()
                    //this.getMetaLineaCentros()
                }
            }
        } else {
            this.$router.push('/')
        }
    },
    computed: {
        ...mapGetters('auth', ['dataSession']),
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo indicador' : 'Editar indicador'
        },
        disabled() {
            return this.editedItem.Nombre.length === 0 // or === 0
        },
        sumatoria: function () {
            var sumatoria = 0
            //recorrer el array this.lineaProgramaticas y sumar meta de los que son true en estado
            for (let index = 0; index < this.lineaProgramaticas.length; index++) {
                const element = this.lineaProgramaticas[index]
                if (element.selected) sumatoria = sumatoria + element.metaxlinea
            }
            var metacum = this.metaAcumulada
            var metaglo = this.metaGlobal
            this.metaAcumulada = sumatoria
            if (this.metaAcumulada == this.metaGlobal) {
                this.alert = true
                this.message = 'La meta acumulada es igual a la meta global'
            } else {
                if (this.metaAcumulada < this.metaGlobal) {
                    this.message = 'La meta acumulada es menor a la meta global'
                    this.alert = true
                }
                if (this.metaAcumulada > this.metaGlobal) {
                    this.message = 'La meta acumulada es mayor a la meta global'
                    this.alert = true
                }
            }

            return sumatoria
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    methods: {
        /**
         * @param c {objet} centro
         * @param v {number} valor del select
         * @param i {number} posicion
         */
        cambio(c, v, i) {
            c[i].selected = true
        },
        /**
         * @param mlinea {number} meta de la linea programatica
         * @param mcentro {number} entrada del input
         */
        validarMeta(mlinea, mcentro) {
            if (mcentro < 0) {
                return 'No se aceptan metas negativas'
            } else if (mlinea < mcentro) {
                return 'La meta sobrepasa la actual'
            }
        },
        // muestra el modal editar la meta de la linea del centro
        showModal(item) {
            this.editarMetaLinCentro = { Nombre: item.Nombre, metaCentro: item.metaCentro, idmeta: item.id, centro_id: item.centro_id }
            this.idmetacentro = item.id
            this.$refs['my-modal'].show()
        },
        // oculta el modal editar la meta de la linea del centro
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        // edita la meta de la linea del centro
        editMetLinea() {
            const longitud = this.editarMetaLinCentro.metaxlinea
            console.log('longitud-> ' + longitud)
            axios
                .put(this.$api + this.$metalineacentro, this.editarMetaLinCentro)
                .then((res) => {
                    // oculta el modal editar la meta de la linea del centro
                    this.hideModal()
                    //this.$refs['my-modal'].hide()
                    this.$swal({
                        icon: 'success',
                        title: 'Actualización Exitosa',
                        confirmButtonColor: '#fb8c00',
                    })
                    this.message = 'actualizado'
                    this.alert = true
                    //llamamos la funcion getMetaLineaCentros para actualizar la tabla con los cambios realizados
                    this.getMetaLineaCentros()
                })
                .catch((err) => {
                    console.error(err)
                })
        },

        saveMetaLineaCentro(metaSelecionanda) {
            console.log(this.$api + this.$metalineacentro, this.MetaCentros)
            this.dialogoCargando = true
            const m = this.MetaCentros.mporcentro
            console.log('valor de la m ->' + m)
            const meta = metaSelecionanda.metaxlinea //50
            console.log('valor de la meta ->' + meta)

            var total = 0
            for (const i in m) {
                total += Number(m[i].metaCentro)
                console.log('total ->' + total)
            }

            if (total <= meta && total > 0) {
                console.log('Total final ->' + total)
                this.MetaCentros.usuarioCreacion = this.user
                this.MetaCentros.metaxlinea = meta
                console.log('meta total ->' + this.MetaCentros.metaxlinea)

                axios
                    .post(this.$api + this.$metalineacentro, this.MetaCentros)
                    .then((res) => {
                        console.log(res)

                        //var re2 = res.data[1][0]['metaCentro']

                        /*                        var re2 = res.data[1][0]['metaCentro']

                        console.log("por finnnn" + re2)


                        var res = res.data[1]
                        this.List = res
 */
                        this.dialogLoading = false
                        this.$swal({
                            icon: 'success',
                            title: 'Meta de centro(s) actualizado(s)',
                            confirmButtonColor: '#fb8c00',
                        })
                        this.message = 'La meta del centro(s) actualizado(s)'
                        this.alert = true

                        //this.getMetaLineaCentros()
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            } else {
                this.message = 'La meta del centro(s) es mayor o menor ala meta de la linea'
                this.alert = true
            }
            this.dialogLoading = false
        },
        /* funcion para agregar entradas centros */
        addInputCentro() {
            const veces = this.centros.length //Numero de centros en la base de dastos
            if (this.ves + 1 < veces) {
                this.MetaCentros.mporcentro.push({ centro: '', metaCentro: '' })
                this.ves++
            } else {
                this.message = `Solo existen ${veces} centros por ende no puede agregar mas`
                this.alert = true
            }
        },
        /* funcion para remover entradas de centros */
        removeInputCentro() {
            const longitud = this.MetaCentros.mporcentro.length //numero de centros
            const metaPorCentro_id = this.MetaCentros.mporcentro[longitud - 1].centro.id //id del ultimo centro
            if (longitud - 1 > 0) {
                for (const iterator of this.centros) {
                    if (iterator.id == metaPorCentro_id) {
                        iterator.selected = false //deselecciona
                    }
                }
            }
            if (longitud > 1 && this.ves >= 0) {
                this.MetaCentros.mporcentro.pop({ centro: '', metaCentro: '' })
                this.ves--
            }
        },
        closeDialogLineaCentro() {
            this.dialogCentroxlinea = false
            this.MetaCentros = {
                mporcentro: [{ centro: '', metaCentro: '' }],
                usuarioCreacion: null,
                metaxLinea_id: null,
            }
        },
        changedValueClasificacion: function (value) {
            this.clasificacionSeleccionada = value
        },
        changedValueCategoria: function (value) {
            this.categoriaSeleccionada = value
        },
        changedValueCliente: function (value) {
            this.clienteSeleccionado = value
        },
        changedValuePlataforma: function (value) {
            this.plataformaSeleccionada = value
        },
        changedValuePeriocidad: function (value) {
            this.periocidadSeleccionada = value
        },
        changedValueUnidad: function (value) {
            this.unidadSeleccionada = value
        },
        changedValueDescripcion: function (value) {
            this.unidadSeleccionada = value
        },
        changedValueMetaGlobal: function () {
            this.metaGlobalSeleccionada = value
        },
        changedValueEstado: function () {
            this.estadoSeleccionado = value
        },
        closeNuevaMeta: function () {
            this.dialogAjusteALaMetaGlobal = false
        },
        closeDialogEstaSeguroDeGuardarLaInformacion: function () {
            this.dialogEstaSeguroDeGuardarLaInformacion = false
        },
        saveEstado: function () {
            this.dialogEstado = false
        },
        closeEstado: function () {
            this.dialogEstado = false
        },
        closeMetaPorLinea: function () {
            this.dialogAsignacionMetaPorLinea = false
        },
        saveIndicador: function () {
            this.dialogEditarIndicador = false
        },
        closeIndicador: function () {
            this.dialogEditarIndicador = false
        },

        initialize() {
            this.dialogLoading = true
            this.parametros = []
            axios.get(this.$api + this.$indicadorMetaAno + '/getIndicadoresYears/' + this.yearSelected).then((response) => {
                for (let index = 0; index < response.data.indicadores.length; index++) {
                    response.data.indicadores[index].estado = response.data.indicadores[index].estado === 1 ? 'Activo' : 'Inactivo'
                }

                this.indicadores = []
                for (var item in response.data.indicadores) {
                    this.indicadores.push({
                        text: response.data.indicadores[item].descripcion,
                        value: response.data.indicadores[item].id,
                    })
                    this.parametros.push({
                        id: response.data.indicadores[item].id,
                        clasificacion: response.data.indicadores[item].clasificacion,
                        clasificacion_id: response.data.indicadores[item].clasificacion_id,
                        categoria: response.data.indicadores[item].categoria,
                        categoria_id: response.data.indicadores[item].categoria_id,
                        cliente_id: response.data.indicadores[item].cliente_id,
                        plataforma_id: response.data.indicadores[item].plataforma_id,
                        periodicidad_id: response.data.indicadores[item].periodicidad_id,
                        unidad_id: response.data.indicadores[item].unidad_id,
                        descripcion: response.data.indicadores[item].descripcion,
                        estado: response.data.indicadores[item].estado,
                        fechaCreacion: response.data.indicadores[item].fechaCreacion,
                        fechaUltimaModificacion: response.data.indicadores[item].fechaUltimaModificacion,
                        usuarioCreacion: response.data.indicadores[item].usuarioCreacion,
                        usuarioModificacion: response.data.indicadores[item].usuarioModificacion,
                        created_at: response.data.indicadores[item].created_at,
                        periodicidad: response.data.indicadores[item].periodicidad,
                        updated_at: response.data.indicadores[item].updated_at,
                        metaGlobal: response.data.metaGlobal[item].metaGlobal == undefined ? 0 : response.data.metaGlobal[item].metaGlobal,
                    })
                }
            })

            this.showTable = true
            this.dialogLoading = false
            var fecha = new Date()
            var anio = fecha.getFullYear()
            if (this.yearSelected >= anio) {
                this.nowYear = true
            } else {
                this.nowYear = false
            }
        },

        editItem(item) {
            this.editedIndex = this.parametros.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        asignacionMetaPorLinea(item) {
            this.rowForChange = item
            this.indicador_id = item.id
            this.lineaProgramatica.selected
            this.dialogAsignacionMetaPorLinea = true
            this.metaGlobal = item.metaGlobal

            axios
                .post(this.$api + this.$metaPorLinea + '/getLineasXMeta', {
                    id: this.indicador_id,
                    year: this.yearSelected,
                })
                .then((response) => {
                    for (var item in response.data.data) {
                        var elemento = response.data.data[item]
                        var elementolineaProgramaticas = this.lineaProgramaticas.findIndex((x) => x.value == elemento.linea_id)
                        var elementoSeleccionado = this.lineaProgramaticas[elementolineaProgramaticas]

                        elementoSeleccionado.selected = elemento.estado == 0 ? false : true
                        elementoSeleccionado.metaxlinea = elemento.metaLinea
                    }
                })
                .catch((erro) => {
                    console.error(erro)
                })
        },
        ajusteALaMetaGlobal(item) {
            this.rowForChange = item
            this.indicador_id = item.id
            this.metaGlobal = item.metaGlobal
            this.dialogAjusteALaMetaGlobal = true
        },
        editarIndicador(item) {
            this.rowForChange = item
            this.indicador_id = item.id
            this.dialogEditarIndicador = true
        },
        cambioDeEstado(item) {
            this.rowForChange = item
            this.selectestado = item.estado
            this.indicador_id = item.id
            this.dialogEstado = true
        },
        estaSeguroDeGuardarLaInformacion() {
            this.dialogEstaSeguroDeGuardarLaInformacion = true
        },

        deleteItem() {
            const index = this.parametros.indexOf(this.deletedItem)
            this.dialogAdvertencia = false
            if (this.parametros.splice(index, 1)) {
                axios.delete(this.$api + this.$indicadores + '/' + this.deletedItem.id).then((response) => {
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
            })
        },
        saveMetaPorLinea() {
            this.dialogLoading = true
            var id = this.id
            var idIndicador = this.indicador_id
            var idLinea = this.linea_id
            var metaLinea = this.metaLinea
            var metaPorLinea = this.metaPorLinea

            axios
                .post(this.$api + this.$metaPorLinea + '/set', {
                    indicador_id: idIndicador,
                    metaXLinea: this.lineaProgramaticas,
                    year: this.yearSelected,
                    user: this.user,
                })

                .then((response) => {
                    this.dialogEstaSeguroDeGuardarLaInformacion = false
                    this.message = 'Meta Por Lineas Asignadas'
                    this.alert = true
                    this.dialogLoading = false

                    this.dialogAsignacionMetaPorLinea = false
                })
                .catch((err) => {
                    this.dialogEstaSeguroDeGuardarLaInformacion = false
                    this.alert = true

                    this.dialogLoading = false
                })
        },
        saveNuevaMeta() {
            this.dialogLoading = true
            var idIndicador = this.indicador_id
            var metaOriginal = this.metaGlobal
            var aprobado = this.selectaprobado === 'SI' ? true : false
            var valor = this.valorNuevaMeta
            var usuarioModificacion = 'usuario modificacion de prueba'
            var usuarioCreacion = 'usuario creacion de prueba'
            if (valor > 0) {
                axios
                    .post(this.$api + this.$ajustemetaglobal, {
                        indicador_id: idIndicador,
                        aprobacion: aprobado,
                        metaAjustado: valor,
                        metaOriginal: metaOriginal,
                        usuarioModificacion: this.user,
                        usuarioCreacion: usuarioCreacion,
                        estado: true,
                        year: this.yearSelected,
                    })
                    .then((response) => {
                        this.$swal({
                            icon: 'warning',
                            title: 'Recuerda que...',
                            text: 'Al ajustar la meta global del indicador, debe percatarse de que la asignación de las metas por línea coincida con el nuevo registro realizado.',
                        })
                        this.message = 'Meta Global Ajustada'
                        this.alert = true
                        this.dialogLoading = false
                        //cerrar la ventana del dialogo de la nueva meta global
                        this.dialogAjusteALaMetaGlobal = false
                        this.valorNuevaMeta = ''
                        this.selectaprobado = 'SI'

                        this.initialize()
                    })
                    .catch((err) => {
                        this.alert = true
                        this.dialogLoading = false
                    })
                this.initialize()
            } else {
                this.dialogLoading = false
                this.$swal({
                    icon: 'error',
                    title: 'Ups...!',
                    text: 'No ingreso el valor de la nueva meta global.',
                })
            }
        },
        saveIndicador() {
            this.dialogLoading = true
            var idIndicador = this.indicador_id
            this.rowForChange.usuarioModificacion = this.user
            this.rowForChange.estado = this.rowForChange.estado === 'Activo' ? 1 : 0
            console.log('Mando esto ->' + this.rowForChange)

            axios
                .put(this.$api + this.$indicadores, this.rowForChange)
                .then((response) => {
                    this.message = 'Guardar Indicador'
                    this.alert = true
                    this.dialogLoading = false
                    this.dialogEditarIndicador = false

                    var elemento = this.parametros.findIndex((x) => x.id == idIndicador)
                    this.rowForChange.editarIndicador = valor
                    this.parametros.$set(elemento, this.rowForChange)
                })
                .catch((err) => {
                    this.alert = true
                    /*this.message = err.response.data.errors.Nombre[0];*/
                    this.dialogLoading = false
                })
        },

        saveEstado() {
            this.dialogLoading = true
            var estado = this.selectestado === 'Activo' ? true : false
            var id = this.indicador_id
            axios
                .post(this.$api + this.$indicadores + '/estado', {
                    estado: estado,
                    id: id,
                })

                .then((response) => {
                    this.message = 'Estado Actualizado'
                    this.alert = true
                    this.dialogLoading = false
                    this.dialogEstado = false
                    this.initialize()
                    var elemento = this.parametros.findIndex((x) => x.id == this.indicador_id)
                    this.rowForChange.estado = true
                    this.parametros.$set(elemento, this.rowForChange)
                })
        },

        getIndicadores(year) {
            console.log(this.$api + this.$indicadorMetaAno + '/getIndicadoresYears/' + year)
            this.parametros = []
            axios.get(this.$api + this.$indicadorMetaAno + '/getIndicadoresYears/' + year).then((response) => {
                for (let index = 0; index < response.data.indicadores.length; index++) {
                    response.data.indicadores[index].estado = response.data.indicadores[index].estado === 1 ? 'Activo' : 'Inactivo'
                }

                this.indicadores = []
                for (var item in response.data.indicadores) {
                    this.indicadores.push({
                        text: response.data.indicadores[item].descripcion,
                        value: response.data.indicadores[item].id,
                    })
                    this.parametros.push({
                        id: response.data.indicadores[item].id,
                        clasificacion: response.data.indicadores[item].clasificacion,
                        clasificacion_id: response.data.indicadores[item].clasificacion_id,
                        categoria: response.data.indicadores[item].categoria,
                        categoria_id: response.data.indicadores[item].categoria_id,
                        cliente_id: response.data.indicadores[item].cliente_id,
                        plataforma_id: response.data.indicadores[item].plataforma_id,
                        periodicidad_id: response.data.indicadores[item].periodicidad_id,
                        unidad_id: response.data.indicadores[item].unidad_id,
                        descripcion: response.data.indicadores[item].descripcion,
                        estado: response.data.indicadores[item].estado,
                        fechaCreacion: response.data.indicadores[item].fechaCreacion,
                        fechaUltimaModificacion: response.data.indicadores[item].fechaUltimaModificacion,
                        usuarioCreacion: response.data.indicadores[item].usuarioCreacion,
                        usuarioModificacion: response.data.indicadores[item].usuarioModificacion,
                        created_at: response.data.indicadores[item].created_at,
                        periodicidad: response.data.indicadores[item].periodicidad,
                        updated_at: response.data.indicadores[item].updated_at,
                        metaGlobal: response.data.metaGlobal[item].metaGlobal == undefined ? 0 : response.data.metaGlobal[item].metaGlobal,
                    })
                }
            })
            var fecha = new Date()
            var anio = fecha.getFullYear()
            if (year >= anio) {
                this.nowYear = true
            } else {
                this.nowYear = false
            }
            this.showTable = true
            this.dialogLoading = false
        },

        openMetaGlobal(item) {
            this.dialogMetaGlobal = true
            this.newMetaGlobal.year = this.yearSelected
            this.newMetaGlobal.id = item.id
            this.newMetaGlobal.metaGlobal = 0
        },

        closeDialogMetaGlobal() {
            this.dialogMetaGlobal = false
        },

        saveMetaGLobal() {
            this.newMetaGlobal
            this.newMetaGlobal.user = this.user
            this.newMetaGlobal.metaGlobal = parseFloat(this.newMetaGlobal.metaGlobal)
            this.$swal({
                icon: 'question',
                title: '¿Guardar la meta global?',
                html:
                    `
          <p>Año: ` +
                    this.newMetaGlobal.year +
                    `</p>
          <p>Meta global: ` +
                    this.newMetaGlobal.metaGlobal +
                    `</p>
        `,
                showCancelButton: 'Cancelar',
                confirmButtonText: `Guardar`,
                confirmButtonColor: '#fb8c00',
                cancelButtonColor: 'red',
            }).then((result) => {
                axios
                    .post(this.$api + this.$indicadorMetaAno + '/createMetaGlobalYear', this.newMetaGlobal)
                    .then((response) => {
                        this.message = response.data
                        this.alert = true
                        this.dialogLoading = true
                        this.parametros = []
                        axios.get(this.$api + this.$indicadorMetaAno + '/getIndicadoresYears/' + this.yearSelected).then((response) => {
                            for (let index = 0; index < response.data.indicadores.length; index++) {
                                response.data.indicadores[index].estado = response.data.indicadores[index].estado === 1 ? 'Activo' : 'Inactivo'
                            }

                            this.indicadores = []
                            for (var item in response.data.indicadores) {
                                this.indicadores.push({
                                    text: response.data.indicadores[item].descripcion,
                                    value: response.data.indicadores[item].id,
                                })
                                this.parametros.push({
                                    id: response.data.indicadores[item].id,
                                    clasificacion: response.data.indicadores[item].clasificacion,
                                    clasificacion_id: response.data.indicadores[item].clasificacion_id,
                                    categoria: response.data.indicadores[item].categoria,
                                    categoria_id: response.data.indicadores[item].categoria_id,
                                    cliente_id: response.data.indicadores[item].cliente_id,
                                    plataforma_id: response.data.indicadores[item].plataforma_id,
                                    periodicidad_id: response.data.indicadores[item].periodicidad_id,
                                    unidad_id: response.data.indicadores[item].unidad_id,
                                    descripcion: response.data.indicadores[item].descripcion,
                                    estado: response.data.indicadores[item].estado,
                                    fechaCreacion: response.data.indicadores[item].fechaCreacion,
                                    fechaUltimaModificacion: response.data.indicadores[item].fechaUltimaModificacion,
                                    usuarioCreacion: response.data.indicadores[item].usuarioCreacion,
                                    usuarioModificacion: response.data.indicadores[item].usuarioModificacion,
                                    created_at: response.data.indicadores[item].created_at,
                                    periodicidad: response.data.indicadores[item].periodicidad,
                                    updated_at: response.data.indicadores[item].updated_at,
                                    metaGlobal: response.data.metaGlobal[item].metaGlobal == undefined ? 0 : response.data.metaGlobal[item].metaGlobal,
                                })
                            }
                        })
                        this.showTable = true
                        this.dialogLoading = false

                        this.dialogMetaGlobal = false
                    })
                    .catch((err) => {
                        this.$swal({
                            icon: 'error',
                            title: 'Ups...!',
                            text: err.response.data,
                            confirmButtonColor: '#fb8c00',
                        })
                    })
            })
        },

        save() {
            this.dialogLoading = true
            if (this.editedIndex > -1) {
                axios
                    .put(this.$api + this.$indicadores, this.editedItem)
                    .then((response) => {
                        this.message = 'elemento actualizado'
                        this.alert = true
                        Object.assign(this.parametros[this.editedIndex], this.editedItem)
                        this.dialogLoading = false
                        this.close()
                    })
                    .catch((err) => {
                        this.alert = true
                        /*this.message = err.response.data.errors.Nombre[0];*/
                        this.dialogLoading = false
                        this.close()
                    })
            } else {
                this.editedItem.usuarioCreacion = this.user
                this.editedItem.categoria_id = this.categoriaSeleccionada
                this.editedItem.cliente_id = this.clienteSeleccionado
                this.editedItem.clasificacion_id = this.clasificacionSeleccionada
                this.editedItem.periodicidad_id = this.periocidadSeleccionada
                this.editedItem.plataforma_id = this.plataformaSeleccionada
                this.editedItem.unidad_id = this.unidadSeleccionada
                this.editedItem.usuarioModificacion = this.usuarioModificacionSeleccionado

                axios
                    .post(this.$api + this.$indicadores + '/nuevaMeta', this.editedItem)
                    .then((response) => {
                        this.message = 'elemento adicionado'
                        this.alert = true

                        this.editedItem.id = response.data.data.id
                        this.editedItem.periodicidad = response.data.data.periodicidad
                        this.editedItem.estado = response.data.data.estado === true ? 'Activo' : 'Inactivo'

                        this.parametros.push(this.editedItem)

                        this.dialogLoading = false
                        this.close()
                        this.editedItem = this.defaultItem

                        this.categoriaSeleccionada = 0
                        this.clienteSeleccionado = 0
                        this.clasificacionSeleccionada = 0
                        this.periocidadSeleccionada = 0
                        this.plataformaSeleccionada = 0
                        this.unidadSeleccionada = 0
                        this.getYearsIndi()
                        var fecha = new Date()
                        this.yearSelected = fecha.getFullYear()
                        this.initialize()
                    })
                    .catch((err) => {
                        this.alert = true
                        /*this.message = err.response.data.errors.Nombre[0];*/
                        this.dialogLoading = false
                        this.close()
                    })
            }
            //this.initialize()
        },
        getLineaprogramatica() {
            this.dialogLoading = true
            axios.get(this.$api + this.$lineaprogramatica).then((response) => {
                this.lineaProgramaticas = []
                for (var item in response.data.data) {
                    //Aqui se dibuja
                    this.lineaProgramaticas.push({
                        linea: response.data.data[item].Nombre,
                        value: response.data.data[item].id,
                        selected: false,
                        metaxlinea: 0,
                    })
                }
            })
            this.dialogLoading = false
        },

        getYearsIndi() {
            axios.post(this.$api + this.$indicadorMetaAno + '/getYears').then((response) => {
                this.dialogLoading = true
                this.years = response.data
            })
            this.dialogLoading = false
        },

        getCategorias() {
            axios.get(this.$api + this.$categorias).then((response) => {
                this.categorias = []
                for (var item in response.data.data) {
                    this.categorias.push({
                        text: response.data.data[item].Nombre,
                        value: response.data.data[item].id,
                    })
                }
            })
        },

        getClasificacion() {
            axios.get(this.$api + this.$clasificacion).then((response) => {
                this.clasificacion = []
                for (var item in response.data.data) {
                    this.clasificacion.push({
                        text: response.data.data[item].Nombre,
                        value: response.data.data[item].id,
                    })
                }
                this.dialogLoading = false
            })
        },

        getCliente() {
            axios.get(this.$api + this.$cliente).then((response) => {
                this.cliente = []
                for (var item in response.data.data) {
                    this.cliente.push({
                        text: response.data.data[item].Nombre,
                        value: response.data.data[item].id,
                    })
                }
                this.dialogLoading = false
            })
        },
        //------------------------------------------------------------------------------//
        // metodo para optener las metas por linea centro
        getMetaLineaCentros() {
            this.MetaCentros.metaxLinea_id
            //console.log("id linea -> " + this.MetaCentros.metaxLinea_id)
            axios.get(this.$api + 'metalineacentro', this.MetaCentros.metaxLinea_id).then((response) => {
                // cuando los datos del controlador se envian por medio de la funcion collection se reciben en dos veces data
                //  var res = response.data.data

                console.log('ultima respuesta -> ' + response)
                //var res1 = response.data[1]

                var res = response.data[0]
                //console.log('llegaaaaa -> ' + res1)

                this.List = res
                //console.log('llegaron datos con éxito')
            })
        },
        //------------------------------------------------------------------------------//

        getCentros(lineaProgramatica) {
            this.MetaCentros.metaxLinea_id = lineaProgramatica.value
            console.log('estooooooooo  this.MetaCentros.metaxLinea_id = lineaProgramatica.value -> ' + this.MetaCentros.metaxLinea_id)
            this.lineaSelected = lineaProgramatica
            //console.log('this.lineaSelected = lineaProgramatica  ->' + this.lineaSelected)
            this.ves = 0
            //console.log("api -> " + this.$api + this.$centros);
            axios
                .get(this.$api + this.$centros)
                .then((response) => {
                    const centros = []
                    const respuesta = response.data.data
                    for (const item in respuesta) {
                        centros.push({
                            Nombre: respuesta[item].Nombre,
                            id: respuesta[item].id,
                            selected: false,
                        })
                    }
                    this.centros = centros
                    this.centrosBackup = centros
                    this.getMetaLineaCentros()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
}
</script>
<style scoped>
.background {
    background-color: white;
}

.metaacumulada-menor {
    background-color: rgb(40, 38, 180);
    color: white;
    border-radius: 5px;
}

.metaacumulada-mayor {
    background-color: rgb(243, 39, 39);
    color: white;
    border-radius: 5px;
}

.metaacumulada-igual {
    background-color: rgb(74, 182, 3);
    color: white;
    font-weight: bolder;
    border-radius: 5px;
}
</style>
