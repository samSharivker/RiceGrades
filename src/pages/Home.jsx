import Nav from '../components/Nav';
import Footer from '../components/Footer';
//import Logo from '../img/logo.svg';

function Home() {
    return (
        <div>
            <Nav />
            <div id="home-1">
                <div className="container-fluid">
                    <div className="container text-center">
                        <div id="wrapper">
                            <h id="home-top">Rice Grades</h> <br />
                            <h id="home-mid">"Cook your Grades like your Rice"</h> <br />
                            <h>- Jiaming Lin</h>
                        </div>
                    </div>
                </div>
            </div>
            <div id="home-2">
                <div className="container-fluid">
                    <p>Text</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;