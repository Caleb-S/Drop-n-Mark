function menuTemplate() {
    var template = document.createElement('template');

    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })

    template.innerHTML = escapeHTMLPolicy.createHTML(`
        <style>
            :host {
                font-size: 20px !important;
                color: #484952 !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                 transform: translate(-50%, -50%) scale(calc(1 / (window.devicePixelRatio || 1)));
     
            }
    
            dialog {
                top: 0;
                bottom: 0;
                position: fixed;
                z-index: 2057483645;
                padding: 0px;
                border: none;
                cursor: grabbing;
            }
    
            .bookmarkmenu-updated {
                width: 350px;
                height: 70vh;
                max-height: 850px;
                margin: auto;
               
                
                background-color: #F7F4EE;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                
                overflow: none;
                border-radius: 5px;
            }
    
             .folder-container {
                width: 100%;
                height: 80%;
                text-align: left;
                object-fit: fill;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-end;
                display: flex;
                overflow: hidden;
                
            }
    
            .new-folder-btn {
                min-height: 10%;
                height: 10%;
                min-width: 100%;
                width: 100%;
                display: flex; 
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #484952;
                border-radius: 5px 5px 0px 0px;
                
            }
    
            .new-folder-btn:hover {
                background-color: #FF7F50;
            }
    
            .new-btn-txt {
                pointer-events: none;
                color: #f7f4ee;
                text-align: center;
                font-size: 26px;
                font-weight: 600;
                text-decoration: none;
                line-height: normal;
            }
    
            .general-btn-txt {
                pointer-events: none;
                color: #f7f4ee;
                text-align: center;
                font-size: 28px !important;
                font-weight: 600;
                text-decoration: none;
                margin: 0px; 
                 line-height: 32px;   
                 margin-top: -3px;
     
            }
    
            .general-sub-txt {
                pointer-events: none;
                color: #f7f4ee;
                font-size: 12px !important;
                width: auto;
                padding: 0px;
            }
    
            .general-btn {
              
                height: 10%;
                width: 100%;
                min-height: 10%;
                min-width: 100%;
                background-color: #484952;
    
                flex-direction: column;
                justify-content: center;
                align-items: center;
                display: flex;
                position: absolute;
                border-radius: 0px 0px 5px 5px;
    
                top: auto;
                bottom: 0%;
                left: 0%;
                right: 0%; 
                
            }
    
            .general-btn:hover {
                box-shadow: none;
                background-color: #FF7F50;
                color: white;
            }
    
           
    
            .backdrop {
                z-index: 2047483645;
                display: block;
                min-width: 100vw;
                min-height: 100vh;
                backdrop-filter: blur(1px);
                background-color: #1d1e1f83;
                position: fixed;
                top: 0%;
                bottom: 0%;
                left: 0%;
                right: 0%;
            }
    
            .main-folder {
                /* cursor: pointer; */
                width: 90%;
                min-height: 60px;
                background-color: #ffffff;
                flex-direction: column;
                justify-content: center;
                /* align-items: center; */
                margin-top: 5px;
                margin-bottom: 5px;
                margin-right: 5%;
                display: flex;
                position: relative;
                box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
                text-align: left;
                align-items: start;
                padding-left: 95px;
    
                box-sizing: border-box;
                overflow: hidden;
            }
    
            .main-folder-ui5864921:hover {
                box-shadow: none;
                background-color: #dcdcdc;
                color: white !important;
                border: 3px solid #48495244;
            }
    
            .main-add-folder {
                width: 80px;
                min-height: 60px;
                background-color: #ECECEC;
                position: absolute;
                top: 0%;
                bottom: 0%;
                left: 0%;
                right: auto;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .main-add-folder:hover { 
                box-shadow: none;
                background-color: #999999;
            }
    
            .main-f-txt {
                pointer-events: none;
                /* cursor: pointer; */
                color: #585B62;
                text-align: center;
                font-size: 23px;
                font-weight: 600;
                text-decoration: none;
                display: flex;
                align-items: center;
                flex: auto;
                justify-content: center;
                white-space: nowrap;
                width: auto;
            }

             .deleteBox {
                z-index: 2147483546;
                width: 250px;
                height: 250px;
                background-color: white;
                left: 0%;
                right: 0%;
                top: 0%;
                bottom: 0%;
                position: fixed;
                margin: auto;
                border: 15px solid #484952;
            }

           .deleteBox[open]{
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .folder-input {
                z-index: 2147483646;
                width: 400px;
                height: 250px;
           
                justify-content:space-evenly;
                align-items: center;
                
                background-color: #484952;
                border-radius: 8px;
          
     
                margin: auto;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                flex-direction: column-reverse;
                cursor: auto;
            
            }

            .folder-input[open] {
                display: flex;
            }

            .folder-input input {
                display: block;
                width: 80%;
                height: 40px;
                padding: 8px;
                border: none;
                border-radius: 4px;
                font-size: 20px;
                background-color: #ffffff;
                outline: none;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
                color: #484952;
            }
                
        </style>
    
       
    
           
    
        <dialog class="folder-input">
            <input type="text" placeholder="New folder name">
        </dialog>
    
        <dialog class="deleteBox"></dialog>
    
    
    
        <dialog class="bookmarkmenu-updated" id="bookmarkMenu2">
            <div class="new-folder-btn">
                <p class="new-btn-txt">New Folder</p>
            </div>
    
            <div class="folder-container">
    
            <!--
                <div class='main-folder' >
                    <div class='main-add-folder'>
                       
                    </div>
                    <div class='main-f-txt'>First Bookmark</div>
                </div>
    
                -->
    
    
                <!-- Auto Filled -->
                <slot></slot>
            </div>
    
            <div class="general-btn">
                <p class="general-btn-txt">General</p>
                <small class="general-sub-txt">No Category</small>
            </div>
        </dialog>
    
         <div class="backdrop"></div>
    
    
     
    `);

    return template.content.cloneNode(true);
}



class BookmarkMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(menuTemplate());
        this.scrollThresholdPercentage = 0.25;
        this.scrollInterval = null; // Initialize scrollInterval as null
        this.folderContainer = this.shadowRoot.querySelector('.folder-container');
        this.bookmarkMenu = this.shadowRoot.querySelector('.bookmarkmenu-updated');
        this.createFolder = this.shadowRoot.querySelector('.folder-input');
        this.scrollPosition = 0;
        this.positionRestored = false;

        // Store references to event listeners for removal
        this.eventListeners = [];
    }

    static get observedAttributes() {
        return ['bookmarked', 'src', 'createFolder'];
    }

    attributeChangedCallback() {
        let imageElement = document.createElement('img');
        if (this.hasAttribute('src')) {
            imageElement.src = this.getAttribute('src');
        }

        if (this.hasAttribute('bookmarked') || this.hasAttribute('createFolder')) {
            this.bookmarkMenu.hasAttribute('open') ? this.bookmarkMenu.removeAttribute('open') : '';

            if (this.hasAttribute('bookmarked')) {
                let deleteBox = this.shadowRoot.querySelector('.deleteBox');
                deleteBox.setAttribute('open', '');
                if (!deleteBox.hasChildNodes()) {
                    deleteBox.appendChild(imageElement);
                }
            } else if (this.hasAttribute('createFolder')) {
                this.createFolder.setAttribute('open', '');
                if (!this.createFolder.hasChildNodes()) {
                    this.createFolder.appendChild(imageElement);
                }
                this.createFolder.querySelector('input').focus();
            }
        }
    }

    connectedCallback() {
        console.log('connected');
        this.restrictHighlighting.bind(this);

        let imageElement = document.createElement('img');
        if (this.hasAttribute('src')) {
            imageElement.src = this.getAttribute('src');
        }

        if (this.hasAttribute('bookmarked') || this.hasAttribute('createFolder')) {
            this.bookmarkMenu.hasAttribute('open') ? this.bookmarkMenu.removeAttribute('open') : '';

            if (this.hasAttribute('bookmarked')) {
                let deleteBox = this.shadowRoot.querySelector('.deleteBox');
                deleteBox.setAttribute('open', '');
                deleteBox.appendChild(imageElement);
            } else if (this.hasAttribute('createFolder')) {
                this.createFolder.setAttribute('open', '');
                this.createFolder.appendChild(imageElement);
                let folderInput = this.shadowRoot.querySelector('.folder-input input');
                folderInput.focus();

                // Store the event listener for removal
                const handleKeyDown = (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.handleFolderInput(); // Ensure `handleFolderInput` is defined in your class
                    }
                };
                folderInput.addEventListener('keydown', handleKeyDown);
                this.eventListeners.push({ element: folderInput, type: 'keydown', handler: handleKeyDown });
            }
        } else {
            this.bookmarkMenu.setAttribute('open', '');
            let slot = this.shadowRoot.querySelector('slot');

            // Waits until all folder items are loaded
            const slotChangeHandler = () => {
                this.folderContainer.scrollTop = this.getAttribute('scrollPosition');
            };
            slot.addEventListener('slotchange', slotChangeHandler);
            this.eventListeners.push({ element: slot, type: 'slotchange', handler: slotChangeHandler });

            // Add mousemove listener
            const mouseMoveHandler = this.handleMouseMove.bind(this);
            this.shadowRoot.addEventListener('mousemove', mouseMoveHandler);
            this.eventListeners.push({ element: this.shadowRoot, type: 'mousemove', handler: mouseMoveHandler });

            // Add general button mouseup listener
            const generalBtnHandler = this.handleGeneralBtn.bind(this);
            let deleteBox = this.shadowRoot.querySelector('.general-btn');
            deleteBox.addEventListener('mouseup', generalBtnHandler);
            this.eventListeners.push({ element: deleteBox, type: 'mouseup', handler: generalBtnHandler });
        }
    }

    disconnectedCallback() {
        console.log('disconnected');

        // Remove all stored event listeners
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = []; // Clear the array after removal

        this.positionRestored = false;

        this.dispatchEvent(new CustomEvent('menu-scroll-point', {
            detail: this.scrollPosition,
            bubbles: true,  // Allows the event to bubble up through the DOM
            composed: true  // Allows the event to pass through Shadow DOM boundaries
        }));
    }

    handleMouseMove(event) {
        let rect = this.folderContainer.getBoundingClientRect();
        let scrollThresholdPixels = rect.height * this.scrollThresholdPercentage;
        let scrollStartOffset = 25;

        let distanceFromBottom = rect.bottom - event.clientY;
        let distanceFromTop = event.clientY - rect.top;

        // Define max speed and easing factor for momentum
        let maxScrollSpeed = 15;
        let baseScrollSpeed = 1;
        let momentum = 0;
        let easingFactor = 0.70;

        clearInterval(this.scrollInterval);

        // Calculate variable speed based on proximity to edges
        let speedDown = Math.min(maxScrollSpeed, baseScrollSpeed + (scrollThresholdPixels - distanceFromBottom) / scrollThresholdPixels * maxScrollSpeed);
        let speedUp = Math.min(maxScrollSpeed, baseScrollSpeed + (scrollThresholdPixels - distanceFromTop) / scrollThresholdPixels * maxScrollSpeed);

        // Scroll down logic
        if (event.clientY >= rect.bottom - scrollThresholdPixels
            && event.clientY <= rect.bottom + 15
            && event.clientX >= rect.left
            && event.clientX <= rect.right) {
            this.scrollInterval = setInterval(() => {
                this.folderContainer.scrollTop += speedDown;
                momentum = speedDown; // Capture momentum
            }, 10);
        } else if (event.clientY <= rect.top + scrollThresholdPixels
            && event.clientY >= rect.top - 15
            && event.clientX >= rect.left
            && event.clientX <= rect.right) {
            this.scrollInterval = setInterval(() => {
                this.folderContainer.scrollTop -= speedUp;
                momentum = -speedUp; // Capture negative momentum for upward scrolling
            }, 10);
        } else {
            // Clear the interval but allow momentum to continue briefly
        }
        this.scrollPosition = this.folderContainer.scrollTop;
    }

    handleGeneralBtn(event) {
        this.dispatchEvent(new CustomEvent('save-general', {
            detail: '2',
            bubbles: true,  // Allows the event to bubble up through the DOM
            composed: true  // Allows the event to pass through Shadow DOM boundaries
        }));
    }

    handleFolderInput(event) {
        let folderInput = this.shadowRoot.querySelector('.folder-input input');
        this.dispatchEvent(new CustomEvent('create-folder', {
            detail: folderInput.value,
            bubbles: true,  // Allows the event to bubble up through the DOM
            composed: true  // Allows the event to pass through Shadow DOM boundaries
        }));
    }

    removeHighlight() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }

    restrictHighlighting() {
        const menuItems = this.shadowRoot.querySelectorAll('div, dialog, p, small');
        menuItems.forEach(item => {
            const preventContextMenu = event => event.preventDefault();
            item.addEventListener('contextmenu', preventContextMenu);
            this.eventListeners.push({ element: item, type: 'contextmenu', handler: preventContextMenu });

            const preventSelectStart = event => event.preventDefault();
            item.addEventListener('selectstart', preventSelectStart);
            this.eventListeners.push({ element: item, type: 'selectstart', handler: preventSelectStart });

            const preventMouseDown = event => {
                if (event.button === 2) {
                    event.preventDefault();
                }
            };
            item.addEventListener('mousedown', preventMouseDown);
            this.eventListeners.push({ element: item, type: 'mousedown', handler: preventMouseDown });

            item.draggable = false;
        });
    }
}

customElements.define('bookmark-menu', BookmarkMenu);

