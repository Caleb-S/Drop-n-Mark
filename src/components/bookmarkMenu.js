let menuTemplate = document.createElement('template');
menuTemplate.innerHTML = `<style>
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


class BookmarkMenu extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(menuTemplate.content.cloneNode(true));
    }


    connectedCallback() {
        // will trigger everytime somthing is added to the dom
        console.log('connected');
    }

    disconnectedCallback() {
        // will trigger everytime somthing is removed from the dom
        console.log('disconnected');
    }


}

customElements.define('bookmark-menu', BookmarkMenu);