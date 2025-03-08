<template>
  <div class="position-relative">
    <VRow class="match-height">
      <VCol cols="12" md="12" lg="12">
        <VCard class="text-center pb-4" title="Search Reports for Providers">

          <v-divider class="pb-1"></v-divider>

          <v-progress-circular v-if="IsLoading" :size="50" color="primary" indeterminate></v-progress-circular>

          <v-data-table v-if="!IsLoading" :headers="headers" :items="getReportData" :pagination.sync="pagination"
            :items-per-page="pagination.itemsPerPage" :sort-by="[{ key: 'calories', order: 'asc' }]"
            class="elevation-1 px-4 py-2" style="min-height: 450px;">
            <template v-slot:top>
              <VRow class="align-center">
                <VCol cols="12" md="4" sm="6">
                  <VueDatePicker auto-apply v-model="picker" range :enable-time-picker="false"
                    :month-picker="periodPicker" @update:model-value="handleDate" :preset-dates="presetRanges"
                    :format="pickerFormat" :preview-format="pickerFormat">
                  </VueDatePicker>
                </VCol>
                <VCol cols="12" md="4" sm="6">
                  <!-- <v-autocomplete
                      v-model="countryModel"
                      label="Countries"
                      :items="getCountries"
                      multiple
                    ></v-autocomplete> -->
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
                  <v-autocomplete label="Providers" :items="getProviders" v-model="providerModel"
                    multiple></v-autocomplete>
                </VCol>
              </VRow>

              <VRow class="align-center">
                <VCol cols="12" md="4" sm="6">
                  <v-autocomplete v-model="customerModel" label="Customers" :items="getCustomers"
                    multiple></v-autocomplete>
                </VCol>
                <VCol cols="12" md="4" sm="6">
                  <v-autocomplete v-model="mccmncModel" label="MccMnc" :items="getMccMnc" multiple
                    :disabled="!getMccMnc.length"></v-autocomplete>
                </VCol>
                <VCol cols="12" md="4" sm="6">
                  <v-autocomplete label="Type of route" :items="getTypeRoute" v-model="typeRouteModel"
                    multiple></v-autocomplete>
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="12" md="12" sm="12" class="text-right">
                  <v-btn @click="searchResult" color="info" dark class="btn border" size="small"
                    prepend-icon="tabler-search">
                    Search
                  </v-btn>
                  <v-btn color="secondary" dark class="btn border ml-4" size="small" prepend-icon="tabler-refresh"
                    @click="Reset">
                    Reset
                  </v-btn>
                </VCol>
                <VCol cols="12" md="3" sm="12"></VCol>
              </VRow>
            </template>

            <template v-slot:item="{ item, index }">
              <tr class="text-left" @click="showEditModal(item)">
                <td>{{ item.Proveedor.replaceAll('+', " ") }}</td>
                <td class="d-flex align-center justify-left">
                  <VImg :min-width="30" :max-width="30" style="margin-right: 10px" :src="`${serverUrl}/flags/${item.Pais_Destino}.png`" />
                  <span>{{ item.state }}</span>
                </td>
                <td>{{ item.Enviados }}</td>
                <td>{{ item.Notificados }}</td>
                <td>{{ item.Errores }}</td>
                <td>{{ item.Reenviados }}</td>
                <td>{{ item.Entregados }}</td>
              </tr>
              <tr v-if="index === this.getReportData.length - 1">
                <td class="font-weight-bold" colspan="2">Totals</td>
                <td class="text-xs-right font-weight-bold">{{ totalSubmited }}</td>
                <td class="text-xs-right font-weight-bold">{{ totalNotified }}</td>
                <td class="text-xs-right font-weight-bold">{{ totalWrong }}</td>
                <td class="text-xs-right font-weight-bold">{{ totalForwarded }}</td>
                <td class="text-xs-right font-weight-bold">{{ totalDelivered }}</td>
              </tr>
            </template>
          </v-data-table>
        </VCard>
        <VDialog v-model="editModalShow" width="1000">
          <v-card>
            <v-card-title>
              <v-row align="center" justify="space-between">
                <v-col cols="auto">
                  <span class="headline">Edition</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn icon class="mx-1">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-1" @click="minimizeEditModal">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-1" @click="closeEditModal">
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
                    <th style="width: 20%;">Provider</th>
                    <th style="width: 15%;">Destination Country</th>
                    <th style="width: 13%;">Submitted</th>
                    <th style="width: 13%;">Notified</th>
                    <th style="width: 13%;">Wrong</th>
                    <th style="width: 13%;">Forwarded</th>
                    <th style="width: 13%;">Delivered</th>
                  </tr>
                </thead>
                <tbody style="color: black;">
                  <tr>
                    <td style="width: 20%; text-align: center;">{{ this.editItem.Proveedor }}</td>
                    <td style="width: 15%; text-align: center;">{{ this.editItem.state }}</td>
                    <td style="width: 13%; text-align: center;">{{ this.editItem.Enviados }}</td>
                    <td style="width: 13%; text-align: center;">{{ this.editItem.Notificados }}</td>
                    <td style="width: 13%; text-align: center;">{{ this.editItem.Errores }}</td>
                    <td style="width: 13%; text-align: center;">{{ this.editItem.Reenviados }}</td>
                    <td style="width: 13%; text-align: center;">{{ this.editItem.Entrregados }}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </VDialog>
      </VCol>
    </VRow>
    <DialogBox :isVisable="isBox"></DialogBox>
    <v-btn v-if="miniModalShow" icon class="mx-1 position-absolute" style="right: 80px; top: -80px; z-index: 100000" @click="maximizeModal">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import DashboardNotify from "@/@core/components/DashboardNotify.vue";
