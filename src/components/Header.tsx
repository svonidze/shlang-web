import * as React from 'react';
import { Link } from "react-router-dom";
import TranslationDirection from './TranslationDirection';

export interface IProps { 
    defaultLangTo?: string;
}

export interface IActionProps {
    setLangTo: (langTo: string) => void;
}

export default function Header(props: IProps & IActionProps) {
    return (
        <header className="App-header">
            <label className="App-title">
                <Link to='/'>shlang</Link>
            </label>
            <nav className="App-header-navigation">
                <Link to='/settings'>settings</Link>
                <TranslationDirection title="To"  defaultLang={props.defaultLangTo} setLang={props.setLangTo} />
            </nav>
        </header>
    )
}