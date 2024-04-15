import Nav from './Nav';
import Footer from './Footer';

export default function Login() {
    return (
        <div>
            <Nav />
            <input id="username" placeholder="Name"></input>
            <input id="password" placeholder="Password"></input>
            <Footer />
        </div>
    )
}