import DialogBox from "@layouts/components/DialogBox.vue";
import { config } from '@layouts/config';
import { createNamespacedHelpers } from 'vuex';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dateRanges from '@/utils/dateranges';

const { mapGetters, mapActions, mapState } = createNamespacedHelpers('dashboard');

export default {
  components: {
    DialogBox,
    DashboardNotify,
    VueDatePicker
  },
  data() {
    return {
      picker: '',
      isBox: false,
      headers: [
        { title: 'Provider', align: 'start', key: 'Proveedor', },
        { title: 'Destination Country', align: 'start', key: 'Pais_Destino', },
        { title: 'Submited', align: 'start', key: 'Enviados' },
        { title: 'Notified', align: 'start', key: 'Notificados' },
        { title: 'Wrong', align: 'start', key: 'Errores' },
        { title: 'Forwarded', align: 'start', key: 'Reenviados' },
        { title: 'Delivered', align: 'start', key: 'Entregados' },
      ],
      pagination: {
        itemsPerPage: -1 // All
      },
      countryModel: null,
      providerModel: null,
      customerModel: null,
      typeRouteModel: null,
      mccmncModel: null,
      serverUrl: window.configData.APP_BASE_URL,
      presetRanges: dateRanges.dayRanges,
      pickerFormat: dateRanges.dayFormat,
      editModalShow: false,
      miniModalShow: false,
      editItem: {
        Proveedor: '',
        state: '',
        Enviados: 0,
        Notificados: 0,
        Errores: 0,
        Reenviados: 0,
        Entrregados: 0
      }
    }
  },
  computed: {
    ...mapGetters(['GetReportProviders', 'IsLoading', 'GetReportMccMnc']),
    totalSubmited() {
      return this.getReportData.reduce((acc, item) => acc + item.Enviados, 0);
    },
    totalNotified() {
      return this.getReportData.reduce((acc, item) => acc + item.Notificados, 0);
    },
    totalWrong() {
      return this.getReportData.reduce((acc, item) => acc + item.Errores, 0);
    },
    totalForwarded() {
      return this.getReportData.reduce((acc, item) => acc + item.Reenviados, 0);
    },
    totalDelivered() {
      return this.getReportData.reduce((acc, item) => acc + item.Entregados, 0);
    },
    getReportData: function () {
      if (this.GetReportProviders?.data) {
        return this.GetReportProviders?.data?.map(xx => {
          let dd = xx;
          dd['OutText'] = decodeURIComponent(xx?.OutText);
          return dd;
        });
      } else {
        return [];
      }
    },
    getCountries: function () {
      return this.GetReportProviders?.countryList?.map(item => {
        return {
          code: item.code,
          state: item.state,
          flag: `${this.serverUrl}/flags/${item.code}.png`,
        }
      })
    },
    getProviders: function () {
      return this.GetReportProviders?.providerList?.map(item => `${item.NOMBRE}[${item.ID_PROVEEDOR}]`).splice(0, 50);
    },
    getCustomers: function () {
      return this.GetReportProviders?.customerList?.map(item => `${item.EMPRESA} [${item.ID_CLIENTE}]`).splice(0, 50);
    },
    getTypeRoute: function () {
      const routes = this.GetReportProviders?.typeRoute || {};
      return Object.keys(routes)?.map(route => `${routes[route]} [${route.substr(1, 1)}]`);
    },
    getMccMnc: function () {
      return this.GetReportMccMnc?.map(item => `${item.OPERATOR} [${item.MCC}${item.MNC}]`).sort() ?? [];
    },
    periodPicker: function () {
      return this.filterPeriod == 'Month'
    }
  },
  mounted() {
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(endDate.getDate() - 1));
    this.picker = [startDate, endDate];

    this.fetchReportProviderData({
      cFechaInicio: startDate,
      cFechaFin: endDate,
      cPaises: "",
      iIDCliente: "",
      iIDProveedor: "",
      iIDTipoRuta: -1,
      cMccMnc: "",
    });

  },
  methods: {
    ...mapActions(['fetchReportProviderData', 'fetchMccMncData']),
    searchResult() {
      this.fetchReportProviderData({
        cFechaInicio: this.picker[0],
        cFechaFin: this.picker[1],
        cPaises: this.getNumList(this.countryModel),
        iIDCliente: this.getNumList(this.customerModel),
        iIDProveedor: this.getNumList(this.providerModel),
        iIDTipoRuta: this.getNumList(this.typeRouteModel),
        cMccMnc: this.getMccMncLists(this.mccmncModel),
      });
    },
    getMccMncLists(value) {
      const data = JSON.parse(JSON.stringify(value));
      if (!data) return "";
      return data.map(item => parseInt(item.match(/\d+/)[0])).join(',');
    },
    Reset() {
      this.countryModel = null;
      this.providerModel = null;
      this.customerModel = null;
      this.typeRouteModel = null;
      this.mccmncModel = null;
      //
      const endDate = new Date();
      const startDate = new Date(new Date().setDate(endDate.getDate() - 1));
      this.picker = [startDate, endDate];
    },
    getNumList(array) {
      return Array.isArray(array) ? array.map(str => parseInt(str.match(/\d+/)[0])).join(',') : array;
    },
    handleDate(value) {
      if (!value[1]) value[1] = value[0];
    },
    showEditModal(item) {
      this.editModalShow= true
      this.editItem.Proveedor = item.Proveedor
      this.editItem.state = item.state
      this.editItem.Enviados = item.Enviados
      this.editItem.Notificados = item.Notificados
      this.editItem.Errores = item.Errores
      this.editItem.Reenviados = item.Reenviados
      this.editItem.Entrregados = item.Entrregados
    },
    minimizeEditModal() {
      this.editModalShow = false
      this.miniModalShow = true
    },
    maximizeModal() {
      this.miniModalShow = false
      this.editModalShow = true
    },
    closeEditModal() {
      this.editModalShow = false
      this.editItem.Proveedor = ''
      this.editItem.state = ''
      this.editItem.Enviados = 0
      this.editItem.Notificados = 0
      this.editItem.Errores = 0
      this.editItem.Reenviados = 0
      this.editItem.Entrregados = 0
    }
  },
  watch: {
    countryModel: function (array) {
      const codes = this.getNumList(array);
      if (!codes) return;
      this.fetchMccMncData({
        codes: codes
      });
    }
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
