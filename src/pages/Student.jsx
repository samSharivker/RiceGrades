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
      const b = document.createElement("li");
      // b.innerHTML = classroom.name;
      const classInfoWrapper = document.createElement("div");
      classInfoWrapper.classList.add("class-info-wrapper");

      const className = document.createElement("h");
      className.innerHTML = classroom.name;

      const classTeacher = document.createElement("p");
      classTeacher.innerHTML = `Teacher: ${classroom.teacher}`;

      const classGrade = document.createElement("p");
      classGrade.innerHTML = `Grade: ${grade}`;


      classInfoWrapper.appendChild(className);
      classInfoWrapper.appendChild(classTeacher);
      classInfoWrapper.appendChild(classGrade);

      b.appendChild(classInfoWrapper);

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
                    if(students.includes(user.user.email)) {
                      data[key].grades.forEach((i) => {
                        if(i.student === user.user.email) {
                          displayClassroom(data[key], i.grade)
                          console.log(`You are part of ${data[key].name} taught by ${data[key].teacher}. Your grade is ${i.grade}`);
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

  getClassrooms()

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

