import{r as o,b as B,u as M,E as V,c as s,e as G,f as I,R as T,h,k as m,l as u,m as P,a5 as p,C,aG as U,H as b,g as q}from"./index-e391d606.js";import{c as z}from"./AuthServices-97191502.js";const A=()=>{var x,N,j;const[S,n]=o.useState(!1),[c,y]=o.useState(!1),[t,k]=o.useState(!1),[d,v]=o.useState(!1),F=B(),l=r=>{switch(r){case"currentPassword":y(!c);break;case"newPassword":k(!t);break;case"confirmNewPassword":v(!d);break}},{handleSubmit:H,setValue:i,register:w,formState:{errors:e}}=M({resolver:V(U)}),E=async r=>{var f,g;try{const a=r.currentPassword,R=r.newPassword;n(!0),await z(a,R),n(!1),i("currentPassword",""),i("newPassword",""),i("confirmNewPassword",""),b("success","Password changed successfully")}catch(a){console.error(a),n(!1),b("error",((g=(f=a==null?void 0:a.response)==null?void 0:f.data)==null?void 0:g.message)||"Something went wrong")}},L=()=>{F("/")};return s.jsxs(G,{onSubmit:H(E),children:[S&&s.jsx(I,{}),s.jsxs(T,{children:[s.jsxs(h,{className:"col-group profile-col-group",children:[s.jsxs(m,{className:"",children:["Current Password ",s.jsx("span",{className:"asterisk",children:"*"})]}),s.jsx(u,{placeholder:"Current Password",type:c?"text":"password",id:"currentPassword",invalid:!!e.currentPassword,...w("currentPassword")}),s.jsx(P,{children:(x=e.currentPassword)==null?void 0:x.message}),s.jsx(p,{type:"button",onClick:()=>l("currentPassword"),className:"pass-visible",children:c?"Hide":"Show"})]}),s.jsxs(h,{className:"col-group  profile-col-group",children:[s.jsxs(m,{children:["New Password ",s.jsx("span",{className:"asterisk",children:"*"})]}),s.jsx(u,{type:t?"text":"password",placeholder:"New Password",id:"newPassword",invalid:!!e.newPassword,...w("newPassword")}),s.jsx(P,{children:(N=e.newPassword)==null?void 0:N.message}),s.jsx(p,{type:"button",onClick:()=>l("newPassword"),className:"pass-visible",children:t?"Hide":"Show"})]}),s.jsxs(h,{className:"col-group  profile-col-group",children:[s.jsxs(m,{children:["Confirm New Password ",s.jsx("span",{className:"asterisk",children:"*"})]}),s.jsx(u,{type:d?"text":"password",placeholder:"Confirm New Password ",id:"confirmNewPassword",invalid:!!e.confirmNewPassword,...w("confirmNewPassword")}),s.jsx(P,{children:(j=e.confirmNewPassword)==null?void 0:j.message}),s.jsx(p,{type:"button",onClick:()=>l("confirmNewPassword"),className:"pass-visible",children:d?"Hide":"Show"})]})]}),s.jsxs("div",{className:"btn-wrapper",children:[s.jsx(C,{className:"primary-btn",children:"Update"}),s.jsx(C,{className:"secondary-btn",onClick:L,children:"Cancel"})]})]})},K=()=>s.jsxs(s.Fragment,{children:[s.jsx("h1",{className:"list-page-header",children:"My Profile"}),s.jsxs(q,{children:[s.jsx("h2",{className:"page-content-header",children:"Change Password"}),s.jsx(A,{})]})]});export{K as default};
