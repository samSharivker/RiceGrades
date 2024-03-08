import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Logo from '../img/logo.png';

export default function Home() {
    return (
        <div>
            <Nav />
            <section id="header">
                <div className="header">
                    <div className="container">
                        <p>"Cook your Grades like your Rice" - Jiaming Lin</p>
                        <img src="https://placehold.co/400x400.png" alt="temp" />
                    </div>
                </div>
            </section>
            <main>
                <section id="about">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#618264" fill-opacity="1" d="M0,64L48,74.7C96,85,192,107,288,106.7C384,107,480,85,576,90.7C672,96,768,128,864,138.7C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
                    <div className="about">
                        <div className="container">
                            <img src={Logo} alt="App Logo" />
                            <p>Professional Grading App for Students by Students</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#618264" fill-opacity="1" d="M0,64L48,74.7C96,85,192,107,288,106.7C384,107,480,85,576,90.7C672,96,768,128,864,138.7C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </section>
            </main>
            <div id="gallery">
                <div className="gallery">
                    <div className="container">
                        <h>Gallery View</h> <br /><br /><br />
                        <div className="slider-wrapper">
                            <div className="slider">
                                <img id="slide-1" src="https://placehold.co/640x360.png" alt="temp" />
                                <img id="slide-2" src="https://placehold.co/640x360/000000/FFF" alt="temp" />
                                <img id="slide-3" src="https://placehold.co/640x360/FF2400/FFF" alt="temp" />
                            </div>
                            <div className="slider-nav">
                                <a href="#slide-1">.</a>
                                <a href="#slide-2">.</a>
                                <a href="#slide-3">.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
