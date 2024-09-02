import{r as g,c as a,ak as Vt,al as $t,b as Ft,ag as Pt,am as Ut,ae as Kt,an as Wt,ao as zt,ap as qt,aq as Ne,ar as Me,as as Oe,at as je,L as Z,au as $,aa as Zt,D as Gt,av as Jt,H as He,aw as Yt,ax as Qt}from"./index-e391d606.js";import{a as Xt,b as en}from"./AuthServices-97191502.js";import{S as tn}from"./SelectedSidebar-192d9a81.js";const nn="/assets/menu-3c0ca3e0.svg",rn=()=>{const[e]=g.useState("sidebar-active"),[t]=g.useState(document.querySelector("body")),n=()=>{const s=document.querySelector("body");s&&(window.innerWidth<=1199?(s.classList.add(e),localStorage.setItem("hideSidebar","true")):s.classList.remove(e))};window.addEventListener("resize",n),g.useEffect(()=>(n(),window.addEventListener("resize",n),()=>{window.removeEventListener("resize",n)}),[]);const r=()=>{t&&t.classList.toggle(e)};return a.jsx("div",{className:"header-wrapper header-section",children:a.jsx("div",{className:"header-content",children:a.jsx("div",{className:"burger",children:a.jsxs("div",{className:"icon-img",children:[a.jsx("img",{src:nn,alt:"menu",onClick:r}),a.jsx("div",{className:"bell-wrap",children:a.jsx("span",{className:"notification",children:"2"})})]})})})})},sn="/assets/logoround_new-6c9df7cb.jpg",on="/assets/profile-8531b9ad.svg",an="/assets/logout-841bb146.svg";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=s&63|128):(s&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=s&63|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=s&63|128)}return t},cn=function(e){const t=[];let n=0,r=0;for(;n<e.length;){const s=e[n++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=e[n++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=e[n++],i=e[n++],l=e[n++],d=((s&7)<<18|(o&63)<<12|(i&63)<<6|l&63)-65536;t[r++]=String.fromCharCode(55296+(d>>10)),t[r++]=String.fromCharCode(56320+(d&1023))}else{const o=e[n++],i=e[n++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|i&63)}}return t.join("")},Xe={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<e.length;s+=3){const o=e[s],i=s+1<e.length,l=i?e[s+1]:0,d=s+2<e.length,u=d?e[s+2]:0,h=o>>2,b=(o&3)<<4|l>>4;let O=(l&15)<<2|u>>6,j=u&63;d||(j=64,i||(O=64)),r.push(n[h],n[b],n[O],n[j])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Qe(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):cn(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<e.length;){const o=n[e.charAt(s++)],l=s<e.length?n[e.charAt(s)]:0;++s;const u=s<e.length?n[e.charAt(s)]:64;++s;const b=s<e.length?n[e.charAt(s)]:64;if(++s,o==null||l==null||u==null||b==null)throw new ln;const O=o<<2|l>>4;if(r.push(O),u!==64){const j=l<<4&240|u>>2;if(r.push(j),b!==64){const w=u<<6&192|b;r.push(w)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class ln extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const dn=function(e){const t=Qe(e);return Xe.encodeByteArray(t,!0)},et=function(e){return dn(e).replace(/\./g,"")},un=function(e){try{return Xe.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fn=()=>hn().__FIREBASE_DEFAULTS__,pn=()=>{if(typeof process>"u"||typeof process.env>"u")return;const e={}.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},gn=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&un(e[1]);return t&&JSON.parse(t)},mn=()=>{try{return fn()||pn()||gn()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},tt=()=>{var e;return(e=mn())===null||e===void 0?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}function nt(){try{return typeof indexedDB=="object"}catch{return!1}}function rt(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var o;t(((o=s.error)===null||o===void 0?void 0:o.message)||"")}}catch(n){t(n)}})}function bn(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn="FirebaseError";class H extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=wn,Object.setPrototypeOf(this,H.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,U.prototype.create)}}class U{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},s=`${this.service}/${t}`,o=this.errors[t],i=o?yn(o,r):"Error",l=`${this.serviceName}: ${i} (${s}).`;return new H(s,l,r)}}function yn(e,t){return e.replace(vn,(n,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const vn=/\{\$([^}]+)}/g;function oe(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const s of n){if(!r.includes(s))return!1;const o=e[s],i=t[s];if(Re(o)&&Re(i)){if(!oe(o,i))return!1}else if(o!==i)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function Re(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(e){return e&&e._delegate?e._delegate:e}class E{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new Cn;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(n=t==null?void 0:t.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(En(t))try{this.getOrInitializeService({instanceIdentifier:D})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=D){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=D){return this.instances.has(t)}getOptions(t=D){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[o,i]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&i.resolve(s)}return s}onInit(t,n){var r;const s=this.normalizeInstanceIdentifier(n),o=(r=this.onInitCallbacks.get(s))!==null&&r!==void 0?r:new Set;o.add(t),this.onInitCallbacks.set(s,o);const i=this.instances.get(s);return i&&t(i,s),()=>{o.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const s of r)try{s(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:_n(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=D){return this.component?this.component.multipleInstances?t:D:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function _n(e){return e===D?void 0:e}function En(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new In(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var f;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(f||(f={}));const Dn={debug:f.DEBUG,verbose:f.VERBOSE,info:f.INFO,warn:f.WARN,error:f.ERROR,silent:f.SILENT},An=f.INFO,Tn={[f.DEBUG]:"log",[f.VERBOSE]:"log",[f.INFO]:"info",[f.WARN]:"warn",[f.ERROR]:"error"},kn=(e,t,...n)=>{if(t<e.logLevel)return;const r=new Date().toISOString(),s=Tn[t];if(s)console[s](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class xn{constructor(t){this.name=t,this._logLevel=An,this._logHandler=kn,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in f))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Dn[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,f.DEBUG,...t),this._logHandler(this,f.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,f.VERBOSE,...t),this._logHandler(this,f.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,f.INFO,...t),this._logHandler(this,f.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,f.WARN,...t),this._logHandler(this,f.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,f.ERROR,...t),this._logHandler(this,f.ERROR,...t)}}const Nn=(e,t)=>t.some(n=>e instanceof n);let Be,Le;function Mn(){return Be||(Be=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function On(){return Le||(Le=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const st=new WeakMap,ie=new WeakMap,ot=new WeakMap,G=new WeakMap,he=new WeakMap;function jn(e){const t=new Promise((n,r)=>{const s=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{n(v(e.result)),s()},i=()=>{r(e.error),s()};e.addEventListener("success",o),e.addEventListener("error",i)});return t.then(n=>{n instanceof IDBCursor&&st.set(n,e)}).catch(()=>{}),he.set(t,e),t}function Hn(e){if(ie.has(e))return;const t=new Promise((n,r)=>{const s=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{n(),s()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});ie.set(e,t)}let ae={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return ie.get(e);if(t==="objectStoreNames")return e.objectStoreNames||ot.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return v(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Rn(e){ae=e(ae)}function Bn(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(J(this),t,...n);return ot.set(r,t.sort?t.sort():[t]),v(r)}:On().includes(e)?function(...t){return e.apply(J(this),t),v(st.get(this))}:function(...t){return v(e.apply(J(this),t))}}function Ln(e){return typeof e=="function"?Bn(e):(e instanceof IDBTransaction&&Hn(e),Nn(e,Mn())?new Proxy(e,ae):e)}function v(e){if(e instanceof IDBRequest)return jn(e);if(G.has(e))return G.get(e);const t=Ln(e);return t!==e&&(G.set(e,t),he.set(t,e)),t}const J=e=>he.get(e);function W(e,t,{blocked:n,upgrade:r,blocking:s,terminated:o}={}){const i=indexedDB.open(e,t),l=v(i);return r&&i.addEventListener("upgradeneeded",d=>{r(v(i.result),d.oldVersion,d.newVersion,v(i.transaction),d)}),n&&i.addEventListener("blocked",d=>n(d.oldVersion,d.newVersion,d)),l.then(d=>{o&&d.addEventListener("close",()=>o()),s&&d.addEventListener("versionchange",u=>s(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}function Y(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),v(n).then(()=>{})}const Vn=["get","getKey","getAll","getAllKeys","count"],$n=["put","add","delete","clear"],Q=new Map;function Ve(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Q.get(t))return Q.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,s=$n.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Vn.includes(n)))return;const o=async function(i,...l){const d=this.transaction(i,s?"readwrite":"readonly");let u=d.store;return r&&(u=u.index(l.shift())),(await Promise.all([u[n](...l),s&&d.done]))[0]};return Q.set(t,o),o}Rn(e=>({...e,get:(t,n,r)=>Ve(t,n)||e.get(t,n,r),has:(t,n)=>!!Ve(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Pn(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Pn(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const ce="@firebase/app",$e="0.9.28";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const T=new xn("@firebase/app"),Un="@firebase/app-compat",Kn="@firebase/analytics-compat",Wn="@firebase/analytics",zn="@firebase/app-check-compat",qn="@firebase/app-check",Zn="@firebase/auth",Gn="@firebase/auth-compat",Jn="@firebase/database",Yn="@firebase/database-compat",Qn="@firebase/functions",Xn="@firebase/functions-compat",er="@firebase/installations",tr="@firebase/installations-compat",nr="@firebase/messaging",rr="@firebase/messaging-compat",sr="@firebase/performance",or="@firebase/performance-compat",ir="@firebase/remote-config",ar="@firebase/remote-config-compat",cr="@firebase/storage",lr="@firebase/storage-compat",dr="@firebase/firestore",ur="@firebase/firestore-compat",hr="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const le="[DEFAULT]",fr={[ce]:"fire-core",[Un]:"fire-core-compat",[Wn]:"fire-analytics",[Kn]:"fire-analytics-compat",[qn]:"fire-app-check",[zn]:"fire-app-check-compat",[Zn]:"fire-auth",[Gn]:"fire-auth-compat",[Jn]:"fire-rtdb",[Yn]:"fire-rtdb-compat",[Qn]:"fire-fn",[Xn]:"fire-fn-compat",[er]:"fire-iid",[tr]:"fire-iid-compat",[nr]:"fire-fcm",[rr]:"fire-fcm-compat",[sr]:"fire-perf",[or]:"fire-perf-compat",[ir]:"fire-rc",[ar]:"fire-rc-compat",[cr]:"fire-gcs",[lr]:"fire-gcs-compat",[dr]:"fire-fst",[ur]:"fire-fst-compat","fire-js":"fire-js",[hr]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F=new Map,de=new Map;function pr(e,t){try{e.container.addComponent(t)}catch(n){T.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function k(e){const t=e.name;if(de.has(t))return T.debug(`There were multiple attempts to register component ${t}.`),!1;de.set(t,e);for(const n of F.values())pr(n,e);return!0}function fe(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gr={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},I=new U("app","Firebase",gr);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(t,n,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new E("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw I.create("app-deleted",{appName:this._name})}}function it(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r=Object.assign({name:le,automaticDataCollectionEnabled:!1},t),s=r.name;if(typeof s!="string"||!s)throw I.create("bad-app-name",{appName:String(s)});if(n||(n=tt()),!n)throw I.create("no-options");const o=F.get(s);if(o){if(oe(n,o.options)&&oe(r,o.config))return o;throw I.create("duplicate-app",{appName:s})}const i=new Sn(s);for(const d of de.values())i.addComponent(d);const l=new mr(n,r,i);return F.set(s,l),l}function Cr(e=le){const t=F.get(e);if(!t&&e===le&&tt())return it();if(!t)throw I.create("no-app",{appName:e});return t}function _(e,t,n){var r;let s=(r=fr[e])!==null&&r!==void 0?r:e;n&&(s+=`-${n}`);const o=s.match(/\s|\//),i=t.match(/\s|\//);if(o||i){const l=[`Unable to register library "${s}" with version "${t}":`];o&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&i&&l.push("and"),i&&l.push(`version name "${t}" contains illegal characters (whitespace or "/")`),T.warn(l.join(" "));return}k(new E(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const br="firebase-heartbeat-database",wr=1,B="firebase-heartbeat-store";let X=null;function at(){return X||(X=W(br,wr,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(B)}catch(n){console.warn(n)}}}}).catch(e=>{throw I.create("idb-open",{originalErrorMessage:e.message})})),X}async function yr(e){try{const n=(await at()).transaction(B),r=await n.objectStore(B).get(ct(e));return await n.done,r}catch(t){if(t instanceof H)T.warn(t.message);else{const n=I.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});T.warn(n.message)}}}async function Fe(e,t){try{const r=(await at()).transaction(B,"readwrite");await r.objectStore(B).put(t,ct(e)),await r.done}catch(n){if(n instanceof H)T.warn(n.message);else{const r=I.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});T.warn(r.message)}}}function ct(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vr=1024,Ir=30*24*60*60*1e3;class _r{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Sr(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Pe();if(!(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(i=>i.date===o)))return this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(i=>{const l=new Date(i.date).valueOf();return Date.now()-l<=Ir}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var t;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Pe(),{heartbeatsToSend:r,unsentEntries:s}=Er(this._heartbeatsCache.heartbeats),o=et(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}}function Pe(){return new Date().toISOString().substring(0,10)}function Er(e,t=vr){const n=[];let r=e.slice();for(const s of e){const o=n.find(i=>i.agent===s.agent);if(o){if(o.dates.push(s.date),Ue(n)>t){o.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Ue(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Sr{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return nt()?rt().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await yr(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Fe(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const s=await this.read();return Fe(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function Ue(e){return et(JSON.stringify({version:2,heartbeats:e})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dr(e){k(new E("platform-logger",t=>new Fn(t),"PRIVATE")),k(new E("heartbeat",t=>new _r(t),"PRIVATE")),_(ce,$e,e),_(ce,$e,"esm2017"),_("fire-js","")}Dr("");var Ar="firebase",Tr="10.8.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_(Ar,Tr,"app");const lt="@firebase/installations",pe="0.6.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dt=1e4,ut=`w:${pe}`,ht="FIS_v2",kr="https://firebaseinstallations.googleapis.com/v1",xr=60*60*1e3,Nr="installations",Mr="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Or={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},x=new U(Nr,Mr,Or);function ft(e){return e instanceof H&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt({projectId:e}){return`${kr}/projects/${e}/installations`}function gt(e){return{token:e.token,requestStatus:2,expiresIn:Hr(e.expiresIn),creationTime:Date.now()}}async function mt(e,t){const r=(await t.json()).error;return x.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Ct({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function jr(e,{refreshToken:t}){const n=Ct(e);return n.append("Authorization",Rr(t)),n}async function bt(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Hr(e){return Number(e.replace("s","000"))}function Rr(e){return`${ht} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Br({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=pt(e),s=Ct(e),o=t.getImmediate({optional:!0});if(o){const u=await o.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const i={fid:n,authVersion:ht,appId:e.appId,sdkVersion:ut},l={method:"POST",headers:s,body:JSON.stringify(i)},d=await bt(()=>fetch(r,l));if(d.ok){const u=await d.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:gt(u.authToken)}}else throw await mt("Create Installation",d)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lr(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vr=/^[cdef][\w-]{21}$/,ue="";function $r(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Fr(e);return Vr.test(n)?n:ue}catch{return ue}}function Fr(e){return Lr(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt=new Map;function vt(e,t){const n=z(e);It(n,t),Pr(n,t)}function It(e,t){const n=yt.get(e);if(n)for(const r of n)r(t)}function Pr(e,t){const n=Ur();n&&n.postMessage({key:e,fid:t}),Kr()}let A=null;function Ur(){return!A&&"BroadcastChannel"in self&&(A=new BroadcastChannel("[Firebase] FID Change"),A.onmessage=e=>{It(e.data.key,e.data.fid)}),A}function Kr(){yt.size===0&&A&&(A.close(),A=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wr="firebase-installations-database",zr=1,N="firebase-installations-store";let ee=null;function ge(){return ee||(ee=W(Wr,zr,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(N)}}})),ee}async function P(e,t){const n=z(e),s=(await ge()).transaction(N,"readwrite"),o=s.objectStore(N),i=await o.get(n);return await o.put(t,n),await s.done,(!i||i.fid!==t.fid)&&vt(e,t.fid),t}async function _t(e){const t=z(e),r=(await ge()).transaction(N,"readwrite");await r.objectStore(N).delete(t),await r.done}async function q(e,t){const n=z(e),s=(await ge()).transaction(N,"readwrite"),o=s.objectStore(N),i=await o.get(n),l=t(i);return l===void 0?await o.delete(n):await o.put(l,n),await s.done,l&&(!i||i.fid!==l.fid)&&vt(e,l.fid),l}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function me(e){let t;const n=await q(e.appConfig,r=>{const s=qr(r),o=Zr(e,s);return t=o.registrationPromise,o.installationEntry});return n.fid===ue?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function qr(e){const t=e||{fid:$r(),registrationStatus:0};return Et(t)}function Zr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(x.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=Gr(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Jr(e)}:{installationEntry:t}}async function Gr(e,t){try{const n=await Br(e,t);return P(e.appConfig,n)}catch(n){throw ft(n)&&n.customData.serverCode===409?await _t(e.appConfig):await P(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Jr(e){let t=await Ke(e.appConfig);for(;t.registrationStatus===1;)await wt(100),t=await Ke(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await me(e);return r||n}return t}function Ke(e){return q(e,t=>{if(!t)throw x.create("installation-not-found");return Et(t)})}function Et(e){return Yr(e)?{fid:e.fid,registrationStatus:0}:e}function Yr(e){return e.registrationStatus===1&&e.registrationTime+dt<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qr({appConfig:e,heartbeatServiceProvider:t},n){const r=Xr(e,n),s=jr(e,n),o=t.getImmediate({optional:!0});if(o){const u=await o.getHeartbeatsHeader();u&&s.append("x-firebase-client",u)}const i={installation:{sdkVersion:ut,appId:e.appId}},l={method:"POST",headers:s,body:JSON.stringify(i)},d=await bt(()=>fetch(r,l));if(d.ok){const u=await d.json();return gt(u)}else throw await mt("Generate Auth Token",d)}function Xr(e,{fid:t}){return`${pt(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ce(e,t=!1){let n;const r=await q(e.appConfig,o=>{if(!St(o))throw x.create("not-registered");const i=o.authToken;if(!t&&ns(i))return o;if(i.requestStatus===1)return n=es(e,t),o;{if(!navigator.onLine)throw x.create("app-offline");const l=ss(o);return n=ts(e,l),l}});return n?await n:r.authToken}async function es(e,t){let n=await We(e.appConfig);for(;n.authToken.requestStatus===1;)await wt(100),n=await We(e.appConfig);const r=n.authToken;return r.requestStatus===0?Ce(e,t):r}function We(e){return q(e,t=>{if(!St(t))throw x.create("not-registered");const n=t.authToken;return os(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}async function ts(e,t){try{const n=await Qr(e,t),r=Object.assign(Object.assign({},t),{authToken:n});return await P(e.appConfig,r),n}catch(n){if(ft(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await _t(e.appConfig);else{const r=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await P(e.appConfig,r)}throw n}}function St(e){return e!==void 0&&e.registrationStatus===2}function ns(e){return e.requestStatus===2&&!rs(e)}function rs(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+xr}function ss(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function os(e){return e.requestStatus===1&&e.requestTime+dt<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function is(e){const t=e,{installationEntry:n,registrationPromise:r}=await me(t);return r?r.catch(console.error):Ce(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function as(e,t=!1){const n=e;return await cs(n),(await Ce(n,t)).token}async function cs(e){const{registrationPromise:t}=await me(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ls(e){if(!e||!e.options)throw te("App Configuration");if(!e.name)throw te("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw te(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function te(e){return x.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt="installations",ds="installations-internal",us=e=>{const t=e.getProvider("app").getImmediate(),n=ls(t),r=fe(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},hs=e=>{const t=e.getProvider("app").getImmediate(),n=fe(t,Dt).getImmediate();return{getId:()=>is(n),getToken:s=>as(n,s)}};function fs(){k(new E(Dt,us,"PUBLIC")),k(new E(ds,hs,"PRIVATE"))}fs();_(lt,pe);_(lt,pe,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ps="/firebase-messaging-sw.js",gs="/firebase-cloud-messaging-push-scope",At="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",ms="https://fcmregistrations.googleapis.com/v1",Tt="google.c.a.c_id",Cs="google.c.a.c_l",bs="google.c.a.ts",ws="google.c.a.e";var ze;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(ze||(ze={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var L;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"})(L||(L={}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function ys(e){const t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),s=new Uint8Array(r.length);for(let o=0;o<r.length;++o)s[o]=r.charCodeAt(o);return s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ne="fcm_token_details_db",vs=5,qe="fcm_token_object_Store";async function Is(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(o=>o.name).includes(ne))return null;let t=null;return(await W(ne,vs,{upgrade:async(r,s,o,i)=>{var l;if(s<2||!r.objectStoreNames.contains(qe))return;const d=i.objectStore(qe),u=await d.index("fcmSenderId").get(e);if(await d.clear(),!!u){if(s===2){const h=u;if(!h.auth||!h.p256dh||!h.endpoint)return;t={token:h.fcmToken,createTime:(l=h.createTime)!==null&&l!==void 0?l:Date.now(),subscriptionOptions:{auth:h.auth,p256dh:h.p256dh,endpoint:h.endpoint,swScope:h.swScope,vapidKey:typeof h.vapidKey=="string"?h.vapidKey:y(h.vapidKey)}}}else if(s===3){const h=u;t={token:h.fcmToken,createTime:h.createTime,subscriptionOptions:{auth:y(h.auth),p256dh:y(h.p256dh),endpoint:h.endpoint,swScope:h.swScope,vapidKey:y(h.vapidKey)}}}else if(s===4){const h=u;t={token:h.fcmToken,createTime:h.createTime,subscriptionOptions:{auth:y(h.auth),p256dh:y(h.p256dh),endpoint:h.endpoint,swScope:h.swScope,vapidKey:y(h.vapidKey)}}}}}})).close(),await Y(ne),await Y("fcm_vapid_details_db"),await Y("undefined"),_s(t)?t:null}function _s(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es="firebase-messaging-database",Ss=1,M="firebase-messaging-store";let re=null;function be(){return re||(re=W(Es,Ss,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(M)}}})),re}async function kt(e){const t=ye(e),r=await(await be()).transaction(M).objectStore(M).get(t);if(r)return r;{const s=await Is(e.appConfig.senderId);if(s)return await we(e,s),s}}async function we(e,t){const n=ye(e),s=(await be()).transaction(M,"readwrite");return await s.objectStore(M).put(t,n),await s.done,t}async function Ds(e){const t=ye(e),r=(await be()).transaction(M,"readwrite");await r.objectStore(M).delete(t),await r.done}function ye({appConfig:e}){return e.appId}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const As={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},m=new U("messaging","Messaging",As);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ts(e,t){const n=await Ie(e),r=Nt(t),s={method:"POST",headers:n,body:JSON.stringify(r)};let o;try{o=await(await fetch(ve(e.appConfig),s)).json()}catch(i){throw m.create("token-subscribe-failed",{errorInfo:i==null?void 0:i.toString()})}if(o.error){const i=o.error.message;throw m.create("token-subscribe-failed",{errorInfo:i})}if(!o.token)throw m.create("token-subscribe-no-token");return o.token}async function ks(e,t){const n=await Ie(e),r=Nt(t.subscriptionOptions),s={method:"PATCH",headers:n,body:JSON.stringify(r)};let o;try{o=await(await fetch(`${ve(e.appConfig)}/${t.token}`,s)).json()}catch(i){throw m.create("token-update-failed",{errorInfo:i==null?void 0:i.toString()})}if(o.error){const i=o.error.message;throw m.create("token-update-failed",{errorInfo:i})}if(!o.token)throw m.create("token-update-no-token");return o.token}async function xt(e,t){const r={method:"DELETE",headers:await Ie(e)};try{const o=await(await fetch(`${ve(e.appConfig)}/${t}`,r)).json();if(o.error){const i=o.error.message;throw m.create("token-unsubscribe-failed",{errorInfo:i})}}catch(s){throw m.create("token-unsubscribe-failed",{errorInfo:s==null?void 0:s.toString()})}}function ve({projectId:e}){return`${ms}/projects/${e}/registrations`}async function Ie({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function Nt({p256dh:e,auth:t,endpoint:n,vapidKey:r}){const s={web:{endpoint:n,auth:t,p256dh:e}};return r!==At&&(s.web.applicationPubKey=r),s}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs=7*24*60*60*1e3;async function Ns(e){const t=await Os(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:y(t.getKey("auth")),p256dh:y(t.getKey("p256dh"))},r=await kt(e.firebaseDependencies);if(r){if(js(r.subscriptionOptions,n))return Date.now()>=r.createTime+xs?Ms(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await xt(e.firebaseDependencies,r.token)}catch(s){console.warn(s)}return Ze(e.firebaseDependencies,n)}else return Ze(e.firebaseDependencies,n)}async function Mt(e){const t=await kt(e.firebaseDependencies);t&&(await xt(e.firebaseDependencies,t.token),await Ds(e.firebaseDependencies));const n=await e.swRegistration.pushManager.getSubscription();return n?n.unsubscribe():!0}async function Ms(e,t){try{const n=await ks(e.firebaseDependencies,t),r=Object.assign(Object.assign({},t),{token:n,createTime:Date.now()});return await we(e.firebaseDependencies,r),n}catch(n){throw await Mt(e),n}}async function Ze(e,t){const r={token:await Ts(e,t),createTime:Date.now(),subscriptionOptions:t};return await we(e,r),r.token}async function Os(e,t){const n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:ys(t)})}function js(e,t){const n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,s=t.auth===e.auth,o=t.p256dh===e.p256dh;return n&&r&&s&&o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return Hs(t,e),Rs(t,e),Bs(t,e),t}function Hs(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const r=t.notification.body;r&&(e.notification.body=r);const s=t.notification.image;s&&(e.notification.image=s);const o=t.notification.icon;o&&(e.notification.icon=o)}function Rs(e,t){t.data&&(e.data=t.data)}function Bs(e,t){var n,r,s,o,i;if(!t.fcmOptions&&!(!((n=t.notification)===null||n===void 0)&&n.click_action))return;e.fcmOptions={};const l=(s=(r=t.fcmOptions)===null||r===void 0?void 0:r.link)!==null&&s!==void 0?s:(o=t.notification)===null||o===void 0?void 0:o.click_action;l&&(e.fcmOptions.link=l);const d=(i=t.fcmOptions)===null||i===void 0?void 0:i.analytics_label;d&&(e.fcmOptions.analyticsLabel=d)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ls(e){return typeof e=="object"&&!!e&&Tt in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ot("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o");Ot("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");function Ot(e,t){const n=[];for(let r=0;r<e.length;r++)n.push(e.charAt(r)),r<t.length&&n.push(t.charAt(r));return n.join("")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vs(e){if(!e||!e.options)throw se("App Configuration Object");if(!e.name)throw se("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const r of t)if(!n[r])throw se(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function se(e){return m.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(t,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const s=Vs(t);this.firebaseDependencies={app:t,appConfig:s,installations:n,analyticsProvider:r}}_delete(){return Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jt(e){try{e.swRegistration=await navigator.serviceWorker.register(ps,{scope:gs}),e.swRegistration.update().catch(()=>{})}catch(t){throw m.create("failed-service-worker-registration",{browserErrorMessage:t==null?void 0:t.message})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fs(e,t){if(!t&&!e.swRegistration&&await jt(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw m.create("invalid-sw-registration");e.swRegistration=t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ps(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=At)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ht(e,t){if(!navigator)throw m.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw m.create("permission-blocked");return await Ps(e,t==null?void 0:t.vapidKey),await Fs(e,t==null?void 0:t.serviceWorkerRegistration),Ns(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Us(e,t,n){const r=Ks(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[Tt],message_name:n[Cs],message_time:n[bs],message_device_time:Math.floor(Date.now()/1e3)})}function Ks(e){switch(e){case L.NOTIFICATION_CLICKED:return"notification_open";case L.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ws(e,t){const n=t.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===L.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Ge(n)):e.onMessageHandler.next(Ge(n)));const r=n.data;Ls(r)&&r[ws]==="1"&&await Us(e,n.messageType,r)}const Je="@firebase/messaging",Ye="0.12.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zs=e=>{const t=new $s(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>Ws(t,n)),t},qs=e=>{const t=e.getProvider("messaging").getImmediate();return{getToken:r=>Ht(t,r)}};function Zs(){k(new E("messaging",zs,"PUBLIC")),k(new E("messaging-internal",qs,"PRIVATE")),_(Je,Ye),_(Je,Ye,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gs(){try{await rt()}catch{return!1}return typeof window<"u"&&nt()&&bn()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Js(e){if(!navigator)throw m.create("only-available-in-window");return e.swRegistration||await jt(e),Mt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ys(e,t){if(!navigator)throw m.create("only-available-in-window");return e.onMessageHandler=t,()=>{e.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qs(e=Cr()){return Gs().then(t=>{if(!t)throw m.create("unsupported-browser")},t=>{throw m.create("indexed-db-unsupported")}),fe(K(e),"messaging").getImmediate()}async function Xs(e,t){return e=K(e),Ht(e,t)}function eo(e){return e=K(e),Js(e)}function to(e,t){return e=K(e),Ys(e,t)}Zs();const no=async e=>{await Vt.put("/api/v1/protected/auth/device-token",{deviceToken:e})},ro="AIzaSyC0Qdo6PpJtOrsxW7R0m-iVR9YLsNDGYYk",so="osplabs-966c1.firebaseapp.com",oo="osplabs-966c1",io="osplabs-966c1.appspot.com",ao="161090588704",co="1:161090588704:web:1ec09c72f7f37d0115ac45",lo={apiKey:ro,authDomain:so,projectId:oo,storageBucket:io,messagingSenderId:ao,appId:co},uo=it(lo),_e=Qs(uo),ho=async()=>{try{if(await Notification.requestPermission()==="granted"){const t=await Xs(_e,{vapidKey:$t});t&&await no(t)}}catch(e){console.error("An error occurred while retrieving token.",e)}},fo=async()=>{try{await eo(_e)}catch(e){console.error("An error occurred while cleaning up firebase ",e)}},po=e=>to(_e,t=>{e==null||e(t)}),go=({title:e,link:t})=>{const n=async()=>{try{const r=t,s=document.createElement("a");s.href=r,s.target="_blank",s.download="test.xlsx",s.click(),URL.revokeObjectURL(r)}catch(r){console.error(r)}};return a.jsxs(a.Fragment,{children:[a.jsx("p",{children:e}),a.jsx("span",{onClick:n,children:"Click here to download"})]})},mo=({color:e})=>a.jsx("svg",{width:"24",height:"23",viewBox:"0 0 24 23",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("path",{d:"M1.7002 19.0001C1.48353 19.0001 1.30436 18.9293 1.1627 18.7876C1.02103 18.6459 0.950195 18.4668 0.950195 18.2501V16.6501C0.950195 16.0668 1.1002 15.5376 1.4002 15.0626C1.7002 14.5876 2.11686 14.2334 2.6502 14.0001C3.86686 13.4668 4.9627 13.0834 5.9377 12.8501C6.9127 12.6168 7.91686 12.5001 8.9502 12.5001C9.98353 12.5001 10.9835 12.6168 11.9502 12.8501C12.9169 13.0834 14.0085 13.4668 15.2252 14.0001C15.7585 14.2334 16.1794 14.5876 16.4877 15.0626C16.796 15.5376 16.9502 16.0668 16.9502 16.6501V18.2501C16.9502 18.4668 16.8794 18.6459 16.7377 18.7876C16.596 18.9293 16.4169 19.0001 16.2002 19.0001H1.7002ZM17.9002 19.0001C18.0669 18.9668 18.2002 18.8793 18.3002 18.7376C18.4002 18.5959 18.4502 18.4168 18.4502 18.2001V16.6501C18.4502 15.6001 18.1835 14.7376 17.6502 14.0626C17.1169 13.3876 16.4169 12.8418 15.5502 12.4251C16.7002 12.5584 17.7835 12.7543 18.8002 13.0126C19.8169 13.2709 20.6419 13.5668 21.2752 13.9001C21.8252 14.2168 22.2585 14.6084 22.5752 15.0751C22.8919 15.5418 23.0502 16.0668 23.0502 16.6501V18.2501C23.0502 18.4668 22.9794 18.6459 22.8377 18.7876C22.696 18.9293 22.5169 19.0001 22.3002 19.0001H17.9002ZM8.9502 10.9751C7.8502 10.9751 6.9502 10.6251 6.2502 9.9251C5.5502 9.2251 5.2002 8.3251 5.2002 7.2251C5.2002 6.1251 5.5502 5.2251 6.2502 4.5251C6.9502 3.8251 7.8502 3.4751 8.9502 3.4751C10.0502 3.4751 10.9502 3.8251 11.6502 4.5251C12.3502 5.2251 12.7002 6.1251 12.7002 7.2251C12.7002 8.3251 12.3502 9.2251 11.6502 9.9251C10.9502 10.6251 10.0502 10.9751 8.9502 10.9751ZM17.9502 7.2251C17.9502 8.3251 17.6002 9.2251 16.9002 9.9251C16.2002 10.6251 15.3002 10.9751 14.2002 10.9751C14.0169 10.9751 13.8127 10.9626 13.5877 10.9376C13.3627 10.9126 13.1585 10.8668 12.9752 10.8001C13.3752 10.3834 13.6794 9.87093 13.8877 9.2626C14.096 8.65426 14.2002 7.9751 14.2002 7.2251C14.2002 6.4751 14.096 5.8126 13.8877 5.2376C13.6794 4.6626 13.3752 4.13343 12.9752 3.6501C13.1585 3.6001 13.3627 3.55843 13.5877 3.5251C13.8127 3.49176 14.0169 3.4751 14.2002 3.4751C15.3002 3.4751 16.2002 3.8251 16.9002 4.5251C17.6002 5.2251 17.9502 6.1251 17.9502 7.2251ZM2.4502 17.5001H15.4502V16.6501C15.4502 16.3834 15.371 16.1251 15.2127 15.8751C15.0544 15.6251 14.8585 15.4501 14.6252 15.3501C13.4252 14.8168 12.4169 14.4584 11.6002 14.2751C10.7835 14.0918 9.9002 14.0001 8.9502 14.0001C8.0002 14.0001 7.1127 14.0918 6.2877 14.2751C5.4627 14.4584 4.4502 14.8168 3.2502 15.3501C3.01686 15.4501 2.8252 15.6251 2.6752 15.8751C2.5252 16.1251 2.4502 16.3834 2.4502 16.6501V17.5001ZM8.9502 9.4751C9.6002 9.4751 10.1377 9.2626 10.5627 8.8376C10.9877 8.4126 11.2002 7.8751 11.2002 7.2251C11.2002 6.5751 10.9877 6.0376 10.5627 5.6126C10.1377 5.1876 9.6002 4.9751 8.9502 4.9751C8.3002 4.9751 7.7627 5.1876 7.3377 5.6126C6.9127 6.0376 6.7002 6.5751 6.7002 7.2251C6.7002 7.8751 6.9127 8.4126 7.3377 8.8376C7.7627 9.2626 8.3002 9.4751 8.9502 9.4751Z",fill:e||"#7F47DD"})}),Co=({color:e})=>a.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[a.jsx("g",{id:"grid_view_black_24dp (1) 1",clipPath:"url(#clip0_2260_484)",children:a.jsx("g",{id:"Group",children:a.jsx("path",{id:"Vector","fill-rule":"evenodd","clip-rule":"evenodd",d:"M4 3C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H4ZM9 8C9 8.55228 8.55228 9 8 9H6C5.44772 9 5 8.55228 5 8V6C5 5.44772 5.44772 5 6 5H8C8.55228 5 9 5.44772 9 6V8ZM4 13C3.44772 13 3 13.4477 3 14V20C3 20.5523 3.44772 21 4 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H4ZM9 18C9 18.5523 8.55228 19 8 19H6C5.44772 19 5 18.5523 5 18V16C5 15.4477 5.44772 15 6 15H8C8.55228 15 9 15.4477 9 16V18ZM14 3C13.4477 3 13 3.44772 13 4V10C13 10.5523 13.4477 11 14 11H20C20.5523 11 21 10.5523 21 10V4C21 3.44772 20.5523 3 20 3H14ZM19 8C19 8.55228 18.5523 9 18 9H16C15.4477 9 15 8.55228 15 8V6C15 5.44772 15.4477 5 16 5H18C18.5523 5 19 5.44772 19 6V8ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H14ZM19 18C19 18.5523 18.5523 19 18 19H16C15.4477 19 15 18.5523 15 18V16C15 15.4477 15.4477 15 16 15H18C18.5523 15 19 15.4477 19 16V18Z",fill:e||"#7F47DD"})})}),a.jsx("defs",{children:a.jsx("clipPath",{id:"clip0_2260_484",children:a.jsx("rect",{width:"24",height:"24",fill:"white"})})})]}),bo=({color:e})=>a.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("g",{id:"medical_information_FILL0_wght400_GRAD0_opsz48 1",children:a.jsx("path",{id:"Vector",d:"M7.25 15.75V17.25C7.25 17.4625 7.32229 17.6406 7.46687 17.7844C7.61147 17.9281 7.79064 18 8.00437 18C8.21812 18 8.39583 17.9281 8.5375 17.7844C8.67917 17.6406 8.75 17.4625 8.75 17.25V15.75H10.25C10.4625 15.75 10.6406 15.6777 10.7844 15.5331C10.9281 15.3885 11 15.2094 11 14.9956C11 14.7819 10.9281 14.6042 10.7844 14.4625C10.6406 14.3208 10.4625 14.25 10.25 14.25H8.75V12.75C8.75 12.5375 8.67771 12.3594 8.53313 12.2156C8.38853 12.0719 8.20936 12 7.99563 12C7.78188 12 7.60417 12.0719 7.4625 12.2156C7.32083 12.3594 7.25 12.5375 7.25 12.75V14.25H5.75C5.5375 14.25 5.35938 14.3223 5.21563 14.4669C5.07188 14.6115 5 14.7906 5 15.0044C5 15.2181 5.07188 15.3958 5.21563 15.5375C5.35938 15.6792 5.5375 15.75 5.75 15.75H7.25ZM13.5 14.25H18.5C18.6333 14.25 18.75 14.2 18.85 14.1C18.95 14 19 13.8833 19 13.75C19 13.6167 18.95 13.5 18.85 13.4C18.75 13.3 18.6333 13.25 18.5 13.25H13.5C13.3667 13.25 13.25 13.3 13.15 13.4C13.05 13.5 13 13.6167 13 13.75C13 13.8833 13.05 14 13.15 14.1C13.25 14.2 13.3667 14.25 13.5 14.25ZM13.5 17.25H16.5C16.6333 17.25 16.75 17.2 16.85 17.1C16.95 17 17 16.8833 17 16.75C17 16.6167 16.95 16.5 16.85 16.4C16.75 16.3 16.6333 16.25 16.5 16.25H13.5C13.3667 16.25 13.25 16.3 13.15 16.4C13.05 16.5 13 16.6167 13 16.75C13 16.8833 13.05 17 13.15 17.1C13.25 17.2 13.3667 17.25 13.5 17.25ZM3.5 22C3.1 22 2.75 21.85 2.45 21.55C2.15 21.25 2 20.9 2 20.5V8.5C2 8.1 2.15 7.75 2.45 7.45C2.75 7.15 3.1 7 3.5 7H9.75V3.5C9.75 3.1 9.9 2.75 10.2 2.45C10.5 2.15 10.8534 2 11.2603 2H12.7397C13.1466 2 13.5 2.15 13.8 2.45C14.1 2.75 14.25 3.1 14.25 3.5V7H20.5C20.9 7 21.25 7.15 21.55 7.45C21.85 7.75 22 8.1 22 8.5V20.5C22 20.9 21.85 21.25 21.55 21.55C21.25 21.85 20.9 22 20.5 22H3.5ZM3.5 20.5H20.5V8.5H14.25V9.25C14.25 9.71667 14.1 10.0833 13.8 10.35C13.5 10.6167 13.1466 10.75 12.7397 10.75H11.2603C10.8534 10.75 10.5 10.6167 10.2 10.35C9.9 10.0833 9.75 9.71667 9.75 9.25V8.5H3.5V20.5ZM11.25 9.25H12.75V3.5H11.25V9.25Z",fill:e||"#7F47DD"})})}),wo=({color:e})=>a.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("g",{id:"list_alt_FILL0_wght400_GRAD0_opsz48 1",children:a.jsx("path",{id:"Vector",d:"M7.5 16.85C7.7 16.85 7.875 16.775 8.025 16.625C8.175 16.475 8.25 16.3 8.25 16.1C8.25 15.9 8.175 15.725 8.025 15.575C7.875 15.425 7.7 15.35 7.5 15.35C7.3 15.35 7.125 15.425 6.975 15.575C6.825 15.725 6.75 15.9 6.75 16.1C6.75 16.3 6.825 16.475 6.975 16.625C7.125 16.775 7.3 16.85 7.5 16.85ZM7.5 12.75C7.7 12.75 7.875 12.675 8.025 12.525C8.175 12.375 8.25 12.2 8.25 12C8.25 11.8 8.175 11.625 8.025 11.475C7.875 11.325 7.7 11.25 7.5 11.25C7.3 11.25 7.125 11.325 6.975 11.475C6.825 11.625 6.75 11.8 6.75 12C6.75 12.2 6.825 12.375 6.975 12.525C7.125 12.675 7.3 12.75 7.5 12.75ZM7.5 8.65C7.7 8.65 7.875 8.575 8.025 8.425C8.175 8.275 8.25 8.1 8.25 7.9C8.25 7.7 8.175 7.525 8.025 7.375C7.875 7.225 7.7 7.15 7.5 7.15C7.3 7.15 7.125 7.225 6.975 7.375C6.825 7.525 6.75 7.7 6.75 7.9C6.75 8.1 6.825 8.275 6.975 8.425C7.125 8.575 7.3 8.65 7.5 8.65ZM11.55 16.85H16.15C16.3625 16.85 16.5406 16.7777 16.6844 16.6331C16.8281 16.4885 16.9 16.3094 16.9 16.0956C16.9 15.8819 16.8281 15.7042 16.6844 15.5625C16.5406 15.4208 16.3625 15.35 16.15 15.35H11.55C11.3375 15.35 11.1594 15.4223 11.0156 15.5669C10.8719 15.7115 10.8 15.8906 10.8 16.1044C10.8 16.3181 10.8719 16.4958 11.0156 16.6375C11.1594 16.7792 11.3375 16.85 11.55 16.85ZM11.55 12.75H16.15C16.3625 12.75 16.5406 12.6777 16.6844 12.5331C16.8281 12.3885 16.9 12.2094 16.9 11.9956C16.9 11.7819 16.8281 11.6042 16.6844 11.4625C16.5406 11.3208 16.3625 11.25 16.15 11.25H11.55C11.3375 11.25 11.1594 11.3223 11.0156 11.4669C10.8719 11.6115 10.8 11.7906 10.8 12.0044C10.8 12.2181 10.8719 12.3958 11.0156 12.5375C11.1594 12.6792 11.3375 12.75 11.55 12.75ZM11.55 8.65H16.15C16.3625 8.65 16.5406 8.57771 16.6844 8.43313C16.8281 8.28853 16.9 8.10936 16.9 7.89563C16.9 7.68188 16.8281 7.50417 16.6844 7.3625C16.5406 7.22083 16.3625 7.15 16.15 7.15H11.55C11.3375 7.15 11.1594 7.22229 11.0156 7.36687C10.8719 7.51147 10.8 7.69064 10.8 7.90437C10.8 8.11812 10.8719 8.29583 11.0156 8.4375C11.1594 8.57917 11.3375 8.65 11.55 8.65ZM4.5 21C4.1 21 3.75 20.85 3.45 20.55C3.15 20.25 3 19.9 3 19.5V4.5C3 4.1 3.15 3.75 3.45 3.45C3.75 3.15 4.1 3 4.5 3H19.5C19.9 3 20.25 3.15 20.55 3.45C20.85 3.75 21 4.1 21 4.5V19.5C21 19.9 20.85 20.25 20.55 20.55C20.25 20.85 19.9 21 19.5 21H4.5ZM4.5 19.5H19.5V4.5H4.5V19.5Z",fill:e||"#7F47DD"})})}),yo=({color:e})=>a.jsx("svg",{width:"28",height:"28",viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("g",{id:"person_FILL0_wght400_GRAD0_opsz48 (2) 1",children:a.jsx("path",{id:"Vector",d:"M13.9998 13.9707C12.7165 13.9707 11.6665 13.5624 10.8498 12.7457C10.0332 11.929 9.62484 10.879 9.62484 9.5957C9.62484 8.31237 10.0332 7.26237 10.8498 6.4457C11.6665 5.62904 12.7165 5.2207 13.9998 5.2207C15.2832 5.2207 16.3332 5.62904 17.1498 6.4457C17.9665 7.26237 18.3748 8.31237 18.3748 9.5957C18.3748 10.879 17.9665 11.929 17.1498 12.7457C16.3332 13.5624 15.2832 13.9707 13.9998 13.9707ZM21.5832 23.3332H6.4165C5.93525 23.3332 5.52327 23.1618 5.18057 22.8191C4.83786 22.4764 4.6665 22.0645 4.6665 21.5832V20.5915C4.6665 19.8526 4.85123 19.2207 5.22067 18.6957C5.59011 18.1707 6.0665 17.7721 6.64984 17.4999C7.95261 16.9165 9.20192 16.479 10.3978 16.1874C11.5936 15.8957 12.7943 15.7499 13.9998 15.7499C15.2054 15.7499 16.4012 15.9006 17.5873 16.202C18.7734 16.5033 20.0171 16.9379 21.3184 17.5055C21.927 17.7802 22.415 18.1785 22.7822 18.7004C23.1495 19.2223 23.3332 19.8526 23.3332 20.5915V21.5832C23.3332 22.0645 23.1618 22.4764 22.8191 22.8191C22.4764 23.1618 22.0644 23.3332 21.5832 23.3332ZM6.4165 21.5832H21.5832V20.5915C21.5832 20.2804 21.4908 19.9839 21.3061 19.702C21.1214 19.42 20.8929 19.211 20.6207 19.0749C19.3762 18.4721 18.2387 18.0589 17.2082 17.8353C16.1776 17.6117 15.1082 17.4999 13.9998 17.4999C12.8915 17.4999 11.8123 17.6117 10.7623 17.8353C9.71234 18.0589 8.57484 18.4721 7.34984 19.0749C7.07761 19.211 6.854 19.42 6.679 19.702C6.504 19.9839 6.4165 20.2804 6.4165 20.5915V21.5832ZM13.9998 12.2207C14.7582 12.2207 15.3853 11.9728 15.8811 11.477C16.3769 10.9811 16.6248 10.354 16.6248 9.5957C16.6248 8.83737 16.3769 8.21029 15.8811 7.71445C15.3853 7.21862 14.7582 6.9707 13.9998 6.9707C13.2415 6.9707 12.6144 7.21862 12.1186 7.71445C11.6228 8.21029 11.3748 8.83737 11.3748 9.5957C11.3748 10.354 11.6228 10.9811 12.1186 11.477C12.6144 11.9728 13.2415 12.2207 13.9998 12.2207Z",fill:e||"#7F47DD"})})}),vo=({color:e})=>a.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("g",{id:"article_FILL0_wght500_GRAD0_opsz48 1",children:a.jsx("path",{id:"Vector",d:"M7.70494 16.9953H13.0799C13.2885 16.9953 13.4656 16.923 13.6113 16.7784C13.7571 16.6338 13.8299 16.4546 13.8299 16.2409C13.8299 16.0311 13.7571 15.8544 13.6113 15.7108C13.4656 15.5671 13.2885 15.4953 13.0799 15.4953H7.70494C7.49244 15.4953 7.31431 15.5686 7.17056 15.7152C7.02681 15.8617 6.95494 16.0409 6.95494 16.2527C6.95494 16.4644 7.02681 16.6411 7.17056 16.7828C7.31431 16.9244 7.49244 16.9953 7.70494 16.9953ZM7.70494 12.7502H16.3011C16.5096 12.7502 16.6868 12.6779 16.8325 12.5333C16.9782 12.3887 17.0511 12.2095 17.0511 11.9958C17.0511 11.7821 16.9782 11.6043 16.8325 11.4627C16.6868 11.321 16.5096 11.2502 16.3011 11.2502H7.70494C7.49244 11.2502 7.31431 11.3225 7.17056 11.4671C7.02681 11.6117 6.95494 11.7908 6.95494 12.0046C6.95494 12.2183 7.02681 12.396 7.17056 12.5377C7.31431 12.6793 7.49244 12.7502 7.70494 12.7502ZM7.70691 8.4991H16.3011C16.5096 8.4991 16.6868 8.4268 16.8325 8.2822C16.9782 8.13762 17.0511 7.95845 17.0511 7.7447C17.0511 7.53495 16.9782 7.35824 16.8325 7.21458C16.6868 7.07093 16.5096 6.9991 16.3011 6.9991H7.70691C7.49386 6.9991 7.31527 7.07239 7.17114 7.21898C7.027 7.36556 6.95494 7.54473 6.95494 7.75648C6.95494 7.96823 7.027 8.14493 7.17114 8.2866C7.31527 8.42827 7.49386 8.4991 7.70691 8.4991ZM4.55384 21.1496C4.09385 21.1496 3.69498 20.9808 3.35721 20.643C3.01946 20.3052 2.85059 19.9064 2.85059 19.4464V4.55398C2.85059 4.09236 3.01946 3.69209 3.35721 3.35315C3.69498 3.0142 4.09385 2.84473 4.55384 2.84473H19.4462C19.9079 2.84473 20.3081 3.0142 20.6471 3.35315C20.986 3.69209 21.1555 4.09236 21.1555 4.55398V19.4464C21.1555 19.9064 20.986 20.3052 20.6471 20.643C20.3081 20.9808 19.9079 21.1496 19.4462 21.1496H4.55384ZM4.55384 19.4464H19.4462V4.55398H4.55384V19.4464Z",fill:e||"#7F47DD"})})}),Io=({color:e})=>a.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:a.jsx("g",{id:"fact_check_FILL0_wght400_GRAD0_opsz24 (1) 1",children:a.jsx("path",{id:"Vector",d:"M4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V5C2 4.45 2.19583 3.97917 2.5875 3.5875C2.97917 3.19583 3.45 3 4 3H20C20.55 3 21.0208 3.19583 21.4125 3.5875C21.8042 3.97917 22 4.45 22 5V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4ZM4 19H20V5H4V19ZM9 17C9.28333 17 9.52083 16.9042 9.7125 16.7125C9.90417 16.5208 10 16.2833 10 16C10 15.7167 9.90417 15.4792 9.7125 15.2875C9.52083 15.0958 9.28333 15 9 15H6C5.71667 15 5.47917 15.0958 5.2875 15.2875C5.09583 15.4792 5 15.7167 5 16C5 16.2833 5.09583 16.5208 5.2875 16.7125C5.47917 16.9042 5.71667 17 6 17H9ZM14.55 12.175L13.825 11.45C13.625 11.25 13.3917 11.1542 13.125 11.1625C12.8583 11.1708 12.625 11.275 12.425 11.475C12.2417 11.675 12.1458 11.9083 12.1375 12.175C12.1292 12.4417 12.225 12.675 12.425 12.875L13.85 14.3C14.05 14.5 14.2833 14.6 14.55 14.6C14.8167 14.6 15.05 14.5 15.25 14.3L18.8 10.75C19 10.55 19.1 10.3167 19.1 10.05C19.1 9.78333 19 9.55 18.8 9.35C18.6 9.15 18.3625 9.05 18.0875 9.05C17.8125 9.05 17.575 9.15 17.375 9.35L14.55 12.175ZM9 13C9.28333 13 9.52083 12.9042 9.7125 12.7125C9.90417 12.5208 10 12.2833 10 12C10 11.7167 9.90417 11.4792 9.7125 11.2875C9.52083 11.0958 9.28333 11 9 11H6C5.71667 11 5.47917 11.0958 5.2875 11.2875C5.09583 11.4792 5 11.7167 5 12C5 12.2833 5.09583 12.5208 5.2875 12.7125C5.47917 12.9042 5.71667 13 6 13H9ZM9 9C9.28333 9 9.52083 8.90417 9.7125 8.7125C9.90417 8.52083 10 8.28333 10 8C10 7.71667 9.90417 7.47917 9.7125 7.2875C9.52083 7.09583 9.28333 7 9 7H6C5.71667 7 5.47917 7.09583 5.2875 7.2875C5.09583 7.47917 5 7.71667 5 8C5 8.28333 5.09583 8.52083 5.2875 8.7125C5.47917 8.90417 5.71667 9 6 9H9Z",fill:e||"#7F47DD"})})}),_o=()=>{var Ae,Te,ke,xe;const[,e]=g.useState(!1),[t,n]=g.useState([]),[r,s]=g.useState(null),o=Ft(),i=Pt(),l=g.useRef(!1),{activeMenu:d,setActiveMenu:u}=g.useContext(Ut),[h,b]=g.useState("#FFFFFF"),{selectedMenu:O,setSelectedMenu:j}=g.useContext(tn),w=Kt().pathname,Ee=()=>e(c=>!c);g.useEffect(()=>{Xt().then(c=>{s(c),i(Wt(`${c==null?void 0:c.firstName} ${c==null?void 0:c.lastName}`)),i(zt(c==null?void 0:c.email))}).catch(c=>{console.error(c)})},[]);const Se=async c=>new Promise(p=>{var C,S;Yt(a.jsx(go,{title:((C=c.data)==null?void 0:C.title)??"",link:((S=c.data)==null?void 0:S.link)??""}),{position:"bottom-right",closeOnClick:!0,autoClose:!1,pauseOnHover:!0,theme:"light",onClose:()=>p()})});g.useEffect(()=>{l.current||(ho(),l.current=!0);const c=po(p=>{Se(p)});return()=>{c==null||c(),l.current||fo()}},[]),g.useEffect(()=>{u(d)},[d]);const V=[{text:"Manage Users",module:"users",path:"/users"},{text:"Facilities",module:"facilities",path:"/facility"},{text:"Jobs",module:"jobs",path:"/jobs"},{text:"Job Templates",module:"job-templates",path:""},{text:"Professionals",module:"professionals",path:"/professionals"},{text:"Role Management",module:"roles",path:"/roles"},{text:"Documents Master",module:"documentmaster",path:"/document-master"}],R=g.useMemo(()=>V.filter(c=>qt(c.module,null,["GET"])),[]),Rt=()=>R[0],De=async()=>{var c,p;try{await en(),He("success","User Logged out successfully"),l.current=!1,o("/login")}catch(C){console.error(C),He("error",(p=(c=C==null?void 0:C.response)==null?void 0:c.data)==null?void 0:p.message)}};g.useEffect(()=>{const c=new BroadcastChannel("notificationChannel"),p=C=>{const S=C==null?void 0:C.data;(S==null?void 0:S.action)==="notification"&&document.visibilityState==="hidden"&&n([S.payload])};return c==null||c.addEventListener("message",p),()=>{c==null||c.removeEventListener("message",p)}},[]),g.useEffect(()=>{(()=>{if(t.length>0){const p=t[0];Se(p)}})()},[t]),g.useEffect(()=>{if(R.length>0&&O===!0||w==="/"){const c=Rt();u(d||(c==null?void 0:c.text));const C={Workspace:"/","Manage Users":"/users",Facilities:"/facility",Jobs:"/jobs",Professionals:"/professionals","Role Management":"/roles","Documents Master":"/document-master"}[(c==null?void 0:c.text)||""];C&&(o(C),b((c==null?void 0:c.text)||"")),j(!1)}else if(R.length>0&&w==="/login"){const c=V.find(p=>p.path===w);c&&(b(c==null?void 0:c.text),u(c==null?void 0:c.text))}else if(w.startsWith("/view"))b("Jobs"),u("Jobs");else if(R.length>0&&w.split("/",2).join("/")){const c=V.find(p=>p.path===w.split("/",2).join("/"));c&&(b((c==null?void 0:c.text)??"Jobs"),u((c==null?void 0:c.text)??"Jobs"))}else{const c=V.find(p=>p.path===w);c&&(b(c==null?void 0:c.text),u(c==null?void 0:c.text))}},[]);const Bt={workspace:Co,users:mo,facilities:bo,jobs:wo,professionals:yo,roles:Io,documentmaster:vo},Lt=c=>{u(c),b(c)};return a.jsxs("nav",{className:"navbar-menu",children:[a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"main-logo-round",children:a.jsx("img",{src:sn,alt:"logo"})}),a.jsx("div",{className:"sidebar-dropdown small-screen-dropdown sidebar-dropdown-section",children:a.jsx(Ne,{toggle:Ee,children:a.jsxs(Me,{className:"me-2",direction:"end",children:[a.jsx(Oe,{caret:!0,size:"md",children:a.jsxs("span",{className:"name-logo",children:[(Ae=r==null?void 0:r.firstName)==null?void 0:Ae.charAt(0).toUpperCase(),(Te=r==null?void 0:r.lastName)==null?void 0:Te.charAt(0).toUpperCase()]})}),a.jsxs(je,{children:[a.jsx(Z,{to:"/profile",className:"forgot-pass-btn",children:a.jsx($,{children:"My Profile"})}),a.jsx($,{onClick:De,children:"Logout"})]})]})})})]}),a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"main-logo",children:a.jsx("img",{src:Zt,alt:"logo"})}),a.jsx("div",{className:"sidebar-dropdown sidebar-dropdown-section",children:a.jsx(Ne,{toggle:Ee,children:a.jsxs(Me,{className:"me-2",direction:"down",children:[a.jsxs(Oe,{caret:!0,size:"md",children:[a.jsxs("span",{className:"name-logo",children:[(ke=r==null?void 0:r.firstName)==null?void 0:ke.charAt(0).toUpperCase(),(xe=r==null?void 0:r.lastName)==null?void 0:xe.charAt(0).toUpperCase()]}),a.jsxs("span",{className:"full-name",title:`${r!=null&&r.firstName?r.firstName.charAt(0).toUpperCase()+r.firstName.slice(1):""} ${r!=null&&r.lastName?r.lastName.charAt(0).toUpperCase()+r.lastName.slice(1):""}`,children:[r!=null&&r.firstName?r.firstName.charAt(0).toUpperCase()+r.firstName.slice(1):"","  ",r!=null&&r.lastName?r.lastName.charAt(0).toUpperCase()+r.lastName.slice(1):""]}),a.jsx("img",{src:Gt,alt:"down-arrow"})]}),a.jsxs(je,{children:[a.jsx(Z,{to:"/profile",className:"forgot-pass-btn",children:a.jsxs($,{children:[a.jsx("img",{src:on,className:"dropdown-icon"}),"My Profile"]})}),a.jsxs($,{onClick:De,children:[a.jsx("img",{src:an,className:"dropdown-icon"}),"Logout"]})]})]})})})]}),a.jsx("ul",{className:"navbar__list",children:R.map((c,p)=>{const C=Bt[c.module];return a.jsx("li",{className:`navbar__li-box ${c.text===d?"active-sidebar":""}`,children:a.jsxs(Z,{onClick:()=>{Jt(),Lt(c.text)},to:c.path,className:"navbar__li-link",children:[a.jsx(C,{color:c.text===h?"#FFFFFF":"#7F47DD"}),a.jsxs("span",{className:"navbar__li",children:[c.text," "]})]})},p)})})]})},Ao=()=>a.jsxs(a.Fragment,{children:[a.jsx(rn,{}),a.jsx(_o,{}),a.jsx("main",{id:"layout-container",children:a.jsx("div",{className:"layout-content",children:a.jsx(Qt,{})})})]});export{Ao as default};
