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

      const classGrade = document.createElement("p");
      classGrade.innerHTML = `Grade: ${grade}`;

      //all display elements first being added to the wrapper
      classInfoWrapper.appendChild(className);
      classInfoWrapper.appendChild(classTeacher);
      classInfoWrapper.appendChild(classGrade);

      //wrapper is then being added to the li
      b.appendChild(classInfoWrapper);

      //then the li joins the overall classroom list
      document.querySelector(".class-list").appendChild(b);
    }
  }

  function getClassrooms() {
      return new Promise((resolve, reject) => {
          const dbRef = ref(db);
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
                          displayClassroom(data[key], (Math.round(100*i.grade.overall)/100) + "%") //classroom data and student grade
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

  return (
    <div>
      <Nav />
      <div className="student-class-wrapper">
        <ul className="class-list"></ul>
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
      <Footer />
    </div>
  );
};

export default Student;

