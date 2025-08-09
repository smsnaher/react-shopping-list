import { Link } from 'react-router-dom';

export const Header = ({ title }: { title: string }) => {
    return (
        <header>
            <h1>{title}</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    )
}
