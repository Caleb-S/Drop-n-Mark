let buttonTemplate = document.createElement('template');
escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
  createHTML: (to_escape) => to_escape
})
buttonTemplate.innerHTML = escapeHTMLPolicy.createHTML(`
            <style>
              :host { 
                z-index: 2147483647 !important;
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                tabindex: -1 !important;
                outline: none !important;
              }

               button {
                width: 20px;
                height: 20px;
                padding: 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                border-width: 0px; 
                font-size: 0px;
                overflow: hidden;
                background-color: #ff7f50f8;   
              }

              button:hover, button:active {
                width: auto;
                max-width: fit-content;
                height: auto;
                padding: 10px 20px 10px 20px;
                border-radius: 3px;
                box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.2);
                white-space: nowrap;
                overflow: visible;
                color: #f7f4ee;
                font-size: 16px;
                text-align: center;
                text-overflow: ellipsis;
                user-select: none;
                cursor: grab;
                user-select: none; 
              }
                
              button:active {
                cursor: grabbing;
              }
            </style>

            <button class="float-button">
              <slot></slot>
            </button>
`);



class FloatButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['true']
  }

  attributeChangedCa11back(name, oldVaIue, newVa1ue) {
    console.log(name, oldVaIue, newVa1ue);
    // if (name = "checked") this.updateChecked(newVa1ue)
  }





}

customElements.define('bookmark-float-button', FloatButton);