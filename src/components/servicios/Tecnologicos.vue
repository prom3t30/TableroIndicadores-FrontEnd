<template>
    <v-row v-if="aplications.SERVICIOSTECNOLOGICOS && screen.METASERVICIOSTECNOLOGICOS.ver" class="fill-height">
        <v-col>
            <!-- pantalla de bienvenida -->
            <v-container v-if="!crear" fluid class="text-center">
                <h3 class="text-h3" style="margin-top: 10%">Metas servicios tecnologicos</h3>
                <h5 class="text-h5 mt-5">Con el siguiente formulario se podra registrar los datos de un proyecto tecnologico.</h5>
                <v-btn class="mt-5" color="orange" text elevation="1" @click="crear = true">
                    Continuar
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-container>
            <!-- /pantalla de bienvenida -->

            <v-stepper v-if="crear" v-model="progreso">
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

                <!-- ALERTA DE MENSAJES ERRONEOS -->
                <v-snackbar v-model="alert" :timeout="timeout">
                    {{ this.message }}
                    <template v-slot:action="{ attrs }">
                        <v-btn color="red" text v-bind="attrs" @click="alert = false"> Cerrar </v-btn>
                    </template>
                </v-snackbar>
                <!-- ALERTA DE MENSAJES ERRONEOS -->

                <!-- Cabeceras -->
                <v-stepper-header>
                    <v-stepper-step color="orange" :complete="progreso > 1" step="1"> Informacion Proyecto </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 2" step="2"> Sistema de gestion </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 3" step="3"> Empresas </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 4" step="4"> Aprendices </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 5" step="5"> Emprendedores </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 6" step="6"> Personas </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 7" step="7"> Otras Metas </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step color="orange" :complete="progreso > 8" step="8"> Seguimiento </v-stepper-step>
                </v-stepper-header>
                <!-- /Cabeceras -->

                <!-- Articulos de contenido -->
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Información de proyecto </v-card-title>
                            <v-card-text class="mx-auto">
                                <v-select
                                    class="label-color-black"
                                    :items="proyectosConsecutivos"
                                    v-model="proyectoEvaluar.proyectoConsecutivo"
                                    label="Elija el proyecto consecutivo"
                                    no-data-text="Actualmente no tiene proyectos por evaluar"
                                    prepend-icon="mdi-notebook-multiple"
                                    :rules="selectsRule"
                                    @change="filterProyectoConsecutivo(proyectoEvaluar.proyectoConsecutivo)"
                                    :error-messages="!proyectoEvaluar.proyectoConsecutivo && !!invalid ? 'Seleccione un proyecto SGPS' : ''"
                                    required
                                ></v-select>

                                <section class="d-flex justify-content-center">
                                    <v-card shaped v-if="proyectoEvaluar.proyectoConsecutivo" min-width="50%" max-width="95%">
                                        <v-card-title class="blue--text">
                                            Proyecto consecutivo:
                                            {{ proyectoEvaluar.proyectoConsecutivo }}
                                        </v-card-title>
                                        <v-card-subtitle> <b>Titulo:</b> {{ proyectoEvaluar.proyectoTitulo }} </v-card-subtitle>
                                        <v-card-text>
                                            <p><b>Regional: </b> {{ proyectoEvaluar.nombreRegional }} <b class="ml-5">Centro: </b>{{ proyectoEvaluar.nombreCentro }}</p>
                                            <p>
                                                <b>Linea Programatica: </b>
                                                {{ proyectoEvaluar.lineaProgramaticaDescripcion }}
                                            </p>
                                            <p><b>Mesa: </b>{{ proyectoEvaluar.mesa }}</p>
                                            <p>
                                                <b>Laboratorio: </b>
                                                {{ proyectoEvaluar.laboratorio }}
                                            </p>
                                            <p>
                                                <b>Descripcion del laboratorio: </b>
                                                {{ proyectoEvaluar.laboratorioNombre }}
                                            </p>
                                            <p>
                                                <b>Responable de la regional: </b>
                                                {{ proyectoEvaluar.responsableRegional }}
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </section>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="crear = false"> Cancelar </v-btn>

                            <v-btn color="orange" :disabled="!proyectosConsecutivos.length" text @click="validar1"> Continuar <v-icon>mdi-chevron-right</v-icon></v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Preguntas Sistema de gestion </v-card-title>
                            <v-card-text class="mx-auto">
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique la norma implementada o en proceso de implementación" v-model.trim="sistemadegestion.pregunta_1" :rules="nameRule" type="text" prepend-icon="mdi-alphabetical" required :error-messages="!sistemadegestion.pregunta_1 && !!invalid ? 'Este campo es requerido' : ''"></v-text-field>

                                        <v-text-field
                                            class="label-color-black"
                                            label="Indique el porcentaje de avance del estado de implementación del sistema de gestión según norma"
                                            v-model.number="sistemadegestion.pregunta_2"
                                            type="number"
                                            :rules="positivo"
                                            prepend-icon="mdi-percent"
                                            required
                                            :error-messages="!sistemadegestion.pregunta_2 && !!invalid ? 'Este campo es requerido' : ''"
                                            min="0"
                                        ></v-text-field>

                                        <v-text-field class="label-color-black" label="Link de el porcentaje de avance del estado de implementación del sistema de gestión según norma" v-model.trim="sistemadegestion.pregunta_3" type="url" prepend-icon="mdi-link" :rules="url" :error-messages="!sistemadegestion.pregunta_3 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el número de las metodologías/servicios/productos aseguradas" v-model.number="sistemadegestion.pregunta_4" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_4 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el nombre de la metodología/servicio/producto asegurada" v-model.trim="sistemadegestion.pregunta_65" type="text" prepend-icon="mdi-alphabetical" :error-messages="!sistemadegestion.pregunta_65 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Link de a metodología/servicio/producto asegurada" v-model.trim="sistemadegestion.pregunta_5" type="url" prepend-icon="mdi-link" :rules="url" :error-messages="!sistemadegestion.pregunta_5 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-select class="label-color-black" :items="['No asegurada', 'En proceso de aseguramiento', 'Asegurada']" v-model.trim="sistemadegestion.pregunta_6" label="Indique el proceso de aseguramiento" prepend-icon="mdi-consolidate" :error-messages="!sistemadegestion.pregunta_6 && !!invalid ? 'Este campo es requerido' : ''" required></v-select>

                                        <v-text-field class="label-color-black" v-if="sistemadegestion.pregunta_6 !== '' && sistemadegestion.pregunta_6 !== 'No asegurada'" label="Link del estado de aseguramiento" v-model.trim="sistemadegestion.pregunta_7" type="url" :rules="url" prepend-icon="mdi-link"></v-text-field>

                                        <v-select class="label-color-black" :items="['No aplica', 'En tramite', 'Reconocido']" v-model.trim="sistemadegestion.pregunta_8" label="Seleccione el Estado de reconocimiento" prepend-icon="mdi-state-machine" :error-messages="!sistemadegestion.pregunta_8 && !!invalid ? 'Este campo es requerido' : ''" required></v-select>

                                        <v-text-field class="label-color-black" v-if="sistemadegestion.pregunta_8 !== '' && sistemadegestion.pregunta_8 !== 'No aplica'" label="Link del estado de reconocimiento de tecera parte (acraditación, certidicación o habilitación)" v-model.trim="sistemadegestion.pregunta_9" type="url" :rules="url" prepend-icon="mdi-link"></v-text-field>
                                        <v-checkbox label="Indique si tiene o no meta acreditación" color="orange" v-model="sistemadegestion.pregunta_10"></v-checkbox>
                                        <v-text-field class="label-color-black" v-if="sistemadegestion.pregunta_10 && sistemadegestion.pregunta_8 == 'Reconocido'" label="Indique el cumplimiento meta acreditación" v-model.number="sistemadegestion.pregunta_11" type="number" :rules="positivo" prepend-icon="mdi-numeric"></v-text-field>
                                        <v-text-field class="label-color-black" v-if="sistemadegestion.pregunta_11" label="link del cumplimiento" v-model.trim="sistemadegestion.pregunta_12" type="url" :rules="url" prepend-icon="mdi-numeric"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 1"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 2 -->
                            <v-btn color="orange" text @click="validar2"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Asesorias Empresas </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el número de asesorías a empresas" v-model.number="sistemadegestion.pregunta_13" type="number" prepend-icon="mdi-numeric" :rules="positivo" required :error-messages="!sistemadegestion.pregunta_13 && !!invalid ? 'Este campo es requerido' : ''"></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de asesorías a empresas" required v-model.trim="sistemadegestion.pregunta_14" type="url" prepend-icon="mdi-link" :rules="url" :error-messages="!sistemadegestion.pregunta_14 && !!invalid ? 'Este campo es requerido' : ''"></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el número de consultorías a empresas" v-model.number="sistemadegestion.pregunta_15" type="number" prepend-icon="mdi-numeric" :rules="positivo" :error-messages="!sistemadegestion.pregunta_15 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de consultorías a empresas" v-model.trim="sistemadegestion.pregunta_16" type="url" prepend-icon="mdi-link" :rules="url" :error-messages="!sistemadegestion.pregunta_16 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de calibración, ensayo, st o se empresa" v-model.number="sistemadegestion.pregunta_17" type="number" prepend-icon="mdi-numeric" :rules="positivo" :error-messages="!sistemadegestion.pregunta_17 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de calibración, ensayo, st o se empresa" v-model.trim="sistemadegestion.pregunta_18" type="url" prepend-icon="mdi-link" :rules="url" :error-messages="!sistemadegestion.pregunta_18 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique la meta de empresas a atender" v-model.number="sistemadegestion.pregunta_19" type="number" prepend-icon="mdi-numeric" :rules="positivo" :error-messages="!sistemadegestion.pregunta_19 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field
                                            class="label-color-black"
                                            label="Indique el numero de empresas atendidas x bimestre (seguimiento metas de gerente público oct) consultoría, asesoría, calibración, ensayo, st o se"
                                            v-model.number="sistemadegestion.pregunta_20"
                                            type="number"
                                            prepend-icon="mdi-numeric"
                                            :rules="positivo"
                                            :error-messages="!sistemadegestion.pregunta_20 && !!invalid ? 'Este campo es requerido' : ''"
                                            required
                                        ></v-text-field>

                                        <v-text-field
                                            class="label-color-black"
                                            label="Indique el link de empresas atendidas x bimestre (seguimiento metas de gerente público oct) consultoría, asesoría, calibración, ensayo, st o se"
                                            v-model.trim="sistemadegestion.pregunta_21"
                                            type="url"
                                            prepend-icon="mdi-link"
                                            :rules="url"
                                            :error-messages="!sistemadegestion.pregunta_21 && !!invalid ? 'Este campo es requerido' : ''"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 2"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 3 -->
                            <v-btn color="orange" text @click="validar3"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Asesorias Aprendices </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de asesoría -aprendiz" v-model.number="sistemadegestion.pregunta_22" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_22 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de asesorías a aprendices" v-model.trim="sistemadegestion.pregunta_23" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_23 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de consultoría a aprendices" v-model.number="sistemadegestion.pregunta_24" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_24 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de consultoría a aprendices" v-model.trim="sistemadegestion.pregunta_25" type="url" :rules="url" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_25 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de transferencias de aprendices" v-model.number="sistemadegestion.pregunta_26" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_26 && !!invalid ? 'Este campo es requerido' : ''"></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de transferencias de aprendices" v-model.trim="sistemadegestion.pregunta_27" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_27 && !!invalid ? 'Este campo es requerido' : ''"></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de calibraciones, ensayo, st o se -aprendices" v-model.number="sistemadegestion.pregunta_28" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_28 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de calibraciones, ensayo, st o se -aprendices" v-model.trim="sistemadegestion.pregunta_29" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_29 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique la meta de aprendices atendidos" v-model.number="sistemadegestion.pregunta_30" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_30 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field
                                            class="label-color-black"
                                            label="Indique el numero de aprendices atendidas x mes (seguimiento metas de gerente público oct) consultoría, asesoría o transferencia de conocimiento"
                                            v-model.number="sistemadegestion.pregunta_31"
                                            type="number"
                                            :rules="positivo"
                                            prepend-icon="mdi-numeric"
                                            :error-messages="!sistemadegestion.pregunta_31 && !!invalid ? 'Este campo es requerido' : ''"
                                            required
                                        ></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el porcentaje meta aprendices atendidos" v-model.number="sistemadegestion.pregunta_32" type="number" :rules="positivo" prepend-icon="mdi-percent" :error-messages="!sistemadegestion.pregunta_32 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 3"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 4 -->
                            <v-btn color="orange" text @click="validar4"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="5">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Asesorias Emprendedores </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de asesorías a emprendedores" v-model.number="sistemadegestion.pregunta_33" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_33 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de asesorías a emprendedores" v-model.trim="sistemadegestion.pregunta_34" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_34 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de consultorías a emprendedores" v-model.number="sistemadegestion.pregunta_35" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_35 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de consultorías a emprendedores" v-model.trim="sistemadegestion.pregunta_36" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_36 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de transferencias de emprendedores" v-model.number="sistemadegestion.pregunta_37" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_37 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field
                                            class="label-color-black"
                                            label="Indique el link Indique el numero de calibraciones, ensayos, st o se emprendedores de transferencias a emprendedores"
                                            v-model.trim="sistemadegestion.pregunta_38"
                                            type="url"
                                            :rules="url"
                                            prepend-icon="mdi-link"
                                            :error-messages="!sistemadegestion.pregunta_38 && !!invalid ? 'Este campo es requerido' : ''"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de calibraciones, ensayos, st o se emprendedores" v-model.number="sistemadegestion.pregunta_39" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_39 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de calibraciones, ensayos, st o se emprendedores" v-model.trim="sistemadegestion.pregunta_40" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_40 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de emprendedores atendidos por bimestre" v-model.number="sistemadegestion.pregunta_41" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_41 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de emprendedores atendidos por bimestre" v-model.trim="sistemadegestion.pregunta_42" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_42 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 4"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 5 -->
                            <v-btn color="orange" text @click="validar5"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="6">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Asesorias a Personas </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de asesorías a personas" v-model.number="sistemadegestion.pregunta_43" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_43 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de asesorías a personas" v-model.trim="sistemadegestion.pregunta_44" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_44 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de consultorías a personas" v-model.number="sistemadegestion.pregunta_45" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_45 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de consultorías a personas" v-model.trim="sistemadegestion.pregunta_46" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_46 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de calibracines, ensayos, st o se - personas" v-model.number="sistemadegestion.pregunta_47" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_47 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de calibración, ensayos, st o se - personas" v-model.trim="sistemadegestion.pregunta_48" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_48 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de personas atendidas por mes" v-model.number="sistemadegestion.pregunta_49" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_49 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de personas atendidas por mes" v-model.trim="sistemadegestion.pregunta_50" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_50 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 5"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 6 -->
                            <v-btn color="orange" text @click="validar6"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="7">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Otras metas </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de la meta contratos de aprendizaje" v-model.number="sistemadegestion.pregunta_51" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_51 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de contratos de aprendizaje" v-model.number="sistemadegestion.pregunta_52" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_52 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de contratos de aprendizaje" v-model.trim="sistemadegestion.pregunta_53" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_53 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de programas de formación beneficiados por st" v-model.number="sistemadegestion.pregunta_54" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_54 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link de programas de formación beneficiados por st" v-model.trim="sistemadegestion.pregunta_55" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_55 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el numero de edt" v-model.number="sistemadegestion.pregunta_56" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_56 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el nombre EDT" prepend-icon="mdi-alphabetical" v-model.trim="sistemadegestion.pregunta_57" :error-messages="!sistemadegestion.pregunta_57 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el link EDT" v-model.trim="sistemadegestion.pregunta_58" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_58 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 6"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 7 -->
                            <v-btn color="orange" text @click="validar7"> Continuar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="8">
                        <v-card class="mb-10" complete-icon="check" error-icon="warning">
                            <v-card-title primary-title> Otras metas </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique numero de apr asignada" v-model.number="sistemadegestion.pregunta_59" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_59 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el numero de apr. Vigente" v-model.number="sistemadegestion.pregunta_60" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_60 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Comprometido" v-model.number="sistemadegestion.pregunta_61" type="number" :rules="positivo" prepend-icon="mdi-numeric" :error-messages="!sistemadegestion.pregunta_61 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="link Comprometido" v-model.trim="sistemadegestion.pregunta_62" type="url" :rules="url" prepend-icon="mdi-link" :error-messages="!sistemadegestion.pregunta_62 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>

                                    <v-col cols="6">
                                        <v-text-field class="label-color-black" label="Indique el porcentaje de ejecución técnica" v-model.number="sistemadegestion.pregunta_63" type="number" :rules="positivo" prepend-icon="mdi-percent" :error-messages="!sistemadegestion.pregunta_63 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>

                                        <v-text-field class="label-color-black" label="Indique el porcentaje de ejecución técnica" v-model.number="sistemadegestion.pregunta_64" type="number" :rules="positivo" prepend-icon="mdi-percent" :error-messages="!sistemadegestion.pregunta_64 && !!invalid ? 'Este campo es requerido' : ''" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <div class="text-right">
                            <v-btn text @click="progreso = 7"><v-icon>mdi-chevron-left</v-icon> Atras </v-btn>
                            <!-- pagina 8 -->
                            <v-btn color="orange" text @click="saveMetasserviciosTecnologicos()"> Guardar <v-icon>mdi-chevron-right</v-icon> </v-btn>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-col>
    </v-row>
