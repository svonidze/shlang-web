import * as React from 'react';
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="App-header">
            <label className="App-title">shlang</label>
            <nav className="App-header-navigation">
                <ul>
                    {/* <li><Link to='/'>Home</Link></li> */}
                    <li><Link to='/settings'>Settings</Link></li>
                </ul>
            </nav>
        </header>
    )
}