import React from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import {
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { auth, db } from '../firebase'
// import { useState } from 'react';
import { ref, set, child, get } from "firebase/database";

export default class Teacher extends React.Component {
    render() {
      const user = this.props;
      const handleSignOut = () => {
        signOut(auth)
          .then(() => console.log("Sign Out"))
          .catch((error) => console.log(error));
      };

      //console.log(user.user.uid);

      function checkIfClassroomExists(classroomID) {
        return new Promise((resolve, reject) => {
          const dbRef = ref(db);
          get(child(dbRef, 'classrooms/' + classroomID)).then((snapshot) => {
            if(snapshot.exists()) {
              resolve(snapshot.val());
            } else  {
              resolve(false)
            }
          }).catch((error) => {
            alert(error);
            reject(error);
          })
        });
      }

      //data
      function generateNewClassroom(data) {
        const reference = ref(db, 'classrooms/' + data.id);
        set(reference, data)
      }

      function createClassroom() {
        //test@gmail.com, jdoe@gmail.com
        const getName = prompt("Classroom Name:\n");
        const getSummativeWeight = parseInt(prompt("What percentage of a student's grade should Summative Assessments Count for?\n For example if you want it to be 50% of a students grade you would enter: '50'\n"));
        const getClassworkWeight = parseInt(prompt("What percentage of a student's grade should ClassWork Count for?\n For example if you want it to be 40% of a students grade you would enter: '40'\n"));
        const getIndependentWeight = parseInt(prompt("What percentage of a student's grade should Independent Work Count for?\n For example if you want it to be 10% of a students grade you would enter: '10'\n"));
        const getStudents = prompt("Add students in the format of: \nStudent1 Account Email, Student 2 Account Email. \nFor example: 'test@gmail.com, jdoe@gmail.com'\n");

        if(!getName || !getStudents || !getSummativeWeight || !getClassworkWeight || !getIndependentWeight) {
          alert("Must fill out all prompts correctly!");
          return;
        } else {
          if((getSummativeWeight + getClassworkWeight + getIndependentWeight) !== 100) {
            alert("Grade Weights must add up to 100!");
            return
          }

          try {
            const cleanGetStudents = getStudents.replace(/\s/g, '');
            const getStudentsArray = cleanGetStudents.split(",");

            getStudentsArray.forEach((i) => {
              const a = i.split("");
              if(!a.includes("@") || a.length < 2) {
                throw new Error("Students were not added in the correct format. Please read the directions and try again!");
              }
            })

            //generate ID
            const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
            const upperLetters = lowerLetters.toUpperCase();
            const numbers = "1234567890";
            let generatedID = "";
            let lengthOfId = 15;
            for(let i=0; i < lengthOfId; i++) {
              const combinedChars = lowerLetters + upperLetters + numbers;
              const index = Math.floor(Math.random() * combinedChars.length);
              generatedID += combinedChars[index]
            }

            const data = {
              "id": generatedID,
              "name": getName,
              "gradingPolicy": {
                "summative": getSummativeWeight,
                "classwork": getClassworkWeight,
                "independent": getIndependentWeight
              },
              "teacher": user.user.uid,
              "students": getStudentsArray
            }

            //check  if classroom already exists
            checkIfClassroomExists(data.id)
            .then((result) => {
              if(!result) {
                alert("Generating Classroom!")
                generateNewClassroom(data);
                window.location.reload();
              } else {
                alert("Classroom with this ID Already Exists. Please Try Again!")
              }
            });

          } catch (error) {
            alert(error);
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
    }
  };

