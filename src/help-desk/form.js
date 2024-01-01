export default class Form {
  constructor(container) {
    this.container = container;
    this.name = this.container.querySelector('.tickets-form--input');
    this.description = this.container.querySelector('.tickets-form--text-area');
  }

  show(name, description) {
    this.container.classList.add('tickets-form--display-active');

    if (this.name) {
      this.name.value = name || '';
      this.name.focus();
    }

    if (this.description) this.description.value = description || '';
  }

  close() {
    this.container.classList.remove('tickets-form--display-active');

    if (this.name) this.name.value = '';
    if (this.description) this.description.value = '';
  }
}
