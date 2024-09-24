let bookmarkTemplate = document.createElement('template');
bookmarkTemplate.innerHTML = `<style>
              :host {
              font-size: 20px;
              color: black;
              font-family: arial;
              transition: opacity 0.3s;
              z-index: 9999;
              margin: 0px;
              
              }

              div {
                width: auto;
                max-width: fit-content;
                height: auto;
                max-height: fit-content;
                background-color: #FDBA74;
                position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
              }

              p {
                padding: 10px 20px;
              }
            </style>

            <div>
             
                    <slot></slot>
               
            </div>`;


class BookmarkToast extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(bookmarkTemplate.content.cloneNode(true));
    }


    /*
    connectedCallback() {
        this.attachShadow({ mode: 'closed' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }
    */
}

customElements.define('bookmark-toast', BookmarkToast);


