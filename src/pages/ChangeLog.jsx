import Nav from '../components/Nav';
import Footer from '../components/Footer';

//Changes in May
const may = ["Changelog is up to date(05/14/2024)", "Style update"]

const listItemsMay = may.map((may) =>
    <li>{may}</li>
  );

// Changes in April
const april = ["Student Classroom view", "Button for deleting classroom", "Refresh tooltip button", "Editing grades feature", "Styling update", "error alerts with toasts", "error for fake accounts", "Adding students to classroom", "Feature for removing students", "Creating classrooms", "Add Firebase", "login form", "Teacher page", "Login errors alert", "Teacher page is protected"];

const listItemsApril = april.map((april) =>
    <li>{april}</li>
  );


// Changes in March
const march = ["Homepage", "Support form", "Profiles for developers", "Removed Bootstrap"];

const listItemsMarch = march.map((march) =>
    <li>{march}</li>
  );


export default function ChangeLog() {
    return (
        <>
            <Nav />
            <div>
                <h3>May Changes:</h3>
                    <br></br>
                    <ul>{listItemsMay}</ul>
                    <br></br>
                    <br></br>
                <h3>April Changes:</h3>
                    <br></br>
                    <ul>{listItemsApril}</ul>
                    <br></br>
                    <br></br>
                <h3>March Changes:</h3>
                    <br></br>
                    <ul>{listItemsMarch}</ul>
            </div>
            <Footer />
        </>
    )
}
