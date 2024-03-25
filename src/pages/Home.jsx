import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Logo from '../img/logo.svg';

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
                <div className="grid text-center">
                        <div className="g-col-6">
                            {/* <div className="container text-center"> */}
                                <img src={Logo} alt="logo" class="img-fluid rounded mx-auto d-block" height="300" width="300" />
                            {/* </div> */}
                        </div>
                        <div className="g-col-6">
                            {/* <div className="container text-center"> */}
                                <h id="line-1">Professional Grading App</h> <br />
                                <h id="line-2">Created by Students For Students</h>
                            {/* </div> */}
                        </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home;