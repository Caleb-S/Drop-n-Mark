let buttonTemplate = document.createElement('template');
buttonTemplate.innerHTML = `
            <style>
              :host {
                font-size: 18px;
                color: white;
                font-family: arial;
                text-align: center;
                text-overflow: ellipsis;
                overflow: visible;
                white-space: nowrap;
              }

               dialog {
                width: 20px;
                height: 20px;
                position: fixed;
                bottom: 20px;
                z-index: 2147483647;
                padding: 0px;
                border-radius: 50%;
                cursor: grab;
                background-color: #ff7f50f8;
              }

              dialog:hover {
                width: auto;
                height: auto;
                padding: 5px 20px 5px 20px;
                border-radius: 0;
                align-items: center;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            </style>

            <dialog open>
              <slot></slot>
            </dialog>
`;



class FloatButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
  }

  connectedCalleback() {
    // when text is added to the dom, change state to drag is true 
    console.log('connected');
  }

  disconnectedCallback() {
    // when text is removed from the dom, return to default pos & state
    console.log('disconnected');
  }




}

customElements.define('bookmark-float-button', FloatButton);


