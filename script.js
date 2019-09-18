"use strict";

window.addEventListener("DOMContentLoaded", start);

let students = "http://petlatkea.dk/2019/hogwartsdata/students.json";
// let family = 'http://petlatkea.dk/2019/hogwartsdata/families.json';

// Todo: Empty array for all students
let allStudents = [];
let currentList = [];
let clickedStudent;
let expelledList = [];

// Todo: Filter varible
let filter = "all";

// Todo: Sort varible
let sort;

const root = document.documentElement;

const modal = document.querySelector(".modal-bg");
// const modalList = document.querySelector(".modal");
const article = document.querySelector(".modal-content");
const close = document.querySelector(".close");
let html = document.querySelector("html");
let img = document.querySelector(".img");

function start() {
  console.log("Ready");

  // AddEventListener for sort
  document.querySelectorAll("#sort").forEach(Option => {
    Option.addEventListener("change", sortBy);
  });

  // AddEventListener for filter
  document.querySelectorAll("#filter").forEach(option => {
    option.addEventListener("change", filterBy);
  });
  modal.addEventListener("click", clickSomething);
  //Load JSON data
  loadJSON();
}

function loadJSON() {
  fetch(students)
    .then(Response => Response.json())
    .then(jsonData => {
      students = jsonData;
      // when the data loaded, display the list
      prepareStudentInfo(jsonData);
    });
}

function prepareStudentInfo(jsonData) {
  jsonData.forEach(jsonObject => {
    // TODO: Create new object with cleaned data
    const student = Object.create(Student);

    // TODO: interpret jsonObject into student properties
    console.log(jsonObject);

    student.house = jsonObject.house.trim();
    student.house =
      student.house.substring(0, 1).toUpperCase() +
      student.house.substring(1).toLowerCase();

    let info = jsonObject.fullname.trim();
    student.firstname = info.split(" ")[0];

    let firstLetter = student.firstname.substring(0, 1).toUpperCase();
    let restOfTheName = student.firstname.substring(1).toLowerCase();
    student.firstname = firstLetter + restOfTheName;

    if (info.split(" ").length === 2) {
      student.lastname = info.split(" ")[1];
      student.lastname =
        student.lastname.substring(0, 1).toUpperCase() +
        student.lastname.substring(1).toLowerCase();
    } else if (info.split(" ").length === 3) {
      student.middlename = info.split(" ")[1];
      student.lastname = info.split(" ")[2];
      student.lastname =
        student.lastname.substring(0, 1).toUpperCase() +
        student.lastname.substring(1).toLowerCase();
    } else if (info.split(" ").length === 4) {
      student.middlename = info.split(" ")[1];
      student.nickname.info.split(" ")[2];
      student.lastname = info.split(" ")[3];
      student.lastname =
        student.lastname.substring(0, 1).toUpperCase() +
        student.lastname.substring(1).toLowerCase();
    }
    student.id = uuidv4();

    allStudents.push(student);
  });
  displayList(allStudents);
}

// Filter function
function filterBy() {
  filter = this.value;
  displayList(allStudents);
}

function sortBy() {
  sort = this.value;
  allStudents.sort((a, b) => {
    return a[sort].localeCompare(b[sort]);
  });
  if (sort == "all") {
    start();
  }
  //   if (sort == "firstname") {
  //     allStudents.sort((a, b) => {
  //       return a[sort].localeCompare(b[sort]);
  //     });

  //   else if (sort == "lastname") {
  //     allStudents.sort((a, b) => {
  //       return a.lastname.localeCompare(b.lastname);
  //     });
  //   } else if (sort == "house") {
  //     allStudents.sort((a, b) => {
  //       return a.house.localeCompare(b.house);
  //     });
  //   } else if (sort == "all") {
  //     start();
  //   }
  displayList(allStudents);
}

function displayList(students) {
  //clear the students list
  document.querySelector("ol").innerHTML = "";

  //make a new list
  students.forEach(displayStudent);
}

