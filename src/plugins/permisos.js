import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  name: 'permisos',
  // called by Vue.use(permiso)
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          logged: null,
          rol: 0,
          estado: null,
          nombre: "",
          nameRol: "",
          user: "",
          centro: "",
          aplications: {
            EVENTOS: false,
            INDICADORES: false,
            PARAMETRIZACION: false,
            METAS: false,
            EJECUCION: false,
            CONFIGURACION: false,
            SERVICIOSTECNOLOGICOS: false,
          },
          screen: {
            CATEGORIAS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            CENTROS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            CLASIFICACION: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            CLIENTE: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            LINEA: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            PERIODICIDAD: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            PLATAFORMA: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            UNIDAD: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            ADMININDICADORES: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            CONFIGURAR: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            APLICACIONES: {
              ver: false,
              CREAR: false, //true 
              EDITAR: false,
              ELIMINAR: false,
            },
            FUNCIONES: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            PANTALLAS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            ROLES: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            USUARIOS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            METASLINEA: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            EJEINDICADOR: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            GESTIONEVENTOS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            CATEVENTOS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            METASERVICIOSTECNOLOGICOS: {
              ver: false,
              CREAR: false,
              EDITAR: false,
              ELIMINAR: false,
            },
            REPORTESMETASSERVICIOSTECNOLOGICOS:{
              ver:false,
              EDITAR : false,
              EDITAR:false,
              ELIMINAR : false,
            }
          },
        };
      },
      computed: {
        ...mapGetters('auth', ["dataSession"]),
      },
      mounted() {
        this.rol = this.dataSession.rol;
        this.logged = this.dataSession.logged;
        this.estado = this.dataSession.stateTrue;
        if (this.logged) {
          if (this.estado) {
            this.acesso(this.dataSession.privi);
            this.user = this.dataSession.id;
            this.nombre = this.dataSession.nombre;
            this.centro = this.dataSession.centro;          
            this.nameRol = this.dataSession.privi.length>0?this.dataSession.privi[0].rol:'Sin rol';
            
          }
        }
      },
      methods: {
        acesso(privi) {
          for (const i in privi) {
            //hasOwnProperty: comprueba si la proiedad de un objeto existe.
            if (
              //si existe entonces existe la aplicacion
              Object.hasOwn(this.aplications, privi[i].aplicacion)
            ) {
              this.aplications[privi[i].aplicacion] = true;
              if (
                //si tiene autorizacion a esa aplicacion y existe entonces tiene autorizacion a esa pantalla
                Object.hasOwn(this.screen, privi[i].pantalla)
              ) {
                this.screen[privi[i].pantalla].ver = true;
              }
              if (
                //si tiene autorizacion a esa aplicacion y existe entonces tiene autorizacion a esa pantalla
                Object.hasOwn(this.screen, privi[i].pantalla)
              ) {
                this.screen[privi[i].pantalla].ver = true;
                var claves = Object.keys(this.screen[privi[i].pantalla]);
                if (claves.includes(privi[i].permiso)) {
                  //console.log(this.screen[privi[i].pantalla]);
                  if (privi[i].permiso == "CREAR") {
                    this.screen[privi[i].pantalla].CREAR = true;
                  } else if (privi[i].permiso == "EDITAR") {
                    this.screen[privi[i].pantalla].EDITAR = true;
                  } else if (privi[i].permiso == "ELIMINAR") {
                    this.screen[privi[i].pantalla].ELIMINAR = true;
                  }
                }
              }
            }
          }
        },
      }
    });
  },
}