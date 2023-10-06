"use strict";

const form = document.querySelector("[data-form]");
const lists = document.querySelector("[data-lists]");
const input = document.querySelector("[data-input]");

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
  toDoArr = [...toDoArr, todo];
  UI.displayData();
  UI.clearInput();

  // REMOVE TASK FROM THE DOM
  UI.removeToDo();

  // ADD TO STORAGE
  Storage.addToStorage(toDoArr);
});

// MAKE OBJECT INSTANCE
class Todo {
  constructor(id, todo) {
    this.id = id;
    this.todo = todo;
  }
}

// DISPLAY TODO ON DOM
class UI {
  static displayData() {
    let displayData = toDoArr.map((item) => {
      return `
        <div class="todo">
          <p>${item.todo}</p>
          <span class="remove" data-id = ${item.id}>🗑️</span>
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
        e.target.parentElement.remove();
      }
      let btnId = e.target.dataset.id;
      // REMOVE FROM ARRAY
      UI.removeArrayToDo(btnId);
    });
  }

  static removeArrayToDo(id) {
    toDoArr = toDoArr.filter((item) => item.id !== +id);
    Storage.addToStorage(toDoArr);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  UI.displayData();

  // REMOVE FROM THE DOM
  UI.removeToDo();
});
