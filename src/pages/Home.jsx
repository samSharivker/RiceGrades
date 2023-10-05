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
                            <h1 className="display-1">Rice Grades</h1>
                            <h3>"Cook your Grades like your Rice"</h3>
                            <h6>- Jiaming</h6>
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