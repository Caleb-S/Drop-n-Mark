
function buttonTemplate() {
  let template = document.createElement('template');
  escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
    createHTML: (to_escape) => to_escape
  })
  template.innerHTML = escapeHTMLPolicy.createHTML(`
              <style>
                :host { 
                  z-index: 2147483647 !important;
                  position: fixed !important;
                  bottom: 20px !important;
                  right: 20px !important;
                  tabindex: -1 !important;
                  outline: none !important;
                  overflow: visible !important;
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

  return template.content.cloneNode(true);
}

class FloatButton extends HTMLElement {

  constructor() {
    super();
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
    this.restrictHighlighting.bind(this);
    this.shadowRoot.addEventListener('mousedown', this.handlemousedown.bind(this));


  }

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

  handlemousedown(event) {
    try {
      this.initialX = event.clientX;
      this.initialY = event.clientY;
    } catch (error) {
      return;
    }
    console.log('mousedown')


    this.floatDragState();
  }

  handleMouseMove(event) {
    this.offsetX = event.clientX - this.initialX;
    this.offsetY = event.clientY - this.initialY;
    console.log('mousemove: ', this.offsetX, this.offsetY);

    let floatingButton = this.shadowRoot.querySelector('.float-button');
    floatingButton.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    //console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
    //this.updateFloatingButtonPosition.bind(this);

  }

  updateFloatingButtonPosition() {
    console.log('offsetX', this.offsetX, 'offsetY', this.offsetY);

    let floatingButton = this.shadowRoot.querySelector('.float-button');
    floatingButton.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    console.log(`translate(${this.offsetX}px, ${this.offsetY}px)`);
  }

  floatDragState() {
    document.addEventListener('mousemove', this.boundHandleMouseMove);
    console.log('floatDragState');
    let floatingButton = this.shadowRoot.querySelector('.float-button');
    document.addEventListener('mouseup', this.boundResetFloatBtn);
    floatingButton.classList.add('hover');
    //isFloatBtnActive = true;


    floatingButton.addEventListener('contextmenu', event => event.preventDefault());
    floatingButton.addEventListener('selectstart', event => event.preventDefault());
    floatingButton.addEventListener('mousedown', event => event.preventDefault());
    //floatingButton.textContent.draggable = false;
    //floatingButton.textContent = truncateText(document.title);
    //floatingButton.style.borderRadius = '0';
    floatingButton.style.pointerEvents = 'none';
    //document.style.cursor = 'grabbing';

    //handleMouseDown();
  }

  resetFloatBtn() {
    console.log('resetFloatBtn');
    let floatingButton = this.shadowRoot.querySelector('.float-button');
    //remove hoverstate
    floatingButton.classList.remove('hover');
    //isFloatBtnActive = false;
    //floatingButton.style.cursor = 'grab';
    document.removeEventListener('mousemove', this.boundHandleMouseMove);
    floatingButton.style.transform = 'translate3d(0, 0, 0)';
    //floatingButton.style.borderRadius = '50%';

    /*
    let ptag = floatingButton.querySelector('.ptag');
    if (ptag instanceof Node) {
      ptag.remove();
    }
    */
    //floatingButton.removeChild(ptag);


    floatingButton.style.pointerEvents = 'auto';
    document.style.cursor = 'auto';
    floatingButton.textContent = '';
    document.removeEventListener('mouseup', this.boundResetFloatBtn);


    this.offsetX = 0;
    this.offsetY = 0;
    //updateFloatingButtonPosition();

  }




  truncateText(text) {
    let maxLength = 20;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

customElements.define('bookmark-float-button', FloatButton);