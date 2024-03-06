import Nav from '../components/Nav';
import Footer from '../components/Footer';

var whatChanged = "";
const changing = false;
if (changing === false){
    whatChanged = "nothing changed";
} else {
    whatChanged = "Something changed";
};

function ChangeLog() {
    return (
        <>
            <Nav />
            <div>
                <h1>ChangeLog</h1>
                <p>{whatChanged}</p>
            </div>
            <Footer />
        </>
    )
}

export default ChangeLog;