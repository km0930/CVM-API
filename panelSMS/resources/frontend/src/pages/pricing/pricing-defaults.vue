<template>
  <VCol cols="12" md="12" lg="12">
    <VCard class="text-center py-4" title="Pricing Customers">
      <v-divider></v-divider>
      <v-progress-circular v-if="IsLoading" :size="50" color="primary" indeterminate></v-progress-circular>
      <div v-else class="px-4 pb-4" style="min-height: 400px;">
        <v-data-table id="providerTable" class="elevation-1 px-4" :headers="headers" :items="connectionData"
          style="min-height: 450px; font-size: 10pt;" :sort-by="[{ key: 'calories', order: 'asc' }]">
          <template v-slot:top>
            <VRow class="align-center">
              <VCol cols="12" md="3" sm="6">
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
              <VCol cols="12" md="3" sm="6">
                <v-autocomplete v-model="customerModel" label="Customers" :items="getCustomers"
                  multiple></v-autocomplete>
              </VCol>
              <VCol cols="12" md="3" sm="6">
                <v-autocomplete v-model="typeRouteModel" label="Type of Route" :items="getRouteTypes"
                  multiple></v-autocomplete>
              </VCol>
              <VCol cols="12" md="3" sm="12" class="text-right">
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
                  New Price
                </v-btn>
              </VCol>
            </VRow>
          </template>
          <template v-slot:item="{ item, index }">
            <tr class="text-left" @click="editRow(item)">
              <td class="d-flex align-center justify-left">
                <VImg v-if="!item.PAIS_DESTINO || item.PAIS_DESTINO == '*'" :min-width="30" :max-width="30" style="margin-right: 10px" :src="`${serverUrl}/flags/0.png`" />
                <VImg v-else :min-width="30" :max-width="30" style="margin-right: 10px" :src="`${serverUrl}/flags/${item.PAIS_DESTINO}.png`" />
                {{ item.state }}
              </td>
              <td>{{ item.MCC }}</td>
              <td>{{ item.MNC }}</td>
              <td>{{ item.OPERADORA }}</td>
              <td>{{ item.MONEDA }}</td>
              <td>{{ item.PRECIO }}</td>
              <td>{{ item.ID_TIPOCOBRO }}</td>
              <td>{{ item.ID_TIPOBULK }}</td>
              <td>{{ item.ID_MASTERBULK }}</td>
              <td>{{ item.FECHA }}</td>
              <td>{{ item.COMENTARIOS }}</td>
            </tr>
          </template>
        </v-data-table>
        <VDialog v-model="addModalShow" width="1000">
          <v-card>
            <v-card-title>
              <v-row align="center" justify="space-between">
                <v-col cols="auto">
                  <span class="headline">New Price</span>
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
                    <td>ID MasterProvider</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>
                      <v-autocomplete label="Countries" :items="getCountries" v-model="newCountryModel" item-title="state"
                        item-value="code" chips closable-chips>
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
                    <td>MccMnc</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Route</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td class="d-flex justify-space-between align-center">
                      <VTextField label="" v-model="rutaPercent" type="number" :min="0" :max="100" />
                    </td>
                  </tr>
                  <tr>
                    <td>Currency</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Charge</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Commentation</td>
                    <td>
                      <v-autocomplete v-model="newRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
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
                    <td>ID Master Provider</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Country</td>
                    <td>
                      <v-autocomplete label="Countries" :items="getCountries" v-model="editCountryModel" item-title="state"
                        item-value="code" chips closable-chips>
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
                    <td>MccMnc</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Route</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Price</td>
                    <td class="d-flex justify-space-between align-center">
                      <VTextField label="percent" v-model="rutaPercent" type="number" :min="0" :max="100" />
                    </td>
                  </tr>
                  <tr>
                    <td>Currency</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Type of Charge</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>Commentation</td>
                    <td>
                      <v-autocomplete v-model="editRouteModel" label="" :items="getRouteTypes" multiple></v-autocomplete>
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
import { notify } from '@/utils';
const { mapGetters, mapActions, mapState } = createNamespacedHelpers('pricing');

export default {
  data() {

    return {
      isBox: false,
      serverUrl: window.configData.APP_BASE_URL,
      headers: [
        { title: 'Destination Country', align: 'start', key: 'state', },
        { title: 'Mcc', align: 'start', key: 'MCC', },
        { title: 'Mnc', align: 'start', key: 'MNC', },
        { title: 'Operator', align: 'start', key: 'OPERADORA', },
        { title: 'Currency', align: 'start', key: 'MONEDA' },
        { title: 'Price', align: 'start', key: 'PRECIO' },
        { title: 'Type of Charge', align: 'start', key: 'ID_TIPOCOBRO' },
        { title: 'Sending Mode', align: 'start', key: 'ID_TIPOBULK' },
        { title: 'ID Master Provider', align: 'start', key: 'ID_MASTERBULK' },
        { title: 'Date', align: 'start', key: 'FECHA' },
        { title: 'Commentation', align: 'start', key: 'COMENTARIOS' },
      ],
      countryModel: null,
      customerModel: null,
      typeRouteModel: null,
      connectionData: [],
      addModalShow: false,
      newCountryModel: null,
      newRouteModel: null,
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
    }
  },
  computed: {
    ...mapGetters(['GetPricingDefaultsData', 'IsLoading', 'GetError']),
    getCountries: function () {
      return this.GetPricingDefaultsData?.countryList?.map(item => {
        return {
          code: item.code,
          state: item.state,
          flag: `${this.serverUrl}/flags/${item.code}.png`,
        }
      })
    },
    getRouteTypes: function () {
      return this.GetPricingDefaultsData?.routeList?.map(item => `${item.route} [${item.id}]`).splice(0, 50);
    },
    getCustomers: function () {
      const customerList = this.GetPricingDefaultsData?.customerList;
      if (!customerList) return [];
      return Object.keys(customerList)?.map(name => `${customerList[name].EMPRESA} [${customerList[name].ID_CLIENTE}]`);
    },
  },
  mounted() {

    this.fetchPricingDefaultsData({
    }).then(() => {
      this.connectionData = this.GetPricingDefaultsData?.data;
    });
  },
  methods: {
    ...mapActions(['fetchPricingDefaultsData',]),
    search() {

      const ctList = this.countryModel;
      const trList = this.typeRouteModel?.map(str => parseInt(str.match(/\[(\d+)\]/)[1]));
      const csList = this.customerModel?.map(str => parseInt(str.match(/\[(\d+)\]/)[1]));

      this.connectionData = this.GetPricingDefaultsData?.data.
        filter(xx => !ctList?.length ? true : ctList.includes(xx.PAIS_DESTINO)).
        filter(xx => !csList?.length ? true : csList.includes(xx.ID_CLIENTE)).
        filter(xx => !trList?.length ? true : trList.includes(xx.ID_TIPO));
    },
    Reset() {
      this.countryModel = null,
        this.typeRouteModel = null,
        this.customerModel = null;

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
    GetError(value) {
      if (value != null) {
        notify(value, 'error');
      }
    }
  }
}
</script>