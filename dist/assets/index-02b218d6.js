import{r as m,b as y,ae as L,u as C,E as F,c as s,a3 as A,f as E,a4 as j,k as P,l as N,m as S,a5 as b,L as B,af as T,H as l,ag as q,ah as H,ai as $,aj as D,a8 as G,a9 as U,aa as V}from"./index-e391d606.js";import{s as z,r as J}from"./AuthServices-97191502.js";const K=()=>{var h,g;const[o,w]=m.useState(!1),[n,e]=m.useState(!1),c=y(),a=L(),i=`/${a.pathname.split("/")[1]}`,d=new URLSearchParams(a==null?void 0:a.search).get("token"),{handleSubmit:k,register:p,formState:{errors:r}}=C({resolver:F(T)}),v=()=>{w(!o)},I=async R=>{var f,x;const u=R.password;try{if(!d){l("error","Invalid Token");return}e(!0),i==="/set-password"?await z(d,u):i==="/reset-password"&&await J(d,u),e(!1),l("success","Password Reset Successfully"),setTimeout(()=>{c("/login")},1500)}catch(t){console.error(t),e(!1),l("error",((x=(f=t==null?void 0:t.response)==null?void 0:f.data)==null?void 0:x.message)||"Something went wrong")}};return s.jsxs(A,{onSubmit:k(I),children:[n&&s.jsx(E,{}),s.jsxs(j,{className:"pass-wrap",children:[s.jsxs(P,{for:"password",className:"label-input",children:["New Password",s.jsx("span",{className:"asterisk",children:" *"})]}),s.jsx(N,{type:o?"text":"password",id:"password",placeholder:"New Password",invalid:!!r.password,...p("password")}),s.jsx(S,{children:(h=r.password)==null?void 0:h.message})]}),s.jsxs(j,{className:"pass-wrap",children:[s.jsxs(P,{for:"password",className:"label-input",children:["Confirm New Password",s.jsx("span",{className:"asterisk",children:" *"})]}),s.jsx(N,{type:o?"text":"password",id:"confirmpassword",placeholder:"Confirm New Password",invalid:!!r.confirmPassword,...p("confirmPassword")}),s.jsx(S,{children:(g=r.confirmPassword)==null?void 0:g.message}),s.jsx(b,{type:"button",onClick:v,className:"pass-visible",children:o?"Show":"Hide"})]}),s.jsxs("div",{className:"footer-btn-wrap",children:[s.jsxs(b,{className:"login-btn",children:[" ",i==="/set-password"?"Set Password":"Reset Password"]}),s.jsx(B,{to:"/login",className:"forgot-pass-btn",children:"Back to Login"})]})]})},X=()=>{const n=`/${L().pathname.split("/")[1]}`,e=y(),c=q(),a=H();return m.useEffect(()=>{a==="1"?e("/talent/main-home"):($(),localStorage.removeItem("isLoggedIn"),c(D(!1)),e("/talent/login"))},[a]),s.jsx("div",{className:"card-main-wrapper",children:s.jsx(G,{className:"card-content",children:s.jsxs(U,{className:"card-body-content",children:[s.jsx("img",{src:V,alt:"logo",className:"img-logo"}),s.jsx("h1",{className:"card-title",children:n==="/set-password"?"Set Password":"Reset Password"}),s.jsx(K,{})]})})})};export{X as default};
