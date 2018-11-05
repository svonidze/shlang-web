import * as React from 'react';
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="App-header">
            <label className="App-title">
                <Link to='/'>shlang</Link>
            </label>
            <nav className="App-header-navigation">
                <Link to='/settings'>settings</Link>
            </nav>
        </header>
    )
}