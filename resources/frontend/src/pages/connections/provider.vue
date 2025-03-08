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
      <VDialog v-model="editModalShow" width="80%">
        <VCard class="text-center pb-4">
          <v-card-title>
            <v-row align="center" justify="space-between">
              <v-col cols="auto">
                <span class="headline">Provider</span>
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
                    <!-- <td v-for="field in selectedFields" :key="field">{{ user[field] }}</td> -->
                    <td>{{ user.ID_Proveedor }}</td>
                    <td>{{ user.Proveedor }}</td>
                    <td>{{ user.TipoBulk }}</td>
                    <td>{{ user.Ruta }}</td>
                    <td>{{ user.email_admin }}</td>
                    <td>{{ user.email_comercial }}</td>
                    <td></td>
                    <td>{{ user.MasterProvider }}</td>
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
          <v-divider class="pb-1"></v-divider>
          <v-card-title>
            <v-row align="center" justify="space-between">
              <v-col cols="auto">
                <span class="headline">Servers</span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider class="pb-1"></v-divider>
          <VRow
            class="d-flex align-center justify-space-between px-6 py-2 mx-6"
            style="border-bottom: solid 1px #AAA; border-top: solid 1px #AAA; background: #eee"
          >
            <div>
              <i class="fa fa-server">&nbsp;CONNECTION #1&nbsp;</i>
            </div>
            <v-btn @click="addRoute" color="success" dark class="btn border" size="small">
              TCP Dump
            </v-btn>
          </VRow>
          <v-card-text>
            <div class="d-flex justify-center align-center">
              <table class="table table-bordered" style="width: 25%">
                <tbody>
                  <tr>
                    <td class="blue--text text-darken-2">Server</td>
                    <td>SIMPP 5</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">IP</td>
                    <td>95.216.84.155</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Protocol</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">GMT</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Dest. NPI</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">F.H.DLR</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">For.Dicc</td>
                    <td>-1</td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-bordered" style="width: 25%">
                <tbody>
                  <tr>
                    <td class="blue--text text-darken-2">Active</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Port</td>
                    <td>2875</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Flux</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Version</td>
                    <td>52</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Dest. TON</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Env.Sin Resp</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Res.Contact</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-bordered" style="width: 25%">
                <tbody>
                  <tr>
                    <td class="blue--text text-darken-2">Linked</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">System ID</td>
                    <td>nVisSIM</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">MTYPE</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">TLV</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Source NPI</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Formato M.ID</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Sender Def.</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-bordered" style="width: 25%">
                <tbody>
                  <tr>
                    <td class="blue--text text-darken-2">Connected</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Password</td>
                    <td>******</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Conection type	</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Seg.Equirel</td>
                    <td>30</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Source TON</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Def.Dicc.</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td class="blue--text text-darken-2">Sender Din.</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
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
          <v-divider class="pb-1"></v-divider>
          <v-card-title>
            <v-row align="center" justify="space-between">
              <v-col cols="auto">
                <span class="headline">Connection sender</span>
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
                <button type="button" class="btn btn-secondary">
                  <i :class="viewMode === 'table' ? 'fas fa-list' : 'fas fa-table'"></i>
                </button>
                <button type="button" class="btn btn-secondary">
                  <i class="fa fa-th-large"></i>&nbsp;<i class="fa fa-caret-down"></i>
                </button>
                <button type="button" class="btn btn-secondary">
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
                    <th>Sender</th>
                  </tr>
                </thead>
                <tbody>
                  No matching records found.
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
import { createNamespacedHelpers } from 'vuex';
import { notify, toArray, exportTableToExcel } from "@/utils";
import dateRanges from '@/utils/dateranges';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const dashboardHelpers = createNamespacedHelpers('dashboard');
const connectionsHelpers = createNamespacedHelpers('connections');

const { mapGetters: mapDashboardGetters, mapActions: mapDashboardActions, mapState: mapDashboardState } = dashboardHelpers;
const { mapGetters: mapConnectionsGetters, mapActions: mapConnectionsActions, mapState: mapConnectionsState } = connectionsHelpers;

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
      },
      searchQuery: "",
      users: [],
      fields: ['Provider', 'Submited', 'Notified', 'Wrong', 'Forwarded', 'Delivered', 'Ratio', 'Deposit'],
      selectedFields: ['Proveedor', 'Enviados', 'Notificados', 'Errores', 'Reenviados', 'Entregados', 'Ratio', 'Coste'],
      theaderFields: ['ID Provider', 'Provider', 'Type', 'Route', 'Technician', 'Sales Representative', 'Impact Data', 'Master'],
      theaderFields2: ['Server', 'SystemID', 'Password', 'Set Time Zone', 'Min Time Zone', 'Flux ACKS', 'Limit SMS', 'Encoding', 'Force Encoding', 'Max Connections', 'Enquire Link', 'Unbind'],
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
        Proveedor: "Supplier",
        ID_Proveedor: "Supplier_ID",
        Enviados: "Submitted",
        Entregados: "Delivered",
        Notificados: "Notified",
        Errores: "Wrong",
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
    ...mapDashboardGetters(['GetConnectProviderData', 'IsLoading',]),
    ...mapConnectionsGetters(["getConnectionProviderData", "IsLoadingDetail"]),
    getMasterProviders: function () {
      return this.GetConnectProviderData?.masterProviderList?.map(item => `${item.NOMBRE}`).splice(0, 50);
    },
    getProviders: function () {
      return this.GetConnectProviderData?.providerList?.map(item => `${item.NOMBRE} [${item.ID_PROVEEDOR}]`).splice(0, 50);
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

    this.fetchConnectProviderData({
    }).then(() => {
      this.connectionData = this.GetConnectProviderData?.data;
    });
    this.fetchConnectionProviderData()
  },
  methods: {
    ...mapDashboardActions(['fetchConnectProviderData',]),
    ...mapConnectionsActions(["fetchConnectionProviderData"]),
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
      if (this.editItem) {
        this.users = this.getConnectionProviderData?.data?.filter(obj_item => {
          return obj_item.ID_Proveedor == item.ID_Proveedor.toString()
        })
      }
      this.users = this.users.map(user => {
        const customerKey = Object.keys(this.getConnectionProviderData.providerList).find(key => {
          return this.getConnectionProviderData.providerList[key].ID_CLIENTE === user.IDCliente;
        });

        const customer = this.getConnectionProviderData.providerList[customerKey];
        return {
          ...user,
          email_admin: customer ? customer.EMAIL_ADMIN : null,
          email_comercial: customer ? customer.EMAIL_COMERCIAL : null,
        };
      });
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
