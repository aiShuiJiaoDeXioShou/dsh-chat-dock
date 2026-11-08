/* dsh-chat-dock v0.1.0 */
window.__ModuleLoader__.load({
  id: "dsh-chat-dock",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
var Ft=Object.create;var $=Object.defineProperty;var Dt=Object.getOwnPropertyDescriptor;var Bt=Object.getOwnPropertyNames;var Ht=Object.getPrototypeOf,Vt=Object.prototype.hasOwnProperty;var Ut=(t,e)=>{for(var n in e)$(t,n,{get:e[n],enumerable:!0})},Fe=(t,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of Bt(e))!Vt.call(t,o)&&o!==n&&$(t,o,{get:()=>e[o],enumerable:!(s=Dt(e,o))||s.enumerable});return t};var K=(t,e,n)=>(n=t!=null?Ft(Ht(t)):{},Fe(e||!t||!t.__esModule?$(n,"default",{value:t,enumerable:!0}):n,t)),Wt=t=>Fe($({},"__esModule",{value:!0}),t);var cn={};Ut(cn,{apply:()=>dn,inject:()=>rn});module.exports=Wt(cn);var J=K(require("react"),1);var f=K(require("react"),1);function De(t){let e="";if(typeof t=="string")e=t;else if(t!==null&&typeof t=="object"){let n=t;typeof n.text=="string"&&(e=n.text)}return e===""?"":(e=e.replace(/\u200b/gu,"").replace(/\r\n/gu,`
`).replace(/\r/gu,`
`).replace(/\n{4,}/gu,`


`).trim(),e.length>2e5&&(e=e.slice(0,2e5)),e)}function Be(t,e=1200){let n=t.trim();return n.length<=e?n:`${n.slice(0,e).trimEnd()}\u2026`}function He(t){let e=t.replace(/\r\n/gu,`
`).replace(/[ \t]+$/gmu,"").trimEnd();return e===""?"":`${e}
`}function Ve(t){let e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Y(t,e,n){return Math.min(Math.max(t,e),Math.max(e,n))}function me(t){return{width:Number.isFinite(t.width)&&t.width>0?t.width:1024,height:Number.isFinite(t.height)&&t.height>0?t.height:768}}function Z(t){let e=me(t),n=Math.min(360,Math.max(300,e.width-32)),s=Math.min(520,Math.max(360,e.height-32));return V({x:e.width-n-16,y:e.height-s-16,width:n,height:s},e)}function V(t,e){let n=me(e),s=Math.max(240,n.width-32),o=Math.max(240,n.height-32),i=Math.min(Math.max(t.width,300),s),u=Math.min(Math.max(t.height,360),o);return{x:Y(t.x,16,n.width-i-16),y:Y(t.y,16,n.height-u-16),width:i,height:u}}function Ue(t){if(t===null||typeof t!="object")return!1;let e=t;return typeof e.x=="number"&&Number.isFinite(e.x)&&typeof e.y=="number"&&Number.isFinite(e.y)&&typeof e.width=="number"&&Number.isFinite(e.width)&&e.width>0&&typeof e.height=="number"&&Number.isFinite(e.height)&&e.height>0}function q(t,e){return{bounds:V(t.bounds,e),collapsed:t.collapsed,hidden:t.hidden}}function We(t,e){let n=me(e);return{x:Y(t.x,16,n.width-44-16),y:Y(t.y,16,n.height-44-16),width:44,height:44}}var jt="https://chat.deepseek.com/",Jt="https://chatgpt.com/",Xt="https://claude.ai/";function I(t){return`(${t.toString()})()`}function $t(){function t(s){let o=s;if(typeof o.checkVisibility=="function")try{if(!o.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0}))return!1}catch{}let i=s.getBoundingClientRect();return i.width>0&&i.height>0}let e=[];for(let s of[".ds-markdown",'[class*="ds-markdown"]','[class*="markdown"]'])for(let o of Array.from(document.querySelectorAll(s)))t(o)&&e.push(o);if(e.length>0){let s=e.filter(u=>!e.some(h=>h!==u&&h.contains(u))),o=s[s.length-1]??e[e.length-1],i=o.innerText??o.textContent??"";if(i.trim())return i}let n=typeof window.getSelection=="function"?String(window.getSelection()??""):"";return n.trim()?n:""}function Kt(){function t(o){let i=o.getBoundingClientRect();return i.width>0&&i.height>0}let e=Array.from(document.querySelectorAll('[data-message-author-role="assistant"]')).filter(t),n=e[e.length-1];if(n!==void 0){let o=n.querySelector('.markdown, [class*="markdown"]')??n,i=o.innerText??o.textContent;if(typeof i=="string"&&i.trim())return i}let s=typeof window.getSelection=="function"?String(window.getSelection()??""):"";return s.trim()?s:""}function Yt(){function t(o){let i=o.getBoundingClientRect();return i.width>0&&i.height>0}let e=Array.from(document.querySelectorAll('.font-claude-message, [data-testid="chat-message"], [data-testid*="message"]')).filter(t),n=e[e.length-1];if(n!==void 0){let o=n.innerText??n.textContent;if(typeof o=="string"&&o.trim())return o}let s=typeof window.getSelection=="function"?String(window.getSelection()??""):"";return s.trim()?s:""}function Q(){let t=typeof window.getSelection=="function"?String(window.getSelection()??""):"";if(t.trim())return t;let e=document.body;if(e===null)return"";let n=e.innerText??"";return n.trim()?n.slice(-12e3):""}var ee=[{id:"deepseek",label:{en:"DeepSeek Chat",zh:"DeepSeek Chat"},url:jt,hosts:["chat.deepseek.com"],extraction:{latestReply:I($t),conversation:I(Q)},enabledByDefault:!0},{id:"chatgpt",label:{en:"ChatGPT",zh:"ChatGPT"},url:Jt,hosts:["chatgpt.com","chat.openai.com"],loginHint:{en:"Sign in to ChatGPT in the Browser tab first. Some accounts or regions may block embedded browsers.",zh:"\u8BF7\u5148\u5728 Browser \u6807\u7B7E\u91CC\u767B\u5F55 ChatGPT\uFF1B\u90E8\u5206\u8D26\u53F7\u6216\u5730\u533A\u53EF\u80FD\u963B\u6B62\u5185\u5D4C\u6D4F\u89C8\u5668\u3002"},extraction:{latestReply:I(Kt),conversation:I(Q)},enabledByDefault:!1,experimental:!0},{id:"claude",label:{en:"Claude",zh:"Claude"},url:Xt,hosts:["claude.ai"],loginHint:{en:"Sign in to Claude in the Browser tab first. Some accounts or regions may block embedded browsers.",zh:"\u8BF7\u5148\u5728 Browser \u6807\u7B7E\u91CC\u767B\u5F55 Claude\uFF1B\u90E8\u5206\u8D26\u53F7\u6216\u5730\u533A\u53EF\u80FD\u963B\u6B62\u5185\u5D4C\u6D4F\u89C8\u5668\u3002"},extraction:{latestReply:I(Yt),conversation:I(Q)},enabledByDefault:!1,experimental:!0}],je=I(Q);function te(t){let e=t.trim().toLowerCase();return e?(e.replace(/^[a-z][a-z0-9+.-]*:\/\//u,"").split("/")[0]?.split("?")[0]?.split("#")[0]??"").replace(/:\d+$/u,"").replace(/^\.+/u,""):""}function ne(t){try{return new URL(t).hostname.toLowerCase()}catch{return}}function U(t){try{let e=new URL(t);return e.protocol==="http:"||e.protocol==="https:"}catch{return!1}}function Je(t,e){let n=ne(t);return n===void 0?!1:e.some(s=>{let o=te(s);return o!==""&&(n===o||n.endsWith(`.${o}`))})}function Zt(t,e){return t.find(n=>n.id===e)}function be(t,e){return e.toLowerCase().startsWith("zh")?t.zh:t.en}function qt(t){let e=t.id.trim(),n=t.label.trim();if(!e||!n||!U(t.url))return;let s=Array.isArray(t.hosts)&&t.hosts.length>0?t.hosts.map(te).filter(Boolean):[ne(t.url)??""].filter(Boolean);if(s.length!==0)return{id:`custom:${e}`,label:{en:n,zh:n},url:t.url,hosts:s,extraction:{latestReply:t.latestReply?.trim()?t.latestReply:je,conversation:je},enabledByDefault:t.enabled!==!1}}function oe(t){let e=[],n=new Set;for(let o of ee){let i=t.overrides[o.id];if(!(i?.enabled??o.enabledByDefault))continue;let h=i?.url!==void 0&&U(i.url)?i.url:o.url;e.push({...o,url:h,extraction:{...o.extraction,...i?.latestReply?.trim()?{latestReply:i.latestReply}:{}}}),n.add(o.id)}let s=new Set(ee.map(o=>o.id));for(let o of t.customSites){if(s.has(o.id.trim()))continue;let i=qt(o);i===void 0||n.has(i.id)||(e.push(i),n.add(i.id))}return e}function z(t,e){return Zt(t,e)??t[0]}var ke="dsh-chat-dock.v1.settings",ve="dsh-chat-dock.v1.console",Xe=1,xe=1500,Se=6e4,ye=20;function P(){return{version:Xe,defaultSite:"deepseek",openMode:"docked",mirror:!0,intervalMs:2500,overrides:{},customSites:[]}}function W(t){if(!(t===null||typeof t!="object"||Array.isArray(t)))return t}function Qt(t){let e=W(t);if(e===void 0)return;let n={};return typeof e.enabled=="boolean"&&(n.enabled=e.enabled),typeof e.url=="string"&&U(e.url)&&(n.url=e.url),typeof e.latestReply=="string"&&e.latestReply.trim()!==""&&(n.latestReply=e.latestReply),n}function $e(t){let e=W(t);if(e===void 0)return;let n=typeof e.id=="string"?e.id.trim():"",s=typeof e.label=="string"?e.label.trim():"",o=typeof e.url=="string"?e.url.trim():"";if(!n||n.length>48||!s||s.length>64||!U(o))return;let i=Array.isArray(e.hosts)&&e.hosts.length>0?e.hosts.filter(h=>typeof h=="string").map(te).filter(Boolean):[],u=typeof e.latestReply=="string"&&e.latestReply.trim()!==""?e.latestReply:void 0;return{id:n,label:s,url:o,...i.length>0?{hosts:i}:{},...u!==void 0?{latestReply:u}:{},enabled:e.enabled!==!1}}function se(t){let e=P(),n=W(t);if(n===void 0)return e;let s=typeof n.defaultSite=="string"&&n.defaultSite.trim()!==""?n.defaultSite:e.defaultSite,o=n.openMode==="float"?"float":"docked",i=typeof n.mirror=="boolean"?n.mirror:e.mirror,u=typeof n.intervalMs=="number"&&Number.isFinite(n.intervalMs)?n.intervalMs:e.intervalMs,h=Math.min(Math.max(Math.round(u),xe),Se),v={},d=W(n.overrides);if(d!==void 0)for(let[C,x]of Object.entries(d)){let m=Qt(x);m!==void 0&&(v[C]=m)}let w=[];if(Array.isArray(n.customSites))for(let C of n.customSites.slice(0,ye)){let x=$e(C);x!==void 0&&w.push(x)}return{version:Xe,defaultSite:s,openMode:o,mirror:i,intervalMs:h,overrides:v,customSites:w}}function re(t){if(t===void 0)return P();try{let e=t.getItem(ke);return e===null||e===""?P():se(JSON.parse(e))}catch{return P()}}function Ke(t,e){if(t!==void 0)try{t.setItem(ke,JSON.stringify(se(e)))}catch{}}function Ye(t,e){let n={bounds:Z(e),collapsed:!1,hidden:!1};if(t===void 0)return n;try{let s=t.getItem(ve);if(s===null||s==="")return n;let o=W(JSON.parse(s));if(o===void 0)return n;let i=Ue(o.bounds)?o.bounds:n.bounds;return q({bounds:i,collapsed:o.collapsed===!0,hidden:o.hidden===!0},e)}catch{return n}}function F(t,e){if(t!==void 0)try{t.setItem(ve,JSON.stringify(e))}catch{}}function Ze(t){if(t!==void 0)try{t.removeItem(ke),t.removeItem(ve)}catch{}}function qe(t){let e=t.trim();if(e==="")return{sites:[]};let n;try{n=JSON.parse(e)}catch{return{sites:[],error:"Invalid JSON."}}if(!Array.isArray(n))return{sites:[],error:"Expected a JSON array."};if(n.length>ye)return{sites:[],error:`At most ${ye} custom sites are allowed.`};let s=[],o=new Set;for(let[i,u]of n.entries()){let h=$e(u);if(h===void 0)return{sites:[],error:`Entry ${i+1} needs an id, a label and an http(s) url.`};if(o.has(h.id))return{sites:[],error:`Duplicate site id "${h.id}".`};if(h.hosts===void 0&&ne(h.url)===void 0)return{sites:[],error:`Entry ${i+1} has an invalid url.`};o.add(h.id),s.push(h)}return{sites:s}}function en(t=document){try{let e=t.querySelectorAll("webview[data-sidebar-browser-frame]");return Array.from(e)}catch{return[]}}function Qe(t){try{let e=t.getURL?.();return typeof e=="string"?e:""}catch{return""}}function tn(t){try{let e=t.getTitle?.();return typeof e=="string"?e:""}catch{return""}}function we(t){try{if(t.isConnected===!1)return!1;let e=t.getBoundingClientRect();return e.width>4&&e.height>4}catch{return!1}}function nn(t,e=document){return en(e).filter(n=>Je(Qe(n),t.hosts))}function Ce(t,e=document){let n=nn(t,e);return n.find(we)??n[0]}function on(t){return t instanceof Error?t.message:String(t)}function sn(t,e){return new Promise((n,s)=>{let o=setTimeout(()=>s(new Error(`timed out after ${e}ms`)),e);t.then(i=>{clearTimeout(o),n(i)},i=>{clearTimeout(o),s(i)})})}async function et(t,e={}){let n=e.timeoutMs??4e3,s=e.root??document,o=Ce(t,s);if(o===void 0)return{ok:!1,reason:"no-page"};if(typeof o.executeJavaScript!="function")return{ok:!1,reason:"error",error:"webview cannot execute JavaScript"};let i;try{i=await sn(Promise.resolve(o.executeJavaScript(t.extraction.latestReply)),n)}catch(h){let v=on(h);return{ok:!1,reason:/timed out/u.test(v)?"timeout":"error",error:v}}let u=De(i);return u===""?{ok:!1,reason:"empty"}:{ok:!0,text:u,url:Qe(o),title:tn(o)}}var ie;function nt(t){return ie=t,()=>{ie===t&&(ie=void 0)}}function tt(t){try{return t.captureInsertion?.()}catch{return}}function ot(t){let e=ie;if(e===void 0||typeof e.actions.insertText!="function")return"unavailable";let n=He(t);if(n==="")return"unavailable";let s=tt(e.actions);for(let o=0;o<2;o+=1){try{if(e.actions.insertText(n,s)===!0)return"inserted"}catch{}s=tt(e.actions)}return"unavailable"}async function Re(t){if(t==="")return!1;try{if(navigator.clipboard!==void 0&&typeof navigator.clipboard.writeText=="function")return await navigator.clipboard.writeText(t),!0}catch{}try{let e=document.createElement("textarea");e.value=t,e.setAttribute("readonly","readonly"),e.style.position="fixed",e.style.top="-1000px",e.style.left="-1000px",e.style.opacity="0",document.body.appendChild(e),e.select();let n=document.execCommand("copy");return e.remove(),n}catch{return!1}}var ae=new Set,M={subscribe(t){return ae.add(t),()=>{ae.delete(t)}},toggle(){for(let t of[...ae])t({type:"toggle"})},show(t){for(let e of[...ae])e({type:"show",notice:t})}};function de(t){try{let e=t.get("sidebarRight");return e!==null&&typeof e=="object"?e:void 0}catch{return}}function st(t){try{let e=t.active?.();return e!=null&&typeof e.id=="string"?e.id:void 0}catch{return}}function rt(t,e){if(typeof t.float!="function")return!1;let n=Ce(e);if(n===void 0||!we(n))return!1;let s=st(t);if(s===void 0)return!1;try{return t.float(s),!0}catch{return!1}}function it(t,e,n=0){n>=4||setTimeout(()=>{rt(t,e)||it(t,e,n+1)},180+n*220)}function ce(t,e,n){if(t===void 0||typeof t.openTab!="function")return{ok:!1,floated:!1,reason:"unavailable"};try{t.openTab("browser",{params:{url:e.url}})}catch(o){return{ok:!1,floated:!1,reason:"error",error:o instanceof Error?o.message:String(o)}}if(n!=="float")return{ok:!0,floated:!1};let s=rt(t,e);return s||it(t,e),{ok:!0,floated:s}}function at(t){if(t===void 0||typeof t.float!="function")return!1;let e=st(t);if(e===void 0)return!1;try{return t.float(e),!0}catch{return!1}}function dt(t,e){if(t===void 0||typeof t.openTab!="function"||!e)return!1;try{return t.openTab(e),!0}catch{return!1}}var g=require("react/jsx-runtime");function O(t,e){return{width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,focusable:!1,className:e}}function D({size:t=16,className:e}){return(0,g.jsxs)("svg",{...O(t,e),children:[(0,g.jsx)("path",{d:"M4 5.5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"}),(0,g.jsx)("path",{d:"M8 11h.01M12 11h.01M16 11h.01",strokeWidth:2.4})]})}function ct({size:t=16,className:e}){return(0,g.jsxs)("svg",{...O(t,e),children:[(0,g.jsx)("circle",{cx:"12",cy:"12",r:"3"}),(0,g.jsx)("path",{d:"M12 2.8v2M12 19.2v2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M2.8 12h2M19.2 12h2M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5"})]})}function lt({size:t=16,className:e}){return(0,g.jsxs)("svg",{...O(t,e),children:[(0,g.jsx)("rect",{x:"8",y:"8",width:"11",height:"11",rx:"2"}),(0,g.jsx)("path",{d:"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"})]})}function ut({size:t=16,className:e}){return(0,g.jsxs)("svg",{...O(t,e),children:[(0,g.jsx)("path",{d:"M12 3v10"}),(0,g.jsx)("path",{d:"m8 9 4 4 4-4"}),(0,g.jsx)("path",{d:"M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"})]})}function pt({size:t=16,className:e}){return(0,g.jsx)("svg",{...O(t,e),children:(0,g.jsx)("path",{d:"m6 6 12 12M18 6 6 18"})})}function ht({size:t=16,className:e}){return(0,g.jsx)("svg",{...O(t,e),children:(0,g.jsx)("path",{d:"M5 12h14"})})}function ft({size:t=16,className:e}){return(0,g.jsxs)("svg",{...O(t,e),children:[(0,g.jsx)("path",{d:"M20 12a8 8 0 1 1-2.34-5.66"}),(0,g.jsx)("path",{d:"M20 4v6h-6"})]})}var _=K(require("react"),1);var l=require("react/jsx-runtime");function gt(t){let{t:e,settings:n,enabledSites:s,onChange:o,onReset:i,onClose:u}=t,[h,v]=_.useState(()=>JSON.stringify(n.customSites,null,2)),[d,w]=_.useState(void 0),[C,x]=_.useState(()=>String(n.intervalMs)),m=JSON.stringify(n.customSites);_.useEffect(()=>{v(JSON.stringify(n.customSites,null,2))},[m]),_.useEffect(()=>{x(String(n.intervalMs))},[n.intervalMs]);let N=c=>n.overrides[c.id]?.enabled??c.enabledByDefault,E=(c,R)=>{o({...n,overrides:{...n.overrides,[c.id]:{...n.overrides[c.id],enabled:R}}})},T=s.some(c=>c.id===n.defaultSite)?n.defaultSite:s[0]?.id??"",b=()=>{let c=Number(C);if(!Number.isFinite(c)){x(String(n.intervalMs));return}let R=Math.min(Math.max(Math.round(c),xe),Se);x(String(R)),R!==n.intervalMs&&o({...n,intervalMs:R})},A=()=>{let c=qe(h);if(c.error!==void 0){w(c.error);return}w(void 0),o({...n,customSites:c.sites})};return(0,l.jsxs)("div",{className:"dsh-chat-dock-settings",children:[(0,l.jsxs)("div",{className:"dsh-chat-dock-settings-actions",style:{paddingTop:0,borderTop:"none"},children:[(0,l.jsx)("strong",{style:{fontSize:12},children:e("settings.title")}),(0,l.jsx)("button",{className:"dsh-chat-dock-btn",onClick:u,children:e("settings.close")})]}),(0,l.jsxs)("div",{className:"dsh-chat-dock-field",children:[(0,l.jsx)("label",{htmlFor:"dsh-chat-dock-default-site",children:e("settings.defaultSite")}),(0,l.jsx)("select",{id:"dsh-chat-dock-default-site",className:"dsh-chat-dock-select",value:T,disabled:s.length===0,onChange:c=>o({...n,defaultSite:c.target.value}),children:s.map(c=>(0,l.jsx)("option",{value:c.id,children:c.label.en},c.id))}),s.length===0?(0,l.jsx)("span",{className:"dsh-chat-dock-hint",children:e("settings.needSite")}):null]}),(0,l.jsxs)("div",{className:"dsh-chat-dock-field",children:[(0,l.jsx)("label",{htmlFor:"dsh-chat-dock-open-mode",children:e("settings.openMode")}),(0,l.jsxs)("select",{id:"dsh-chat-dock-open-mode",className:"dsh-chat-dock-select",value:n.openMode,onChange:c=>o({...n,openMode:c.target.value==="float"?"float":"docked"}),children:[(0,l.jsx)("option",{value:"docked",children:e("settings.modeDocked")}),(0,l.jsx)("option",{value:"float",children:e("settings.modeFloat")})]})]}),(0,l.jsxs)("label",{className:"dsh-chat-dock-check",children:[(0,l.jsx)("input",{type:"checkbox",checked:n.mirror,onChange:c=>o({...n,mirror:c.target.checked})}),e("settings.mirror")]}),(0,l.jsxs)("div",{className:"dsh-chat-dock-field",children:[(0,l.jsxs)("label",{htmlFor:"dsh-chat-dock-interval",children:[e("settings.interval")," ",(0,l.jsx)("span",{className:"dsh-chat-dock-tag",children:e("settings.intervalHint")})]}),(0,l.jsx)("input",{id:"dsh-chat-dock-interval",className:"dsh-chat-dock-input",inputMode:"numeric",value:C,onChange:c=>x(c.target.value),onBlur:b,onKeyDown:c=>{c.key==="Enter"&&(c.preventDefault(),b())}})]}),(0,l.jsxs)("div",{className:"dsh-chat-dock-field",children:[(0,l.jsx)("span",{className:"dsh-chat-dock-field-label",children:e("settings.sites")}),(0,l.jsx)("div",{className:"dsh-chat-dock-sites",children:ee.map(c=>(0,l.jsxs)("label",{className:"dsh-chat-dock-site-row",children:[(0,l.jsx)("input",{type:"checkbox",checked:N(c),onChange:R=>E(c,R.target.checked)}),c.label.en,c.experimental===!0?(0,l.jsx)("span",{className:"dsh-chat-dock-tag",children:e("settings.experimental")}):null]},c.id))})]}),(0,l.jsxs)("div",{className:"dsh-chat-dock-field",children:[(0,l.jsx)("label",{htmlFor:"dsh-chat-dock-custom-sites",children:e("settings.custom")}),(0,l.jsx)("textarea",{id:"dsh-chat-dock-custom-sites",className:"dsh-chat-dock-textarea",value:h,spellCheck:!1,placeholder:'[{"id":"my-chat","label":"My Chat","url":"https://example.com/chat"}]',onChange:c=>v(c.target.value)}),(0,l.jsx)("span",{className:"dsh-chat-dock-hint",children:e("settings.customHint")}),d!==void 0?(0,l.jsx)("span",{className:"dsh-chat-dock-status","data-kind":"error",children:e("settings.invalid",{error:d})}):null,(0,l.jsx)("div",{className:"dsh-chat-dock-actions",style:{alignSelf:"flex-end",flex:"none"},children:(0,l.jsx)("button",{className:"dsh-chat-dock-btn",onClick:A,children:e("settings.apply")})})]}),(0,l.jsx)("div",{className:"dsh-chat-dock-settings-note",children:e("settings.loginNote")}),(0,l.jsxs)("div",{className:"dsh-chat-dock-settings-actions",children:[(0,l.jsx)("button",{className:"dsh-chat-dock-btn",onClick:i,children:e("settings.reset")}),(0,l.jsx)("button",{className:"dsh-chat-dock-btn",onClick:u,children:e("settings.close")})]}),(0,l.jsx)("div",{className:"dsh-chat-dock-about",children:e("settings.about")})]})}var a=require("react/jsx-runtime");function B(){return{width:window.innerWidth,height:window.innerHeight}}function mt(){try{return document.documentElement.lang||navigator.language||"en"}catch{return"en"}}function bt(t){return t.state==="missing"?"idle":t.state}function yt(t){let{t:e,services:n,storage:s}=t,[o,i]=f.useState(()=>re(s)),u=f.useMemo(()=>oe(o),[o]),[h,v]=f.useState(()=>z(u,o.defaultSite)?.id??""),d=f.useMemo(()=>z(u,h),[u,h]),w=f.useRef(d?.id),[C,x]=f.useState(()=>B()),[m,N]=f.useState(()=>Ye(s,B())),[E,T]=f.useState({state:"idle"}),[b,A]=f.useState(void 0),[c,R]=f.useState(!1),[Me,Te]=f.useState(void 0),[Le,le]=f.useState(!1),G=f.useRef(void 0),X=f.useRef(void 0),y=f.useCallback(r=>{Te(r),G.current!==void 0&&window.clearTimeout(G.current),G.current=window.setTimeout(()=>{Te(void 0),G.current=void 0},4500)},[]);f.useEffect(()=>()=>{G.current!==void 0&&window.clearTimeout(G.current)},[]);let Et=f.useCallback(r=>{let p=se(r);i(p),Ke(s,p)},[s]),ue=f.useCallback(r=>{N(r),F(s,r)},[s]);f.useEffect(()=>{let r=z(u,h);r!==void 0&&r.id!==h&&v(r.id)},[u,h]),f.useEffect(()=>{w.current=d?.id},[d?.id]),f.useEffect(()=>{A(void 0),T({state:"idle"})},[d?.id]),f.useEffect(()=>{let r=()=>x(B());return window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]),f.useEffect(()=>{N(r=>q(r,C))},[C]),f.useEffect(()=>M.subscribe(r=>{if(r.type==="toggle"){N(p=>{let S={...p,hidden:!p.hidden,collapsed:p.hidden?!1:p.collapsed};return F(s,S),S});return}N(p=>{let S={...p,hidden:!1,collapsed:!1};return F(s,S),S}),r.notice!==void 0&&y(r.notice)}),[y,s]),f.useEffect(()=>{let r=p=>{p.altKey&&p.shiftKey&&p.code==="KeyC"&&(p.preventDefault(),M.toggle())};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[]);let pe=f.useCallback(async()=>{if(d===void 0)return;let r=await et(d);return w.current!==d.id||(r.ok?(A({siteId:d.id,text:r.text,capturedAt:Date.now(),title:r.title!==""?r.title:void 0,url:r.url!==""?r.url:void 0}),T({state:"found"})):r.reason==="no-page"?(A(void 0),T({state:"missing"})):r.reason==="empty"?(A(void 0),T({state:"empty"})):T({state:"error",error:r.error??r.reason})),r},[d]);f.useEffect(()=>{if(m.hidden||m.collapsed||!o.mirror||d===void 0)return;let r=!1,p=!1,S=async()=>{if(!(r||p||document.hidden)){p=!0;try{await pe()}finally{p=!1}}};S();let ge=window.setInterval(()=>{S()},Math.max(1500,o.intervalMs)),H=()=>{document.hidden||S()};return document.addEventListener("visibilitychange",H),()=>{r=!0,window.clearInterval(ge),document.removeEventListener("visibilitychange",H)}},[m.hidden,m.collapsed,o.mirror,o.intervalMs,pe,d]);let he=()=>de(n),Ie=r=>{if(d===void 0){y({kind:"warn",text:e("status.noSite")});return}let p=ce(he(),d,r);if(!p.ok){y({kind:"error",text:p.reason==="unavailable"?e("status.noSidebar"):e("status.openFailed")});return}y({kind:"success",text:r==="float"&&!p.floated?e("status.floatManual"):e("status.opened")})},Mt=async()=>{if(b===void 0)return;let r=await Re(b.text);y({kind:r?"success":"error",text:e(r?"status.copied":"status.copyFailed")})},Tt=async()=>{if(b===void 0)return;if(ot(b.text)==="inserted"){y({kind:"success",text:e("status.inserted")});return}let p=await Re(b.text);y({kind:"warn",text:e(p?"status.insertUnavailable":"status.copyFailed")})},Lt=async()=>{if(d===void 0)return;R(!0);let r=await pe();R(!1),r!==void 0&&(r.ok?y({kind:"success",text:e("status.captureDone")}):r.reason==="empty"?y({kind:"warn",text:e("status.captureEmpty")}):y({kind:"error",text:e("status.captureFailed")}))},It=()=>{let r=at(he());y({kind:r?"success":"warn",text:e(r?"status.floatDone":"status.floatFailed")})},fe=r=>{let p=dt(he(),r);y({kind:p?"success":"error",text:e(p?"status.sideOpened":"status.sideFailed",{kind:e(`console.${r}`)})})},Ot=()=>{Ze(s);let r=P(),p={bounds:Z(B()),collapsed:!1,hidden:!1};i(r),N(p),F(s,p),le(!1),y({kind:"success",text:e("settings.saved")})},_t=()=>ue({...m,hidden:!1,collapsed:!1}),At=()=>ue({...m,collapsed:!0}),Gt=()=>ue({...m,hidden:!0}),Oe=(r,p)=>{if(r.button!==0||p==="drag"&&r.target.closest("button, input, select, textarea, a, label")!==null)return;r.preventDefault();let S=m.bounds,ge={mode:p,startX:r.clientX,startY:r.clientY,origin:{...S}};X.current=ge;let H=L=>{let k=X.current;if(k===void 0)return;let Ge=L.clientX-k.startX,ze=L.clientY-k.startY,Pe=k.mode==="drag"?V({...k.origin,x:k.origin.x+Ge,y:k.origin.y+ze},B()):V({...k.origin,width:k.origin.width+Ge,height:k.origin.height+ze},B());k.last=Pe,N(Pt=>({...Pt,bounds:Pe}))},Ae=()=>{window.removeEventListener("pointermove",H),window.removeEventListener("pointerup",Ae);let L=X.current;if(X.current=void 0,L===void 0||L.last===void 0)return;let k={...m,bounds:L.last};N(k),F(s,k)};window.addEventListener("pointermove",H),window.addEventListener("pointerup",Ae)};if(m.hidden)return null;let _e=d===void 0?"":be(d.label,mt()),zt=d===void 0?e("settings.needSite"):E.state==="missing"?e("mirror.missing",{site:_e}):E.state==="empty"?e("mirror.empty"):E.state==="error"?e("mirror.error",{error:E.error??"error"}):E.state==="idle"?e("mirror.idle"):b===void 0?e("mirror.waiting"):"";if(m.collapsed){let r=We(m.bounds,C);return(0,a.jsx)("div",{className:"dsh-chat-dock-root",children:(0,a.jsxs)("button",{type:"button",className:"dsh-chat-dock-pill",style:{left:r.x,top:r.y,width:r.width,height:r.height},onClick:_t,title:e("console.expand"),"aria-label":e("console.expand"),children:[(0,a.jsx)(D,{size:20}),(0,a.jsx)("span",{className:"dsh-chat-dock-pill-dot","data-state":bt(E)})]})})}return(0,a.jsx)("div",{className:"dsh-chat-dock-root",children:(0,a.jsxs)("div",{className:"dsh-chat-dock-panel",style:{left:m.bounds.x,top:m.bounds.y,width:m.bounds.width,height:m.bounds.height},role:"region","aria-label":e("console.title"),children:[(0,a.jsxs)("header",{className:"dsh-chat-dock-header",onPointerDown:r=>Oe(r,"drag"),children:[(0,a.jsx)("span",{className:"dsh-chat-dock-dot","data-state":bt(E)}),(0,a.jsx)("span",{className:"dsh-chat-dock-title",children:e("console.title")}),(0,a.jsx)("span",{className:"dsh-chat-dock-site-name",children:_e}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-icon-btn",onClick:()=>le(r=>!r),title:e("console.settings"),"aria-label":e("console.settings"),"aria-pressed":Le,children:(0,a.jsx)(ct,{})}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-icon-btn",onClick:At,title:e("console.collapse"),"aria-label":e("console.collapse"),children:(0,a.jsx)(ht,{})}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-icon-btn",onClick:Gt,title:e("console.hide"),"aria-label":e("console.hide"),children:(0,a.jsx)(pt,{})})]}),(0,a.jsx)("div",{className:"dsh-chat-dock-body",children:Le?(0,a.jsx)(gt,{t:e,settings:o,enabledSites:u,onChange:Et,onReset:Ot,onClose:()=>le(!1)}):(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"dsh-chat-dock-row",children:[u.length===0?(0,a.jsx)("span",{className:"dsh-chat-dock-hint",children:e("settings.needSite")}):(0,a.jsx)("select",{className:"dsh-chat-dock-select",value:d?.id??"",onChange:r=>v(r.target.value),"aria-label":e("console.site"),title:e("console.site"),children:u.map(r=>(0,a.jsx)("option",{value:r.id,children:be(r.label,mt())},r.id))}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn","data-variant":"primary",disabled:d===void 0,onClick:()=>Ie(o.openMode),children:e("console.open")}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn",disabled:d===void 0,onClick:()=>Ie("float"),children:e("console.float")})]}),(0,a.jsxs)("div",{className:"dsh-chat-dock-mirror",children:[(0,a.jsxs)("div",{className:"dsh-chat-dock-mirror-head",children:[(0,a.jsx)("span",{children:e("console.latest")}),(0,a.jsx)("span",{children:b===void 0?"":Ve(b.capturedAt)})]}),(0,a.jsx)("div",{className:"dsh-chat-dock-mirror-body",children:b===void 0?(0,a.jsx)("div",{className:"dsh-chat-dock-hint",children:zt}):(0,a.jsx)("pre",{children:Be(b.text,4e3)})})]}),(0,a.jsxs)("div",{className:"dsh-chat-dock-actions",children:[(0,a.jsxs)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>{Lt()},disabled:c||d===void 0,title:e("console.captureHint"),children:[(0,a.jsx)(ft,{size:13}),c?"\u2026":e("console.capture")]}),(0,a.jsxs)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>{Mt()},disabled:b===void 0,title:e("console.copyHint"),children:[(0,a.jsx)(lt,{size:13}),e("console.copy")]}),(0,a.jsxs)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>{Tt()},disabled:b===void 0,title:e("console.insertHint"),children:[(0,a.jsx)(ut,{size:13}),e("console.insert")]})]}),(0,a.jsx)("div",{className:"dsh-chat-dock-status","data-kind":Me?.kind??"info","aria-live":"polite",children:Me?.text??""}),(0,a.jsxs)("div",{className:"dsh-chat-dock-side",children:[(0,a.jsx)("span",{className:"dsh-chat-dock-side-label",children:e("console.sidebar")}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>fe("files"),children:e("console.files")}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>fe("terminal"),children:e("console.terminal")}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:()=>fe("browser"),children:e("console.browser")}),(0,a.jsx)("button",{type:"button",className:"dsh-chat-dock-btn",onClick:It,children:e("console.floatCurrent")})]}),(0,a.jsx)("div",{className:"dsh-chat-dock-foot",children:e("console.limits")})]})}),(0,a.jsx)("div",{className:"dsh-chat-dock-resize",onPointerDown:r=>Oe(r,"resize")})]})})}var Ne=require("react/jsx-runtime");function kt({t}){return(0,Ne.jsx)("button",{type:"button",className:"dsh-chat-dock-icon-btn",onClick:()=>M.toggle(),title:t("action.toggle"),"aria-label":t("action.toggle"),children:(0,Ne.jsx)(D,{size:15})})}var vt=K(require("react"),1);function xt(t){let{sessionId:e,inputActions:n}=t;return vt.useEffect(()=>{if(!(typeof e!="string"||e===""||n===void 0))return nt({sessionId:e,actions:n})},[e,n]),null}var St={"action.open":"\u5728\u53F3\u4FA7\u680F\u6253\u5F00 Chat","action.toggle":"Chat \u6D6E\u7A97","console.title":"Chat \u6D6E\u7A97","console.settings":"\u8BBE\u7F6E","console.collapse":"\u6536\u8D77","console.expand":"\u5C55\u5F00 Chat \u6D6E\u7A97","console.hide":"\u9690\u85CF\u60AC\u6D6E\u7403","console.open":"\u6253\u5F00","console.float":"\u6D6E\u52A8","console.latest":"\u6700\u65B0\u56DE\u590D","console.copy":"\u590D\u5236","console.insert":"\u63D2\u5165","console.capture":"\u6293\u53D6","console.captureHint":"\u7ACB\u5373\u6293\u53D6\u5F53\u524D\u6700\u65B0\u56DE\u590D","console.copyHint":"\u590D\u5236\u5230\u526A\u8D34\u677F","console.insertHint":"\u63D2\u5165\u5F53\u524D\u4F1A\u8BDD\u8F93\u5165\u6846","console.sidebar":"\u4FA7\u680F UI","console.files":"\u6587\u4EF6","console.terminal":"\u7EC8\u7AEF","console.browser":"\u6D4F\u89C8\u5668","console.floatCurrent":"\u6D6E\u52A8\u5F53\u524D\u6807\u7B7E","console.limits":"\u7F51\u9875\u767B\u5F55\u6001\u4E0D\u4F1A\u8DE8\u5E94\u7528\u91CD\u542F\u4FDD\u5B58\u3002","console.site":"\u7AD9\u70B9","mirror.missing":"\u8FD8\u6CA1\u6709\u6253\u5F00 {site} \u9875\u9762\u3002","mirror.empty":"\u9875\u9762\u5DF2\u6253\u5F00\uFF0C\u4F46\u6682\u65F6\u6CA1\u627E\u5230\u53EF\u6293\u53D6\u7684\u56DE\u590D\u3002","mirror.error":"\u8BFB\u53D6\u9875\u9762\u5931\u8D25\uFF1A{error}","mirror.idle":"\u7B49\u5F85\u9875\u9762\u2026","mirror.waiting":"\u7B49\u5F85\u56DE\u590D\u2026","status.opened":"\u5DF2\u6253\u5F00 Chat \u6807\u7B7E\u3002","status.floatManual":"\u5DF2\u6253\u5F00\uFF1B\u82E5\u672A\u6D6E\u8D77\uFF0C\u8BF7\u62D6\u52A8\u6807\u7B7E\u5230\u6D6E\u7A97\u3002","status.openFailed":"\u6253\u5F00 Chat \u5931\u8D25\u3002","status.noSidebar":"\u53F3\u4FA7\u680F\u4E0D\u53EF\u7528\uFF1A\u8BF7\u5728\u684C\u9762\u7AEF\u542F\u7528 Browser \u5E76\u6253\u5F00\u4E00\u4E2A\u4F1A\u8BDD\u3002","status.noSite":"\u6CA1\u6709\u542F\u7528\u7684\u7AD9\u70B9\u3002","status.copied":"\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F\u3002","status.copyFailed":"\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u6587\u672C\u3002","status.inserted":"\u5DF2\u63D2\u5165\u5F53\u524D\u4F1A\u8BDD\u8F93\u5165\u6846\u3002","status.insertUnavailable":"\u8F93\u5165\u6846\u4E0D\u53EF\u7528\uFF0C\u5DF2\u6539\u4E3A\u590D\u5236\u3002","status.floatFailed":"\u5F53\u524D\u6CA1\u6709\u53EF\u6D6E\u52A8\u7684\u6807\u7B7E\u3002","status.floatDone":"\u5DF2\u6D6E\u52A8\u5F53\u524D\u6807\u7B7E\u3002","status.sideOpened":"\u5DF2\u6253\u5F00 {kind} \u6807\u7B7E\u3002","status.sideFailed":"\u6253\u5F00 {kind} \u6807\u7B7E\u5931\u8D25\u3002","status.captureDone":"\u5DF2\u6293\u53D6\u3002","status.captureEmpty":"\u6CA1\u6709\u6293\u5230\u5185\u5BB9\u3002","status.captureFailed":"\u6293\u53D6\u5931\u8D25\u3002","settings.title":"\u8BBE\u7F6E","settings.close":"\u8FD4\u56DE","settings.defaultSite":"\u9ED8\u8BA4\u7AD9\u70B9","settings.openMode":"\u6253\u5F00\u65B9\u5F0F","settings.modeDocked":"\u505C\u9760\u53F3\u4FA7\u680F","settings.modeFloat":"\u76F4\u63A5\u6D6E\u52A8","settings.mirror":"\u81EA\u52A8\u955C\u50CF\u6700\u65B0\u56DE\u590D","settings.interval":"\u6293\u53D6\u95F4\u9694\uFF08\u6BEB\u79D2\uFF09","settings.intervalHint":"1500-60000","settings.sites":"\u542F\u7528\u7AD9\u70B9","settings.experimental":"\u5B9E\u9A8C","settings.custom":"\u81EA\u5B9A\u4E49\u7AD9\u70B9\uFF08JSON\uFF09","settings.customHint":"\u6570\u7EC4\u9879\uFF1Aid\u3001label\u3001url\uFF0C\u53EF\u9009 hosts\u3001latestReply\u3002latestReply \u662F\u9875\u9762\u5185 JS\u3002","settings.apply":"\u5E94\u7528","settings.reset":"\u6062\u590D\u9ED8\u8BA4\u8BBE\u7F6E","settings.resetHint":"\u6E05\u9664\u672C\u63D2\u4EF6\u7684\u8BBE\u7F6E\u4E0E\u6D6E\u7A97\u4F4D\u7F6E\u3002","settings.saved":"\u5DF2\u4FDD\u5B58\u3002","settings.invalid":"\u81EA\u5B9A\u4E49\u7AD9\u70B9\u65E0\u6548\uFF1A{error}","settings.loginNote":"\u7F51\u9875\u767B\u5F55\u6001\u4E0D\u8DE8\u5E94\u7528\u91CD\u542F\uFF1B\u91CD\u542F\u540E\u9700\u8981\u5728 Browser \u6807\u7B7E\u91CC\u91CD\u65B0\u767B\u5F55\u3002","settings.about":"dsh-chat-dock v0.1.0 \xB7 MIT","settings.needSite":"\u81F3\u5C11\u542F\u7528\u4E00\u4E2A\u7AD9\u70B9\u3002"},wt={"action.open":"Open Chat in the right sidebar","action.toggle":"Chat dock","console.title":"Chat dock","console.settings":"Settings","console.collapse":"Collapse","console.expand":"Expand the Chat dock","console.hide":"Hide the floating button","console.open":"Open","console.float":"Float","console.latest":"Latest reply","console.copy":"Copy","console.insert":"Insert","console.capture":"Capture","console.captureHint":"Capture the latest reply now","console.copyHint":"Copy to the clipboard","console.insertHint":"Insert into the current composer","console.sidebar":"Sidebar UI","console.files":"Files","console.terminal":"Terminal","console.browser":"Browser","console.floatCurrent":"Float current tab","console.limits":"Web login state does not survive an app restart.","console.site":"Site","mirror.missing":"No {site} page is open yet.","mirror.empty":"The page is open, but no reply could be captured yet.","mirror.error":"Could not read the page: {error}","mirror.idle":"Waiting for a page\u2026","mirror.waiting":"Waiting for a reply\u2026","status.opened":"Opened the Chat tab.","status.floatManual":"Opened; drag the tab out if it did not float.","status.openFailed":"Could not open Chat.","status.noSidebar":"The right sidebar is unavailable. Enable the Browser in the desktop app and open a session first.","status.noSite":"No site is enabled.","status.copied":"Copied to the clipboard.","status.copyFailed":"Copy failed; select the text manually.","status.inserted":"Inserted into the current composer.","status.insertUnavailable":"The composer is unavailable; copied instead.","status.floatFailed":"There is no tab to float.","status.floatDone":"Floated the current tab.","status.sideOpened":"Opened the {kind} tab.","status.sideFailed":"Could not open the {kind} tab.","status.captureDone":"Captured.","status.captureEmpty":"Nothing was captured.","status.captureFailed":"Capture failed.","settings.title":"Settings","settings.close":"Back","settings.defaultSite":"Default site","settings.openMode":"Open mode","settings.modeDocked":"Dock in the right sidebar","settings.modeFloat":"Open floating","settings.mirror":"Mirror the latest reply automatically","settings.interval":"Capture interval (ms)","settings.intervalHint":"1500-60000","settings.sites":"Enabled sites","settings.experimental":"Experimental","settings.custom":"Custom sites (JSON)","settings.customHint":"Each item: id, label, url; optional hosts and latestReply. latestReply is page JavaScript.","settings.apply":"Apply","settings.reset":"Restore defaults","settings.resetHint":"Clear this plugin\u2019s settings and console position.","settings.saved":"Saved.","settings.invalid":"Invalid custom sites: {error}","settings.loginNote":"Web login state does not survive an app restart; sign in again in the Browser tab after restarting.","settings.about":"dsh-chat-dock v0.1.0 \xB7 MIT","settings.needSite":"Enable at least one site."};function Ct(t,e){return typeof t!="string"?"":t.replace(/\{([a-zA-Z0-9_]+)\}/gu,(n,s)=>{let o=e?.[s];return o==null?n:String(o)})}var Ee=require("react/jsx-runtime");function Rt(t){let{t:e,services:n,storage:s}=t;return(0,Ee.jsx)("button",{type:"button",className:"dsh-chat-dock-icon-btn",onClick:()=>{let i=re(s),u=z(oe(i),i.defaultSite);if(u===void 0){M.show({kind:"warn",text:e("status.noSite")});return}let h=ce(de(n),u,i.openMode);h.ok||M.show({kind:"error",text:h.reason==="unavailable"?e("status.noSidebar"):e("status.openFailed")})},title:e("action.open"),"aria-label":e("action.open"),children:(0,Ee.jsx)(D,{size:15})})}var Nt=`
.dsh-chat-dock-root {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  font-family: inherit;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-root *,
.dsh-chat-dock-root *::before,
.dsh-chat-dock-root *::after {
  box-sizing: border-box;
}
.dsh-chat-dock-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  background: var(--dsw-alias-bg-overlay, #ffffff);
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.12));
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  font-size: 13px;
  line-height: 1.45;
}
.dsh-chat-dock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.1));
  cursor: grab;
  user-select: none;
  touch-action: none;
}
.dsh-chat-dock-header:active {
  cursor: grabbing;
}
.dsh-chat-dock-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dsw-alias-state-idle-primary, #8a8f98);
}
.dsh-chat-dock-dot[data-state="found"] { background: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-dot[data-state="empty"] { background: var(--dsw-alias-state-warn-primary, #c58a12); }
.dsh-chat-dock-dot[data-state="error"] { background: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-title {
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.dsh-chat-dock-site-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 12px;
}
.dsh-chat-dock-icon-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #6b7280);
  cursor: pointer;
}
.dsh-chat-dock-icon-btn:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-icon-btn:focus-visible,
.dsh-chat-dock-btn:focus-visible,
.dsh-chat-dock-select:focus-visible,
.dsh-chat-dock-input:focus-visible,
.dsh-chat-dock-textarea:focus-visible,
.dsh-chat-dock-pill:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary, #3b5bff);
  outline-offset: 2px;
}
.dsh-chat-dock-body {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  padding: 12px;
}
.dsh-chat-dock-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.dsh-chat-dock-select,
.dsh-chat-dock-input {
  height: 28px;
  min-width: 0;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  color: var(--dsw-alias-label-primary, #1f2329);
  font: inherit;
  font-size: 12px;
}
.dsh-chat-dock-select {
  flex: 1;
  cursor: pointer;
}
.dsh-chat-dock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-primary, #1f2329);
  font: inherit;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
}
.dsh-chat-dock-btn:hover:not(:disabled) {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.06));
}
.dsh-chat-dock-btn[data-variant="primary"] {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary, #3b5bff);
  color: #ffffff;
}
.dsh-chat-dock-btn[data-variant="primary"]:hover:not(:disabled) {
  filter: brightness(1.06);
}
.dsh-chat-dock-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.dsh-chat-dock-mirror {
  display: flex;
  flex: 1;
  min-height: 120px;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.1));
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1, #fafafa);
}
.dsh-chat-dock-mirror-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-mirror-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px 10px 10px;
}
.dsh-chat-dock-mirror pre {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.55;
  color: var(--dsw-alias-label-primary, #1f2329);
}
.dsh-chat-dock-hint {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 12px;
  line-height: 1.55;
}
.dsh-chat-dock-actions {
  display: flex;
  gap: 6px;
}
.dsh-chat-dock-actions .dsh-chat-dock-btn {
  flex: 1;
}
.dsh-chat-dock-status {
  min-height: 15px;
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
  line-height: 1.4;
}
.dsh-chat-dock-status[data-kind="success"] { color: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-status[data-kind="warn"] { color: var(--dsw-alias-state-warn-primary, #a8730a); }
.dsh-chat-dock-status[data-kind="error"] { color: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-side {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
}
.dsh-chat-dock-side-label {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-foot {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
  line-height: 1.5;
}
.dsh-chat-dock-resize {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  touch-action: none;
}
.dsh-chat-dock-resize::after {
  content: "";
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 7px;
  height: 7px;
  border-right: 2px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.25));
  border-bottom: 2px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.25));
}
.dsh-chat-dock-pill {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: var(--dsw-alias-brand-primary, #3b5bff);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  cursor: pointer;
  pointer-events: auto;
}
.dsh-chat-dock-pill:hover {
  filter: brightness(1.07);
}
.dsh-chat-dock-pill-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border: 2px solid var(--dsw-alias-bg-overlay, #ffffff);
  border-radius: 50%;
  background: var(--dsw-alias-state-idle-primary, #8a8f98);
}
.dsh-chat-dock-pill-dot[data-state="found"] { background: var(--dsw-alias-state-success-primary, #1a9f5b); }
.dsh-chat-dock-pill-dot[data-state="empty"] { background: var(--dsw-alias-state-warn-primary, #c58a12); }
.dsh-chat-dock-pill-dot[data-state="error"] { background: var(--dsw-alias-state-error-primary, #d33b3b); }
.dsh-chat-dock-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dsh-chat-dock-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dsh-chat-dock-field > label,
.dsh-chat-dock-field-label {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
}
.dsh-chat-dock-check {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  cursor: pointer;
}
.dsh-chat-dock-check input {
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary, #3b5bff);
}
.dsh-chat-dock-sites {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.dsh-chat-dock-site-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
}
.dsh-chat-dock-tag {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.07));
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
}
.dsh-chat-dock-textarea {
  width: 100%;
  min-height: 96px;
  resize: vertical;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.14));
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  color: var(--dsw-alias-label-primary, #1f2329);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
}
.dsh-chat-dock-settings-note {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 11px;
  line-height: 1.55;
}
.dsh-chat-dock-settings-actions {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.08));
}
.dsh-chat-dock-about {
  color: var(--dsw-alias-label-secondary, #6b7280);
  font-size: 10px;
  text-align: center;
}
@media (prefers-reduced-motion: reduce) {
  .dsh-chat-dock-btn,
  .dsh-chat-dock-icon-btn,
  .dsh-chat-dock-pill {
    transition: none !important;
  }
}
`;var j="dshChatDock",rn=["slots","locale"];function an(){try{let t=window.localStorage;return t??void 0}catch{return}}function dn(t){t.effect(()=>t.locale.register(j,{zh:St,en:wt}),"dsh-chat-dock: locale");let e=t.locale.bind(j),n=(d,w)=>Ct(e(d),w),s=an(),o={get:d=>t.get(d)};t.effect(()=>{let d=document.createElement("style");return d.setAttribute("data-plugin-css","dsh-chat-dock"),d.textContent=Nt,document.head.appendChild(d),()=>{d.remove()}},"dsh-chat-dock: styles");let i=yt;t.effect(()=>t.slots.inject("shell.overlay",()=>t.slots.register({name:"shell.overlay",id:"chat-dock-console",order:60,locale:j},d=>J.createElement(i,{...d,t:n,services:o,storage:s}))),"dsh-chat-dock: console");let u=Rt;t.effect(()=>t.slots.inject("conversation.session.header.actions",()=>t.slots.register({name:"conversation.session.header.actions",id:"chat-dock-open",order:45,locale:j},d=>J.createElement(u,{...d,t:n,services:o,storage:s}))),"dsh-chat-dock: header action");let h=kt;t.effect(()=>t.slots.inject("sidebar.footer.action",()=>t.slots.register({name:"sidebar.footer.action",id:"chat-dock-toggle",order:30,label:()=>n("action.toggle"),locale:j},()=>J.createElement(h,{t:n}))),"dsh-chat-dock: console toggle");let v=xt;t.effect(()=>t.slots.inject("conversation.input.dock",()=>t.slots.register({name:"conversation.input.dock",id:"chat-dock-bridge",order:4},d=>J.createElement(v,d))),"dsh-chat-dock: composer bridge")}

    return module.exports;
  },
});
