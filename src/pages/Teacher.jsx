import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, set, child, get, update } from "firebase/database";
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
            const dbRef = ref(db);
            get(child(dbRef, 'classrooms/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    for (let key in data) {
                        if (data[key].teacher === user.user.uid) {
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

    getClassrooms()

    function getStudents(target) {
      return new Promise((resolve, reject) => {
        const dbRef = ref(db);
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

    function getStudentGrade(classroomID, target) {
      return new Promise((resolve, reject) => {
        const dbRef = ref(db);
        get(child(dbRef, 'classrooms/' + classroomID + '/grades')).then((snapshot) => {
          if(snapshot.exists()) {
            const data = snapshot.val();
            for(let key in data) {
              if(data[key].student === target) {
                resolve(data[key].grade);
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

    function updateStudentGrade(classroomID, target, grade) {
      return new Promise((resolve, reject)  => {
          const dbRef = ref(db);
          const gradesRef = child(dbRef, 'classrooms/' + classroomID + '/grades');
          get(gradesRef).then((snapshot) => {
              if(snapshot.exists()) {
                  const grades = snapshot.val();
                  for (const studentID in grades) {
                      if (grades.hasOwnProperty(studentID)) {
                          const student = grades[studentID];
                          if (student.student === target) {
                              student.grade = grade;
                              update(child(gradesRef, studentID), student)
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


    //classroom, email to remove
    function removeFromClassroom(a, b) {
      return new Promise((resolve, reject) => {
        const dbRef = ref(db);
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

        input.forEach((i) => {
          const a = i.split("");
          if(!a.includes("@") || a.length < 2) {
            errorToast("Students were not added in the correct format. Please read the directions and try again!");
            return;
          }
        })


        input.forEach((i) => {
          getStudents(i)
          .then((result) => {
            if(result === null) {
              errorToast(`${i} does not have an account. Please have the student register first!`);
              return;
            } else if(classroom.students.includes(i)) {
              errorToast("This student is already in your classroom!");
              return;
            } else {
              alert("Done!")
              const dbRef = ref(db);
              get(child(dbRef, 'classrooms/' + classroom.id)).then((snapshot) => {
                if(snapshot.exists()) {
                  let array = snapshot.val().students;
                  input.forEach((i) => {
                    array.push(i)
                  })
                  set(ref(db, 'classrooms/' + classroom.id + '/students'), array)
                  window.location.reload();
                }
              })
            }
          })
        })
      }
    }

    function displayClassroom(classroom) {
        const classroomWrapper = document.querySelector('.classroom-wrapper');
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
        b.innerHTML = `Number of Students: ${classroom.students.length}`;
        b.classList.add("student-count-display")

        const classroomButtonWrapper = document.createElement("div");
        classroomButtonWrapper.classList.add("classroom-button-wrapper");

        const gradesButton = document.createElement("button");
        gradesButton.classList.add("view-grades-button");
        gradesButton.innerHTML = "Edit Grades";

        const viewStudentsButton = document.createElement("button");
        viewStudentsButton.classList.add("view-students-button");
        viewStudentsButton.innerHTML = "Edit Students";

        classroomButtonWrapper.appendChild(viewStudentsButton);
        classroomButtonWrapper.appendChild(gradesButton);

        const addStudentsButton = document.createElement("button");
        addStudentsButton.classList.add("add-students-button");
        addStudentsButton.innerHTML = "Add Students";

        addStudentsButton.addEventListener("click", () => {
          addStudent(classroom);
        });

        viewStudentsButton.addEventListener("click", () => {
          if(document.querySelector('.deez') === null) {
              studentWrapper.appendChild(addStudentsButton);
              classroom.students.forEach((i) => {
                  const student = document.createElement("p");
                  student.innerHTML = i;
                  student.classList.add("deez");
                  studentWrapper.appendChild(student);
                  if(classroom.students.length > 1) {
                    student.addEventListener("click", () => {
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
            const temp = document.querySelectorAll('.deez');
            temp.forEach((i) => {
              i.remove();
            })
            addStudentsButton.remove();
          }
      })

      gradesButton.addEventListener("click", () => {
        if(document.querySelector('.deez') === null) {
            classroom.students.forEach((i) => {
                const student = document.createElement("p");
                student.innerHTML = i;
                student.classList.add("deez");
                student.setAttribute('id', i.replace(/[.@]/g, ""));
                studentWrapper.appendChild(student);
                getStudentGrade(classroom.id, student.innerHTML)
                .then((result) => {
                  tippy(`#${i.replace(/[.@]/g, "")}`, {
                    content: result,
                    placement: 'right'
                  })
                })
                student.addEventListener("click", () => {
                  const getNewGrade = parseInt(prompt("What do you want to change the student's grade to?\n"));
                  console.log(getNewGrade);
                  if(isNaN(getNewGrade)) {
                    errorToast("Must input a number!");
                    return;
                  } else {
                    updateStudentGrade(classroom.id, student.innerHTML, getNewGrade);
                    window.location.reload();
                  }
                })
            })
        } else {
          const temp = document.querySelectorAll('.deez');
          temp.forEach((i) => {
            i.remove();
          })
          addStudentsButton.remove();
        }
    })

        classWrapper.appendChild(a);
        classWrapper.appendChild(b);
        classWrapper.appendChild(classroomButtonWrapper);
        classWrapper.appendChild(studentWrapper)
        classroomWrapper.appendChild(classWrapper);
    }

    function checkIfClassroomExists(classroomID) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(db);
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

    function generateNewClassroom(data) {
        const reference = ref(db, 'classrooms/' + data.id);
        set(reference, data)
    }

    function createClassroom() {
        const getName = prompt("Classroom Name:\n");
        const getSummativeWeight = parseInt(prompt("What percentage of a student's grade should Summative Assessments Count for?\n For example if you want it to be 50% of a students grade you would enter: '50'\n"));
        const getClassworkWeight = parseInt(prompt("What percentage of a student's grade should Classwork Count for?\n For example if you want it to be 40% of a students grade you would enter: '40'\n"));
        const getIndependentWeight = parseInt(prompt("What percentage of a student's grade should Independent Work Count for?\n For example if you want it to be 10% of a students grade you would enter: '10'\n"));
        const getStudentsPrompt = prompt("Add students in the format of: \nStudent1 Account Email, Student 2 Account Email. \nFor example: 'jdoe@test.com, testing@yahoo.com\n");

        if (!getName || !getStudentsPrompt || !getSummativeWeight || !getClassworkWeight || !getIndependentWeight) {
            errorToast("Must fill out all prompts correctly!");
            return;
        } else {
            if ((getSummativeWeight + getClassworkWeight + getIndependentWeight) !== 100) {
                errorToast("Grade Weights must add up to 100!");
                return
            }

            try {
                const cleanGetStudents = getStudentsPrompt.replace(/\s/g, '');
                const getStudentsArray = cleanGetStudents.split(",");

                getStudentsArray.forEach((i) => {
                    const a = i.split("");
                    if (!a.includes("@") || a.length < 2) {
                        throw new Error("Students were not added in the correct format. Please read the directions and try again!");
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
                  getStudents(i)
                  .then((result) => {
                    if(result === null) {
                      const index = finalStudentsArray.indexOf(i);
                      finalStudentsArray.splice(index, 1);
                      errorToast(`${i} does not have an account. Please have the student register first!`);
                    }
                  })
                })

                if(finalStudentsArray.length > 0) {
                  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
                  const upperLetters = lowerLetters.toUpperCase();
                  const numbers = "1234567890";
                  let generatedID = "";
                  let lengthOfId = 15;
                  for (let i = 0; i < lengthOfId; i++) {
                      const combinedChars = lowerLetters + upperLetters + numbers;
                      const index = Math.floor(Math.random() * combinedChars.length);
                      generatedID += combinedChars[index]
                  }

                  let grades = [];
                  finalStudentsArray.forEach((i) => {
                    grades.push({"student": i, "grade": 100})
                  });

                  const data = {
                      "id": generatedID,
                      "name": getName,
                      "gradingPolicy": {
                          "summative": getSummativeWeight,
                          "classwork": getClassworkWeight,
                          "independent": getIndependentWeight
                      },
                      "teacher": user.user.uid,
                      "students": finalStudentsArray,
                      "grades": grades
                  }

                  checkIfClassroomExists(data.id)
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
