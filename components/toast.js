const template = document.createElement('template');
template.innerHTML = `<style>
              
            </style>
            <div style="background-color: #FDBA74;">
                <p>${content}</p>
                 <p>test</p>
            </div>`;

class Toast extends HTMLElement {
    /*
    constructor() {
        super();
        this.attachShadow({ mode: 'closed' });
    }
    */

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

    }
}

customElements.define('bookmark-toast', Toast);


