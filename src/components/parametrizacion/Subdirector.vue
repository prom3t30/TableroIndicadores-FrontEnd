<template>
    <div v-if="aplications.PARAMETRIZACION && screen.EJESUBDIRECTOR.ver">
                <!-- MODAL Meses-->
                <b-modal ref="my-modal" hide-footer title="Ejecución meta por linea" size="xl" body-bg-variant="warning" header-bg-variant="warning" header-text-variant="light">
                    <v-card>
                        <!--                         <v-card-title class="warning" style="color: black">
                            <span class="headline">Editar Meta</span>
                        </v-card-title> -->
                        <v-card-text>
                            <v-container>
                                <v-row  >

                                    <v-col cols="6" v-for="meta in List" :key="meta.id">
                                       <b-card title="Meta linea " >
                                            <b-card-text>
                                                <span  style="font-size:26px">{{meta.metaCentro}}</span>
                                            </b-card-text>
                                        </b-card>
                                    </v-col>

                                    <v-col cols="6">
                                        <b-card title="Meta Acumulada ">
                                            <b-card-text>
                                            <span style="font-size:26px">{{TotalEjecucion}}</span>
                                            </b-card-text>
                                        </b-card>
                                    </v-col>
                                </v-row>
                            <!--  Filas de meses  -->
                                <v-row>

                                    <v-col>
                                        <b-card title="Enero" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionEne" :disabled="btn_save"> </v-text-field>
                                            <v-text-field type="text" label=" Evidencia Link" v-model="urlEne" required :disabled="btn_save"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,1)" block :disabled="btn_save" >Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Enero'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_save">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>

                                                </span>
                                            </div>

                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Febrero" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución " v-model="ejecucionFeb" :disabled="btn_feb"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlFeb" required :disabled="btn_feb"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,2,'2022/05/01')" block :disabled="btn_feb">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Febrero'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_feb">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>

                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Marzo" v-for="item in List" :key="item.id"  class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionMar" :disabled="btn_mar"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlMar" required :disabled="btn_mar"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,3)" block :disabled="btn_mar">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Marzo'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_mar">Editar
                                                    <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>

                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Abril" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionAbr" :disabled="btn_abr"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlAbr" required :disabled="btn_abr"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,4)" block :disabled="btn_abr">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Abril'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_abr">Editar
                                                    <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                </v-row>

                                <v-row>
                                    <v-col>
                                        <b-card title="Mayo" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionMay" :disabled="btn_may"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlMay" required :disabled="btn_may"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,5)" block :disabled="btn_may">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Mayo'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_may">Editar
                                                    <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Junio" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionJun" :disabled="btn_jun"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlJun"  :disabled="btn_jun"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,6)" block :disabled="btn_jun">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Junio'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_jun">Editar
                                                    <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Julio" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionJul" :disabled="btn_jul"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlJul" required :disabled="btn_jul"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,7)" block :disabled="btn_jul">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Julio'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_jul">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Agosto" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionAgo" :disabled="btn_ago"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlAgo" required :disabled="btn_ago"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,8)" block :disabled="btn_ago">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Agosto'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_ago">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                </v-row>

                                <v-row>
                                    <v-col>
                                        <b-card title="Septiembre" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionSep" :disabled="btn_sep"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlSep" required :disabled="btn_sep"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,9)" block :disabled="btn_sep">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Septiembre'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_sep">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Octubre" v-for="item in List" :key="item.id" class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionOct" :disabled="btn_oct"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlOct" required :disabled="btn_oct"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,10)" block :disabled="btn_oct">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Octubre'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_oct">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Noviembre" v-for="item in List" :key="item.id"  class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionNov" :disabled="btn_nov"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlNov" required :disabled="btn_nov"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,11)" block :disabled="btn_nov">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Noviembre'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_nov">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>

                                    <v-col>
                                        <b-card title="Diciembre" v-for="item in List" :key="item.id"  class="black">
                                            <v-text-field type="number" label="Ejecución" v-model="ejecucionDic" :disabled="btn_dic"> </v-text-field>
                                            <v-text-field type="text" label="Evidencia Link" v-model="urlDic" required :disabled="btn_dic"> </v-text-field>
                                            <v-row align="center" justify="space-around">
                                                <v-btn small style="background-color: #4caf50" @click="saveEjecution(item,12)" block :disabled="btn_dic">Guardar
                                                    <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                                </v-btn>
                                            </v-row>
                                            <div  v-for="res in List2" :key="res.id">
                                                <span v-if="res.mes == 'Diciembre'">
                                                    Ejecucion Realizada: {{res.valorejecucionrealizada}}
                                                <v-row align="center" justify="space-around">
                                                    <v-btn small style="background-color:orange" @click="showModal(res)" block :disabled="btn_dic">Editar
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </v-row>
                                                </span>
                                            </div>
                                        </b-card>
                                    </v-col>
                                </v-row>
                                <!-- FIN  Filas de meses  -->


                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn style="background-color: #fb8c00" text @click="hideModalTwo">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </b-modal>

                <!--MODAL Editar-->
                  <b-modal ref="bv-modal" id="" hide-footer>
                    <template #modal-title>
                        Editar Ejecución
                    </template>
                    <div class="d-block text-center">
                    <h3>Ejecución {{editarMetaLinCentro.mes}}</h3>
