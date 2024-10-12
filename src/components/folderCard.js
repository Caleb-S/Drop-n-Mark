
function folderCardTemplate() {
    template = document.createElement('template');
    let escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })
    template.innerHTML = escapeHTMLPolicy.createHTML(` 
        <style> 
        :host {
            width: 100% !important;
            align-items: flex-end !important;
            display: flex !important;
            flex-direction: column !important;
        }

        div {
            display: flex;
            overflow: hidden;
        }

        p {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 600;
            text-align: center;
            text-decoration: none;
            width: auto;
            white-space: nowrap;
            pointer-events: none;
            margin: 0px;

            display: flex;
            align-items: center;
            flex: auto;
            justify-content: center;
        }

        :hover {
            box-shadow: none;
            color: white;  
        }

        .main-folder:hover, .sub-folder:hover, .nested-folder:hover  {
            border: 2px solid #48495244;
        }

        .main-folder, .sub-folder, .nested-folder {
            box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
            box-sizing: border-box;
            margin-bottom: 5px;
            margin-right: 5%;
            align-items: start;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow: hidden;
            /* border: 2px solid transparent; */
        }

        /* Main Folder */

        .main-folder {
            min-height: 60px;
            width: 90%;
            margin-top: 5px;
            padding-left: 95px;
            background-color: #ffffff;

            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);

            text-align: left;

            color: #585B62;
            font-size: 23px;
        }

        

        .main-folder:hover {
            background-color: #dcdcdc;
        }
 

        .main-add-folder {
            min-height: 60px;

            width: 80px;

            position: absolute;
            top: 0%;
            bottom: 0%;
            left: 0%;
            right: auto;

            justify-content: center;
            align-items: center;

            background-color: #ECECEC;
            
        }

        .main-add-folder:hover {
            background-color: #999999;
          

        }

        /* Sub Folder */

        .sub-folder {
            min-height: 50px;
            width: 85%;
            margin-top: 1px;
            padding-left: 75px;
            /* background-color: #fdba74; */
            background-color: #D4D4D4;


            color: #57534e;
            font-size: 20px;
        }

        .sub-folder:hover {
            background-color: #f59d4e;
            background-color: #bfbdbd;
     
        }

        .sub-add-folder {
            min-height: 50px;

            width: 60px;
            
            position: absolute;
            top: 0%;
            bottom: 0%;
            left: 0%;
            right: auto;

            justify-content: center;
            align-items: center;

            /* background-color: #EBC9A6; */
            background-color: #ECECEC;
        }

        .sub-add-folder:hover {
            background-color: #b17842;
            background-color: #5b5550;
            background-color: #999999;
        }


        .nested-folder {
            min-height: 40px;
            width: 67%;
            margin-top: 0px;
            padding-left: 17px;
            /* background-color: #C5C1B4; */
            background-color: #9E9E9E;

            /* color: #57534e; */
            color: #f7f4ee;
            font-size: 17px;
        }

        .nested-folder:hover {
            background-color: #a79e91;
            background-color: #737373;
        }
        
        img {
            pointer-events: none;    
        }


        </style>

        <div id='container' >
            <div id='folder-button'></div>
            <p>
                <slot></slot>
            </p>
        </div>
    

        `);

    return template.content.cloneNode(true);
}


class FolderCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(folderCardTemplate());
        this.buttonType;
        this.container = this.shadowRoot.getElementById('container');
        this.folderBtn = this.shadowRoot.getElementById('folder-button');

        // Bind the event handlers to ensure correct context
        this.handleMouseUpOnContainer = this.handleMouseUpOnContainer.bind(this);
        this.handleMouseUpOnFolderBtn = this.handleMouseUpOnFolderBtn.bind(this);
    }

    connectedCallback() {
        this.buttonType = this.getAttribute('type');
        let imgSrc = this.getAttribute('src');

        // Set up the folder card based on the button type
        if (this.buttonType === 'main') {
            this.container.classList.add('main-folder');
            this.folderBtn.classList.add('main-add-folder');
            this.folderBtn.innerHTML = `<img src="${imgSrc}">`;
        } else if (this.buttonType === 'sub') {
            this.container.classList.add('sub-folder');
            this.folderBtn.classList.add('sub-add-folder');
            this.folderBtn.innerHTML = `<img src="${imgSrc}">`;
        } else if (this.buttonType === 'nested') {
            this.container.classList.add('nested-folder');
            this.folderBtn.style.display = 'none';
        }

        // Add event listeners
        this.container.addEventListener('mouseup', this.handleMouseUpOnContainer);
        this.folderBtn.addEventListener('mouseup', this.handleMouseUpOnFolderBtn);
    }

    disconnectedCallback() {
        // Clean up event listeners
        this.container.removeEventListener('mouseup', this.handleMouseUpOnContainer);
        this.folderBtn.removeEventListener('mouseup', this.handleMouseUpOnFolderBtn);
    }

    handleMouseUpOnContainer(event) {
        if (event.target !== this.folderBtn) {
            this.dispatchEvent(new CustomEvent('create-bookmark', {
                detail: event.detail,
                bubbles: true,  // Allows the event to bubble up through the DOM
                composed: true  // Allows the event to pass through Shadow DOM boundaries
            }));
        }
    }

    handleMouseUpOnFolderBtn(event) {
        this.dispatchEvent(new CustomEvent('create-sub-folder', {
            detail: event.detail,
            bubbles: true,  // Allows the event to bubble up through the DOM
            composed: true  // Allows the event to pass through Shadow DOM boundaries
        }));
    }
}

customElements.define('bookmark-folder-card', FolderCard);

