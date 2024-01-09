!function(){"use strict";class t{constructor(t){this.container=t,this.name=this.container.querySelector(".tickets-form--input"),this.description=this.container.querySelector(".tickets-form--text-area")}show(t,e){this.container.classList.add("tickets-form--display-active"),this.name&&(this.name.value=t||"",this.name.focus()),this.description&&(this.description.value=e||"")}close(){this.container.classList.remove("tickets-form--display-active"),this.name&&(this.name.value=""),this.description&&(this.description.value="")}}function e(t,e,i,s){const n=new XMLHttpRequest;n.onreadystatechange=function(){if(4!==n.readyState)return;if(n.status>299)return console.log(`${n.status}: ${n.statusText}`),void console.log(n.responseText);let t;try{t=JSON.parse(n.responseText)}catch(t){return void console.log(t)}s(t)};const o="http://localhost:7070"+(e?`?${e}`:"");n.open(t,o),n.send(i)}const i=new class{constructor(){this.container=document.getElementById("help-desk"),this.ticketsItems=this.container.querySelector(".tickets-items"),this.formAdd=new t(this.container.querySelector("#help-desk--form-add")),this.formEdit=new t(this.container.querySelector("#help-desk--form-edit")),this.formDelete=new t(this.container.querySelector("#help-desk--form-delete")),this.activeItem=void 0,this.activeControlElement=void 0,this.bindToDOM()}bindToDOM(){this.onAddTicketClick=this.onAddTicketClick.bind(this),this.onTicketClick=this.onTicketClick.bind(this),this.onFormAddClose=this.onFormAddClose.bind(this),this.onFormEditClose=this.onFormEditClose.bind(this),this.onFormDeleteClose=this.onFormDeleteClose.bind(this),this.container.querySelector(".tickets-add-btn").addEventListener("click",this.onAddTicketClick),this.ticketsItems.addEventListener("click",this.onTicketClick),this.formAdd.container.addEventListener("submit",this.onFormAddClose),this.formAdd.container.addEventListener("reset",this.onFormAddClose),this.formEdit.container.addEventListener("submit",this.onFormEditClose),this.formEdit.container.addEventListener("reset",this.onFormEditClose),this.formDelete.container.addEventListener("submit",this.onFormDeleteClose),this.formDelete.container.addEventListener("reset",this.onFormDeleteClose)}onAddTicketClick(){this.formAdd.show()}onTicketClick(t){t.preventDefault(),this.activeItem=t.target.closest(".tickets-item"),this.activeControlElement=t.target,t.target.classList.contains("tickets-item--checkbox")?this.onTicketClickChangeStatus():t.target.classList.contains("tickets-item--edit-btn")?this.onTicketClickEdit():t.target.classList.contains("tickets-item--del-btn")?this.formDelete.show():(t.target.classList.contains("tickets-item--name")||t.target.classList.contains("tickets-item--description"))&&this.toggleDescriptionVisible()}onTicketClickChangeStatus(){const t=new FormData;t.append("id",this.activeItem.dataset.id),t.append("status",this.activeControlElement.checked),e("PUT","method=editTicket",t,(t=>{this.activeItem.querySelector(".tickets-item--checkbox").checked="true"===t.status}))}onTicketClickEdit(){e("GET",`method=ticketById&id=${this.activeItem.dataset.id}`,void 0,(t=>{this.formEdit.show(t.name,t.description)}))}onFormAddClose(t){t.preventDefault(),"submit"===t.type&&e("POST","method=createTicket",new FormData(this.formAdd.container),(t=>{this.addItem(t)})),this.formAdd.close()}onFormEditClose(t){if(t.preventDefault(),"submit"===t.type){const t=new FormData(this.formEdit.container);t.append("id",this.activeItem.dataset.id),e("PUT","method=editTicket",t,(t=>{this.activeItem.querySelector(".tickets-item--name").textContent=t.name;const e=this.activeItem.querySelector(".tickets-item--description");e&&(e.textContent=t.description)}))}this.formEdit.close()}onFormDeleteClose(t){t.preventDefault(),"submit"===t.type&&e("DELETE",`id=${this.activeItem.dataset.id}`,void 0,(()=>{this.activeItem.remove()})),this.formDelete.close()}addItem(t){const e=document.createElement("li");e.classList.add("tickets-item"),e.innerHTML='\n      <div class="tickets-item--container">\n          <input type="checkbox" class="tickets-item--checkbox tickets-btn">\n          <a class="tickets-item--name">text</a>\n          <a class="tickets-item--date">date</a>\n          <button type="button" class="tickets-item--edit-btn tickets-btn">&#x270E</button>\n          <button type="button" class="tickets-item--del-btn tickets-btn">&#10007</button>\n      </div>\n',e.dataset.id=t.id,e.querySelector(".tickets-item--checkbox").checked="true"===t.status,e.querySelector(".tickets-item--name").textContent=t.name,e.querySelector(".tickets-item--date").textContent=new Date(t.created).toLocaleDateString(),this.ticketsItems.appendChild(e)}getAllTickets(){e("GET","method=allTickets",void 0,(t=>{t.forEach((t=>this.addItem(t)))}))}toggleDescriptionVisible(){let t=this.activeItem.querySelector(".tickets-item--description");t?t.remove():e("GET",`method=ticketById&id=${this.activeItem.dataset.id}`,void 0,(e=>{e.description&&(t=document.createElement("a"),t.classList.add("tickets-item--description"),t.textContent=e.description||"",this.activeItem.appendChild(t))}))}};document.addEventListener("DOMContentLoaded",(t=>i.getAllTickets(t)))}();