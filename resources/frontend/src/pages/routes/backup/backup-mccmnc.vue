<template>
  <VCol cols="12" md="12" lg="12">
    <VCard class="text-center py-4" title="Backup MccMnc">
      <v-divider></v-divider>
      <v-progress-circular v-if="IsLoading" :size="50" color="primary" indeterminate></v-progress-circular>
      <div v-else class="px-4 pb-4" style="min-height: 400px;">
        <v-data-table id="providerTable" class="elevation-1 px-4 py-2" :headers="headers" :items="connectionData"
          style="min-height: 450px; font-size: 10pt;" :sort-by="[{ key: 'calories', order: 'asc' }]">
          <template v-slot:top>
            <VRow class="align-center">
              <VCol cols="12" md="4" sm="6">
                <v-autocomplete label="Countries" :items="getCountries" v-model="countryModel" item-title="state"
                  item-value="code" chips closable-chips multiple>
                  <template v-slot:chip="{ props, item }">
                    <v-chip v-bind="props" :prepend-avatar="item.raw.flag" :text="item.raw.state"></v-chip>
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-avatar="item.raw.flag" :title="item.raw.state"></v-list-item>
                  </template>
                </v-autocomplete>
              </VCol>
              <VCol cols="12" md="4" sm="6">
                <v-autocomplete v-model="typeRouteModel" label="Type of Route" :items="getRouteTypes"
                  multiple></v-autocomplete>
              </VCol>
              <VCol cols="12" md="4" sm="12" class="text-right">
                <v-btn @click="search" color="info" dark class="btn border" size="small" prepend-icon="tabler-search">
                  Search
                </v-btn>
                <v-btn color="secondary" dark class="btn border ml-4" size="small" prepend-icon="tabler-refresh"
                  @click="Reset">
                  Reset
                </v-btn>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="4" sm="12" class="text-left">
                <v-btn @click="addRoute" color="success" dark class="btn border" size="small">
                  Nueva Ruta
                </v-btn>
              </VCol>
            </VRow>
          </template>
          <template v-slot:item="{ item, index }">
            <tr class="text-left" @click="editRow(item)">
              <td class="d-flex align-center justify-left">
                <VImg v-if="!item.PAIS_DESTINO || item.PAIS_DESTINO == '*'" :min-width="30" :max-width="30"
                  style="margin-right: 10px" :src="`${serverUrl}/flags/0.png`" />
                <VImg v-else :min-width="30" :max-width="30" style="margin-right: 10px"
                  :src="`${serverUrl}/flags/${item.PAIS_DESTINO}.png`" />
                {{ item.state }}
              </td>
              <td>{{ item.MCC }}</td>
              <td>{{ item.MNC }}</td>
              <td>{{ item.OPERATOR }}</td>
              <td>{{ item.tyepRoute }}</td>
              <td>{{ item.RUTA }}</td>
              <td>{{ item.NOMBRE_PROVEEDOR }}</td>
            </tr>
          </template>
        </v-data-table>
        <VDialog v-model="addModalShow" width="1000">
          <v-card>
            <v-card-title>
              <v-row align="center" justify="space-between">
                <v-col cols="auto">
                  <span class="headline">Nueva Ruta</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn icon @click="addModalShow = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <table class="table">
                <thead class="blue--text text-darken-2">
                  <tr>
                    <th style="width: 30%;">Data</th>
                    <th style="width: 70%;">Value</th>
                  </tr>
                </thead>
                <tbody style="color: black;">
                  <tr>
                    <td>Country</td>
                    <td>
                      <v-autocomplete label="Countries" :items="getCountries" v-model="newCountryModel"
                        item-title="state" item-value="code" chips closable-chips>
                        <template v-slot:chip="{ props, item }">
                          <v-chip v-bind="props" :prepend-avatar="item.raw.flag" :text="item.raw.state"></v-chip>
                        </template>

                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :prepend-avatar="item.raw.flag"
                            :title="item.raw.state"></v-list-item>
                        </template>
                      </v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>MccMcc</td>
                    <td>
                      <v-autocomplete v-model="newMccMccModel" label="MccMcc" :items="getRouteTypes"
                        multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Route</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="Type of Route" :items="getRouteTypes"
                        multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Ruta</td>
                    <td class="d-flex justify-space-between align-center">
                      <v-text-field style="width: 70%" label="Ruta" v-model="ruta"></v-text-field>&nbsp; % &nbsp;
                      <VTextField style="width: 25%" label="percent" v-model="rutaPercent" type="number" :min="0"
                        :max="100" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <VCol cols="12" md="4" sm="12" class="text-left">
                <v-btn color="primary" dark class="btn border" size="small">
                  Añadir Ruta
                </v-btn>
                <v-btn color="primary" dark class="btn border ml-4" size="small">
                  Create
                </v-btn>
                <VTextField class="mt-4" v-model="rutaPercent" type="text" style="width: 100%" />
              </VCol>
            </v-card-text>
          </v-card>
        </VDialog>

        

        <VDialog v-model="editModalShow" width="1000">
          <v-card>
            <v-card-title>
              <v-row align="center" justify="space-between">
                <v-col cols="auto">
                  <span class="headline">Edition</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn icon>
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon @click="editModalShow = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <table class="table">
                <thead class="blue--text text-darken-2">
                  <tr>
                    <th style="width: 30%;">Data</th>
                    <th style="width: 70%;">Value</th>
                  </tr>
                </thead>
                <tbody style="color: black;">
                  <tr>
                    <td>Country</td>
                    <td>
                      <v-autocomplete label="Countries" :items="getCountries" v-model="editCountryModel"
                        item-title="state" item-value="code" chips closable-chips>
                        <template v-slot:chip="{ props, item }">
                          <v-chip v-bind="props" :prepend-avatar="item.raw.flag" :text="item.raw.state"></v-chip>
                        </template>

                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props" :prepend-avatar="item.raw.flag"
                            :title="item.raw.state"></v-list-item>
                        </template>
                      </v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>MccMcc</td>
                    <td>
                      <v-autocomplete v-model="editMccMccModel" label="MccMcc" :items="getRouteTypes"
                        multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Route</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="Type of Route" :items="getRouteTypes"
                        multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Ruta</td>
                    <td class="d-flex justify-space-between align-center">
                      <v-text-field style="width: 70%" label="Ruta" v-model="ruta"></v-text-field>&nbsp; % &nbsp;
                      <VTextField style="width: 25%" label="percent" v-model="rutaPercent" type="number" :min="0"
                        :max="100" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <VCol cols="12" class="text-left">
                <v-btn color="primary" dark class="btn border" size="small">
                  Añadir Ruta
                </v-btn>
                <v-btn color="primary" dark class="btn border ml-4" size="small">
                  Update
                </v-btn>
                <v-btn color="primary" dark class="btn border ml-4" size="small">
                  Delete
                </v-btn>
                <VTextField class="mt-4" v-model="rutaPercent" type="text" style="width: 100%" />
              </VCol>
            </v-card-text>
          </v-card>
        </VDialog>
      </div>
    </VCard>
  </VCol>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
