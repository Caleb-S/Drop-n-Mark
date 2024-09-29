
function folderCardTemplate() {
    template = document.createElement('template');
    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })
    template.innerHTML = escapeHTMLPolicy.createHTML(` 
        <style> 
        </style>

        <div class='main-folder' >
                <div class='main-add-folder'>
                        
                </div>
                <div class='main-f-txt'>
                <slot></slot>
                </div>
        </div>
    

        `);

    return template.content.cloneNode(true);
}


class FolderCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(folderCardTemplate());
    }

    connectedCallback() {
        this.restrictHighlighting.bind(this);
        this.shadowRoot.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
}

customElements.define('folder-card', FolderCard);

