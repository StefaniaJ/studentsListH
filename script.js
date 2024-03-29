"use strict";

window.addEventListener("DOMContentLoaded", start);

//LINKS
let students = "http://petlatkea.dk/2019/hogwartsdata/students.json";
let familyJSON = "http://petlatkea.dk/2019/hogwartsdata/families.json";

// Todo: EMPTY ARREYS
let allStudents = [];
let currentList = [];
let expelledList = [];
let prefectList = [];

// Set the filter
let filter = "all";

// Set the sort
let sort;

// GLOBAL VARIABLES
const root = document.documentElement;
const modal = document.querySelector(".modal-bg");
const close = document.querySelector(".close");
const listInfo = document.querySelector("#mainslisttudents");
const displayExpelledList = document.querySelector("#displayExpelledList");

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

  // AddEventListener for showing expelled students
  displayExpelledList.addEventListener("click", seeExpelled);

  //Load JSON data
  loadJSON();
}

// SEEEXPELLED FUNCTION
function seeExpelled() {
  displayList(expelledList);
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

    //Expelled status
    student.expelled = false;

    //Prefect status
    // student.prefect = false;

    //Squad status
    // student.squad = false;

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
  newStudent.expelled = false;
  // newStudent.prefect = false;
  // newStudent.squad = false;
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
  filterStudentsBy(filterBy);
  displayList(currentList);
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
function sortStudentsBy(sortBy) {
  //if sortBy is not all, sort by another option
  if (sortBy != "all") {
    currentList.sort((a, b) => {
      return a[sortBy].localeCompare(b[sortBy]);
    });
  }
  displayList(currentList);
}

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
  clone.querySelectorAll("[data-field]").forEach(field => {
    const prop = field.dataset.field;
    field.textContent = student[prop];
  });

  //  Index on the remove button
  clone.querySelector("[data-action=remove]").dataset.index = index;

  // Set an id to remove button
  clone.querySelector("[data-id=remove]").dataset.id = student.id;

  const prefectTemp = clone.querySelector("[data-field=prefect]");
  prefectTemp.dataset.id = student.id;
  prefectTemp.addEventListener("click", addPrefectStatus);

  clone.querySelector(".img-template").src =
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
    modal.querySelectorAll("[data-field]").forEach(field => {
      const prop = field.dataset.field;
      field.textContent = student[prop];
    });

    if (student.middlename == "-middlename-") {
      modal.querySelector(".middlename").classList.add("hide");
    } else {
      modal.querySelector(".middlename").classList.remove("hide");
    }

    if (student.nickname == "-nickname-") {
      modal.querySelector(".nickname").classList.add("hide");
    } else {
      modal.querySelector(".nickname").classList.remove("hide");
    }

    if (student.expelled) {
      document.querySelector("[data-field=expell]").innerHTML =
        "STUDENT EXPELLED";
    }

    if (student.prefect) {
      document.querySelector(".prefect-modal").classList.add("prefectActiv");
      document.querySelector(".prefect-modal").classList.add("glow");
    } else {
      document.querySelector(".prefect-modal").classList.remove("prefectActiv");
      document.querySelector(".prefect-modal").classList.remove("glow");
    }

    //Inquisitorial squad
    const squadClass = document.querySelector(".squad-modal");
    squadClass.dataset.id = student.id;
    squadClass.addEventListener("click", addSquadStatus);

    //Students img
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

    //Set the color for each house
    modalColors(student.house);

    //Show the modal
    modal.classList.remove("hide");

    // Call loadFamilyBloodStatus Function to load the json
    loadFamilyBloodStatus();

    // loadFamilyBloodStatus FUNCTION
    function loadFamilyBloodStatus() {
      fetch(familyJSON)
        .then(response => response.json())
        .then(familyBloodStatus => {
          checkFamilyBloodStatus(familyBloodStatus);
        });
    }
    //  Check family blood status FUNCTION
    function checkFamilyBloodStatus(familyBloodStatus) {
      const bloodInfo = document.querySelector("[data-field=blood]");
      if (familyBloodStatus.half.includes(`${student.lastname}`)) {
        bloodInfo.textContent = "halfblood";
      } else if (familyBloodStatus.pure.includes(`${student.lastname}`)) {
        bloodInfo.textContent = "pureblood";
      } else {
        bloodInfo.textContent = "not pure";
      }
    }
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
  const nonExpelledStudents = document.querySelector(".nonExpelledStudents");
  const expelledStudents = document.querySelector(".expelledStudents");
  const gryffindorStudents = document.querySelector(".gryffindorStudents");
  const ravenclawStudents = document.querySelector(".ravenclawStudents");
  const hufflepuffStudents = document.querySelector(".hufflepuffStudents");
  const slytherinStudents = document.querySelector(".slytherinStudents");

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
    expelledList.forEach(student => {
      student.expelled = true;
    });

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

//MAKE PREFECT FUNCTION
function addPrefectStatus(event) {
  let element = event.target;
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
  const listId = findById(allStudents, clickedId);
  const currentListId = findById(currentList, clickedId);
  const prefectId = findById(prefectList, clickedId);
  const studentHouse = allStudents[listId].house;
  let counter = 0;
  let currentPrefect = [];

  for (let i = 0; i < prefectList.length; i++) {
    if (studentHouse == prefectList[i].house) {
      counter++;
      currentPrefect.push(prefectList[i]);
    }
  }

  if (
    allStudents[listId].prefect == true ||
    currentList[currentListId].prefect == true
  ) {
    allStudents[listId].prefect = false;
    currentList[currentListId].prefect = false;
    prefectList.splice(prefectId, 1);
    element.classList.remove("prefectActiv");
  } else if (counter < 2) {
    allStudents[listId].prefect = true;
    currentList[currentListId].prefect = true;
    prefectList.push(allStudents[listId]);
    element.classList.add("prefectActiv");
  } else {
    alert(
      `There are already two prefects in the same house! First, revoke a student's prefect status from a house if you want to add another one. The current prefects' students are: ${currentPrefect[0].firstname} and ${currentPrefect[1].firstname}!`
    );
  }
}

//MAKE INQUISITORIAL SQUAD FUNCTION
function addSquadStatus(event) {
  const squadClass = document.querySelector(".squad-modal");
  let element = event.target;
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
  const listId = findById(allStudents, clickedId);
  const currentListId = findById(currentList, clickedId);
  if (
    allStudents[listId].squad == true ||
    currentList[currentListId].squad == true
  ) {
    allStudents[listId].squad = false;
    currentList[currentListId].squad = false;
    squadClass.classList.remove("glow");
  } else if (allStudents[listId].house == "Slytherin") {
    allStudents[listId].squad = true;
    currentList[currentListId].squad = true;
    console.log("students added squad status");
    squadClass.classList.add("glow");
  } else {
    alert(
      "Only students from Slytherin house can be added to Inquisitorial Squad!"
    );
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
  id: "-id-",
  expelled: false,
  prefect: "",
  squad: " "
};

//Add global eventListeners
close.addEventListener("click", () => modal.classList.add("hide"));

//HOW TO CREATE UUID
//This function will give us an unique id for every students
// source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 8) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x4;
    return v.toString(16);
  });
}
// console.log(uuidv4());
