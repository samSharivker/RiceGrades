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

  function getClassrooms() {
      return new Promise((resolve, reject) => {
          const dbRef = ref(db);
          get(child(dbRef, 'classrooms/')).then((snapshot) => {
              if (snapshot.exists()) {
                  const data = snapshot.val();
                  for (let key in data) {
                    const students = data[key].students;
                    if(students.includes(user.user.email)) {
                      console.log(`You are part of ${data[key].name} taught by ${data[key].teacher}`);
                    }
                  }
              } else {
                  // displayClassroom(null);
                  console.log("not part of any classrooms")
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
      <button onClick={handleSignOut}>Sign Out</button>
      <Footer />
    </div>
  );
};

export default Student;

