<template>
  <div class="position-relative">
    <VRow class="match-height">
      <VCol cols="12" md="12" lg="12">
        <VCard class="text-center py-4" title="Customer Connections">
          <v-divider></v-divider>
          <v-progress-circular v-if="IsLoading" :size="50" color="primary" indeterminate></v-progress-circular>
          <div v-else class="px-4 pb-4" style="min-height: 400px;">
            <v-data-table id="connectionTable" class="elevation-1 px-4 py-2" :headers="headers" :items="connectionData"
              style="min-height: 450px; font-size: 10pt;" :sort-by="[{ key: 'calories', order: 'asc' }]">
              <template v-slot:top>
                <VRow class="align-center">
                  <VCol cols="12" md="4" sm="6">
                    <v-autocomplete label="Master Providers" :items="getMasterProviders" v-model="masterProviderModel"
                      multiple></v-autocomplete>
                  </VCol>
                  <VCol cols="12" md="4" sm="6">
                    <v-autocomplete v-model="customerModel" label="Customers" :items="getCustomers"
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
                  <td>{{ item.IDCliente }}</td>
                  <td>{{ item.NombreCliente }}</td>
                  <td>{{ item.TipoBulk }}</td>
                  <td>{{ item.Servidores }}</td>
                  <td>{{ item.lastDate }}</td>
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
                  <th style="width: 25%;">ID Master Provider</th>
                  <th style="width: 15%;">ID Customer</th>
                  <th style="width: 15%;">Customer</th>
                  <th style="width: 15%;">Type of Route</th>
                  <th style="width: 15%;">Server</th>
                  <th style="width: 15%;">Last</th>
                </tr>
              </thead>
              <tbody style="color: black;">
                <tr>
                  <td style="width: 25%; text-align: center;">{{ this.editItem.MasterProvider }}</td>
                  <td style="width: 15%; text-align: center;">{{ this.editItem.IDCliente }}</td>
                  <td style="width: 15%; text-align: center;">{{ this.editItem.NombreCliente }}</td>
                  <td style="width: 15%; text-align: center;">{{ this.editItem.TipoBulk }}</td>
                  <td style="width: 15%; text-align: center;">{{ this.editItem.Servidores }}</td>
                  <td style="width: 15%; text-align: center;">{{ this.editItem.lastDate }}</td>
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
        { title: 'ID Customer', align: 'start', key: 'IDCliente' },
        { title: 'Customer', align: 'start', key: 'NombreCliente' },
        { title: 'Type of route', align: 'start', key: 'TipoBulk' },
        { title: 'Server', align: 'start', key: 'MasterProvider' },
        { title: 'Last', align: 'start', key: 'Ultimo_Enquire' },
      ],
      masterProviderModel: null,
      customerModel: null,
      connectionData: [],
      editModalShow: false,
      miniModalShow: false,
      editItem: {
        MasterProvider: '',  // ID Master Provider
        IDCliente: 0, // ID customer
        NombreCliente: '',  // Customer
        TipoBulk: '',   // Type of Route
        Servidores: '',   // Server
        lastDate: '', // Last
      }
    }
  },
  computed: {
    ...mapGetters(['GetConnectCustomerData', 'IsLoading',]),
    getMasterProviders: function () {
      return this.GetConnectCustomerData?.masterProviderList?.map(item => `${item.NOMBRE}`).splice(0, 50);
    },
    getCustomers: function () {
      const customerList = this.GetConnectCustomerData?.customerList;
      if (!customerList) return [];
      return Object.keys(customerList)?.map(name => `${name} [${customerList[name].ID_CLIENTE}]`).splice(0, 50);
    },
    getData: function () {
      return toArray(this.GetConnectCustomerData?.data);
    },
  },
  mounted() {

    this.fetchConnectCustomerData({
    }).then(() => {
      this.connectionData = this.GetConnectCustomerData?.data;
    });
  },
  methods: {
    ...mapActions(['fetchConnectCustomerData',]),
    search() {

      const mpList = this.masterProviderModel;
      const ctList = this.customerModel?.map(str => parseInt(str.match(/\[(\d+)\]/)[1]));

      this.connectionData = this.GetConnectCustomerData?.data.
        filter(xx => !mpList?.length ? true : mpList.includes(xx.MasterProvider)).
        filter(xx => !ctList?.length ? true : ctList.includes(xx.IDCliente));

    },
    Reset() {
      this.masterProviderModel = null,
        this.customerModel = null,

        this.search();
    },
    handleDate(value) {
      if (!value[1]) value[1] = value[0];
    },
    exportTable() {
      exportTableToExcel("connectionTable", "acquisitions_report.xlsx");
    },
    showEditModal(item) {
      this.editModalShow = true
      this.editItem.MasterProvider = item.MasterProvider
      this.editItem.IDCliente = item.IDCliente
      this.editItem.NombreCliente = item.NombreCliente
      this.editItem.TipoBulk = item.TipoBulk
      this.editItem.Servidores = item.Servidores
      this.editItem.lastDate = item.lastDate
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
      this.editItem.IDCliente = 0
      this.editItem.NombreCliente = ''
      this.editItem.TipoBulk = ''
      this.editItem.Servidores = ''
      this.editItem.lastDate = ''
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
