import './help-desk.css';
import markupItem from './markup-item';
import Form from './form';
import request from './request';

export default class HelpDesk {
  constructor() {
    this.container = document.getElementById('help-desk');
    this.ticketsItems = this.container.querySelector('.tickets-items');
    this.ticketsItems = this.container.querySelector('.tickets-items');
    this.formAdd = new Form(this.container.querySelector('#help-desk--form-add'));
    this.formEdit = new Form(this.container.querySelector('#help-desk--form-edit'));
    this.formDelete = new Form(this.container.querySelector('#help-desk--form-delete'));
    this.activeItem = undefined;
    this.activeControlElement = undefined;

    this.bindToDOM();
  }

  bindToDOM() {
    // this.loadTickets = this.loadTickets.bind(this);
    this.onAddTicketClick = this.onAddTicketClick.bind(this);
    this.onTicketClick = this.onTicketClick.bind(this);
    this.onFormAddClose = this.onFormAddClose.bind(this);
    this.onFormEditClose = this.onFormEditClose.bind(this);
    this.onFormDeleteClose = this.onFormDeleteClose.bind(this);

    this.container.querySelector('.tickets-add-btn').addEventListener('click', this.onAddTicketClick);
    this.ticketsItems.addEventListener('click', this.onTicketClick);
    this.formAdd.container.addEventListener('submit', this.onFormAddClose);
    this.formAdd.container.addEventListener('reset', this.onFormAddClose);
    this.formEdit.container.addEventListener('submit', this.onFormEditClose);
    this.formEdit.container.addEventListener('reset', this.onFormEditClose);
    this.formDelete.container.addEventListener('submit', this.onFormDeleteClose);
    this.formDelete.container.addEventListener('reset', this.onFormDeleteClose);
  }

  onAddTicketClick() {
    this.formAdd.show();
  }

  onTicketClick(e) {
    e.preventDefault();

    this.activeItem = e.target.closest('.tickets-item');
    this.activeControlElement = e.target;

    if (e.target.classList.contains('tickets-item--checkbox')) {
      this.onTicketClickChangeStatus();
    } else if (e.target.classList.contains('tickets-item--edit-btn')) {
      this.onTicketClickEdit();
    } else if (e.target.classList.contains('tickets-item--del-btn')) {
      this.formDelete.show();
    } else if (e.target.classList.contains('tickets-item--name')) {
      this.toggleDescriptionVisible();
    } else if (e.target.classList.contains('tickets-item--description')) {
      this.toggleDescriptionVisible();
    }
  }

  onTicketClickChangeStatus() {
    const body = new FormData();
    body.append('id', this.activeItem.dataset.id);
    body.append('status', this.activeControlElement.checked);

    request('PUT', 'method=editTicket', body, data => {
      this.activeItem.querySelector('.tickets-item--checkbox').checked = (data.status === 'true');
    });
  }

  onTicketClickEdit() {
    const query = `method=ticketById&id=${this.activeItem.dataset.id}`;

    request('GET', query, undefined, data => {
      this.formEdit.show(data.name, data.description);
    });
  }

  onFormAddClose(e) {
    e.preventDefault();

    if (e.type === 'submit') {
      const body = new FormData(this.formAdd.container);

      request('POST', 'method=createTicket', body, data => {
        this.addItem(data);
      });
    }

    this.formAdd.close();
  }

  onFormEditClose(e) {
    e.preventDefault();

    if (e.type === 'submit') {
      const body = new FormData(this.formEdit.container);
      body.append('id', this.activeItem.dataset.id);

      request('PUT', 'method=editTicket', body, data => {
        this.activeItem.querySelector('.tickets-item--name').textContent = data.name;

        const descriptionElement = this.activeItem.querySelector('.tickets-item--description');
        if (descriptionElement) descriptionElement.textContent = data.description;
      });
    }

    this.formEdit.close();
  }

  onFormDeleteClose(e) {
    e.preventDefault();

    if (e.type === 'submit') {
      const query = `id=${this.activeItem.dataset.id}`;

      request('DELETE', query, undefined, () => {
        this.activeItem.remove();
      });
    }

    this.formDelete.close();
  }

  addItem(el) {
    const listItem = document.createElement('li');
    listItem.classList.add('tickets-item');
    listItem.innerHTML = markupItem;
    listItem.dataset.id = el.id;
    listItem.querySelector('.tickets-item--checkbox').checked = (el.status === 'true');
    listItem.querySelector('.tickets-item--name').textContent = el.name;
    listItem.querySelector('.tickets-item--date').textContent = new Date(el.created).toLocaleDateString();
    this.ticketsItems.appendChild(listItem);
  }

  getAllTickets() {
    request('GET', 'method=allTickets', undefined, data => {
      data.forEach(el => this.addItem(el));
    });
  }

  toggleDescriptionVisible() {
    let descriptionElement = this.activeItem.querySelector('.tickets-item--description');

    if (descriptionElement) {
      descriptionElement.remove();
      return;
    }

    const query = `method=ticketById&id=${this.activeItem.dataset.id}`;
    request('GET', query, undefined, data => {
      const description = data.description || '';

      if (description) {
        descriptionElement = document.createElement('a');
        descriptionElement.classList.add('tickets-item--description');
        descriptionElement.textContent = data.description || '';

        this.activeItem.appendChild(descriptionElement);
      }
    });
  }
}
