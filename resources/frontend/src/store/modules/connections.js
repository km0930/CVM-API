import { connectionClients, connectionProviders } from "@/api/connectionsApi"
import { getAuthName, getAuthPass } from '@/utils/auth';

const state = {
  connectionClientsData: [],
  connectionProvidersData: [],
  loading: true, 
}

const getters = {
  IsLoadingDetail: state => state.loading,
  getConnectionClientData: state => state.connectionClientsData,
  getConnectionProviderData: state => state.connectionProvidersData
}

const actions = {
  fetchConnectionClientData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          connectionClients({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('CONNECTION_CLIENTS_DATA', response.message)
                  commit('IS_LOADING', false);
                  resolve();
              }else{

                  reject(`Routing API has error ${response.message}`);
              }
              
          }).catch(error => {
              reject(error);
          });
      });
  },
  fetchConnectionProviderData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          connectionProviders({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('CONNECTION_PROVIDERS_DATA', response.message)
                  commit('IS_LOADING', false);
                  resolve();
              }else{

                  reject(`Routing API has error ${response.message}`);
              }
              
          }).catch(error => {
              reject(error);
          });
      });
  }
}

const mutations = {
  IS_LOADING(state, data){
    state.loading = data;
  },
  CONNECTION_CLIENTS_DATA(state, data) {
    state.connectionClientsData = data
  },
  CONNECTION_PROVIDERS_DATA(state, data) {
    state.connectionProvidersData = data
  }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
