import axios from 'axios'

import { LayoutPlugin } from 'bootstrap-vue'

export default {
    namespaced: true,
    state: {
        userProfile: {},
        sesion: {
            rol: 0,
            logged: false,
            stateTrue: false,
            token: null,
            nombre: '',
            centro: '',
        },
    },
    mutations: {
        setUserProfile(state, val) {
            state.userProfile = val
        },
        singOff(state) {
            state.userProfile = {}
            state.sesion.rol = 0
            state.sesion.logged = false
            state.sesion.stateTrue = false
            state.sesion.token = null
            state.sesion.nombre = ''
            state.sesion.centro = ''
        },
        interLogin(state, value) {
            state.sesion.logged = true
            state.sesion.rol = value.data.data.rol_id
            state.sesion.stateTrue = value.data.data.estado
            state.sesion.token = value.data.token
            state.sesion.nombre = value.data.data.name
            state.sesion.id = value.data.data.id
            state.sesion.centro = value.data.data.codigoCentro
        },
        permits(state, value) {
            state.sesion.privi = value.data
        },
    },
    getters: {
        userProfile: (state) => {
            return state.userProfile
        },
        dataSession: (state) => {
            return state.sesion
        },
    },
    actions: {
        login(state, data) {
            //
            var rutaPermits = this._vm.$api + this._vm.$roles + '/' + this._vm.$privilegios + '/'
            var rol = ''
            axios
                .post(this._vm.$api + this._vm.$auth, data)
                .then((response) => {
                    state.commit('setUserProfile', data)
                    state.commit('interLogin', response)
                    rol = response.data.data.rol_id
                    rutaPermits += rol
                })
                .catch((err) => {
                    alert('La contraseña y/o cuenta de correo electronico son incorrectos')
                })
                .then(function () {
                    axios
                        .get(rutaPermits)
                        .then((res) => {
                            state.commit('permits', res)
                            window.location.reload()
                        })
                        .catch((err) => {
                            console.error(err)
                        })
                })
        },
        logOut(state) {
            axios.get(this._vm.$api + this._vm.$logOut).then((response) => {
                state.commit('singOff')
                window.location.reload()
            })
        },
    },
}
