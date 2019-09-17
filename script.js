"use strict";

window.addEventListener("DOMContentLoaded", start);

let students = "http://petlatkea.dk/2019/students1991.json";
// let students = "http://petlatkea.dk/2019/hogwartsdata/students.json";
// let family = 'http://petlatkea.dk/2019/hogwartsdata/families.json';

// Todo: Empty array for all students
let allStudents = [];

// Todo: Filter varible
let filter = "all";

// Todo: Sort varible
let sort;

const modal = document.querySelector(".modal-bg");
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
    student.house = jsonObject.house.toUpperCase();

    const info = jsonObject.fullname.split(" ");
    student.firstname = info[0];
    //   student.middlename = info[1];
    //   student.nickname = info[2];
    student.lastname = info[1];
    console.log(info);

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

  if (sort == "firstname") {
    allStudents.sort((a, b) => {
      return a.firstname.localeCompare(b.firstname);
    });
  } else if (sort == "lastname") {
    allStudents.sort((a, b) => {
      return a.lastname.localeCompare(b.lastname);
    });
  } else if (sort == "house") {
    allStudents.sort((a, b) => {
      return a.house.localeCompare(b.house);
    });
  } else if (sort == "all") {
    start();
  }
  displayList(allStudents);
}

function displayList(students) {
  //clear the students list
  document.querySelector("ol").innerHTML = "";

  //make a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  //filter list
  if (filter == student.house || filter == "all") {
    //make a clone
    const template = document.querySelector("#student");
    const clone = template.cloneNode(true).content;

    //set clone data
    clone.querySelector(".firstname").textContent =
      "First name: " + student.firstname;
    clone.querySelector(".middlename").textContent =
      "Middle name: " + student.middlename;
    clone.querySelector(".nickname").textContent =
      "Nick name: " + student.nickname;
    clone.querySelector(".lastname").textContent =
      "Last name: " + student.lastname;
    clone.querySelector(".house").textContent = "House name: " + student.house;

    clone.querySelector(".btn").addEventListener("click", () => {
      showDetails(student);
    });

    function showDetails(student) {
      modal.querySelector(".firstname-modal").textContent =
        "First name: " + student.firstname;
      modal.querySelector(".lastname-modal").textContent =
        "Last name: " + student.lastname;
      modal.querySelector(".house-modal").textContent =
        "House name: " + student.house;
      console.log(student.house);

      if (student.house == "Gryffindor" || "gryffindor") {
        article.style.backgroundColor = "red";
        article.style.color = "#fff";
        // img.src = "images/abbott_h.png";
      } else if (student.house == "Hufflepuff") {
        article.style.backgroundColor = "orange";
        article.style.color = "#fff";
      } else if (student.house == "Slytherin") {
        article.style.backgroundColor = "green";
        article.style.color = "#fff";
      } else if (student.house == "Ravenclaw") {
        article.style.backgroundColor = "blue";
        article.style.color = "#fff";
      }

      // html.setAttribute(
      //   "data-attribute",
      //   `${student.house.toLowerCase()}-colors`
      // );

      modal.classList.remove("hide");
    }
    // //ADDING HOUSE ATTRIBUTE
    // clone.querySelector("tr").setAttribute("house", student.house);

    //append clone to list
    document.querySelector("ol").appendChild(clone);
  }
}

// Our prototpype Student
const Student = {
  firstname: "-firstname-",
  lastname: "-lastname-",
  middlename: "-middlename-",
  nickname: "-nickname-",
  house: "-house-"
};

//Add global eventListeners
close.addEventListener("click", () => modal.classList.add("hide"));
