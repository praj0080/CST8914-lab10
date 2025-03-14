/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *   Desc: Menu button that opens a menu of actions with improved accessibility.
 */

'use strict';

class MenuButtonActions {
  constructor(domNode, performMenuAction) {
    this.domNode = domNode;
    this.performMenuAction = performMenuAction;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = [];
    this.firstMenuitem = null;
    this.lastMenuitem = null;
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

      if (!this.firstMenuitem) {
        this.firstMenuitem = menuitem;
      }
      this.lastMenuitem = menuitem;
    });

    domNode.addEventListener('focusin', this.onFocusin.bind(this));
    domNode.addEventListener('focusout', this.onFocusout.bind(this));
    window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
  }

  setFocusToMenuitem(newMenuitem) {
    this.menuitemNodes.forEach(item => item.setAttribute('tabindex', '-1'));
    newMenuitem.setAttribute('tabindex', '0');
    newMenuitem.focus();
    this.currentIndex = this.menuitemNodes.indexOf(newMenuitem);
  }

  onButtonKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        this.openPopup();
        this.setFocusToFirstMenuitem();
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.openPopup();
        this.setFocusToLastMenuitem();
        event.preventDefault();
        break;
      case 'Escape':
        this.closePopup();
        event.preventDefault();
        break;
    }
  }

  onMenuitemKeydown(event) {
    let selectedItem = event.currentTarget;
    switch (event.key) {
        case 'Enter':
        case ' ':
            this.updatePizzaChoice(selectedItem);
            this.closePopup();
            this.buttonNode.focus();
            event.preventDefault();
            break;
        case 'ArrowDown':
            this.setFocusToNextMenuitem(selectedItem);
            event.preventDefault();
            break;
        case 'ArrowUp':
            this.setFocusToPreviousMenuitem(selectedItem);
            event.preventDefault();
            break;
        case 'Escape':
            this.closePopup();
            event.preventDefault();
            break;
    }
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToNextMenuitem(currentMenuitem) {
    let index = this.menuitemNodes.indexOf(currentMenuitem);
    let newIndex = (index + 1) % this.menuitemNodes.length;
    this.setFocusToMenuitem(this.menuitemNodes[newIndex]);
  }

  setFocusToPreviousMenuitem(currentMenuitem) {
    let index = this.menuitemNodes.indexOf(currentMenuitem);
    let newIndex = (index - 1 + this.menuitemNodes.length) % this.menuitemNodes.length;
    this.setFocusToMenuitem(this.menuitemNodes[newIndex]);
  }

  openPopup() {
    this.menuNode.style.display = 'block';
    this.buttonNode.setAttribute('aria-expanded', 'true');
    this.setFocusToFirstMenuitem();
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
