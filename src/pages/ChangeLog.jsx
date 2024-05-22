import Nav from '../components/Nav';
import Footer from '../components/Footer';

//Changes in May
const may = [
    "Changelog is up to date(05/14/2024)",
    "Style update"
];
//Turns may array into list
const listItemsMay = may.map((may) =>
    <li>{may}</li>
  );

// Changes in April
const april = [
    "Student Classroom view",
    "Button for deleting classroom",
    "Refresh tooltip button",
    "Editing grades feature",
    "Styling update",
    "Error alerts with toasts",
    "Error for fake accounts",
    "Add students to classroom",
    "Feature for removing students",
    "Creating classrooms",
    "Add Firebase",
    "login form",
    "Teacher page",
    "Login errors alert",
    "Teacher page is protected"
];
//Turns april array into list
const listItemsApril = april.map((april) =>
    <li>{april}</li>
  );


// Changes in March
const march = [
    "Homepage",
    "Support form",
    "Profiles for developers",
    "Removed Bootstrap"
];
//Turns march array into list
const listItemsMarch = march.map((march) =>
    <li>{march}</li>
  );


export default function ChangeLog() {
    return (
        <>
            <Nav />
            <div className="change-log-wrapper">
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
