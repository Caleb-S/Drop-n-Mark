
function buttonTemplate() {
    let template = document.createElement('template');
    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })
    template.innerHTML = escapeHTMLPolicy.createHTML(`


        <button class="float-button">
        <slot></slot>
        </button>
        `);

    return template.content.cloneNode(true);
}

class FloatButton extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' });
       

        this.shadowRoot.appendChild(buttonTemplate());
        this.isFloatBtnActive = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.initialX = 0;
        this.initialY = 0;

        this.boundHandleMouseMove = this.handleMouseMove.bind(this);
        this.boundResetFloatBtn = this.resetFloatBtn.bind(this);
    }

    connectedCallback() {
        let style = this.getAttribute('stylesheet');

        // Basic URL validation (modify as per your domain requirements)
        const isValidUrl = (url) => {
            try {
                new URL(url, window.location.origin); // Validates if `url` is relative or absolute
                return true;
            } catch (e) {
                console.warn("Invalid URL:", url);
                return false;
            }
        };

        if (isValidUrl(style)) {
            const linkElem = document.createElement('link');
            linkElem.setAttribute('rel', 'stylesheet');
           linkElem.setAttribute('href',style);

        this.shadowRoot.appendChild(linkElem);
        }


        this.restrictHighlighting.bind(this);
        this.shadowRoot.addEventListener('mousedown', this.handlemousedown.bind(this));

        let floatingButton = this.shadowRoot.querySelector('.float-button');
        this.shadowRoot.addEventListener('mouseover', () => {
            floatingButton.textContent = this.truncateText(document.title);

        });
    }

    disconnectedCallback() {

        try {
            document.removeEventListener('mouseup', this.boundResetFloatBtn);
            document.removeEventListener('mousemove', this.boundHandleMouseMove);
            this.shadowRoot.removeEventListener('mousedown', this.handlemousedown.bind(this));
        } catch (error) {
            console.log('Failed to remove eventlistners:', error);
        }

    }

    handlemousedown(event) {
        try {
            this.initialX = event.clientX;
            this.initialY = event.clientY;
        } catch (error) {
            return;
        }
        //console.log('mousedown')


        this.floatDragState();
    }

    handleMouseMove(event) {
        this.offsetX = event.clientX - this.initialX;
        this.offsetY = event.clientY - this.initialY;
        //console.log('mousemove: ', this.offsetX, this.offsetY);

        let floatingButton = this.shadowRoot.querySelector('.float-button');
        floatingButton.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
        //console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
        //this.updateFloatingButtonPosition.bind(this);

    }

    updateFloatingButtonPosition() {
        //console.log('offsetX', this.offsetX, 'offsetY', this.offsetY);

        let floatingButton = this.shadowRoot.querySelector('.float-button');
        floatingButton.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
        //console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
    }

    floatDragState() {
        document.addEventListener('mousemove', this.boundHandleMouseMove);
        //console.log('floatDragState');
        let floatingButton = this.shadowRoot.querySelector('.float-button');
        document.addEventListener('mouseup', this.boundResetFloatBtn);

        floatingButton.addEventListener('contextmenu', event => event.preventDefault());
        floatingButton.addEventListener('selectstart', event => event.preventDefault());
        floatingButton.addEventListener('mousedown', event => event.preventDefault());
        floatingButton.style.pointerEvents = 'none';
        document.body.style.cursor = 'grabbing';

    }

    resetFloatBtn() {
        let floatingButton = this.shadowRoot.querySelector('.float-button');
        this.offsetX = 0;
        this.offsetY = 0;

        document.removeEventListener('mousemove', this.boundHandleMouseMove);
        document.removeEventListener('mouseup', this.boundResetFloatBtn);


        floatingButton.style.transform = 'translate3d(0, 0, 0)';
        floatingButton.style.pointerEvents = 'auto';
        floatingButton.textContent = '';
        //set floating button to not active

        document.body.style.cursor = 'auto';
    }

    // Make text fit within the button.
        truncateText(text) {
            let maxLength = 20;
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }

    // Restricts text highlighting button text.
        restrictHighlighting() {
            const menuItems = this.shadowRoot.querySelectorAll('.float-button');

            menuItems.forEach(item => {
                item.addEventListener('contextmenu', event => {
                    event.preventDefault();
                });

                item.addEventListener('selectstart', event => {
                    event.preventDefault();
                });

                item.addEventListener('mousedown', event => {
                    if (event.button === 2) {
                        event.preventDefault();
                    }
                });

                item.draggable = false;
            });
        }
}

customElements.define('bookmark-float-button', FloatButton);
