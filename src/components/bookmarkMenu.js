function menuTemplate() {
    var template = document.createElement('template');

    escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })

    template.innerHTML = escapeHTMLPolicy.createHTML(`
        <style>
            :host {
                font-size: 20px !important;
                color: #484952 !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
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
    
        </style>
    
       
    
           
    
        <dialog class="folder-input">
            <input type="text" placeholder="New folder name">
        </dialog>
    
        <dialog class="deleteBox"></dialog>
    
    
    
        <dialog open class="bookmarkmenu-updated" id="bookmarkMenu2">
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
        this.scrollThresholdPercentage = 0.2;
        this.scrollInterval;
    }




    connectedCallback() {
        console.log('connected');
        this.restrictHighlighting.bind(this);
        this.shadowRoot.addEventListener('mousemove', this.handleMouseMove.bind(this));

    }

    disconnectedCallback() {
        console.log('disconnected');
        this.shadowRoot.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    }




    handleMouseMove(event) {
        let folderContainer = this.shadowRoot.querySelector('.folder-container');
        let rect = folderContainer.getBoundingClientRect();
        let scrollSpeed = 7;
        let scrollThresholdPixels = rect.height * this.scrollThresholdPercentage;
        this.removeHighlight();

        if (event.clientY >= rect.bottom - scrollThresholdPixels && event.clientY <= rect.bottom && event.clientX >= rect.left && event.clientX <= rect.right) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = setInterval(() => { folderContainer.scrollTop += scrollSpeed; }, 10);
        } else if (event.clientY <= rect.top + scrollThresholdPixels && event.clientY >= rect.top && event.clientX >= rect.left && event.clientX <= rect.right) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = setInterval(() => { folderContainer.scrollTop -= scrollSpeed; }, 10);
        } else {
            clearInterval(this.scrollInterval);
        }
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



customElements.define('bookmark-menu', BookmarkMenu);