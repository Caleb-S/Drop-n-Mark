

let toastTemplate = document.createElement('template');
let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
  createHTML: (to_escape) => to_escape
})
toastTemplate.innerHTML = escapeHTMLPolicy.createHTML(`<style>
              :host {
              font-size: 18px;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              z-index: 2147483647 !important;
              font-weight: 600 !important;
              font-color: #18181b;
          
              }

               .toast-dialog {
                width: auto;
                max-width: fit-content;
                height: auto;
                max-height: fit-content;
                background-color: #FDBA74;
                 color: black;
                position: fixed;
                bottom: 20px;
                
                padding: 10px 20px;
                border-width: 0px;
                border-radius: 3px;
                z-index: 2147483647 !important;
              }

            </style>

            <dialog open class="toast-dialog">
             
                    <slot></slot>
               
            </dialog>`);


class BookmarkToast extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(toastTemplate.content.cloneNode(true));
  }
}

customElements.define('bookmark-toast', BookmarkToast);