function displayStudent(student, index) {
  //filter list
  if (filter == student.house || filter == "all") {
    //make a clone
    const template = document.querySelector("#student");
    const clone = template.cloneNode(true).content;

    //set clone data
    clone.querySelector(".firstname").textContent =
      "First name: " + student.firstname;
    clone.querySelector(".lastname").textContent =
      "Last name: " + student.lastname;
    clone.querySelector(".house").textContent = "House name: " + student.house;

    clone.querySelector(".btn").addEventListener("click", () => {
      showDetails(student);
    });

    function showDetails(student) {
      if (student.middlename !== "-middlename-") {
        modal.querySelector(".middlename-modal").textContent =
          "Middle name:" + student.middlename;
      } else {
        modal.querySelector(".middlename-modal").textContent = "";
      }

      if (student.nickname !== "-nickname-") {
        modal.querySelector(".nickname-modal").textContent =
          "Nick name:" + student.nickname;
      } else {
        modal.querySelector(".nickname-modal").textContent = "";
      }

      modal.querySelector(".firstname-modal").textContent =
        "First name: " + student.firstname;
      modal.querySelector(".lastname-modal").textContent =
        "Last name: " + student.lastname;
      modal.querySelector(".house-modal").textContent =
        "House name: " + student.house;

      const imgModal = document.querySelector(".img-modal");
      imgModal.src =
        "images/" +
        student.lastname.toLowerCase() +
        "_" +
        student.firstname.substring(0, 1).toLowerCase() +
        ".png";
      // // 2 students with the same last name or no picture or last name wit a dash
      // let i = 0;
      // imgModal.addEventListener("error", imgError);
      // function imgError() {
      //   if (i == 0) {
      //     imgModal.src =
      //       "images/" +
      //       student.lastname.toLowerCase() +
      //       "_" +
      //       student.firstname.toLowerCase() +
      //       ".png";
      //     i++;
      //     // const noImg = document.querySelector(".noImg");
      //     // noImg.classList.remove("hide");
      //   } else if (i == 1) {
      //     let secondLastName = student.lastname.slice(
      //       student.lastname.indexOf("-") + 1
      //     );
      //     imgModal.src =
      //       "images/" +
      //       secondLastName.toLowerCase() +
      //       "_" +
      //       student.firstname.substring(0, 1).toLowerCase() +
      //       ".png";
      //     i++;
      //   }
      // }

      document.querySelector(
        ".house-img-modal"
      ).src = `images/houses/${student.house}.png`;

      clickedStudent = event.target.parentElement;
      const removeBtn = document.querySelector("[data-action=remove]");
      removeBtn.dataset.index = index;
      removeBtn.dataset.attribute = student.id;
      console.log(student.id);

      console.log(student.house);

      modalColors(student.house);
      modal.classList.remove("hide");
    }

    //append clone to list
    document.querySelector("ol").appendChild(clone);
  }
}

// modal colors
function modalColors(house) {
  root.dataset.colors = house;
}

// Our prototpype Student
const Student = {
  firstname: "-firstname-",
  lastname: "-lastname-",
  middlename: "-middlename-",
  nickname: "-nickname-",
  house: "-house-",
  id: "-id-"
};

//Add global eventListeners
close.addEventListener("click", () => modal.classList.add("hide"));

// Function ClickSomething

function clickSomething(event) {
  //   console.table(currentList);
  let element = event.target;

  if (element.dataset.action === "remove") {
    // console.log(`remove button clicked ${element} `);

    const clickedId = element.dataset.attribute;

    function findById(arr, index) {
      function findId(student) {
        if (index === student.id) {
          return true;
        } else {
          return false;
        }
      }
      return arr.findIndex(findId);
    }

    let listId = findById(allStudents, clickedId);
    let currentListId = findById(currentList, clickedId);
    // element.parentElement.parentElement.remove();
    console.table(student);
    console.log(allStudents[listId]);
    console.log(listId);
    currentList.push(allStudents[listId]);
    expelledList.push(allStudents[listId]);
    document.querySelector("#expelledStudents").innerHTML = expelledList.length;
    document.querySelector("#nonExpelledStudents").innerHTML =
      allStudents.length - 1;

    // currentList.splice(currentListId, 1);
    allStudents.splice(listId, 1);
    clickedStudent.remove();
    modal.classList.add("hide");
  } else {
    console.log("not working");
  }
  console.table(allStudents);
}

function uuidv4() {
  return "xxxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 8) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x4;
    return v.toString(16);
  });
}

console.log(uuidv4());
