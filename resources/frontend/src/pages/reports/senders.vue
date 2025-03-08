<template>
  <div class="position-relative">
    <VRow class="match-height">
      <VCol cols="12" md="12" lg="12">
        <VCard class="text-center pb-4" title="Search Reports for Senders">

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
                <td class="d-flex align-center justify-left">
                  <VImg :min-width="30" :max-width="30" style="margin-right: 10px"
                    :src="`${serverUrl}/flags/${item.Pais_Destino}.png`" />
                  <span>{{ item.state }}</span>
                </td>
                <td>{{ item.Remitente.replaceAll('+', ' ') }}</td>
                <td>{{ item.Enviados }}</td>
                <td>{{ item.Notificados }}</td>
                <td>{{ item.Errores }}</td>
                <td>{{ (item.Errores / item.Enviados).toFixed(2) }}%</td>
                <td>{{ item.Reenviados }}</td>
                <td>{{ item.Entregados }}</td>
                <td>{{ (item.Entregados * 100 / item.Enviados).toFixed(2) }}</td>
                <td>{{ item.Coste }}</td>
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
        <VDialog v-model="editModalShow" width="80%">
          <VCard class="text-center pb-4">
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
            <v-divider class="pb-1"></v-divider>
            <v-card-text>
              <div class="search-toolbar">
                <div class="input-group">
                  <v-text-field style="width: 300px" @input="filterTable" label="Search"
                    v-model="searchQuery"></v-text-field>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-secondary" @click="toggleViewMode">
                    <i :class="viewMode === 'table' ? 'fas fa-list' : 'fas fa-table'"></i>
                  </button>
                  <button type="button" class="btn btn-secondary" @click="toggleSelectList">
                    <i class="fa fa-th-large"></i>&nbsp;<i class="fa fa-caret-down"></i>
                  </button>
                  <button type="button" class="btn btn-secondary" @click="downloadData">
                    <i class="fas fa-download"></i>
                  </button>
                  <div v-if="showSelectList" class="options" style="">
                    <div v-for="(option, index) in fields" :key="index" class="option"
                      style="display: flex; justify-content: flex-start">
                      <label><input type="checkbox" v-model="selectedFields" :value="option" @change="applyFilters">
                        {{
                          option
                        }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="viewMode === 'table'" class="table-responsive">
                <table class="table table-bordered">
                  <thead class="blue--text text-darken-2">
                    <tr>
                      <th v-for="field in theaderFields" :key="field" class="sortable" @click="sortTable(field)">
                        {{ field }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in paginatedData" :key="user.id">
                      <td>{{ user.Remitente }}</td>
                      <td class="d-flex align-center justify-left">
                        <VImg :min-width="30" :max-width="30" style="margin-right: 10px"
                          :src="`${serverUrl}/flags/${user.Pais_Destino}.png`" />
                        <span>{{ user.state }}</span>
                      </td>
                      <td>{{ user.Enviados }}</td>
                      <td>{{ user.Notificados }}</td>
                      <td>{{ user.Errores }}</td>
                      <td>{{ (user.Errores / user.Enviados).toFixed(2) }}%</td>
                      <td>{{ user.Reenviados }}</td>
                      <td>{{ user.Entregados }}</td>
                      <td>{{ (user.Entregados * 100 / user.Enviados).toFixed(2) }}</td>
                      <td>{{ user.Coste }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="list-view">
                <ul class="list-group">
                  <li class="list-group-item" v-for="user in paginatedData" :key="user.id">
                    <div v-for="field in selectedFields" :key="field"
                      style="display: flex; justify-content: flex-start; gap: 400px">
                      <span>{{ field }} </span> <span>{{ user[field] }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div style="display: flex; justify-content: space-between">
                <div class="items-per-page">
                  <label for="itemsPerPage">Items per page:</label>
                  <select id="itemsPerPage" v-model="itemsPerPage">
                    <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
                <div class="pagination">
                  <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Previous</button>
                  <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
                    @click="changePage(page)">
                    {{ page }}
                  </button>
                  <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Next</button>
                </div>
              </div>
            </v-card-text>
          </VCard>
        </VDialog>
      </VCol>
    </VRow>
    <DialogBox :isVisable="isBox"></DialogBox>
    <v-btn v-if="miniModalShow" icon class="mx-1 position-absolute" style="right: 80px; top: -80px; z-index: 100000"
      @click="maximizeModal">
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

const dashboardHelpers = createNamespacedHelpers('dashboard');
const reportsHelpers = createNamespacedHelpers('reports');

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions, mapState: mapDashboardState } = dashboardHelpers;
const { mapGetters: mapReportsGetters, mapActions: mapReportsActions, mapState: mapReportsState } = reportsHelpers;

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
        { title: 'Destination Country', align: 'start', key: 'Pais_Destino', },
        { title: 'Sender', align: 'start', key: 'Remitente', },
        { title: 'Submited', align: 'start', key: 'Enviados' },
        { title: "Notified", align: "start", key: "Notificados" },
        { title: "Wrong", align: "start", key: "Errores" },
        { title: "Wrong(%)", align: "start", key: "Errores(%)" },
        { title: "Forwarded", align: "start", key: "Reenviados" },
        { title: "Delivered", align: "start", key: "Entregados" },
        { title: "Ratio", align: "start", key: "Ratio" },
        { title: "Deposit", align: "start", key: "Deposit" },
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
        Remitente: '',  // sender
        state: '',  // destination country
        Enviados: 0,  // submitted
        Notificados: 0, // Notified
        Errores: 0, //wrong
        Reenviados: 0,  // forwarded
        Entregados: 0, // delievered
      },
      searchQuery: "",
      users: [],
      fields: ['Sender', 'Destination Country', 'Submited', 'Notified', 'Wrong', 'Forwarded', 'Delivered', 'Ratio', 'Deposit'],
      selectedFields: ['Remitente', 'Pais_Destino', 'Enviados', 'Notificados', 'Errores', 'Reenviados', 'Entregados', 'Ratio', 'Coste'],
      theaderFields: ['Sender', 'Destination Country', 'Submitted', 'Notified', 'Wrong', 'Wrong %', 'Forwarded', 'Delivered', 'Ratio', 'Deposit'],
      sortKey: "",
      sortOrder: 1,
      viewMode: "table",
      currentPage: 1,
      itemsPerPage: 5,
      selectedOptions: [],
      showSelectList: false,
      showPageList: false,
      perPageOptions: [5, 10, 25, 50, 100],
      locale_fields: {
        Pais_Destino: "Destination country",
        Remitente: "Sender",
        Proveedor: "Supplier",
        ID_Proveedor: "Supplier_ID",
        Enviados: "Sent",
        Entregados: "Delivered",
        Notificados: "Notified",
        Errores: "Mistakes",
        Reenviados: "Forwarded",
        Undelivered: "Undelivered",
        Precio_Cliente: "Customer_Price",
        Mensajes_Cliente: "Client_Messages",
        Total_Cliente: "Total_Customer",
        Precio_Proveedor: "Supplier_Price",
        Mensajes_Proveedor: "Provider_Messages",
        Total_Proveedor: "Total_Supplier",
        Coste: "Cost",
        state: "state"
      },
      selectedItem: null
    }
  },
  computed: {
    ...mapDashboardGetters(['GetReportSenders', 'IsLoading', 'GetReportMccMnc']),
    ...mapReportsGetters(["getReportDetailSenderData", "IsLoadingDetail"]),
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
      if (this.GetReportSenders?.data) {
        return this.GetReportSenders?.data?.filter(item => item.Pais_Destino).map(xx => {
          let dd = xx;
          dd['OutText'] = decodeURIComponent(xx?.OutText);
          return dd;
        });
      } else {
        return [];
      }
    },
    getCountries: function () {
      return this.GetReportSenders?.countryList?.map(item => {
        return {
          code: item.code,
          state: item.state,
          flag: `${this.serverUrl}/flags/${item.code}.png`,
        }
      })
    },
    getProviders: function () {
      return this.GetReportSenders?.providerList?.map(item => `${item.NOMBRE}[${item.ID_PROVEEDOR}]`).splice(0, 50);
    },
    getCustomers: function () {
      return this.GetReportSenders?.customerList?.map(item => `${item.ID_CLIENTE} [${item.EMPRESA}]`).splice(0, 50);
    },
    getTypeRoute: function () {
      const routes = this.GetReportSenders?.typeRoute || {};
      return Object.keys(routes)?.map(route => `${routes[route]} [${route.substr(1, 1)}]`);
    },
    getMccMnc: function () {
      return this.GetReportMccMnc?.map(item => `${item.OPERATOR} [${item.MCC}${item.MNC}]`).sort() ?? [];
    },
    periodPicker: function () {
      return this.filterPeriod == 'Month'
    },
    filteredUsers() {
      return this.users?.filter(user => {
        return this.selectedFields.some(field => {
          return user.field.toString().toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }).sort((a, b) => {
        let modifier = this.sortOrder;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      // return this.filteredUsers?.slice(start, end);
      return this.users?.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
      // return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    displayedFields() {
      return this.selectedFields;
    }
  },
  mounted() {
    const endDate = new Date();
    const startDate = new Date(new Date().setDate(endDate.getDate() - 1));
    this.picker = [startDate, endDate];

    this.fetchReportSenderData({
      cFechaInicio: startDate,
      cFechaFin: endDate,
      cPaises: "",
      iIDCliente: "",
      iIDProveedor: "",
      iIDTipoRuta: -1,
      cMccMnc: "",
    });
    this.fetchReportDetailSenderData()
  },
  methods: {
    ...mapDashboardActions(['fetchReportSenderData', 'fetchMccMncData']),
    ...mapReportsActions(["fetchReportDetailSenderData"]),
    searchResult() {
      this.fetchReportSenderData({
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
      this.editModalShow = true
      this.editItem.Remitente = item.Remitente
      this.editItem.state = item.state
      this.editItem.Enviados = item.Enviados
      this.editItem.Notificados = item.Notificados
      this.editItem.Errores = item.Errores
      this.editItem.Reenviados = item.Reenviados
      this.editItem.Entregados = item.Entregados
      if (this.editItem) {
        this.users = this.getReportDetailSenderData?.data?.filter(obj_item => {
          return obj_item.Remitente == item.Remitente.toString()
        })
      }
      this.editModalShow = true
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
      this.editItem.Remitente = ''
      this.editItem.state = ''
      this.editItem.Enviados = 0
      this.editItem.Notificados = 0
      this.editItem.Errores = 0
      this.editItem.Reenviados = 0
      this.editItem.Entregados = 0
    },
    filterTable() {
      this.currentPage = 1;
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortOrder = -this.sortOrder;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 1 ? "sort-asc" : "sort-desc";
      }
      return "sortable";
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === "table" ? "list" : "table";
    },
    updatePage(page) {
      this.currentPage = page;
    },
    paginateData(page) {
      this.currentPage.value = page;
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    downloadData() {
      const csvContent = [
        this.selectedFields.join(','),
        ...this.users.map(user => this.selectedFields.map(field => user[field]).join(','))
        // ...this.filteredUsers.map(user => this.selectedFields.map(field => user.field).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    toggleSelectList() {
      this.showSelectList = !this.showSelectList;
    },
    togglePageList() {
      this.showPageList = !this.showPageList;
    },
    applyFilters() {
      console.log("Selected options:", this.selectedOptions);
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

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.container {
  width: 100%;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 20px;
  gap: 20px;
}

.input-group .form-control {
  border-radius: 0;
}

.input-group .input-group-append .btn {
  border-radius: 0;
}

.filter-toolbar {
  margin-top: 10px;
  flex-direction: column;
}

.filter-toolbar .form-group {
  width: 100%;
}

.table-responsive {
  margin-top: 20px;
}

.table-bordered {
  border: 1px solid #ddd;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #ddd;
}

.sortable {
  position: relative;
  cursor: pointer;
  padding-right: 20px;
}

.sortable span {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}

.sort-asc:after,
.sort-desc:after {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.sort-asc:after {
  content: '\f0de';
  /* Up arrow */
}

.sort-desc:after {
  content: '\f0dd';
  /* Down arrow */
}

.sortable:after {
  content: '\f0dc';
  /* Sort icon */
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

.pagination {
  margin-top: 20px;
}

.btn-group .btn-secondary {
  background-color: #777777;
  border: 1px solid rgb(37, 37, 37);
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

.btn-group .btn-secondary:not(:last-child) {
  border-right: none;
}

.btn-group .btn-secondary:hover {
  background-color: rgb(141, 134, 134);
}

.select-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 1000;
}

.select-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.select-list li {
  margin-bottom: 5px;
}

.list-view {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.list-view .list-group-item {
  border: 1px solid #ccc;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.pagination button.active {
  background-color: #007bff;
  color: #fff;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.items-per-page {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.items-per-page label {
  margin-right: 10px;
}

.items-per-page select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.options {
  // margin-top: 10px;
  position: absolute;
  top: 200px;
  right: 100px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  z-index: 1000;
}

.select-list {
  position: absolute;
  top: 100px;
  /* Adjust as needed based on your layout */
  right: 10px;
  /* Adjust as needed based on your layout */
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  z-index: 1000;
  /* Ensure it's above other content */
}

.select-list ul {
  list-style-type: none;
  padding: 0;
}

.select-list button {
  margin-top: 10px;
}
</style>