</template>
<script>
import axios from 'axios'
export default {
    name: 'formularioproyecto',
    data() {
        return {
            alert: false,
            message: '',
            timeout: 5000,
            progreso: 1,
            crear: false,
            centro: '',
            dialogLoading: false,
            invalid: false,
            selectsRule: [(v) => !!v || 'Debe seleccionar una opción'],
            nameRule: [(v) => v.length <= 255 || 'El nombre debe tener menos de 255 caracteres'],
            url: [(v) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v) || 'Url incorrecta'],
            positivo: [(v) => v >= 0 || 'Este campo debe ser positivo'],
            proyectos: [],
            proyectosConsecutivos: [],
            proyectoEvaluar: {
                codigoProyecto: 0,
                proyectoConsecutivo: 0,
                proyectoTitulo: '',
                codigoRegional: 0, //automatico
                nombreRegional: '', //automatico
                codigoCentro: 0, //automatico
                nombreCentro: '', //automatico
                lineaProgramaticaDescripcion: '',
                mesa: '',
                laboratorio: '', //select con datos quemados
                laboratorioNombre: '',
                responsableRegional: '',
                evaluado: 0,
            },
            sistemadegestion: {},
        }
    },
    created() {
        this.resetearCampos()
    },
    mounted() {
        if (this.logged) {
            if (this.estado) {
                if (this.aplications.SERVICIOSTECNOLOGICOS && this.screen.METASERVICIOSTECNOLOGICOS.ver) {
                    this.getproyectosCentro(this.centro)
                }
            }
        } else {
            this.$router.push('/')
        }
    },
    methods: {
        async getproyectosCentro(centro) {
            try {
                this.dialogLoading = true
                await axios
                    .get(this.$api + this.$proyectoevaluarCentro + '/' + centro)
                    .then((res) => {
                        this.proyectos = res.data.data
                        for (const i in this.proyectos) {
                            this.proyectosConsecutivos.push(this.proyectos[i].proyectoConsecutivo)
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            } catch (error) {
                this.dialogLoading = false
            }
            this.dialogLoading = false
        },
        resetearCampos() {
            const camposPordefecto = {
                codigoProyecto: null,
                pregunta_1: '',
                pregunta_2: 0,
                pregunta_3: '',
                pregunta_4: 0,
                pregunta_5: '',
                pregunta_6: '',
                pregunta_7: '',
                pregunta_8: '',
                pregunta_9: '',
                pregunta_10: 0,
                pregunta_11: 0,
                pregunta_12: '',
                pregunta_13: 0,
                pregunta_14: '',
                pregunta_15: 0,
                pregunta_16: '',
                pregunta_17: 0,
                pregunta_18: '',
                pregunta_19: 0,
                pregunta_20: 0,
                pregunta_21: '',
                pregunta_22: 0,
                pregunta_23: '',
                pregunta_24: 0,
                pregunta_25: '',
                pregunta_26: 0,
                pregunta_27: '',
                pregunta_28: 0,
                pregunta_29: '',
                pregunta_30: 0,
                pregunta_31: 0,
                pregunta_32: '',
                pregunta_33: 0,
                pregunta_34: '',
                pregunta_35: 0,
                pregunta_36: '',
                pregunta_37: 0,
                pregunta_38: '',
                pregunta_39: 0,
                pregunta_40: '',
                pregunta_41: 0,
                pregunta_42: '',
                pregunta_43: 0,
                pregunta_44: '',
                pregunta_45: 0,
                pregunta_46: '',
                pregunta_47: 0,
                pregunta_48: '',
                pregunta_49: 0,
                pregunta_50: '',
                pregunta_51: 0,
                pregunta_52: 0,
                pregunta_53: '',
                pregunta_54: 0,
                pregunta_55: '',
                pregunta_56: 0,
                pregunta_57: '',
                pregunta_58: '',
                pregunta_59: 0,
                pregunta_60: 0,
                pregunta_61: 0,
                pregunta_62: '',
                pregunta_63: 0,
                pregunta_64: '',
            }
            this.sistemadegestion = camposPordefecto
            this.proyectosConsecutivos = []
            this.proyectoEvaluar = {}
        },

        /**
         * Filtra los proyectos por el seleccionado y lo asigna a al proyecto evaluar.
         * @param {number} value - valor seleccionado.
         */
        filterProyectoConsecutivo(value) {
            if (value) {
                this.invalid = false
                let proyecto = this.proyectos.find((pro) => pro.proyectoConsecutivo === value)
                this.proyectoEvaluar = Object.assign(this.proyectoEvaluar, proyecto)
                this.sistemadegestion.codigoProyecto = proyecto.proyectoConsecutivo
            }
        },

        async saveMetasserviciosTecnologicos() {
            const ProyectoEvaluado = {
                codigoProyecto: this.proyectoEvaluar.codigoProyecto,
                proyectoConsecutivo: this.proyectoEvaluar.proyectoConsecutivo, // 8520
                evaluado: true,
            }
            if (this.validar8()) {
                this.$swal({
                    title: '¿Seguro desea guardar la informacion?',
                    text: 'No podrá revertir esto!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#fb8c00',
                    cancelButtonColor: '#3085d6',
                    cancelButtonText: 'No, Cancelar!',
                    confirmButtonText: 'Si, Guardar!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.invalid = false
                        this.dialogLoading = true
                        axios
                            .post(this.$api + this.$sistemagestion, this.sistemadegestion)
                            .then((res) => {
                                this.$swal('¡Bien!', 'Su información se guardó satisfactoriamente', 'success')
                                this.progreso = 1
                                this.resetearCampos()
                                console.log(this.$api + this.$proyectoevaluar + 'evaluado')
                            })
                            .catch((err) => {
                                console.error(err)
                            })
                            .then(
                                axios
                                    .put(this.$api + this.$proyectoevaluar + 'evaluado', ProyectoEvaluado)
                                    .then((res) => {
                                        console.log(res)
                                        this.crear = false
                                        this.getproyectosCentro(this.centro)
                                    })
                                    .catch((err) => {
                                        console.error(err)
                                    }),
                            )
                    }
                })
            }
            this.dialogLoading = false
        },
        datosInvalidos() {
            this.invalid = true
            this.message = 'Algunos campos del formulario son nesesarios'
            this.alert = true
        },
        validar1() {
            if (this.proyectoEvaluar.proyectoConsecutivo) {
                this.progreso = 2
            } else {
                this.invalid = true
                this.message = 'Elija un  proyecto  dentro de la lista'
                this.alert = true
            }
        },
        validar2() {
            if (this.sistemadegestion.pregunta_1 && this.sistemadegestion.pregunta_2 && this.sistemadegestion.pregunta_3 && this.sistemadegestion.pregunta_4 && this.sistemadegestion.pregunta_65 && this.sistemadegestion.pregunta_5 && this.sistemadegestion.pregunta_6 && this.sistemadegestion.pregunta_8) {
                this.progreso = 3
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar3() {
            if (this.sistemadegestion.pregunta_13 && this.sistemadegestion.pregunta_14 && this.sistemadegestion.pregunta_15 && this.sistemadegestion.pregunta_16 && this.sistemadegestion.pregunta_17 && this.sistemadegestion.pregunta_18 && this.sistemadegestion.pregunta_19 && this.sistemadegestion.pregunta_20 && this.sistemadegestion.pregunta_21) {
                this.progreso = 4
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar4() {
            if (
                this.sistemadegestion.pregunta_22 &&
                this.sistemadegestion.pregunta_23 &&
                this.sistemadegestion.pregunta_24 &&
                this.sistemadegestion.pregunta_25 &&
                this.sistemadegestion.pregunta_26 &&
                this.sistemadegestion.pregunta_27 &&
                this.sistemadegestion.pregunta_28 &&
                this.sistemadegestion.pregunta_29 &&
                this.sistemadegestion.pregunta_30 &&
                this.sistemadegestion.pregunta_31 &&
                this.sistemadegestion.pregunta_32
            ) {
                this.progreso = 5
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar5() {
            if (this.sistemadegestion.pregunta_33 && this.sistemadegestion.pregunta_34 && this.sistemadegestion.pregunta_35 && this.sistemadegestion.pregunta_36 && this.sistemadegestion.pregunta_37 && this.sistemadegestion.pregunta_38 && this.sistemadegestion.pregunta_39 && this.sistemadegestion.pregunta_40 && this.sistemadegestion.pregunta_41 && this.sistemadegestion.pregunta_42) {
                this.progreso = 6
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar6() {
            if (this.sistemadegestion.pregunta_43 && this.sistemadegestion.pregunta_44 && this.sistemadegestion.pregunta_45 && this.sistemadegestion.pregunta_46 && this.sistemadegestion.pregunta_47 && this.sistemadegestion.pregunta_48 && this.sistemadegestion.pregunta_49 && this.sistemadegestion.pregunta_50) {
                this.progreso = 7
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar7() {
            if (this.sistemadegestion.pregunta_51 && this.sistemadegestion.pregunta_52 && this.sistemadegestion.pregunta_54 && this.sistemadegestion.pregunta_55 && this.sistemadegestion.pregunta_56 && this.sistemadegestion.pregunta_57 && this.sistemadegestion.pregunta_58) {
                this.progreso = 8
                this.invalid = false
            } else {
                this.datosInvalidos()
            }
        },
        validar8() {
            if (this.sistemadegestion.pregunta_59 && this.sistemadegestion.pregunta_60 && this.sistemadegestion.pregunta_61 && this.sistemadegestion.pregunta_62 && this.sistemadegestion.pregunta_63 && this.sistemadegestion.pregunta_64) {
                return true
            } else {
                this.datosInvalidos()
            }
        },
    },
}
</script>
<style>
/* Color & tamaño label personalizado */
.label-color-black .v-label {
    font-size: 1.1rem;
    color: #121212;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
}
</style>
