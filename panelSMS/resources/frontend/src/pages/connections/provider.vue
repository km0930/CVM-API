<template>
  <div class="position-relative">
    <VRow class="match-height">
      <VCol cols="12" md="12" lg="12">
        <VCard class="text-center py-4" title="Provider Connections">
          <v-divider></v-divider>
          <v-progress-circular v-if="IsLoading" :size="50" color="primary" indeterminate></v-progress-circular>
          <div v-else class="px-4 pb-4" style="min-height: 400px;">
            <v-data-table id="providerTable" class="elevation-1 px-4 py-2" :headers="headers" :items="connectionData"
              style="min-height: 450px; font-size: 10pt;" :sort-by="[{ key: 'calories', order: 'asc' }]">
              <template v-slot:top>
                <VRow class="align-center">
                  <VCol cols="12" md="4" sm="6">
                    <v-autocomplete label="Master Providers" :items="getMasterProviders" v-model="masterProviderModel"
                      multiple></v-autocomplete>
                  </VCol>
                  <VCol cols="12" md="4" sm="6">
                    <v-autocomplete v-model="providerModel" label="Provider" :items="getProviders"
                      multiple></v-autocomplete>
                  </VCol>
                  <VCol cols="12" md="4" sm="12" class="text-right">
                    <v-btn @click="search" color="info" dark class="btn border" size="small"
                      prepend-icon="tabler-search">
                      Search
                    </v-btn>
                    <v-btn color="secondary" dark class="btn border ml-4" size="small" prepend-icon="tabler-refresh"
                      @click="Reset">
                      Reset
                    </v-btn>
                  </VCol>
                </VRow>
              </template>
              <template v-slot:item="{ item, index }">
                <tr class="text-left" @click="showEditModal(item)">
                  <td>{{ item.MasterProvider }}</td>
                  <td>{{ item.ID_Proveedor }}</td>
                  <td>{{ item.Proveedor }}</td>
                  <td>{{ item.TipoBulk }}</td>
                  <td>{{ item.Ruta }}</td>
                  <td>{{ item.Num_Conexiones }}</td>
                  <td>{{ item.Servidor }}</td>

                  <td>
                    <VIcon :icon="item.Activa ? 'tabler-check' : 'tabler-x'"
                      :color="item.Activa ? 'success' : 'warning'" />
                  </td>
                  <td>
                    <VIcon :icon="item.Conectado ? 'tabler-check' : 'tabler-x'"
                      :color="item.Conectado ? 'success' : 'warning'" />
                  </td>
                  <td>
                    <VIcon :icon="item.Bindeado ? 'tabler-check' : 'tabler-x'"
                      :color="item.Bindeado ? 'success' : 'warning'" />
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </VCard>
      </VCol>
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
                  <th style="width: 14%;">ID Master Provider</th>
                  <th style="width: 9%;">ID Provider</th>
                  <th style="width: 14%;">Proveedor</th>
                  <th style="width: 9%;">Type of Route</th>
                  <th style="width: 9%;">Ruta</th>
                  <th style="width: 9%;">Connection</th>
                  <th style="width: 9%;">Server</th>
                  <th style="width: 9%;">Active</th>
                  <th style="width: 9%;">Connected</th>
                  <th style="width: 9%;">Linked</th>
                </tr>
              </thead>
              <tbody style="color: black;">
                <tr>
                  <td style="width: 14%; text-align: center;">{{ this.editItem.MasterProvider }}</td>
                  <td style="width: 9%; text-align: center;">{{ this.editItem.ID_Proveedor }}</td>
                  <td style="width: 14%; text-align: center;">{{ this.editItem.Proveedor }}</td>
                  <td style="width: 9%; text-align: center;">{{ this.editItem.TipoBulk }}</td>
                  <td style="width: 9%; text-align: center;">{{ this.editItem.Ruta }}</td>
                  <td style="width: 9%; text-align: center;">{{ this.editItem.Num_Conexiones }}</td>
                  <td style="width: 9%; text-align: center;">{{ this.editItem.Servidor }}</td>
                  <td style="width: 9%; text-align: center;">
                    <VIcon :icon="this.editItem.Activa ? 'tabler-check' : 'tabler-x'"
                      :color="this.editItem.Activa ? 'success' : 'warning'" />
                  </td>
                  <td style="width: 9%; text-align: center;">
                    <VIcon :icon="this.editItem.Bindeado ? 'tabler-check' : 'tabler-x'"
                      :color="this.editItem.Bindeado ? 'success' : 'warning'" />
                  </td>
                  <td style="width: 9%; text-align: center;">
                    <VIcon :icon="this.editItem.Conectado ? 'tabler-check' : 'tabler-x'"
                      :color="this.editItem.Conectado ? 'success' : 'warning'" />
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </VDialog>
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
import { createNamespacedHelpers } from 'vuex';
import { notify, toArray, exportTableToExcel } from "@/utils";
import dateRanges from '@/utils/dateranges';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const { mapGetters, mapActions, mapState } = createNamespacedHelpers('dashboard');

