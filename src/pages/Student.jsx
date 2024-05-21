import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { ref, set, child, get, update, remove } from "firebase/database";

const Student = (props) => {
  const [user] = useState(props);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const dbRef = ref(db);

  function fetchAssignments(classroomID) {
    return new Promise((resolve, reject) => {
      let output = []
      get(child(dbRef, 'assignments/')).then((snapshot) => {
        if(snapshot.exists()) {
          const data = snapshot.val();
          for(let key in data) {
            if(data[key].classroomID === classroomID) {
              const a = data[key].grades;
              let points;
              let worth;
              let grade;
              a.forEach((i) => {
                if(i.student === user.user.email) {
                  points = i.grade
                  worth = data[key].worth
                  grade = roundGrade((i.grade / data[key].worth) * 100)
                }
              })
              const info = {
                "name": data[key].name,
                "type": data[key].type,
                "worth": data[key].worth,
                "grade": [points, parseInt(worth), grade],
                "id": data[key].assignmentID
              }
              output.push(info);
            }
          }
          resolve(output)
          // console.log(output)
        } else {
          resolve(null);
        }
      }).catch((error) => {
        // console.log(error);
        reject(error);
      })
    })
  }

  function displayClassroom(classroom, grade) {
    if(classroom === null) {
      const a = document.createElement("p");
      a.innerHTML = "Not part of any classes";
      document.querySelector('.student-class-wrapper').appendChild(a);
    } else {
      //runs if student is in at least 1 classroom
      const b = document.createElement("li");
      const classInfoWrapper = document.createElement("div");
      /*
      All the classroom display elements will first get appended to the class-info-wrapper
      Then that wrapper will get appended to the li element and will then join a ul of all the classrooms the user is part of
      */
      classInfoWrapper.classList.add("class-info-wrapper");

      //creating and displaying classroom information
      const className = document.createElement("h");
      className.innerHTML = classroom.name;

      const classTeacher = document.createElement("p");
      classTeacher.innerHTML = `Teacher: ${classroom.teacher}`;

      const classOverallGrade = document.createElement("p");
      classOverallGrade.innerHTML = `Grade: ${grade[0]}`;

      const classIndependentGrade = document.createElement("p");
      classIndependentGrade.innerHTML = `Independent: ${grade[1]}`;

      const classSummativeGrade = document.createElement("p");
      classSummativeGrade.innerHTML = `Summative: ${grade[2]}`;

      const classClassWorkGrade = document.createElement("p");
      classClassWorkGrade.innerHTML = `Classwork: ${grade[3]}`;

      //handle view assignments cause Yu wants me to implement that :(
      const assignmentsWrapper = document.createElement("div");
      assignmentsWrapper.classList.add("student-assignments-wrapper");

      const viewAssignmentsButton = document.createElement("button");
      viewAssignmentsButton.innerHTML = "View Assignments";

      viewAssignmentsButton.addEventListener("click", () => {
        if(document.querySelector('.deez') === null) {
          fetchAssignments(classroom.id)
          .then((results) => {
            results.forEach((i) => {
              const z = document.createElement("div");
              z.classList.add("deez");

              const name = document.createElement("h");
              name.innerHTML = `Name: ${i.name}`;

              const type = document.createElement("p");
              type.innerHTML = `Type: ${i.type}`;

              const grade = document.createElement("p");
              grade.innerHTML = `Grade: ${i.grade[2]}%`;

              const points = document.createElement("p");
              points.innerHTML = `Points: ${i.grade[0]}/${i.grade[1]}`;

              z.appendChild(name);
              z.appendChild(type)
              z.appendChild(grade);
              z.appendChild(points);
              assignmentsWrapper.appendChild(z);
            })
          })
        } else {
          const temp = document.querySelectorAll('.deez');
          temp.forEach((i) => {
            i.remove();
          })
        }
      })

      //all display elements first being added to the wrapper
      classInfoWrapper.appendChild(className);
      classInfoWrapper.appendChild(classTeacher);
      classInfoWrapper.appendChild(classOverallGrade);
      classInfoWrapper.appendChild(classIndependentGrade);
      classInfoWrapper.appendChild(classSummativeGrade);
      classInfoWrapper.appendChild(classClassWorkGrade);

      assignmentsWrapper.appendChild(viewAssignmentsButton);

      //wrapper is then being added to the li
      b.appendChild(classInfoWrapper);
      b.appendChild(assignmentsWrapper);

      //then the li joins the overall classroom list
      document.querySelector(".class-list").appendChild(b);
    }
  }

  function roundGrade(grade) {
    return Math.round(grade * 100) / 100
  }

  function getClassrooms() {
      return new Promise((resolve, reject) => {
          get(child(dbRef, 'classrooms/')).then((snapshot) => {
              if (snapshot.exists()) {
                  const data = snapshot.val();
                  for (let key in data) {
                    const students = data[key].students;
                    /*
                    Iterates through classrooms in database to see if their students array contain the current authenticated student.
                    If they are in the array then that means that a teacher had to have added them to that classroom.
                    */
                    if(students.includes(user.user.email)) {
                      data[key].grades.forEach((i) => {
                        if(i.student === user.user.email) {
                          displayClassroom(data[key], [roundGrade(i.grade.overall) + "%", roundGrade(i.grade.independent) + "%", roundGrade(i.grade.summative) + "%", roundGrade(i.grade.classwork) + "%"]) //classroom data and student grade
                        }
                      })
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
  displayCurrentUser() //runs on page load

  function displayCurrentUser() {
    get(child(dbRef, 'users/')).then((snapshot) => {
      if(snapshot.exists()) {
        const data = snapshot.val();
        for(let key in data) {
          if(data[key].email === user.user.email) {
            document.querySelector("#current-user-name").innerHTML = data[key].firstName;
            document.querySelector("#current-user-last").innerHTML = data[key].lastName;
            document.querySelector("#current-user-email").innerHTML = data[key].email;
          }
        }
      }
    })
  }

  return (
    <div>
      <Nav />
      <div className="student-page">
        <div className="display-current-user">
          <p><span id="current-user-name"></span> <span id="current-user-last"></span></p>
          <p id="current-user-email"></p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
        <div className="student-class-wrapper">
          <ul className="class-list"></ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Student;

