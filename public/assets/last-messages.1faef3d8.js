import{D as C,_ as D}from"./DialogBox.c4d55d6b.js";import{y as V,E as L,r as g,o as p,c as k,p as a,w as i,R as N,b as f,bl as v,ba as h,D as b,P as y,m as r,b5 as P,x as n}from"./index.84400ea8.js";import{o as I}from"./main.9984b416.js";import{d as u,V as E,c as M}from"./VRow.5bc57025.js";import{V as m}from"./VAutocomplete.f4bce551.js";import"./VDialog.e12e96f6.js";const{mapGetters:O,mapActions:T,mapState:j}=L("dashboard"),x={components:{DialogBox:C,DashboardNotify:D,VueDatePicker:I},data(){return{isBox:!1,headers:[{title:"Destination Country",align:"start",key:"Pais_Destino"},{title:"Ruta",align:"start",key:"Ruta"},{title:"Ruta Real",align:"start",key:"Ruta_Real"},{title:"MCC",align:"start",key:"MCC"},{title:"MNC",align:"start",key:"MNC"},{title:"HLR",align:"start",key:"HLR"},{title:"Client Name",align:"start",key:"NombreCliente"},{title:"Mobile",align:"start",key:"Movil"},{title:"Send Text",align:"start",key:"Texto_Remitente"},{title:"Departure Date",align:"start",key:"Fecha_Salida"},{title:"Operator Delivery Date",align:"start",key:"Fecha_EntregaOperadora"},{title:"Notification",align:"start",key:"Fecha_Notificacion"},{title:"State",align:"start",key:"Estado"},{title:"Identifier",align:"start",key:"Identificador"}],countryModel:null,providerModel:null,customerModel:null,typeRouteModel:null,mccmncModel:null,serverUrl:window.configData.APP_BASE_URL}},computed:{...O(["GetLastMessage","IsLoading","GetReportMccMnc"]),getReportData:function(){var t,e,s;return(t=this.GetLastMessage)!=null&&t.data?(s=(e=this.GetLastMessage)==null?void 0:e.data)==null?void 0:s.filter(c=>c.Pais_Destino).map(c=>{let o=c;return o.OutText=decodeURIComponent(c==null?void 0:c.OutText),o}):[]},getCountries:function(){var t,e;return(e=(t=this.GetLastMessage)==null?void 0:t.countryList)==null?void 0:e.map(s=>`${s.state}[${s.code}]`).splice(0,50)},getProviders:function(){var t,e;return(e=(t=this.GetLastMessage)==null?void 0:t.providerList)==null?void 0:e.map(s=>`${s.NOMBRE}[${s.ID_PROVEEDOR}]`).splice(0,50)},getCustomers:function(){var t,e;return(e=(t=this.GetLastMessage)==null?void 0:t.customerList)==null?void 0:e.map(s=>`${s.EMPRESA}[${s.ID_CLIENTE}]`).splice(0,50)},getTypeRoute:function(){var e,s;const t=((e=this.GetLastMessage)==null?void 0:e.typeRoute)||{};return(s=Object.keys(t))==null?void 0:s.map(c=>`${t[c]} [${c.substr(1,1)}]`)},getMccMnc:function(){var t,e;return(e=(t=this.GetReportMccMnc)==null?void 0:t.map(s=>`${s.OPERATOR} [${s.MCC}${s.MNC}]`).sort())!=null?e:[]},periodPicker:function(){return this.filterPeriod=="Month"}},mounted(){this.fetchLastMessageData({cPaises:"",iIDCliente:"",iIDProveedor:"",iIDTipoRuta:-1,cMccMnc:""})},methods:{...T(["fetchLastMessageData","fetchMccMncData"]),searchResult(){this.fetchLastMessageData({cPaises:this.getNumList(this.countryModel),iIDCliente:this.getNumList(this.customerModel),iIDProveedor:this.getNumList(this.providerModel),iIDTipoRuta:this.getNumList(this.typeRouteModel),cMccMnc:this.getMccMncLists(this.mccmncModel)})},getMccMncLists(t){const e=JSON.parse(JSON.stringify(t));return e?e.map(s=>parseInt(s.match(/\d+/)[0])).join(","):""},Reset(){this.countryModel=null,this.providerModel=null,this.customerModel=null,this.typeRouteModel=null,this.mccmncModel=null},getNumList(t){return Array.isArray(t)?t.map(e=>parseInt(e.match(/\d+/)[0])).join(","):t}},watch:{countryModel:function(t){const e=this.getNumList(t);!e||this.fetchMccMncData({codes:e})}}},B={class:"text-left"};function S(t,e,s,c,o,d){const _=g("v-data-table"),R=g("DialogBox");return p(),k("div",null,[a(M,{class:"match-height"},{default:i(()=>[a(u,{cols:"12",md:"12",lg:"12"},{default:i(()=>[a(E,{class:"text-center pb-4",title:"Last Messages"},{default:i(()=>[a(N,{class:"pb-1"}),t.IsLoading?(p(),f(v,{key:0,size:50,color:"primary",indeterminate:""})):h("",!0),t.IsLoading?h("",!0):(p(),f(_,{key:1,headers:o.headers,items:d.getReportData,"sort-by":[{key:"calories",order:"asc"}],class:"elevation-1 px-4 py-2",style:{"min-height":"450px","font-size":"10pt"}},{top:i(()=>[a(M,{class:"align-center"},{default:i(()=>[a(u,{cols:"12",md:"4",sm:"6"},{default:i(()=>[a(m,{modelValue:o.countryModel,"onUpdate:modelValue":e[0]||(e[0]=l=>o.countryModel=l),label:"Countries",items:d.getCountries,multiple:""},null,8,["modelValue","items"])]),_:1}),a(u,{cols:"12",md:"4",sm:"6"},{default:i(()=>[a(m,{label:"Providers",items:d.getProviders,modelValue:o.providerModel,"onUpdate:modelValue":e[1]||(e[1]=l=>o.providerModel=l),multiple:""},null,8,["items","modelValue"])]),_:1}),a(u,{cols:"12",md:"4",sm:"6"},{default:i(()=>[a(m,{label:"Type of route",items:d.getTypeRoute,modelValue:o.typeRouteModel,"onUpdate:modelValue":e[2]||(e[2]=l=>o.typeRouteModel=l),multiple:""},null,8,["items","modelValue"])]),_:1})]),_:1}),a(M,{class:"align-center pb-4 mb-4"},{default:i(()=>[a(u,{cols:"12",md:"4",sm:"6"},{default:i(()=>[a(m,{modelValue:o.customerModel,"onUpdate:modelValue":e[3]||(e[3]=l=>o.customerModel=l),label:"Customers",items:d.getCustomers,multiple:""},null,8,["modelValue","items"])]),_:1}),a(u,{cols:"12",md:"4",sm:"6"},{default:i(()=>[a(m,{modelValue:o.mccmncModel,"onUpdate:modelValue":e[4]||(e[4]=l=>o.mccmncModel=l),label:"MccMnc",items:d.getMccMnc,multiple:"",disabled:!d.getMccMnc.length},null,8,["modelValue","items","disabled"])]),_:1}),a(u,{cols:"12",md:"4",sm:"6",class:"text-right"},{default:i(()=>[a(b,{onClick:d.searchResult,color:"info",dark:"",class:"btn border",size:"small","prepend-icon":"tabler-search"},{default:i(()=>[y(" Search ")]),_:1},8,["onClick"]),a(b,{color:"secondary",dark:"",class:"btn border ml-4",size:"small","prepend-icon":"tabler-refresh",onClick:d.Reset},{default:i(()=>[y(" Reset ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),item:i(({item:l,index:G})=>[r("tr",B,[r("td",null,[a(P,{"max-width":40,src:`${o.serverUrl}/flags/${l.selectable.Pais_Destino}.png`},null,8,["src"]),r("span",null,n(l.selectable.state),1)]),r("td",null,n(l.selectable.Ruta),1),r("td",null,n(l.selectable.Ruta_Real),1),r("td",null,n(l.selectable.MCC),1),r("td",null,n(l.selectable.MNC),1),r("td",null,n(l.selectable.HLR),1),r("td",null,n(l.selectable.NombreCliente),1),r("td",null,n(l.selectable.Movil),1),r("td",null,n(l.selectable.Texto_Remitente),1),r("td",null,n(l.selectable.Fecha_Salida),1),r("td",null,n(l.selectable.Fecha_EntregaOperadora),1),r("td",null,n(l.selectable.Fecha_Notificacion),1),r("td",null,n(l.selectable.Estado),1),r("td",null,n(l.selectable.Identificador),1)])]),_:1},8,["headers","items"]))]),_:1})]),_:1})]),_:1}),a(R,{isVisable:o.isBox},null,8,["isVisable"])])}const J=V(x,[["render",S]]);export{J as default};
