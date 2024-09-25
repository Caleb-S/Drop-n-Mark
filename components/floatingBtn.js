let buttonTemplate = document.createElement('template');
buttonTemplate.innerHTML = `<style>
              :host {
              font-size: 20px;
              color: black;
              font-family: arial;
              }

               dialog {
                width: auto;
                max-width: fit-content;
                height: auto;
                max-height: fit-content;
                background-color: #FDBA74;
                position: fixed;
                bottom: 20px;
                z-index: 9999;
                padding: 10px 20px;
                border-width: 0px;
                border-radius: 3px;
              }

            </style>

            <dialog open>
             
                    <slot></slot>
               
            </dialog>`;


class FloatButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(bookmarkTemplate.content.cloneNode(true));
  }
}

customElements.define('float-button', FloatButton);


