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
                    <div className="about">
                        <div className="container">
                            <img src={Logo} alt="App Logo" />
                            <p>Professional Grading App for Students by Students</p>
                        </div>
                    </div>
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
