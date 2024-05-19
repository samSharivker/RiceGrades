import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, set, child, get, update, remove } from "firebase/database";
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const Teacher = (props) => {
    const [user] = useState(props);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => console.log("Sign Out"))
            .catch((error) => console.log(error));
    };

    /*
    Needs to be turned into a component eventually
    This is just a more clean way to display error messages to the user so try to use this instead of just an alert
    https://github.com/apvarun/toastify-js/blob/master/README.md
    */
    const dbRef = ref(db);
    function errorToast(msg) {
      Toastify({

        text: `Error: ${msg}`,
        gravity: "bottom",
        position: "right",
        close: true,
        duration: 30000,
        style: {
          background: "red",
          borderRadius: "10px"
        }

      }).showToast();
    }

    function getClassrooms() {
        return new Promise((resolve, reject) => {
            console.log(dbRef)
            get(child(dbRef, 'classrooms/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    for (let key in data) {
                        /*
                        Iterates through all classrooms in the database to see if the teacher's email matches the current authenticated user's email
                        If the email is same as user email then the user must be the teacher so it will be displayed
                        */
                        if (data[key].teacher === user.user.email) {
                            displayClassroom(data[key]);
                        }
                    }
                } else {
                    displayClassroom(null);
                }
            }).catch((error) => {
                console.log(error);
                reject(error);
            })
        });
    }

    getClassrooms() //runs on page load

    function getStudents(target) {
      return new Promise((resolve, reject) => {
        get(child(dbRef, 'users/')).then((snapshot) => {
          if(snapshot.exists()) {
            const data = snapshot.val();
            for(let key in data) {
              if(data[key].email === target) {
                resolve([data[key].firstName, data[key].lastName]);
                return;
              }
            }
            resolve(null);
          } else {
            resolve(null);
          }
        }).catch((error) => {
          console.log(error);
          reject(error);
        })
      })
    }
    // a function to get the overall student grade
    function getStudentGrade(classroomID, target) {
      return new Promise((resolve, reject) => {
        get(child(dbRef, 'classrooms/' + classroomID + '/grades')).then((snapshot) => {
          if(snapshot.exists()) {
            const data = snapshot.val();
            for(let key in data) {
              if(data[key].student === target) {
                resolve(data[key].grade.overall);
                return;
              }
            }
          } else {
            resolve(null);
          }
        }).catch((error) => {
          console.log(error);
          reject(error);
        })
      })
    }
    // functions that will give the student grade on a specific assignment
    function getStudentAssignmentGrade(assignmentID, student){
      return new Promise((resolve, reject) => {
        const gradesRef = child(dbRef, 'assignments/' + assignmentID + '/grades');
        get(gradesRef).then((snapshot) => {
          if(snapshot.exists()) {
            const data = snapshot.val();
            for(let key in data){
              if(data[key].student === student) {
                resolve(data[key].grade);
                return;
              }
            }
          }
        }).catch((error) => {
          console.log(error);
          reject(error);
        })
      })
    }
    function getGradingPolicy(classroomID){
      return new Promise((resolve, reject) => {
        const gradingPolicyRef = child(dbRef, 'classrooms/' + classroomID + '/gradingPolicy');
        get(gradingPolicyRef).then((snapshot) => {
          if(snapshot.exists()){
            resolve(snapshot.val())
            return;
          }
        })
      })
    }
    function updateStudentGrade(classroomID, target, grade, worth, type, assignmentID) {
      return new Promise((resolve, reject)  => {
          const gradesRef = child(dbRef, 'classrooms/' + classroomID + '/grades');
          var gradingPolicyRef = child(dbRef, 'classrooms/' + classroomID + '/gradingPolicy');

          get(gradingPolicyRef).then((snapshot) => {
            if(snapshot.exists()){
              gradingPolicyRef = snapshot.val()
            }
          })
          get(gradesRef).then((snapshot) => {
              if(snapshot.exists()) {
                  const grades = snapshot.val();
                  for (const studentID in grades) {
                      if (grades.hasOwnProperty(studentID)) {
                          const student = grades[studentID];
                          if (student.student === target) {
                            if(type === "summative"){
                              getStudentAssignmentGrade(assignmentID, target).then((result)=>{

                                // execute if there is no grade on the assignment
                                if (result === "N/A"){
                                  getGradingPolicy(classroomID).then((output)=>{
                                    student.grade.earnedSummative += parseInt(grade);
                                    student.grade.worthSummative += parseInt(worth);
                                    student.grade.summative = 100*(student.grade.earnedSummative/student.grade.worthSummative)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                } else {
                                  getGradingPolicy(classroomID).then((output)=>{
                                    // subtract grade from the original then added the updated version
                                    student.grade.earnedSummative -= parseInt(result);
                                    student.grade.earnedSummative += parseInt(grade);
                                    student.grade.summative = 100*(student.grade.earnedSummative/student.grade.worthSummative)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                }
                              })

                            } else if(type === "classwork"){
                              getStudentAssignmentGrade(assignmentID, target).then((result)=>{
                                 // execute if there is no grade on the assignment
                                if (result === "N/A"){
                                  getGradingPolicy(classroomID).then((output)=>{
                                    student.grade.earnedClasswork += parseInt(grade);
                                    student.grade.worthClasswork += parseInt(worth);
                                    student.grade.classwork = 100*(student.grade.earnedClasswork/student.grade.worthClasswork)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                } else {
                                  getGradingPolicy(classroomID).then((output)=>{
                                    // subtract grade from the original then added the updated version
                                    student.grade.earnedClasswork -= parseInt(result);
                                    student.grade.earnedClasswork += parseInt(grade);
                                    student.grade.classwork = 100*(student.grade.earnedClasswork/student.grade.worthClasswork)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                }
                              })
                            } else if(type === "independent"){
                              getStudentAssignmentGrade(assignmentID, target).then((result)=>{
                                // execute if there is no grade on the assignment
                                if (result === "N/A"){
                                  getGradingPolicy(classroomID).then((output)=>{
                                    console.log(parseInt(grade))
                                    student.grade.earnedIndependent += parseInt(grade);
                                    student.grade.worthIndependent += parseInt(worth);
                                    student.grade.independent = 100*(student.grade.earnedIndependent/student.grade.worthIndependent)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                } else {
                                  getGradingPolicy(classroomID).then((output)=>{
                                    // subtract grade from the original then added the updated version
                                    student.grade.earnedIndependent -= parseInt(result);
                                    student.grade.earnedIndependent += parseInt(grade);
                                    student.grade.independent = 100*(student.grade.earnedIndependent/student.grade.worthIndependent)
                                    student.grade.overall = ((output.summative/100)*student.grade.summative)+((output.classwork/100)*student.grade.classwork)+((output.independent/100)*student.grade.independent) // formula for combining three categories into an overall grade
                                    update(child(gradesRef, studentID, 'grade/'), student)
                                  })
                                }
                              })
                            }
                              return;
                          }
                      }
                  }
              } else {
              }
          }).catch((error) => {
              reject("Error:" + error.message);
          });
      });
  }
      function deleteClassroom(classroomID) {
        return new Promise((resolve, reject) => {
            const classroomRef = child(dbRef, 'classrooms/' + classroomID);

            remove(classroomRef);
        });
    }

    //classroom, email to remove
    function removeFromClassroom(a, b) {
      return new Promise((resolve, reject) => {
        get(child(dbRef, 'classrooms/' + a)).then((snapshot) => {
          if(snapshot.exists()) {
            let array = snapshot.val().students;
            const position = array.indexOf(b);
            array.splice(position, 1);
            // Update the value of 'students' in the snapshot
            snapshot.val().students = array;
            // Set the updated value to the database
            set(ref(db, 'classrooms/' + a + '/students'), array)
              .then(() => {
                resolve(array);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
              window.location.reload();
          } else {
            resolve(null);
          }
        }).catch((error) => {
          console.log(error);
          reject(error);
        });
      });
    }


    function addStudent(classroom) {
      const rawInput = prompt("Add students in the format of: \nStudent1 Account Email, Student 2 Account Email. \nFor example: 'jdoe@test.com, testing@yahoo.com\n");

      if(rawInput) {
        const cleanInput = rawInput.replace(/\s/g, '');
        const input = cleanInput.split(",");

        //error handling
        input.forEach((i) => {
          const a = i.split("");
          if(!a.includes("@") || a.length < 2) {
            errorToast("Students were not added in the correct format. Please read the directions and try again!");
            return;
          }
        })


        input.forEach((i) => {
          //checking that added students exist in the database
          getStudents(i)
          .then((result) => {
            if(result === null) {
              errorToast(`${i} does not have an account. Please have the student register first!`);
              return;
            } else if(classroom.grades.includes(i)) {
              errorToast("This student is already in your classroom!");
              return;
            } else {
              alert("Done!")
              //updating students array in classroom object of database
              get(child(dbRef, 'classrooms/' + classroom.id)).then((snapshot) => {
                if(snapshot.exists()) {
                  let array = snapshot.val().students;
                  input.forEach((i) => {
                    array.push(i)
                  })
                  set(ref(db, 'classrooms/' + classroom.id + '/students'), array)
                  // window.location.reload();
                }
              })
              //update grade system;
              get(child(dbRef, 'classrooms/' + classroom.id)).then((snapshot) => {
                if(snapshot.exists()) {
                  let array2 = snapshot.val().grades;
                  input.forEach((i) => {
                    array2.push({"student": i, "grade": {"summative": 100, "earnedSummative":0, "worthSummative": 0,"classwork": 100, "earnedClasswork": 0, "worthClasswork": 0, "independent": 100, "earnedIndependent":0, "worthIndependent": 0, "overall": 100}})
                  })
                  set(ref(db, 'classrooms/' + classroom.id + '/grades'), array2)
                  // window.location.reload();
                }
              })
              //update assignments
              get(child(dbRef, 'assignments')).then((snapshot) => {
                if(snapshot.exists()) {
                  const data = snapshot.val();
                  for(let key in data) {
                    if(data[key].classroomID === classroom.id) {
                      let array3 = data[key].grades;
                      input.forEach((i) => {
                        array3.push({"grade": "N/A", "student": i});
                        set(ref(db, 'assignments/' + data[key].assignmentID + "/" + "/grades"), array3)
                        window.location.reload();
                      })
                    }
                  }
                }
              })
            }
          })
        })
      }
    }

    function displayClassroom(classroom) {
        //check student page for explaintation on the wrappers
        const classroomWrapper = document.querySelector('.classroom-wrapper');
        const assignmentsWrapper = document.createElement("div");
        assignmentsWrapper.classList.add("assignments-wrapper");
        const classWrapper = document.createElement("div");
        classWrapper.classList.add("classroom");

        const studentWrapper = document.createElement("div");
        studentWrapper.classList.add("student-wrapper");

        const a = document.createElement("h");
        if (classroom !== null) {
            a.innerHTML = classroom.name;
        } else {
            a.innerHTML = "You do not currently have any classrooms!";
            classroomWrapper.appendChild(a);
            return;
        }

        const b = document.createElement("p");
        b.innerHTML = `Number of Students: ${classroom.grades.length}`;
        b.classList.add("student-count-display")

        const classroomButtonWrapper = document.createElement("div");
        classroomButtonWrapper.classList.add("classroom-button-wrapper");

        const addAssignmentButton = document.createElement("button");
        addAssignmentButton.classList.add("view-grades-button");
        addAssignmentButton.innerHTML = "Assignments";

        const deleteClassroomButton = document.createElement("button");
        deleteClassroomButton.classList.add("classroom-delete-button");
        deleteClassroomButton.innerHTML = "Delete Classroom";

        const viewStudentsButton = document.createElement("button");
        viewStudentsButton.classList.add("view-students-button");
        viewStudentsButton.innerHTML = "Edit Students";

        const refreshButton = document.createElement("button");
        refreshButton.classList.add("refresh-students-button");
        refreshButton.innerHTML = "Refresh View";

        classroomButtonWrapper.appendChild(viewStudentsButton);
        classroomButtonWrapper.appendChild(addAssignmentButton);
        classroomButtonWrapper.appendChild(deleteClassroomButton);

        const addStudentsButton = document.createElement("button");
        addStudentsButton.classList.add("add-students-button");
        addStudentsButton.innerHTML = "Add Students";

        //refreshes page by reloading page
        refreshButton.addEventListener("click", () => {
          window.location.reload();
        })

        //add student function
        addStudentsButton.addEventListener("click", () => {
          addStudent(classroom);
        });

        //delete classroom function
        deleteClassroomButton.addEventListener("click", () => {
          Swal.fire({
            title: `Are you sure you want to delete ${classroom.name}? This action cannot be reversed! This will delete all grades and assignments associated with this classroom.`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Delete",
            denyButtonText: `Don't Delete`
          }).then((result) => {
            if (result.isConfirmed) { //if user confirms they want to delete the classroom
              deleteClassroom(classroom.id);
              Swal.fire("Deleted!", "", "success");
              window.location.reload();
            }
          });
        })

        viewStudentsButton.addEventListener("click", () => {
          if(document.querySelector('.deez') === null) { //if dropdown currently closed
              studentWrapper.appendChild(addStudentsButton);
              classroom.grades.forEach((i) => {
                  const student = document.createElement("p");
                  student.innerHTML = i;
                  student.classList.add("deez");
                  studentWrapper.appendChild(student);
                  if(classroom.grades.length > 1) {
                    student.addEventListener("click", () => { //make it so that if you click the student they can be deleted by using innerHTML as reference
                      getStudents(student.innerHTML)
                      .then((result) => {
                        Swal.fire({
                          title: `Do you want to remove ${result[0]} ${result[1]} from ${classroom.name}? This action cannot be reversed! This will also delete all assignments and grades related to ${result[0]} ${result[1]}!`,
                          showDenyButton: true,
                          showCancelButton: false,
                          confirmButtonText: "Remove",
                          denyButtonText: `Don't Remove`
                        }).then((result) => {
                          /* Read more about isConfirmed, isDenied below */
                          if (result.isConfirmed) {
                            removeFromClassroom(classroom.id, student.innerHTML);
                            Swal.fire("Removed!", "", "success");
                          }
                        });
                      })
                    })
                  }
              })
          } else {
            //handle close dropdown
            const temp = document.querySelectorAll('.deez');
            temp.forEach((i) => {
              i.remove();
            })
            if(document.querySelector(".assignmentForm") !== null){
              document.querySelector(".assignmentForm").remove()
            }
            addStudentsButton.remove();
            refreshButton.remove();
          }
      })
      //add assignment
      addAssignmentButton.addEventListener("click", () => {
        if(document.querySelector('.deez') === null) { //if dropdown currently closed
          fetchAssignments(classroom.id)
          .then((result) => {
            if(result === null) {
              console.log("no assignments");
            } else {
              result.forEach((i, count) => {
                const assignmentP = document.createElement("p");
                assignmentP.classList.add("assignment-item");
                assignmentP.setAttribute("name", count + 1);
                assignmentP.setAttribute("id", i.id);
                assignmentP.innerHTML = `${count + 1}. ${i.name}`;
                document.querySelector(".assignmentForm").appendChild(assignmentP);
              })
            }
          })
          const assignment = document.createElement("form");
          assignment.onsubmit = function(event) {
            const a = document.querySelector("#assignment-name-form").value;
            const b = document.querySelector("#assignment-grade-form").value;
            const c = document.querySelector("#assignment-type-form").value;

            const okOptions = ['summative', 'classwork', 'independent', 's', 'c', 'i'];
            const formatedOptions = {
              "s": "summative",
              "c": "classwork",
              "i": "independent",
              "summative": "summative",
              "classwork": "classwork",
              "independent": "independent",
            }
            if(okOptions.includes(c.toLowerCase())) {
              createAssignment(a, b, formatedOptions[c], classroom.id, classroom.students);
            } else {
              event.preventDefault();
              alert("Invalid assignment type. Please read the documentation!");
            }
          }
          assignment.classList.add("assignmentForm")
          assignment.innerHTML = `<input id="assignment-name-form" type="text" placeholder="Assignment Name?" required><input id="assignment-grade-form" type="number" placeholder="Total grade points" required><input id="assignment-type-form" type="text" placeholder="Assignment Type?" required><button type="submit">Create Assignment</button>`;

          studentWrapper.appendChild(assignment);


            studentWrapper.appendChild(refreshButton); // refresh view button
            classroom.grades.forEach((i) => {
                const student = document.createElement("p");
                student.innerHTML = i;
                student.classList.add("deez");
                student.setAttribute('id', i.replace(/[.@]/g, "")); //create students with p element and give them id based on their email
                studentWrapper.appendChild(student);
                getStudentGrade(classroom.id, student.innerHTML) //create tooltip for each p element with the student's greade
                .then((result) => {
                  tippy(`#${i.replace(/[.@]/g, "")}`, {
                    content: result,
                    placement: 'right'
                  })
                })
                student.addEventListener("click", () => {
                  const getAssignmentNumber = parseInt(prompt("Which assignment grade do you want to edit for the student? Please type the number that you see corrosponding in the assignment list above."));

                  const getAssignment = document.querySelector(`.assignment-item[name="${getAssignmentNumber}"]`);
                  console.log(getAssignment)
                  if(getAssignment === null) {
                    alert("This assignment does not exist");
                    return;
                  }
                  const gradesRef = child(dbRef, 'assignments/' + getAssignment.id)
                  get(gradesRef).then((snapshot)=>{
                    if(snapshot.exists()){
                      if(snapshot.val().type === "summative"){
                        const getAssignmentGrade = parseInt(prompt("What grade do you want the student to have for this assignment? They currently have a:\n[ex number] / [worth]"));

                        if(isNaN(getAssignmentGrade)) {
                          alert("Not a valid number!");
                          return
                        } else {
                          // alert("Ok i will change this");
                          updateStudentGrade(classroom.id, student.innerHTML, getAssignmentGrade, snapshot.val().worth, snapshot.val().type, getAssignment.id)
                          updateAssignmentGradeDB(getAssignment.id, student.innerHTML, getAssignmentGrade,)

                          return;
                        }
                      } else if(snapshot.val().type === "classwork"){
                          const getAssignmentGrade = parseInt(prompt("What grade do you want the student to have for this assignment? They currently have a:\n[ex number] / [worth]"));

                          if(isNaN(getAssignmentGrade)) {
                            alert("Not a valid number!");
                            return
                          } else {
                            // alert("Ok i will change this");
                            updateStudentGrade(classroom.id, student.innerHTML, getAssignmentGrade, snapshot.val().worth, snapshot.val().type, getAssignment.id)
                            updateAssignmentGradeDB(getAssignment.id, student.innerHTML, getAssignmentGrade)
                            return;
                          }

                      } else if(snapshot.val().type === "independent"){
                          const getAssignmentGrade = parseInt(prompt("What grade do you want the student to have for this assignment? They currently have a:\n[ex number] / [worth]"));

                          if(isNaN(getAssignmentGrade)) {
                            alert("Not a valid number!");
                            return
                          } else {
                            // alert("Ok i will change this");
                            updateStudentGrade(classroom.id, student.innerHTML, getAssignmentGrade, snapshot.val().worth, snapshot.val().type, getAssignment.id)

                            updateAssignmentGradeDB(getAssignment.id, student.innerHTML, getAssignmentGrade)


                            return;
                          }
                      }
                    }
                  })
                })
            })
        } else {
          //handle close dropdown
          const temp = document.querySelectorAll('.deez');
          temp.forEach((i) => {
            i.remove();
          })
          if(document.querySelector(".assignmentForm") !== null){
            document.querySelector(".assignmentForm").remove()
          }
          addStudentsButton.remove();
          refreshButton.remove();
        }
    })

        assignmentsWrapper.appendChild(a);
        assignmentsWrapper.appendChild(b);
        classWrapper.appendChild(assignmentsWrapper);
        classWrapper.appendChild(classroomButtonWrapper);
        classWrapper.appendChild(studentWrapper)
        classroomWrapper.appendChild(classWrapper);
    }

    function checkIfClassroomExists(classroomID) {
        return new Promise((resolve, reject) => {
            get(child(dbRef, 'classrooms/' + classroomID)).then((snapshot) => {
                if (snapshot.exists()) {
                    resolve(snapshot.val());
                } else {
                    resolve(false)
                }
            }).catch((error) => {
                alert(error);
                reject(error);
            })
        });
    }

    //data arg is a json object of the classroom attributes
    function generateNewClassroom(data) {
        const reference = ref(db, 'classrooms/' + data.id);
        set(reference, data)
    }

    function createClassroom() {

        //get user input for classroom attributes
        const getName = prompt("Classroom Name:\n");
        const getSummativeWeight = parseInt(prompt("What percentage of a student's grade should Summative Assessments Count for?\n For example if you want it to be 50% of a students grade you would enter: '50'\n"));
        const getClassworkWeight = parseInt(prompt("What percentage of a student's grade should Classwork Count for?\n For example if you want it to be 40% of a students grade you would enter: '40'\n"));
        const getIndependentWeight = parseInt(prompt("What percentage of a student's grade should Independent Work Count for?\n For example if you want it to be 10% of a students grade you would enter: '10'\n"));
        const getStudentsPrompt = prompt("Add students in the format of: \nStudent1 Account Email, Student 2 Account Email. \nFor example: 'jdoe@test.com, testing@yahoo.com\n");

        if (!getName || !getStudentsPrompt || !getSummativeWeight || !getClassworkWeight || !getIndependentWeight) { //error handling
            errorToast("Must fill out all prompts correctly!");
            return;
        } else {
            if ((getSummativeWeight + getClassworkWeight + getIndependentWeight) !== 100) { //error handling
                errorToast("Grade Weights must add up to 100!");
                return
            }

            try {
                const cleanGetStudents = getStudentsPrompt.replace(/\s/g, '');
                const getStudentsArray = cleanGetStudents.split(",");

                getStudentsArray.forEach((i) => {
                    const a = i.split("");
                    if (!a.includes("@") || a.length < 2) {
                        throw new Error("Students were not added in the correct format. Please read the directions and try again!"); //error handling
                    }
                })

                const preventStudentDuplicatesArray = new Set();
                getStudentsArray.forEach((i) => {
                  preventStudentDuplicatesArray.add(i);
                });

                const finalStudentsArray = [];

                preventStudentDuplicatesArray.forEach((i) => {
                  finalStudentsArray.push(i);
                });

                finalStudentsArray.forEach((i) => {
                  //checking to see if the student email is in users database to prevent random email from getting added
                  getStudents(i)
                  .then((result) => {
                    if(result === null) {
                      //removes student from the classroom list if not in database
                      const index = finalStudentsArray.indexOf(i);
                      finalStudentsArray.splice(index, 1);
                      errorToast(`${i} does not have an account. Please have the student register first!`); //error handling
                    }
                  })
                })

                if(finalStudentsArray.length > 0) { // > 0 to prevent creating a classroom with no students
                  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
                  const upperLetters = lowerLetters.toUpperCase();
                  const numbers = "1234567890";
                  let generatedID = "";
                  let lengthOfId = 15;
                  //generating a classroomID
                  for (let i = 0; i < lengthOfId; i++) {
                      const combinedChars = lowerLetters + upperLetters + numbers;
                      const index = Math.floor(Math.random() * combinedChars.length);
                      generatedID += combinedChars[index]
                  }

                  let grades = [];
                  finalStudentsArray.forEach((i) => {
                    grades.push({"student": i, "grade": {"summative": 100, "earnedSummative":0, "worthSummative": 0,"classwork": 100, "earnedClasswork": 0, "worthClasswork": 0, "independent": 100, "earnedIndependent":0, "worthIndependent": 0, "overall": 100}}) //by default gives kids 100
                  });

                  const data = {
                      "id": generatedID,
                      "name": getName,
                      "gradingPolicy": {
                          "summative": getSummativeWeight,
                          "classwork": getClassworkWeight,
                          "independent": getIndependentWeight
                      },
                      "teacher": user.user.email,
                      "students": finalStudentsArray,
                      "grades": grades
                  }

                  checkIfClassroomExists(data.id) //prevents the very rare chance that classroom with that ID already exists
                      .then((result) => {
                          if (!result) {
                              alert("Generating Classroom!")
                              generateNewClassroom(data);
                              window.location.reload();
                          } else {
                              errorToast("Classroom with this ID Already Exists. Please Try Again!");
                          }
                      });
                  }

            } catch (error) {
                const theError = error.message;
                errorToast(theError.replace("Error:", ""));
            }
        }
    }

    function createAssignment(name, grade, type, classroomID, students) {
      const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
      const upperLetters = lowerLetters.toUpperCase();
      const numbers = "1234567890";
      let generatedID = "";
      let lengthOfId = 35;
      //generating a assignmentID
      for (let i = 0; i < lengthOfId; i++) {
          const combinedChars = lowerLetters + upperLetters + numbers;
          const index = Math.floor(Math.random() * combinedChars.length);
          generatedID += combinedChars[index]
      }

      const reference = ref(db, 'assignments/' + generatedID);
      let grades = [];
      students.forEach((i) => {
        grades.push({"grade": "N/A", "student": i})
      });
      const data = {
        "name": name,
        "worth": grade,
        "type": type,
        "classroomID": classroomID,
        "grades": grades,
        "assignmentID": generatedID
      }
      set(reference, data);

    }

    function fetchAssignments(classroomID) {
      return new Promise((resolve, reject) => {
        let output = []
        get(child(dbRef, 'assignments/')).then((snapshot) => {
          if(snapshot.exists()) {
            const data = snapshot.val();
            for(let key in data) {
              if(data[key].classroomID === classroomID) {
                const info = {
                  "name": data[key].name,
                  "type": data[key].type,
                  "worth": data[key].worth,
                  "grades": data[key].grades,
                  "id": data[key].assignmentID
                }
                output.push(info);
              }
            }
            resolve(output)
          } else {
            resolve(null);
          }
        }).catch((error) => {
          // console.log(error);
          reject(error);
        })
      })
    }

    function updateAssignmentGradeDB(assignmentID, student, newGrade) {
      return new Promise((resolve, reject) => {
        const gradesRef = child(dbRef, 'assignments/' + assignmentID + '/grades');
        get(gradesRef).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            for (let key in data) {
              if (data[key].student === student) {
                // Update the grade
                data[key].grade = newGrade;
                // Update the database
                const updateData = {};
                updateData['assignments/' + assignmentID + '/grades/' + key + '/grade'] = newGrade;
                update(dbRef, updateData)
                  .then(() => {
                    resolve(); // Resolve the promise once update is successful
                  })
                  .catch((error) => {
                    reject(error); // Reject the promise if there's an error
                  });
                return;
              }
            }
          }
          // If student's grade not found
          reject(new Error("Student's grade not found for the given assignment ID"));
        }).catch((error) => {
          reject(error); // Reject the promise if there's an error
        });
      });
    }

    return (
        <div>
            <Nav />
            <button onClick={createClassroom}>Create Classroom</button>
            <p>teacher page</p>
            <div className="classroom-wrapper"></div>
            <button onClick={handleSignOut}>Sign Out</button>
            <Footer />
        </div>
    );
};

export default Teacher;