import { notify, toArray, exportTableToExcel } from "@/utils";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const { mapGetters, mapActions, mapState } = createNamespacedHelpers('routing');

export default {
  components: {
    VueDatePicker
  },
  data() {

    return {
      isBox: false,
      serverUrl: window.configData.APP_BASE_URL,
      headers: [
        { title: 'Destination Country', align: 'start', key: 'state', },
        { title: 'Mcc', align: 'start', key: 'MCC', },
        { title: 'Mnc', align: 'start', key: 'MNC', },
        { title: 'Operator', align: 'start', key: 'OPERATOR', },
        { title: 'Type of route', align: 'start', key: 'tyepRoute' },
        { title: 'Route', align: 'start', key: 'RUTA' },
        { title: 'Proveedor', align: 'start', key: 'NOMBRE_PROVEEDOR' },
      ],
      countryModel: null,
      typeRouteModel: null,
      connectionData: [],
      addModalShow: false,
      newCountryModel: null,
      newRouteModel: null,
      newCustomerModel: null,
      editModalShow: false,
      editItem: {
        ID_PROVEEDOR: 0,
        ID_TIPO: 0,
        NOMBRE_PROVEEDOR: '',
        PAIS_DESTINO: '',
        RUTA: '',
        state: '',
        tyepRoute: ''
      },
      editCountryModel: null,
      editRouteModel: null,
      editCustomerModel: null,
    }
  },
  computed: {
    ...mapGetters(['GetRoutingBackupMccMncData', 'IsLoading',]),
    getCountries: function () {
      return this.GetRoutingBackupMccMncData?.countryList?.map(item => {
        return {
          code: item.code,
          state: item.state,
          flag: `${this.serverUrl}/flags/${item.code}.png`,
        }
      })
    },
    getRouteTypes: function () {
      return this.GetRoutingBackupMccMncData?.routeList?.map(item => `${item.route} [${item.id}]`).splice(0, 50);
    },
  },
  mounted() {

    this.fetchRoutingBackupMccMncData({
    }).then(() => {
      this.connectionData = this.GetRoutingBackupMccMncData?.data;
    });
  },
  methods: {
    ...mapActions(['fetchRoutingBackupMccMncData',]),
    search() {

      const ctList = this.countryModel;
      const trList = this.typeRouteModel?.map(str => parseInt(str.match(/\[(\d+)\]/)[1]));

      this.connectionData = this.GetRoutingBackupMccMncData?.data.
        filter(xx => !ctList?.length ? true : ctList.includes(xx.PAIS_DESTINO)).
        filter(xx => !trList?.length ? true : trList.includes(xx.ID_TIPO));
    },
    Reset() {
      this.countryModel = null,
        this.typeRouteModel = null,

        this.search();
    },
    addRoute() {
      this.addModalShow = true
    },
    editRow(item) {
      this.editModalShow = true
      this.editItem = item
      this.editCountryModel = item.state
      this.editRouteModel = item.typeRoute
      console.log(this.editItem)
    }
  },
  watch: {
  }
}
</script>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
@use "@core/scss/template/pages/update-table.scss";

.v-progress-circular {
  margin: 1rem;
}
</style>