export default {
  components: {
    DialogBox,
    DashboardNotify,
    VueDatePicker
  },
  data() {
    return {
      isBox: false,
      headers: [
        { title: 'ID Master Provider', align: 'start', key: 'MasterProvider', },
        { title: 'ID Provider', align: 'start', key: 'ID_Proveedor' },
        { title: 'Proveedor', align: 'start', key: 'Proveedor' },
        { title: 'Type of route', align: 'start', key: 'TipoBulk' },
        { title: 'Ruta', align: 'start', key: 'Ruta' },
        { title: 'Connection', align: 'start', key: 'Num_Conexiones' },
        { title: 'Server', align: 'start', key: 'Servidor' },
        { title: 'Active', align: 'start', key: 'Activa' },
        { title: 'Connected', align: 'start', key: 'Conectado' },
        { title: 'Linked', align: 'start', key: 'Bindeado' },
      ],
      masterProviderModel: null,
      providerModel: null,
      connectionData: [],
      editModalShow: false,
      miniModalShow: false,
      editItem: {
        MasterProvider: '',  // ID Master Provider
        ID_Proveedor: 0,  // ID Provider
        Proveedor: '', // Proveedor
        TipoBulk: '',   // Type of Route
        Ruta: '', // Ruta
        Num_Conexiones: 0,  // Connection
        Servidor: '', // Server
        Activa: false,  // Active
        Bindeado: false,  // Connected
        Conectado: false  // Linked
      }
    }
  },
  computed: {
    ...mapGetters(['GetConnectProviderData', 'IsLoading',]),
    getMasterProviders: function () {
      return this.GetConnectProviderData?.masterProviderList?.map(item => `${item.NOMBRE}`).splice(0, 50);
    },
    getProviders: function () {
      return this.GetConnectProviderData?.providerList?.map(item => `${item.NOMBRE} [${item.ID_PROVEEDOR}]`).splice(0, 50);
    },
  },
  mounted() {

    this.fetchConnectProviderData({
    }).then(() => {
      this.connectionData = this.GetConnectProviderData?.data;
    });
  },
  methods: {
    ...mapActions(['fetchConnectProviderData',]),
    search() {

      const mpList = this.masterProviderModel;
      const pdList = this.providerModel?.map(str => parseInt(str.match(/\[(\d+)\]/)[1]));

      this.connectionData = this.GetConnectProviderData?.data.
        filter(xx => !mpList?.length ? true : mpList.includes(xx.MasterProvider)).
        filter(xx => !pdList?.length ? true : pdList.includes(xx.IDCliente));

    },
    Reset() {
      this.masterProviderModel = null,
        this.providerModel = null,

        this.search();
    },
    handleDate(value) {
      if (!value[1]) value[1] = value[0];
    },
    exportTable() {
      exportTableToExcel("providerTable", "provider_report.xlsx");
    },
    showEditModal(item) {
      this.editModalShow = true
      this.editItem.MasterProvider = item.MasterProvider
      this.editItem.ID_Proveedor = item.ID_Proveedor
      this.editItem.Proveedor = item.Proveedor
      this.editItem.TipoBulk = item.TipoBulk
      this.editItem.Ruta = item.Ruta
      this.editItem.Num_Conexiones = item.Num_Conexiones
      this.editItem.Servidor = item.Servidor
      this.editItem.Activa = item.Activa
      this.editItem.Bindeado = item.Bindeado
      this.editItem.Conectado = item.Conectado
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
      this.editItem.MasterProvider = ''
      this.editItem.ID_Proveedor = 0
      this.editItem.Proveedor = ''
      this.editItem.TipoBulk = ''
      this.editItem.Ruta = ''
      this.editItem.Num_Conexiones = 0
      this.editItem.Servidor = ''
      this.editItem.Activa = false
      this.editItem.Bindeado = false
      this.editItem.Conectado = false
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
