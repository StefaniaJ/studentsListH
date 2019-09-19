"use strict";

window.addEventListener("DOMContentLoaded", start);

//LINKS
let students = "http://petlatkea.dk/2019/hogwartsdata/students.json";
// let family = 'http://petlatkea.dk/2019/hogwartsdata/families.json';

// Todo: EMPTY ARREYS
let allStudents = [];
let currentList = [];
let expelledList = [];

// Todo: Set the filter
let filter = "all";

// Todo: Set the sort
let sort;

// GLOBAL VARIABLES
const root = document.documentElement;
const modal = document.querySelector(".modal-bg");
const article = document.querySelector(".modal-content");
const close = document.querySelector(".close");

const nonExpelledStudents = document.querySelector(".nonExpelledStudents");
const expelledStudents = document.querySelector(".expelledStudents");
const gryffindorStudents = document.querySelector(".gryffindorStudents");
const ravenclawStudents = document.querySelector(".ravenclawStudents");
const hufflepuffStudents = document.querySelector(".hufflepuffStudents");
const slytherinStudents = document.querySelector(".slytherinStudents");
const listInfo = document.querySelector("#mainslisttudents");

function start() {
  console.log("Ready");

  // AddEventListener for sort
  document.querySelectorAll("#sort").forEach(Option => {
    Option.addEventListener("change", sortStudents);
  });

  // AddEventListener for filter
  document.querySelectorAll("#filter").forEach(option => {
    option.addEventListener("change", filterStudents);
  });
  // modal.addEventListener("click", clickSomething);

  listInfo.addEventListener("click", expellStudent);
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
    student.gender = jsonObject.gender;
    student.id = uuidv4();

    allStudents.push(student);
  });
  //Create a new student
  const newStudent = Object.create(Student);
  newStudent.firstname = "Janina";
  newStudent.middlename = "Stefania";
  newStudent.lastname = "Olteanu";
  newStudent.house = "Gryffindor";
  newStudent.gender = "girl";
  newStudent.id = "041097";
  allStudents.push(newStudent);
  rebuildList();
}

function rebuildList() {
  filterStudentsBy("all");
  sortStudentsBy("all");
  displayList(currentList);
}

function filterStudents(event) {
  const filterBy = event.target.value;
  // if (filterBy === "expelled") {
  //   displayList(expelledList);
  // } else {
  filterStudentsBy(filterBy);
  displayList(currentList);
  // }
}

//FILTER DATA FUNCTION
function filterStudentsBy(filterBy) {
  currentList = allStudents.filter(filterByHouse);
  function filterByHouse(student) {
    if (student.house === filterBy || filterBy === "all") {
      return true;
    } else {
      return false;
    }
  }
  return currentList.length;
}

// SORT FUNCTION
function sortStudents(event) {
  const sortBy = event.target.value;
  sortStudentsBy(sortBy);
  displayList(currentList);
}

function sortStudentsBy(prop) {
  currentList.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
}

// function sortBy() {
//   sort = this.value;

//   // currentList = allStudents;
//   allStudents.sort((a, b) => {
//     return a[sort].localeCompare(b[sort]);
//   });

// // if (sort == "firstname") {
// //   allStudents.sort((a, b) => {
// //     return a[sort].localeCompare(b[sort]);
// //   });
// // } else if (sort == "lastname") {
// //   allStudents.sort((a, b) => {
// //     return a.lastname.localeCompare(b.lastname);
// //   });
// // } else if (sort == "house") {
// //   allStudents.sort((a, b) => {
// //     return a.house.localeCompare(b.house);
// //   });
// // } else if (sort == "all") {
// //   start();
// // }
//   displayList(allStudents);
// }

function displayList(students) {
  //clear the students list
  document.querySelector("#mainslisttudents").innerHTML = "";

  //make a new list
  students.forEach(displayStudent);
  displayListDetails(currentList);
}

function displayStudent(student, index) {
  //make a clone
  const template = document.querySelector("#student");
  const clone = template.cloneNode(true).content;

  //set clone data
  clone.querySelector(".firstname").textContent =
    "First name: " + student.firstname;
  clone.querySelector(".lastname").textContent =
    "Last name: " + student.lastname;
  clone.querySelector(".house").textContent = "House name: " + student.house;

  // store the index on the button
  clone.querySelector("[data-action=remove]").dataset.index = index;

  // add uuid as the ID to the remove-button as a data attribute
  clone.querySelector("[data-id=uuid]").dataset.id = student.id;

  let imgTemp = clone.querySelector(".img-template");
  imgTemp.src =
    "images/" +
    student.lastname.toLowerCase() +
    "_" +
    student.firstname.substring(0, 1).toLowerCase() +
    ".png";

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
    modal.querySelector(".gender-modal").textContent =
      "Gender: " + student.gender;

    let imgModal = document.querySelector(".img-modal");
    imgModal.src =
      "images/" +
      student.lastname.toLowerCase() +
      "_" +
      student.firstname.substring(0, 1).toLowerCase() +
      ".png";
    // 2 students with the same last name or no picture or last name wit a dash
    let i = 0;
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

    // clickedStudent = event.target.parentElement;
    // const removeBtn = document.querySelector("[data-action=remove]");
    // removeBtn.dataset.index = index;
    // removeBtn.dataset.attribute = student.id;
    // console.log(student.id);

    // console.log(student.house);

    modalColors(student.house);
    modal.classList.remove("hide");
  }

  //append clone to list
  document.querySelector("#mainslisttudents").appendChild(clone);
}

// modal colors
function modalColors(house) {
  root.dataset.colors = house;
}

//DISPLAYING LIST DETAILS
function displayListDetails(currentList) {
  nonExpelledStudents.textContent = allStudents.length;
  expelledStudents.textContent = expelledList.length;
  ravenclawStudents.textContent = countStudentsHouse("Ravenclaw");
  slytherinStudents.textContent = countStudentsHouse("Slytherin");
  gryffindorStudents.textContent = countStudentsHouse("Gryffindor");
  hufflepuffStudents.textContent = countStudentsHouse("Hufflepuff");

  function countStudentsHouse(house) {
    // return allStudents.filter(x => x.house === house).length;
    let group = allStudents.filter(filterBy);
    function filterBy(student) {
      if (student.house === house || house === "all") {
        return true;
      } else {
        return false;
      }
    }
    return group.length;
  }
  console.log(expelledList);
}
//EXPELLING STUDENTS
function expellStudent(event) {
  let element = event.target;
  if (element.dataset.action === "remove" && element.dataset.id !== "041097") {
    const clickedId = element.dataset.id;

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

    expelledList.push(currentList[currentListId]);

    currentList.splice(currentListId, 1);
    allStudents.splice(listId, 1);

    element.parentElement.classList.add("remove");
    element.parentElement.addEventListener("animationend", function() {
      element.parentElement.remove();
    });
    displayListDetails(currentList, expelledList);
  } else if (element.dataset.id === "041097") {
    element.parentElement.classList.add("donttouch");
    element.parentElement.addEventListener("animationend", function() {
      element.parentElement.classList.remove("donttouch");
    });
  }
}

// Our prototpype Student
const Student = {
  firstname: "-firstname-",
  lastname: "-lastname-",
  middlename: "-middlename-",
  nickname: "-nickname-",
  house: "-house-",
  gender: "-gender-",
  id: "-id-"
};

//Add global eventListeners
close.addEventListener("click", () => modal.classList.add("hide"));

//HOW TO CREATE UUID
// source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 8) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x4;
    return v.toString(16);
  });
}
// console.log(uuidv4());
