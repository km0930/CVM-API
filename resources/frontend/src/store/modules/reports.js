import { reportCountries, reportProviders, reportCustomers, reportMccmncs, reportSenders } from "@/api/reportsApi"
import { getAuthName, getAuthPass } from '@/utils/auth';

const state = {  
  reportCountriesData: [],
  reportProvidersData: [],
  reportCustomersData: [],
  reportMccmncsData: [],
  reportSendersData: [],
  loading: true, 
}

const getters = {
  IsLoadingDetail: state => state.loading,
  getReportDetailCountryData: state => state.reportCountriesData,
  getReportDetailProviderData: state => state.reportProvidersData,
  getReportDetailCustomerData: state => state.reportCustomersData,
  getReportDetailMccmncData: state => state.reportMccmncsData,
  getReportDetailSenderData: state => state.reportSendersData
}

const actions = {
  fetchReportDetailCountryData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          reportCountries({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('REPORT_COUNTRIES_DATA', response.message)
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
  fetchReportDetailProviderData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          reportProviders({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('REPORT_PROVIDERS_DATA', response.message)
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
  fetchReportDetailCustomerData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          reportCustomers({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('REPORT_CUSTOMERS_DATA', response.message)
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
  fetchReportDetailMccmncData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          reportMccmncs({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('REPORT_MCCMNCS_DATA', response.message)
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
  fetchReportDetailSenderData({ commit }, data) {
    commit('IS_LOADING', true);    
      return new Promise((resolve, reject) => {
          reportSenders({username: getAuthName(), password: getAuthPass()}).then( response => {
            if (response.status) {       
                commit('REPORT_SENDERS_DATA', response.message)
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
  REPORT_COUNTRIES_DATA(state, data) {
    state.reportCountriesData = data
  },
  REPORT_PROVIDERS_DATA(state, data) {
    state.reportProvidersData = data
  },
  REPORT_CUSTOMERS_DATA(state, data) {
    state.reportCustomersData = data
  },
  REPORT_MCCMNCS_DATA(state, data) {
    state.reportMccmncsData = data
  },
  REPORT_SENDERS_DATA(state, data) {
    state.reportSendersData = data
  }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
