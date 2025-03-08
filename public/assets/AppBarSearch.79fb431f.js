import{y as N,bS as P,k as y,bJ as f,B as A,a9 as j,o as r,b,w as t,p as a,U as E,q as l,bh as O,bt as B,D as I,C as u,m as n,R as G,be as J,ag as C,M as R,c as d,F as m,a as x,bT as X,P as z,x as v,n as D,N as L,O as H,aG as w,ba as Q,bj as W,bk as Y}from"./index.84400ea8.js";import{V as Z,b as $,c as ee,d as se}from"./VRow.5bc57025.js";import{V as te}from"./VDialog.e12e96f6.js";const ae=_=>(W("data-v-dd687002"),_=_(),Y(),_),le={class:"d-flex align-center"},re={class:"h-100"},ie={class:"text-xs text-disabled text-uppercase"},oe={class:"h-100"},ne={class:"app-bar-search-suggestions d-flex flex-column align-center justify-center text-high-emphasis h-100"},ce={class:"text-h6 my-3"},ue={key:0,class:"mt-8"},de=ae(()=>n("span",{class:"d-flex justify-center text-disabled"},"Try searching for",-1)),pe=["onClick"],he={class:"text-sm"},fe={__name:"AppBarSearch",props:{isDialogVisible:{type:Boolean,required:!0},searchQuery:{type:String,required:!0},searchResults:{type:Array,required:!0},suggestions:{type:Array,required:!1},noDataSuggestion:{type:Array,required:!1}},emits:["update:isDialogVisible","update:searchQuery","itemSelected"],setup(_,{emit:g}){const i=_,{ctrl_k:T,meta_k:K}=P(),k=y(),o=y(structuredClone(f(i.searchQuery))),U=y(),S=y(structuredClone(f(i.isDialogVisible))),p=y(structuredClone(f(i.searchResults)));A(i,()=>{S.value=structuredClone(f(i.isDialogVisible)),p.value=structuredClone(f(i.searchResults)),o.value=structuredClone(f(i.searchQuery))}),A([T,K],()=>{S.value=!0,g("update:isDialogVisible",!0)});const V=()=>{g("update:isDialogVisible",!1),g("update:searchQuery","")};j(()=>{o.value.length||(p.value=[])});const q=e=>{var c,s;e.key==="ArrowDown"?(e.preventDefault(),(c=k.value)==null||c.focus("next")):e.key==="ArrowUp"&&(e.preventDefault(),(s=k.value)==null||s.focus("prev"))},F=e=>{g("update:isDialogVisible",e),g("update:searchQuery","")},M=e=>e==="dashboards"?"Dashboards":e==="appsPages"?"Apps & Pages":e==="userInterface"?"User Interface":e==="formsTables"?"Forms Tables":e==="chartsMisc"?"Charts Misc":"Misc";return(e,c)=>(r(),b(te,{"max-width":"600","model-value":l(S),height:e.$vuetify.display.smAndUp?"550":"100%",fullscreen:e.$vuetify.display.width<600,class:"app-bar-search-dialog","onUpdate:modelValue":F,onKeyup:B(V,["esc"])},{default:t(()=>[a(Z,{height:"100%",width:"100%",class:"position-relative"},{default:t(()=>[a($,{class:"pt-1",style:{"max-height":"65px"}},{default:t(()=>[a(E,{ref_key:"refSearchInput",ref:U,modelValue:l(o),"onUpdate:modelValue":[c[0]||(c[0]=s=>O(o)?o.value=s:null),c[1]||(c[1]=s=>e.$emit("update:searchQuery",l(o)))],autofocus:"",variant:"plain",density:"comfortable",class:"app-bar-autocomplete-box",onKeyup:B(V,["esc"]),onKeydown:q},{"prepend-inner":t(()=>[a(I,{icon:"",variant:"text",color:"default",size:"x-small",class:"text-high-emphasis ms-n1"},{default:t(()=>[a(u,{size:"22",icon:"tabler-search"})]),_:1})]),"append-inner":t(()=>[n("div",le,[n("div",{class:"text-base text-disabled cursor-pointer me-2",onClick:V}," [esc] "),a(I,{icon:"",variant:"text",color:"default",size:"x-small",onClick:V},{default:t(()=>[a(u,{size:"22",icon:"tabler-x"})]),_:1})])]),_:1},8,["modelValue","onKeyup"])]),_:1}),a(G),a(l(J),{options:{wheelPropagation:!1,suppressScrollX:!0},class:"h-100"},{default:t(()=>[C(a(l(R),{ref_key:"refSearchList",ref:k,density:"compact",class:"app-bar-search-list"},{default:t(()=>[(r(!0),d(m,null,x(l(p),s=>(r(),d(m,{key:s.title},["header"in s?(r(),b(l(X),{key:0,class:"text-disabled"},{default:t(()=>[z(v(M(s.title)),1)]),_:2},1024)):D(e.$slots,"searchResult",{key:1,item:s},()=>[a(l(L),{link:"",onClick:h=>e.$emit("itemSelected",s)},{prepend:t(()=>[a(u,{size:"20",icon:s.icon,class:"me-3"},null,8,["icon"])]),append:t(()=>[a(u,{size:"20",icon:"tabler-corner-down-left",class:"enter-icon text-disabled"})]),default:t(()=>[a(H,null,{default:t(()=>[z(v(s.title),1)]),_:2},1024)]),_:2},1032,["onClick"])],!0)],64))),128))]),_:3},512),[[w,l(o).length&&!!l(p).length]]),C(n("div",re,[D(e.$slots,"suggestions",{},()=>[a($,{class:"app-bar-search-suggestions h-100 pa-10"},{default:t(()=>[i.suggestions?(r(),b(ee,{key:0,class:"gap-y-4"},{default:t(()=>[(r(!0),d(m,null,x(i.suggestions,s=>(r(),b(se,{key:s.title,cols:"12",sm:"6",class:"ps-6"},{default:t(()=>[n("p",ie,v(s.title),1),a(l(R),{class:"card-list"},{default:t(()=>[(r(!0),d(m,null,x(s.content,h=>(r(),b(l(L),{key:h.title,link:"",title:h.title,class:"app-bar-search-suggestion",onClick:_e=>e.$emit("itemSelected",h)},{prepend:t(()=>[a(u,{icon:h.icon,size:"20",class:"me-2"},null,8,["icon"])]),_:2},1032,["title","onClick"]))),128))]),_:2},1024)]),_:2},1024))),128))]),_:1})):Q("",!0)]),_:1})],!0)],512),[[w,!!l(p)&&!l(o)]]),C(n("div",oe,[D(e.$slots,"noData",{},()=>[a($,{class:"h-100"},{default:t(()=>[n("div",ne,[a(u,{size:"75",icon:"tabler-file-x"}),n("h6",ce,' No Result For "'+v(l(o))+'" ',1),i.noDataSuggestion?(r(),d("div",ue,[de,(r(!0),d(m,null,x(i.noDataSuggestion,s=>(r(),d("h6",{key:s.title,class:"app-bar-search-suggestion text-sm font-weight-regular cursor-pointer mt-3",onClick:h=>e.$emit("itemSelected",s)},[a(u,{size:"20",icon:s.icon,class:"me-3"},null,8,["icon"]),n("span",he,v(s.title),1)],8,pe))),128))])):Q("",!0)])]),_:1})],!0)],512),[[w,!l(p).length&&l(o).length]])]),_:3})]),_:3})]),_:3},8,["model-value","height","fullscreen","onKeyup"]))}},me=N(fe,[["__scopeId","data-v-dd687002"]]);export{me as default};
