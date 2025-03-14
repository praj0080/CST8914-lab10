'use strict';

class MenuButtonActions {
  constructor(domNode) {
    this.domNode = domNode;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = Array.from(domNode.querySelectorAll('[role="menuitem"]'));
    this.currentIndex = 0;

    this.buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
    this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));

    this.menuitemNodes.forEach((menuitem, index) => {
      menuitem.setAttribute('tabindex', index === 0 ? '0' : '-1');
      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
      menuitem.addEventListener('click', this.onMenuitemClick.bind(this));
    });

    window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
  }

  setFocusToMenuitem(newIndex) {
    if (newIndex < 0 || newIndex >= this.menuitemNodes.length) return;

    // Remove old focus and set tabindex="-1"
    this.menuitemNodes[this.currentIndex].setAttribute('tabindex', '-1');
    
    // Set new focus and update tabindex
    this.menuitemNodes[newIndex].setAttribute('tabindex', '0');
    this.menuitemNodes[newIndex].focus();
    this.currentIndex = newIndex;
  }

  onButtonKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        this.openPopup();
        this.setFocusToMenuitem(0);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.openPopup();
        this.setFocusToMenuitem(this.menuitemNodes.length - 1);
        event.preventDefault();
        break;
      case 'Escape':
        this.closePopup();
        event.preventDefault();
        break;
    }
  }

  onMenuitemKeydown(event) {
    let newIndex = this.currentIndex;

    switch (event.key) {
      case 'Enter':
      case ' ':
        this.updatePizzaChoice(this.menuitemNodes[this.currentIndex]);
        this.closePopup();
        this.buttonNode.focus();
        event.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = (this.currentIndex + 1) % this.menuitemNodes.length;
        this.setFocusToMenuitem(newIndex);
        event.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = (this.currentIndex - 1 + this.menuitemNodes.length) % this.menuitemNodes.length;
        this.setFocusToMenuitem(newIndex);
        event.preventDefault();
        break;
      case 'Escape':
        this.closePopup();
        event.preventDefault();
        break;
    }
  }

  openPopup() {
    this.menuNode.style.display = 'block';
    this.buttonNode.setAttribute('aria-expanded', 'true');
    this.setFocusToMenuitem(0);
  }

  closePopup() {
    if (this.isOpen()) {
      this.buttonNode.removeAttribute('aria-expanded');
      this.menuNode.style.display = 'none';
    }
  }

  isOpen() {
    return this.buttonNode.getAttribute('aria-expanded') === 'true';
  }

  onButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
      this.buttonNode.focus();
    } else {
      this.openPopup();
    }
    event.preventDefault();
  }

  onMenuitemClick(event) {
    this.updatePizzaChoice(event.currentTarget);
    this.closePopup();
    this.buttonNode.focus();
  }

  updatePizzaChoice(selectedItem) {
    document.getElementById('action_output').value = selectedItem.textContent.trim();
  }

  onBackgroundMousedown(event) {
    if (!this.domNode.contains(event.target)) {
      this.closePopup();
      this.buttonNode.focus();
    }
  }
}

window.addEventListener('load', function () {
  document.getElementById('action_output').value = 'none';

  let menuButtons = document.querySelectorAll('.menu-button-actions');
  menuButtons.forEach(menuButton => {
    new MenuButtonActions(menuButton);
  });
});