<!--                         <v-row >
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="editarMetaLinCentro.id" type="text" label="id"> </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="editarMetaLinCentro.mes" type="text" label="Mes"> </v-text-field>
                            </v-col>
                        </v-row> -->
                        <v-row >
                            <v-col cols="12" sm="12" md="12">
                                Ejecución
                                <v-text-field v-model="editarMetaLinCentro.valorejecucionrealizada" type="text" label="Ejecucion"> </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row >
                            <v-col cols="12" sm="12" md="12">
                                Evidencia link
                                <v-text-field v-model="editarMetaLinCentro.link" type="text" label="Ejecucion"> </v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                    <b-button style="background-color: #4caf50" class="mt-3" block @click="editMetLinea">Actualizar</b-button>
                    <b-button style="background-color:orange" class="mt-3" block @click="hideModal()">Cancelar</b-button>
                </b-modal>

                <!--modal informacion -->
                 <b-modal ref="modal-info" id="" hide-footer>
                    <template #modal-title>
                        Ejecución Indicadores
                    </template>
                    <div class="d-block text-center">
                    <h3  style="color:orange">Importante!!</h3>
                        <v-row >
                            <v-col cols="12" sm="12" md="12" >
                                <span style="color:black;font-size:20px">
                                    Recuerde registrar los indicadores en los primeros 15 días hábiles en el aplicativo.
                                </span>
                            </v-col>
                        </v-row>
                    </div>
                    <b-button style="background-color:orange" class="mt-3" block @click="hideModal3()">Aceptar</b-button>
                </b-modal>


        <h1 class="oranges">Ejecucion Subdirector</h1>

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
                    <v-btn color="warning" dark class="mb-2" @click="buscarMetaASignada">Ejecución de la Meta </v-btn>
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

        // objeto que recibe los valores de la consulta para mostrar
        // las metas por linea por centro
        List: [],
        List2: [],
        List3: [],


        // declaramos los input que reciben las varibales de los meses con
        // sus valores a almacenar en la tabla EjecucionMetaCentro
        ejecucion:'',
        url:'',

        ejecucionEne:'',
        urlEne:'',
        ejecucionFeb:'',
        urlFeb:'',
        ejecucionMar:'',
        urlMar:'',
        ejecucionAbr:'',
        urlAbr:'',
        ejecucionMay:'',
        urlMay:'',
        ejecucionJun:'',
        urlJun:'',
        ejecucionJul:'',
        urlJul:'',
        ejecucionAgo:'',
        urlAgo:'',
        ejecucionSep:'',
        urlSep:'',
        ejecucionOct:'',
        urlOct:'',
        ejecucionNov:'',
        urlNov:'',
        ejecucionDic:'',
        urlDic:'',

        //objeto que almacena los datos que pasamos del boton editar
        editarMetaLinCentro: { id: '', mes: '', valorejecucionrealizada: '', link: '' },

        // valor del boton guardar de los meses
        btn_save:true,
        btn_feb:true,
        btn_mar:true,
        btn_abr:true,
        btn_may:true,
        btn_jun:true,
        btn_jul:true,
        btn_ago:true,
        btn_sep:true,
        btn_oct:true,
        btn_nov:true,
        btn_dic:true,





        // variable que almacena el total de ejecucion por linea hasta la fecha
        TotalEjecucion:'',


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
                if (this.aplications.PARAMETRIZACION && this.screen.EJESUBDIRECTOR.ver) {
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
                    this.enableDesable()

                    setTimeout(() => {
                        this.showModal3()
                    }, 3000);

                }
            } else {
                this.$router.push('/')
            }
            //this.btn_save = false
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

        //  mi metodo --------------------------------------------------------------
        async buscarMetaASignada(){
            this.esperar = true
            var sumaMetaEsperada = 0
            var lineaProgramatica = this.lineaProgramatica
            //console.log("linea programatica selecionada-> " + lineaProgramatica)
            var indicador = this.indicador
            console.log("indicador selecionado-> " + indicador)

            var year = this.year
            // nombre usuario de la vista  actual
            var usu = this.nombre
/*             var id = this.user

            console.log("ID user -> " + id); */

            //console.log("usr " + usu  + " year" + year);
            if (lineaProgramatica != null && indicador != null && year != null) {
                await axios
                    .post(this.$api + this.$ejecucionIndicador + '/getMetasEsperadasPorLineaPorAnioPorCentro', {
                        lineaProgramatica: lineaProgramatica,
                        indicador: indicador,
                        year: year,
                        meses: this.meses,
                        usu: usu,
                        ides: this.user
                    })
                    .then((response) => {
                        this.esperar = false

                        var res = response.data[0]
                        var re2 = response.data[1]
                        var total = response.data[2]


                        this.TotalEjecucion = total

                        this.List2 = re2
                        this.List = res

/*                         console.log(typeof this.List);

                        console.log("este -> " + this.List); */


                        this.$refs['my-modal'].show();



                    })
            } else {
                this.dialog = false
                this.$swal({
                    icon: 'error',
                    title: 'Ups...!',
                    text: 'No ha escogido la linea programatica, el año y/o el indicador.',
                    confirmButtonColor: '#fb8c00',
                })
            }// fin ELSE

        },// Fin buscarMetaASignada

        // oculta el modaL EJECUCION DE METAS POR LINEA
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        hideModal3() {
            this.$refs['modal-info'].hide()
        },
        showModal3(){
            this.$refs['modal-info'].show()

        },

        // funcion ejecutar meta por linea
        saveEjecution(item,valor,fecha){

            var fechaActual = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            console.log("fecha actual" + fechaActual); // este trae  2022/05/19

            if (valor== 1) {
                //console.log("seleccionoooooo ->" + valor);
                item.year = this.year;
                var ene = "Enero";
                item.mes = ene;
                item.ejecucion = this.ejecucionEne;
                item.url = this.urlEne;
                // llamamos la funcion que nos hace el insert de cada mes
                //y le pasamos el objeto item con los valores
                this.insertMonth(item);
            }

            if (valor== 2) {

                console.log("fecha -> " + fecha)

                if (fecha <= fechaActual ) {
                    item.year = this.year;
                    var feb = "Febrero";
                    item.mes = feb;
                    item.ejecucion = this.ejecucionFeb;
                    item.url = this.urlFeb;
                    this.insertMonth(item);
                }
                else {
                        this.$swal({
                            icon: 'danger',
                            title: 'Periodo no vigente para ejecutar meta',
                            confirmButtonColor: '#fb8c00',
                        })
                }

            }

            if (valor== 3) {
                item.year = this.year;
                var Mar = "Marzo";
                item.mes = Mar;
                item.ejecucion = this.ejecucionMar;
                item.url = this.urlMar;
                this.insertMonth(item);
            }

            if (valor== 4) {
                item.year = this.year;
                var Abr = "Abril";
                item.mes = Abr;
                item.ejecucion = this.ejecucionAbr;
                item.url = this.urlAbr;
                this.insertMonth(item);
            }

            if (valor== 5) {
                item.year = this.year;
                var May = "Mayo";
                item.mes = May;
                item.ejecucion = this.ejecucionMay;
                item.url = this.urlMay;
                this.insertMonth(item);
            }

            if (valor== 6) {
                item.year = this.year;
                var Jun = "Junio";
                item.mes = Jun;
                item.ejecucion = this.ejecucionJun;
                item.url = this.urlJun;
                this.insertMonth(item);
            }

            if (valor== 7) {
                item.year = this.year;
                var Jul = "Julio";
                item.mes = Jul;
                item.ejecucion = this.ejecucionJul;
                item.url = this.urlJul;
                this.insertMonth(item);
            }

            if (valor== 8) {
                item.year = this.year;
                var Ago = "Agosto";
                item.mes = Ago;
                item.ejecucion = this.ejecucionAgo;
                item.url = this.urlAgo;
                this.insertMonth(item);
            }

            if (valor== 9) {
                item.year = this.year;
                var Sep = "Septiembre";
                item.mes = Sep;
                item.ejecucion = this.ejecucionSep;
                item.url = this.urlSep;
                // llamamos la funcion que nos hace el insert de cada mes
                //y le pasamos el objeto item con los valores
                this.insertMonth(item);
            }

            if (valor== 10) {
                item.year = this.year;
                var Oct = "Octubre";
                item.mes = Oct;
                item.ejecucion = this.ejecucionOct;
                item.url = this.urlOct;
                this.insertMonth(item);
            }

            if (valor== 11) {
                item.year = this.year;
                var Nov = "Noviembre";
                item.mes = Nov;
                item.ejecucion = this.ejecucionNov;
                item.url = this.urlNov;
                this.insertMonth(item);
            }

            if (valor== 12) {
                item.year = this.year;
                var Dic = "Diciembre";
                item.mes = Dic;
                item.ejecucion = this.ejecucionDic;
                item.url = this.urlDic;
                this.insertMonth(item);
            }


        },
        // funcion para almacenar las indicadores de cada mes
        insertMonth(item){
                axios
                    .post(this.$api + this.$ejecucionIndicador + '/ejecucionPorLineaPorCentro', item)
                    .then((res) => {
                        console.log(res)
                        this.dialogLoading = false
                        this.$swal({
                            icon: 'success',
                            title: 'Ejecución Almacenada',
                            confirmButtonColor: '#fb8c00',
                        })
                        this.message = 'La meta almacenada';
                        this.hideModal();
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    })
                    .catch((err) => {
                        console.error(err)
                        this.$swal({
                            icon: 'danger',
                            title: 'Verifique la informacion ingresada',
                            confirmButtonColor: '#fb8c00',
                        })
                    });
        },
        // muestra el modal editar la meta del mes
        showModal(res) {

            this.editarMetaLinCentro = { id: res.id, mes: res.mes, valorejecucionrealizada: res.valorejecucionrealizada , link: res.link }
            this.$refs['bv-modal'].show()
        },
        // oculta modal editar
        hideModal() {
            this.$refs['bv-modal'].hide()
        },
        // oculta modal meses
        hideModalTwo() {
            this.$refs['my-modal'].hide()

        },
        // edita la ejecucion de cada mes
        editMetLinea() {

            console.log('messssssssss-> ' + this.editarMetaLinCentro.mes )
            axios
                .put(this.$api + this.$ejecucionIndicador + '/ejecucionPorLineaPorCentroPorSub', this.editarMetaLinCentro)
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
                    //llamamos la funcion buscarMetaASignada para actualizarlos datos en la vista
                    this.buscarMetaASignada()
                })
                .catch((err) => {
                    console.error(err)
                        this.$swal({
                            icon: 'danger',
                            title: 'Verifique la informacion que desea actualizar!!',
                            confirmButtonColor: '#fb8c00',
                        })
                });
        },
        //funcion para  condicion de activar botones
        enableDesable(){

            var fechaActual = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            console.log("fecha actual" + fechaActual); // este trae  2022/05/19

            var eneroInicio = "2022/01/01"
            var enerofin = "2022/01/20"

            if (fechaActual >= eneroInicio &&  fechaActual <= enerofin ) {
                this.btn_save = false;
            }

            var FebInicio = "2022/02/01"
            var Febfin = "2022/02/20"
            if (fechaActual >= FebInicio &&  fechaActual <= Febfin ) {
                this.btn_feb = false;
            }


            var MarInicio = "2022/03/01"
            var Marfin = "2022/03/20"
            if (fechaActual >= MarInicio &&  fechaActual <= Marfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_mar = false;
            }


            var AbrInicio = "2022/04/01"
            var Abrfin = "2022/04/20"
            if (fechaActual >= AbrInicio &&  fechaActual <= Abrfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_abr = false;
            }

            var MayInicio = "2022/05/01"
            var Mayfin = "2022/05/20"
            if (fechaActual >= MayInicio &&  fechaActual <= Mayfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_may = false;
            }


            var JunInicio = "2022/06/01"
            var Junfin = "2022/06/20"
            if (fechaActual >= JunInicio &&  fechaActual <= Junfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_jun = false;
            }


            var JulInicio = "2022/06/01"
            var Julfin = "2022/06/20"

            if (fechaActual >= JulInicio &&  fechaActual <= Julfin ) {
                this.btn_jul = false;
            }

            var AgoInicio = "2022/08/01"
            var Agofin = "2022/08/20"
            if (fechaActual >= AgoInicio &&  fechaActual <= Agofin ) {
                this.btn_ago = false;
            }


            var SepInicio = "2022/09/01"
            var Sepfin = "2022/09/20"
            if (fechaActual >= SepInicio &&  fechaActual <= Sepfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_sep = false;
            }


            var OctInicio = "2022/10/01"
            var OCtfin = "2022/10/20"
            if (fechaActual >= OctInicio &&  fechaActual <= OCtfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_oct = false;
            }

            var NovInicio = "2022/11/01"
            var Novfin = "2022/11/20"
            if (fechaActual >= NovInicio &&  fechaActual <= Novfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_nov = false;
            }


            var DicInicio = "2022/12/01"
            var Dicfin = "2022/12/20"
            if (fechaActual >= DicInicio &&  fechaActual <= Dicfin ) {
                // si 2022/05/19 <= 2022/01/01 && 2022/05/19 < enerofin
                this.btn_dic = false;
            }




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

<style>

.black{
    color: rgb(8, 5, 5);
}
.oranges{
    color: #d77813;
}
</style>
