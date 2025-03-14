'use strict';

class MenuButtonActions {
  constructor(domNode, performMenuAction) {
    this.domNode = domNode;
    this.performMenuAction = performMenuAction;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = [];
    this.currentIndex = 0;

    this.buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
    this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));

    let nodes = domNode.querySelectorAll('[role="menuitem"]');

    nodes.forEach((menuitem, index) => {
      this.menuitemNodes.push(menuitem);
      menuitem.setAttribute('tabindex', index === 0 ? '0' : '-1');

      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
      menuitem.addEventListener('click', this.onMenuitemClick.bind(this));
      menuitem.addEventListener('mouseover', this.onMenuitemMouseover.bind(this));
    });

    domNode.addEventListener('focusin', this.onFocusin.bind(this));
    domNode.addEventListener('focusout', this.onFocusout.bind(this));
    window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
  }

  setFocusToMenuitem(newIndex) {
    // Ensure valid index
    if (newIndex < 0 || newIndex >= this.menuitemNodes.length) return;

    // Update tabindex for roving index technique
    this.menuitemNodes[this.currentIndex].setAttribute('tabindex', '-1');
    this.menuitemNodes[newIndex].setAttribute('tabindex', '0');

    // Move focus
    this.menuitemNodes[newIndex].focus();
    this.currentIndex = newIndex;
  }

  onButtonKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        this.openPopup();
        this.setFocusToMenuitem(0); // Focus on the first menu item
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.openPopup();
        this.setFocusToMenuitem(this.menuitemNodes.length - 1); // Focus on last menu item
        event.preventDefault();
        break;
      case 'Escape':
        this.closePopup();
        event.preventDefault();
        break;
    }
  }

  onMenuitemKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        this.updatePizzaChoice(event.currentTarget);
        this.closePopup();
        this.buttonNode.focus();
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.setFocusToMenuitem((this.currentIndex + 1) % this.menuitemNodes.length);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.setFocusToMenuitem((this.currentIndex - 1 + this.menuitemNodes.length) % this.menuitemNodes.length);
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
