import{r as x,u as j,E as p,ab as c,c as s,ac as d,a3 as f,f as w,a4 as b,k as F,l as N,m as y,a5 as k,L as S,ad as L,H as l,a8 as P,a9 as v,aa as A}from"./index-e391d606.js";import{f as E}from"./AuthServices-97191502.js";const B=()=>{var t;const[r,e]=x.useState(!1),{register:m,handleSubmit:u,formState:{errors:o}}=j({resolver:p(L),defaultValues:{email:""}});if(c())return s.jsx(d,{to:"/"});const h=async g=>{var i,n;try{const{email:a}=g;e(!0),await E(a),e(!1),l("success","Please check your email for reset password link")}catch(a){console.error(a),l("error",((n=(i=a==null?void 0:a.response)==null?void 0:i.data)==null?void 0:n.message)||"Something went wrong"),e(!1)}};return s.jsxs(f,{onSubmit:u(h),children:[r&&s.jsx(w,{}),s.jsxs(b,{children:[s.jsxs(F,{for:"email",className:"label-input",children:["Email address",s.jsx("span",{className:"asterisk",children:"*"})]}),s.jsx(N,{type:"email",id:"email",placeholder:"Email address",invalid:!!o.email,...m("email")}),s.jsx(y,{children:(t=o.email)==null?void 0:t.message})]}),s.jsxs("div",{className:"footer-btn-wrap",children:[s.jsx(k,{className:"login-btn",children:"Send"}),s.jsx(S,{to:"/login",className:"forgot-pass-btn",children:"Back to Login"})]})]})},I=()=>c()?s.jsx(d,{to:"/"}):s.jsx("div",{className:"card-main-wrapper",children:s.jsx(P,{className:"card-content",children:s.jsxs(v,{className:"card-body-content",children:[s.jsx("img",{src:A,alt:"logo",className:"img-logo"}),s.jsx("h1",{className:"card-title forgot-pass",children:"Forgot Password"}),s.jsx("p",{children:"Please enter your registered email address and we will send you link to reset your password."}),s.jsx(B,{})]})})});export{I as default};