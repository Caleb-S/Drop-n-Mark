

let bookmarkTemplate = document.createElement('template');
bookmarkTemplate.innerHTML = `<style>
              :host {
              font-size: 18px;
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


class BookmarkToast extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(bookmarkTemplate.content.cloneNode(true));
    }
}

customElements.define('bookmark-toast', BookmarkToast);


