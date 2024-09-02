import{aM as b,aN as re,aO as le,aP as ce,b as ie,r,am as de,c as a,g as me,l as ue,aQ as pe,a4 as ge,n as he,d as S,L as xe,B as j,C as Se,f as je,aR as Ce,aS as fe,aT as ve,H as p,aU as L,aV as Ne,aW as be,aX as Pe,aY as we,aZ as Re}from"./index-e391d606.js";import{T as Te}from"./CustomToggle-88ae48af.js";function P(){return P=Object.assign?Object.assign.bind():function(i){for(var c=1;c<arguments.length;c++){var d=arguments[c];for(var l in d)Object.prototype.hasOwnProperty.call(d,l)&&(i[l]=d[l])}return i},P.apply(this,arguments)}var ye={placement:"top",autohide:!0,placementPrefix:"bs-tooltip",trigger:"hover focus"};function w(i){var c=b("tooltip-arrow",i.arrowClassName),d=b("tooltip","show",i.popperClassName),l=b("tooltip-inner",i.innerClassName);return re.createElement(le,P({},i,{arrowClassName:c,popperClassName:d,innerClassName:l}))}w.propTypes=ce;w.defaultProps=ye;const Ie=()=>{const i=ie(),[c,d]=r.useState(1),[l,O]=r.useState(10),[R,W]=r.useState(0),[T,m]=r.useState(!1),[y,C]=r.useState([]),[u,E]=r.useState(null),[M,$]=r.useState([]),[F,D]=r.useState(1),[z,G]=r.useState(0),[g,B]=r.useState(""),[H,Q]=r.useState({}),[U,I]=r.useState(1),{activeMenu:Z}=r.useContext(de),[k,V]=r.useState(!1),X=e=>{Q(s=>({...s,[e]:!s[e]}))},Y=e=>{try{const s=y.find(N=>(N==null?void 0:N.Id)===e),{FirstName:o,LastName:n,Phone:t,State:v,Zip:h,Address:x,City:te,Role:ne,Email:oe}=s||{};i(`/user/edit/${e}`,{state:{FirstName:o,LastName:n,Phone:t,State:v,Zip:h,Address:x,City:te,Role:ne,Email:oe}})}catch(s){console.error(s),p("error","Something went wrong")}},_=async e=>{var s,o,n;try{m(!0);const t=await we(e);p("success",(s=t.data)==null?void 0:s.message),m(!1),m(!0),await A(),m(!1)}catch(t){console.error(t),m(!1),p("error",((n=(o=t==null?void 0:t.response)==null?void 0:o.data)==null?void 0:n.message)||"Something went wrong")}},q=async()=>{var e,s,o;try{const n=await ve();$((e=n==null?void 0:n.data)==null?void 0:e.data)}catch(n){console.error(n),m(!1),p("error",((o=(s=n==null?void 0:n.response)==null?void 0:s.data)==null?void 0:o.message)||"Something went wrong")}},J=L(async(e,s)=>{var o,n;try{const t=await Re(e,s);p("success","User activation changed successfully")}catch(t){p("error",((n=(o=t==null?void 0:t.response)==null?void 0:o.data)==null?void 0:n.message)||"Something went wrong")}},500),f=new AbortController,A=L(async()=>{var e,s,o;try{const n=(u==null?void 0:u.value)??"";m(!0);const t=await Ne(l,f,g?U:c,g,n);if(m(!1),W(t==null?void 0:t.count),u){const v=(e=t==null?void 0:t.rows)==null?void 0:e.filter(h=>{var x;return((x=h==null?void 0:h.Role)==null?void 0:x.Role)===(u==null?void 0:u.label)});C(v)}C(t==null?void 0:t.rows),G(Math.ceil((t==null?void 0:t.count)/l))}catch(n){if(f.signal.aborted){V(!0);return}console.error(n),m(!1),p("error",((o=(s=n==null?void 0:n.response)==null?void 0:s.data)==null?void 0:o.message)||"Something went wrong")}},300);r.useEffect(()=>(q(),A(),D(c),()=>f.abort()),[l,g,u,C,Z,c,k]);const K=e=>{if(e===null){E(null);return}d(1),E(e)},ee=async e=>{g?I(e):d(e)},ae=e=>{B(e),I(1)},se=[{name:"Sr No",selector:(e,s)=>(c-1)*l+(s!==void 0?s+1:e.Id||0),width:"7%"},{name:"User Name",selector:e=>a.jsxs("div",{className:"table-username",children:[a.jsx("p",{style:{marginRight:"5px"},className:"name-logo",children:e.FirstName.slice(0,1).toUpperCase()+e.LastName.slice(0,1).toUpperCase()}),a.jsx("span",{className:"row-user-name",children:`${S(e.FirstName)} ${S(e.LastName)}`})]}),minWidth:"260px"},{name:"Contact",selector:e=>e.Phone.replace(/(\d{3})(\d{3})(\d{4})/,"$1-$2-$3"),minWidth:"120px"},{name:"Email Address",minWidth:"160px",selector:e=>a.jsxs("div",{children:[a.jsx("span",{id:`email-${e.Id}`,style:{cursor:"pointer"},children:e.Email}),a.jsx(w,{isOpen:H[e.Id],target:`email-${e.Id}`,toggle:()=>X(e.Id),placement:"bottom",children:e.Email})]},e.Id)},{name:"Address",selector:e=>e.Address,minWidth:"150px"},{name:"Role",selector:e=>{var s,o;return(s=e.Role)!=null&&s.Role?(o=e.Role)==null?void 0:o.Role.split(" ").map(n=>S(n)).join(" "):"No Role"},minWidth:"190px"},{name:"Status",minWidth:"70px",cell:e=>a.jsx("div",{children:a.jsx(j,{submodule:"",module:"users",action:["GET","PUT"],children:a.jsx(Te,{onStateChange:s=>J(e.Id,s),checked:e.ActivationStatus})})})},{name:"Actions",minWidth:"120px",cell:(e,s)=>a.jsxs("div",{className:"d-flex",children:[a.jsx(j,{submodule:"",module:"users",action:["GET","PUT"],children:a.jsx(be,{onEdit:()=>e.Id!==void 0&&Y(e.Id)})}),a.jsx(j,{submodule:"",module:"users",action:["GET","DELETE"],children:a.jsx(Pe,{onDelete:()=>e.Id!==void 0&&_(e.Id)})})]},s)}];return a.jsxs(a.Fragment,{children:[a.jsx("h1",{className:"list-page-header",children:"Manage Users"}),a.jsxs(me,{children:[a.jsxs("div",{className:"d-flex search-button",children:[a.jsxs("div",{className:"search-bar-wrapper flex-grow-1 ",children:[a.jsx(ue,{placeholder:"search by Name, Contact, Email Address and Role",value:g,onChange:e=>ae(e.target.value)}),a.jsx("img",{src:pe,alt:"search"})]}),a.jsx("div",{className:"users-header-select select-dropdown",children:a.jsx(ge,{children:a.jsx(he,{id:"role",name:"role",value:u,onChange:e=>K(e),placeholder:"Select Role",options:M.map(e=>({value:e==null?void 0:e.Id,label:e==null?void 0:e.Role.split(" ").map(s=>S(s)).join(" ")})),noOptionsMessage:()=>"No Role Found",isClearable:!0,isSearchable:!0})})}),a.jsx("div",{className:"table-navigate",children:a.jsx(xe,{to:"/users/create",className:"link-button",children:a.jsx(j,{submodule:"",module:"users",action:["GET","POST"],children:a.jsx(Se,{className:"primary-btn me-0",children:"Add New User"})})})})]}),T?a.jsx(je,{}):a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"datatable-wrapper",children:a.jsx(Ce,{columns:se,data:y,progressPending:T,paginationServer:!0,paginationTotalRows:R,paginationPerPage:l,selectableRows:!1,responsive:!0})}),a.jsx(fe,{currentPage:g?U:F,totalPages:z,onPageChange:ee,onPageSizeChange:O,entriesPerPage:l,totalRows:R,setPage:d})]})]})]})};export{Ie as default};
