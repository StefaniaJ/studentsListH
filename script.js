"use strict";

window.addEventListener("DOMContentLoaded", start);

//LINKS
let students = "http://petlatkea.dk/2019/hogwartsdata/students.json";
// let family = 'http://petlatkea.dk/2019/hogwartsdata/families.json';

// Todo: EMPTY ARREYS
let allStudents = [];
let currentList = [];
let expelledList = [];

// Set the filter
let filter = "all";

// Set the sort
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

// START FUNCTION
function start() {
  // console.log("Ready");

  // AddEventListener for sort
  document.querySelectorAll("#sort").forEach(Option => {
    Option.addEventListener("change", sortStudents);
  });

  // AddEventListener for filter
  document.querySelectorAll("#filter").forEach(option => {
    option.addEventListener("change", filterStudents);
  });

  // AddEventListener for expell a student
  listInfo.addEventListener("click", expellStudent);

  //Load JSON data
  loadJSON();
}

// LOADJSON FUNCTION
function loadJSON() {
  fetch(students)
    .then(Response => Response.json())
    .then(jsonData => {
      students = jsonData;
      // When the data loaded, prepare the students list
      prepareStudentInfo(jsonData);
    });
}

// PREPARESTUDENTINFO FUNCTION
function prepareStudentInfo(jsonData) {
  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data
    const student = Object.create(Student);

    // Interpret jsonObject into student properties
    console.log(jsonObject);

    //Edit the house name
    student.house = jsonObject.house.trim();
    student.house =
      student.house.substring(0, 1).toUpperCase() +
      student.house.substring(1).toLowerCase();

    //Fix the gender
    student.gender = jsonObject.gender;

    //Fix the id for every students students
    student.id = uuidv4();

    //Edit the name
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

  //Rebuild the list
  rebuildList();
}
//REBUILD FUNCTION
function rebuildList() {
  filterStudentsBy("all");
  sortStudentsBy("all");
  displayList(currentList);
}

//FILTER
function filterStudents(event) {
  const filterBy = event.target.value;
  // if (filterBy === "expelled") {
  //   displayList(expelledList);
  // } else {
  filterStudentsBy(filterBy);
  displayList(currentList);
  // }
}

//FILTER FUNCTION
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

// SORT
function sortStudents(event) {
  const sortBy = event.target.value;
  sortStudentsBy(sortBy);
  displayList(currentList);
}

// SORT FUNCTION
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
  // Clear the students list first
  listInfo.innerHTML = "";

  //Make a new list
  students.forEach(displayStudent);
  showList(currentList);
}
// DISPLAYSTUDENT FUNCTION
function displayStudent(student, index) {
  //Make a clone
  const template = document.querySelector("#student");
  const clone = template.cloneNode(true).content;

  //Set clone info
  clone.querySelector(".firstname").textContent =
    "First name: " + student.firstname;
  clone.querySelector(".lastname").textContent =
    "Last name: " + student.lastname;
  clone.querySelector(".house").textContent = "House name: " + student.house;

  //  Index on the remove button
  clone.querySelector("[data-action=remove]").dataset.index = index;

  // Set an id to remove button
  clone.querySelector("[data-id=remove]").dataset.id = student.id;

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

  //SHOWDETAILS FUNCTION
  function showDetails(student) {
    // Set modal info
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
    // Students img
    let imgModal = document.querySelector(".img-modal");
    imgModal.src =
      "images/" +
      student.lastname.toLowerCase() +
      "_" +
      student.firstname.substring(0, 1).toLowerCase() +
      ".png";

    // Houses img
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

    //Show the modal
    modal.classList.remove("hide");
  }

  // Append clone to list
  document.querySelector("#mainslisttudents").appendChild(clone);
}

// Modal colors
function modalColors(house) {
  root.dataset.colors = house;
}

//DISPLAYING LIST DETAILS
function showList(currentList) {
  nonExpelledStudents.textContent = allStudents.length;
  expelledStudents.textContent = expelledList.length;
  ravenclawStudents.textContent = studentsInHouses("Ravenclaw");
  slytherinStudents.textContent = studentsInHouses("Slytherin");
  gryffindorStudents.textContent = studentsInHouses("Gryffindor");
  hufflepuffStudents.textContent = studentsInHouses("Hufflepuff");

  //STUDENTS IN HOUSES FUNCTION  (made with help :D)
  function studentsInHouses(house) {
    const studentsHouse = allStudents.filter(filterBy);
    function filterBy(student) {
      if (student.house === house || house === "all") {
        return true;
      } else {
        return false;
      }
    }
    return studentsHouse.length;
  }
}
//EXPELLSTUDENT FUNCTION
function expellStudent(event) {
  const element = event.target;
  if (element.dataset.action === "remove" && element.dataset.id !== "041097") {
    const clickedId = element.dataset.id;
    // (made with help)
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

    showList(currentList, expelledList);
  } else if (element.dataset.id === "041097") {
    element.parentElement.classList.add("donttouch");
    element.parentElement.addEventListener("animationend", function() {
      element.parentElement.classList.remove("donttouch");
    });
  }
}

//Student Prototpype
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
