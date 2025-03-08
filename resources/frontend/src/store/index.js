import { createStore } from 'vuex';
import getters from './getters';
import user from './modules/user';
import dashboard from './modules/dashboard';
import routing from './modules/routing';
import pricing from './modules/pricing';
import billing from './modules/billing';
import clearing from './modules/clearing';
import quality from './modules/quality';
import configuration from './modules/configuration';
import reports from './modules/reports'
import connections from './modules/connections'


const store = createStore({
  modules: {
    user,
    dashboard,
    routing,
    pricing,
    billing,
    clearing,
    quality,
    configuration,
    reports,
    connections
  },
  getters
});

export default store
