<template>
  <v-container
    fluid
    v-if="
      aplications.SERVICIOSTECNOLOGICOS &&
      screen.REPORTESMETASSERVICIOSTECNOLOGICOS.ver
    "
  >
    <v-card max-width="200">
      <v-icon x-large color="orange" class="text-center" height="150px"
        >mdi-microsoft-excel</v-icon
      >
      <v-card-text>
        <section>
          Al presionar descargar iniciara la descarga de las metas servicios
          tecnologicos
        </section>
      </v-card-text>
        <v-btn
          color="orange"
          class="mx-auto white--text btn"
          block
          :href="getReportsExcel"
        >
          Descargar Reporte
        </v-btn>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  name: "REPOTESTECNOLOGICOS",
  data() {
    return {
      getReportsExcel : 'http://localhost:8000/api/sistemagestion',
    };
  },
  mounted() {
    if (this.logged) {
      if (this.estado) {
        if (
          this.aplications.SERVICIOSTECNOLOGICOS &&
          this.screen.REPORTESMETASSERVICIOSTECNOLOGICOS.ver
        ) {
        }
      }
    } else {
      this.$router.push("/");
    }
  },
  methods: {
  },
};
</script>