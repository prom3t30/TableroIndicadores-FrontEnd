<template>
    <div>
        <v-navigation-drawer :color="color" :expand-on-hover="expandOnHover" :mini-variant="miniVariant" :right="right" :permanent="permanent" absolute dark class="adelante">
            <v-list dense nav class="py-0">
                <v-list-item two-line :class="miniVariant && 'px-0'">
                    <v-list-item-avatar>
                        <img src="../assets/logo-de-Sena-sin-fondo-Blanco.png" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ nombre }}</v-list-item-title>
                        <v-list-item-subtitle>{{ nameRol }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item :to="{ name: 'Dashboard' }" exact>
                    <v-list-item-icon>
                        <v-icon>mdi-desktop-mac-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group v-if="aplications.PARAMETRIZACION">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>mdi-cog-box</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Parametrización</v-list-item-title>
                    </template>

                    <v-list-item v-if="screen.CATEGORIAS.ver" :to="{ name: 'Categorias' }">
                        <v-list-item-icon>
                            <v-icon>mdi-school</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Categorias</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.CENTROS.ver" :to="{ name: 'Centros' }">
                        <v-list-item-icon>
                            <v-icon>mdi-home-modern</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Centros</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.CLASIFICACION.ver" :to="{ name: 'Clasificacion' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account-switch</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Clasificacion</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.CLIENTE.ver" :to="{ name: 'Cliente' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account-switch</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Cliente</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.LINEA.ver" :to="{ name: 'Lineaprogramatica' }">
                        <v-list-item-icon>
                            <v-icon>mdi-clipboard-text-play-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Lineaprogramatica</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.PERIODICIDAD.ver" :to="{ name: 'Periodicidad' }">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-arrow-right</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Periodicidad</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.PLATAFORMA.ver" :to="{ name: 'Plataforma' }">
                        <v-list-item-icon>
                            <v-icon>mdi-tablet-cellphone</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Plataforma</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.UNIDAD.ver" :to="{ name: 'Unidad' }">
                        <v-list-item-icon>
                            <v-icon>mdi-gauge-full</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Unidad</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.INDICADORES">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>mdi-clipboard-text</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Indicadores</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.ADMININDICADORES.ver" :to="{ name: 'AdministradorDeIndicadores' }">
                        <v-list-item-icon>
                            <v-icon>mdi-comment-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Administrador de Indicadores</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.METAS">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>mdi-bullseye-arrow</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>MetaEsperadaEnLinea</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.METASLINEA.ver" :to="{ name: 'MetaEsperadaEnLinea' }">
                        <v-list-item-icon>
                            <v-icon>mdi-comment-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Meta Esperada En Línea</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.EJECUCION">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>mdi-comment-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Ejecución Indicador</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.EJEINDICADOR.ver" :to="{ name: 'EjecucionIndicadores' }">
                        <v-list-item-icon>
                            <v-icon>mdi-comment-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Ejecución Indicador</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.INDICADORES">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon> mdi-account-group</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Conf. cuentas</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.CONFIGURAR.ver" :to="{ name: 'ConfigPermisos' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account-lock</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Configurar roles y permisos</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.APLICACIONES.ver" :to="{ name: 'Aplicaciones' }">
                        <v-list-item-icon>
                            <v-icon>mdi-application-settings</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Aplicaciones</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item v-if="screen.PANTALLAS.ver" :to="{ name: 'Pantallas' }">
                        <v-list-item-icon>
                            <v-icon>mdi-monitor-eye</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Pantallas</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.FUNCIONES.ver" :to="{ name: 'Funciones' }">
                        <v-list-item-icon>
                            <v-icon>mdi-animation-play-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Funciones</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.ROLES.ver" :to="{ name: 'Roles' }">
                        <v-list-item-icon>
                            <v-icon>mdi-car-cruise-control</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Roles</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.USUARIOS.ver" :to="{ name: 'Usuarios' }">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Usuarios</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.EVENTOS">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon> mdi-calendar</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Eventos</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.GESTIONEVENTOS.ver" :to="{ name: 'Eventos' }">
                        <v-list-item-icon>
                            <v-icon>mdi-calendar-edit</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Gestionar eventos</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.CATEVENTOS.ver" :to="{ name: 'CategoriaEventos' }">
                        <v-list-item-icon>
                            <v-icon>mdi-arrange-send-backward</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Categorias eventos</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group v-if="aplications.SERVICIOSTECNOLOGICOS">
                    <template v-slot:activator>
                        <v-list-item-icon>
                            <v-icon>mdi-room-service</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Servicios Tecnologicos</v-list-item-title>
                    </template>
                    <v-list-item v-if="screen.METASERVICIOSTECNOLOGICOS.ver" :to="{ name: 'Tecnologicos' }">
                        <v-list-item-icon>
                            <v-icon>mdi-chart-line</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Meta Servicios Tecnologicos</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="screen.REPORTESMETASSERVICIOSTECNOLOGICOS.ver" :to="{ name: 'RepotesTecnologicos' }">
                        <v-list-item-icon>
                            <v-icon>mdi-file-chart</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Reportes Servicios Tecnologicos </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
import router from '../router/index'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    name: 'Menu',
    data() {
        return {
            color: 'warning',
            right: false,
            permanent: true,
            miniVariant: true,
            expandOnHover: true,
        }
    },
}
</script>
<style scoped>
[b1],
.b1 {
    border: 1px dashed rgb(241, 172, 43);
}

.list__tile {
    height: auto;
    min-height: 48px;
}

.list__tile__title {
    white-space: normal !important;
    text-overflow: wrap !important;
    word-wrap: break-word;
}

.border {
    border: 2px dashed danger;
}

.v-application .primary--text {
    color: #796400 !important;
}
.adelante {
    z-index: 2 !important;
}
</style>
