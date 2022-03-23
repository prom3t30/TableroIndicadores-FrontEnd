<template>
    <v-footer class="color-sena" padless>
            <v-col
              class="text-center"
              cols="12" style="color:white;font-size:10px"
            >
              © {{ new Date().getFullYear() }} SENA - Dirección de Formación Profesional - Grupo - <a href="#"> SENNOVA </a>
              Servicio Nacional de Aprendizaje SENA - Dirección General<br>
              Calle 57 No. 8 - 69 Bogotá D.C. (Cundinamarca), Colombia 
              Conmutador Nacional (57 1) 5461500 - Extensiones<br>
              <a href="http://sciudadanos.sena.edu.co/SolicitudIndex.aspx" target="_blank">PQRS - </a>
              Correo servicio al cliente: gpservicioalcliente@sena.edu.co - 
              Correo notificaciones judiciales: servicioalciudadano@sena.edu.co
            </v-col>
          </v-footer>
</template>
<script>
export default {
    name:"Footer"
}
</script>