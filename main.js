(()=>{"use strict";class e{constructor(){this.username=null,this.webSocket=new WebSocket("wss://ahj-sse-ws-back.onrender.com"),this.addListenersToPage=this.addListenersToPage.bind(this),this.sendMessage=this.sendMessage.bind(this),this.messenger=document.querySelector(".messenger-wrapper"),this.userID=null}init(){this.bindToDOM(),this.addListenersToPage()}bindToDOM(){this.autorizationForm=document.querySelector(".authorization-form")}addListenersToPage(){this.webSocket.addEventListener("message",(e=>{const s=JSON.parse(e.data);this.getMessageFromServer(s)})),document.querySelector(".authorization-form").addEventListener("submit",(e=>{e.preventDefault(),this.name=e.target[0].value,this.sendMessage("connect"),e.target[0].value=""}));const e=document.querySelector(".messenger__new-message-form");e.addEventListener("submit",(s=>{s.preventDefault();const t=e[0].value;this.sendMessage("message",t),e[0].value=""}))}sendMessage(e,s){if(this.webSocket.readyState===WebSocket.OPEN){const t={type:e,name:this.name,userID:this.userID};if(""===s)return;const n=function(e){const s=new Date(e);let t=s.getDate();t<10&&(t=`0${t}`);let n=s.getMonth();n<10&&(n=`0${n}`);const r=s.getFullYear();let a=s.getHours();a<10&&(a=`0${a}`);let i=s.getMinutes();return i<10&&(i=`0${i}`),`${t}.${n}.${r} ${a}:${i}`}(Date.now());t.date=n,t.content=s,this.webSocket.send(JSON.stringify(t))}}getMessageFromServer(e){const{type:s}=e;console.log(e),"connect"!==s&&"disconnect"!==s||this.refreshUserList(e.allUsers),"Used username!"===s&&alert("Username Used!"),"Username ok"===s&&(this.autorizationForm.classList.add("invisible"),document.querySelector(".messenger-wrapper").classList.remove("invisible"),this.userID=e.userID),"message"===s&&this.postMessage(e),"reportID"===s&&(this.userID=e.userID),"error"===s&&console.log(e)}refreshUserList(e){const s=this.messenger.querySelector(".messenger-users"),t=document.createElement("div");t.classList.add("messenger-users"),e.forEach((e=>{const s=document.createElement("div");s.classList.add("messenger-users__user");const n=document.createElement("div");n.classList.add("messenger-users__user-image");const r=document.createElement("div");e===this.name?(r.textContent="You",r.classList.add("messenger-users__you-user-name")):(r.textContent=e,r.classList.add("messenger-users__user-name")),s.appendChild(n),s.appendChild(r),t.appendChild(s)})),this.messenger.replaceChild(t,s)}postMessage(e){const s=this.messenger.querySelector(".messenger__messages"),t=document.createElement("div");t.classList.add("messenger__message");const n=document.createElement("div");e.userID===this.userID?(t.classList.add("messenger__your-message"),n.classList.add("messenger__your-message-author"),n.textContent=`You ${e.date}`):(t.classList.add("messenger__other-message"),n.classList.add("messenger__message-author"),n.textContent=`${e.name} ${e.date}`);const r=document.createElement("div");r.classList.add("messenger__message-content"),r.innerHTML=e.content.replace(/\n/g,"<br/>"),t.appendChild(n),t.appendChild(r),s.appendChild(t)}}document.addEventListener("DOMContentLoaded",(()=>{(new e).init()}))})();