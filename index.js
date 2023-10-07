"use strict";

const form = document.querySelector("[data-form]");
const lists = document.querySelector("[data-lists]");
const input = document.querySelector("[data-input]");
const removeAllBtn = document.querySelector(".removeAll__btn");

// LOCAL STORAGE
class Storage {
  static addToStorage(toDoArr) {
    let storage = localStorage.setItem("todo", JSON.stringify(toDoArr));
    return storage;
  }

  static getStorage() {
    let storage =
      localStorage.getItem("todo") === null
        ? []
        : JSON.parse(localStorage.getItem("todo"));
    return storage;
  }
}

// EMPTY ARR
let toDoArr = Storage.getStorage();

// FORM PART
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = Math.random() * 100000;
  const todo = new Todo(id, input.value);

  // ADDING TASK TO ARR
  toDoArr = [...toDoArr, todo];
  UI.displayData();
  UI.clearInput();

  // ADD TO STORAGE
  Storage.addToStorage(toDoArr);

  UI.removeBtn();
});

// MAKE OBJECT INSTANCE
class Todo {
  date = new Date();

  constructor(id, todo) {
    this.id = id;
    this.todo = todo;
    this.setTime();
  }

  setTime() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.dateFormat = `${months[this.date.getMonth()]}, ${this.date.getDate()}`;
  }
}

// DISPLAY TODO ON DOM
class UI {
  static displayData() {
    let displayData = toDoArr.map((item) => {
      return `
        <div class="todo">
          <p class="todo__text">${item.todo}</p>
          <div class="icon">
            <p class="date__format">${item.dateFormat}</p>
            <span class="remove" data-id = ${item.id}>🗑️</span>
            <span class="edit" data-id = ${item.id}>🖊️</span>
          </div>
        </div>
      `;
    });
    lists.innerHTML = displayData.join(" ");
  }

  static clearInput() {
    input.value = "";
  }

  static removeToDo() {
    lists.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        e.target.parentElement.parentElement.remove();
        let btnId = e.target.dataset.id;
        // REMOVE FROM ARRAY
        UI.removeArrayToDo(btnId);
        UI.removeBtn();
      }
    });
  }

  static removeArrayToDo(id) {
    toDoArr = toDoArr.filter((item) => item.id !== +id);
    Storage.addToStorage(toDoArr);
  }

  static editBtn() {
    let iconChange = true;
    lists.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit")) {
        let p = e.target.parentElement.parentElement.firstElementChild;
        const btnId = e.target.dataset.id;
        if (iconChange) {
          p.setAttribute("contentEditable", "true");
          p.focus();
          e.target.textContent = "Save";
          p.style.color = "blue";
        } else {
          e.target.textContent = "🖊️";
          p.style.color = "black";
          p.removeAttribute("contentEditable");
          const newArr = toDoArr.findIndex((item) => item.id === +btnId);
          toDoArr[newArr].todo = p.textContent;
          Storage.addToStorage(toDoArr);
        }
      }
      iconChange = !iconChange;
    });
  }

  static removeAll() {
    removeAllBtn.addEventListener("click", () => {
      toDoArr.length = 0;
      localStorage.clear();
      UI.displayData();
      UI.removeBtn();
    });
  }

  static removeBtn() {
    if (toDoArr.length <= 0) {
      removeAllBtn.style.display = "none";
    } else {
      removeAllBtn.style.display = "flex";
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  UI.displayData();

  // REMOVE FROM THE DOM
  UI.removeToDo();

  // EDIT TASKS
  UI.editBtn();

  // REMOVE ALL TASKS
  UI.removeAll();

  // SHOW AND HIDE REMOVE ALL BTN
  UI.removeBtn();
});
