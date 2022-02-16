import { load, save } from './localStorage';

class App {
  start() {
    document.addEventListener('DOMContentLoaded', () => {
      const loadedState = load();
      if (loadedState) {
        const mainElement = document.body.querySelector('.container');
        mainElement.innerHTML = loadedState;
      }
      const items = document.querySelectorAll('.another');
      for (const item of items) {
        item.addEventListener('click', () => {
          const div = item.closest('.text');
          const trello = div.closest('.trello');
          trello.removeChild(div);
        });
      }
      this.dragNDrop();
      this.beginApp();
    });

    window.addEventListener('beforeunload', () => {
      save();
    });
  }

  beginApp() {
    const mainElement = document.body.querySelector('.container');
    const cards = mainElement.getElementsByClassName('add-card');
    const forms = mainElement.getElementsByClassName('add-tasks-control');
    const cancels = mainElement.getElementsByClassName('add-tasks-cancel');

    for (const card of cards) {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        const main = card.closest('.main');
        const form = main.getElementsByClassName('add-tasks-control')[0];
        form.classList.remove('hidden');
      });
    }

    for (const form of forms) {
      const button = form.getElementsByClassName('add-tasks-submit')[0];
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const text = form.getElementsByClassName('add-tasks-input')[0];
        if (!text.value.trim()) return;
        const main = form.closest('.main');
        const trello = main.getElementsByClassName('trello')[0];
        const textArea = document.createElement('div');
        textArea.innerText = `${text.value}`;
        text.value = '';
        textArea.classList.add('text');
        textArea.setAttribute('readonly', 'readonly');
        textArea.setAttribute('draggable', 'true');
        trello.appendChild(textArea);
        this.dragNDrop();
        form.classList.add('hidden');
      });
    }

    for (const cancel of cancels) {
      cancel.addEventListener('click', (event) => {
        event.preventDefault();
        const form = cancel.closest('.add-tasks-buttons').closest('.add-tasks-control');
        form.classList.add('hidden');
        const area = form.querySelector('textarea');
        area.value = '';
      });
    }
  }

  dragNDrop() {
    const listItems = document.querySelectorAll('.text');
    const list = document.querySelectorAll('.trello');
    let draggetItem = null;

    for (let i = 0; i < listItems.length; i += 1) {
      const item = listItems[i];

      item.addEventListener('mouseover', function () {
        this.style.backgroundColor = 'rgba(0,0,0,.2)';
        this.style.cursor = 'grabbing';
        if (this.lastChild && this.lastChild.classList !== null && this.lastChild.classList !== undefined && this.lastChild.classList.contains('another')) {
          this.lastChild.classList.remove('hidden');
          return;
        }
        const div = document.createElement('div');
        div.innerText = 'x';
        div.style.cursor = 'pointer';
        div.classList.add('another');
        this.appendChild(div);
        div.addEventListener('click', () => {
          const trello = this.closest('.trello');
          trello.removeChild(this);
        });
      });

      item.addEventListener('mouseout', function () {
        if (this.lastChild && this.lastChild.classList !== null && this.lastChild.classList !== undefined && this.lastChild.classList.contains('another')) {
          this.style.backgroundColor = 'white';
          this.style.cursor = 'default';
          this.lastChild.classList.add('hidden');
        }
      });

      item.addEventListener('dragstart', function () {
        draggetItem = item;
        draggetItem.style.cursor = 'grabbing';
        setTimeout(() => {
          if (this.lastChild && this.lastChild.classList !== null && this.lastChild.classList !== undefined && this.lastChild.classList.contains('another')) {
            item.lastChild.classList.add('hidden');
          }
          item.style.display = 'none';
        }, 0);
      });

      item.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('top-change');
      });

      item.addEventListener('dragend', () => {
        const elements = document.querySelectorAll('.top-change');
        for (const element of elements) {
          element.classList.remove('top-change');
        }
        setTimeout(() => {
          item.style.backgroundColor = 'white';
          item.style.cursor = 'default';
          item.style.display = 'block';
          draggetItem = null;
        }, 0);
      });

      for (let j = 0; j < list.length; j += 1) {
        const element = list[j];
        element.addEventListener('dragover', (e) => {
          e.preventDefault();
        });

        element.addEventListener('drop', (e) => {
          e.preventDefault();
          if (draggetItem) element.prepend(draggetItem);
        });
      }
    }
  }
}

const app = new App();
app.start();
