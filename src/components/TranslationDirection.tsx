import * as React from "react";
import { Languages } from "src/constants/Languages";

export interface IProps {
    lang?: string;
}
export interface IActionProps {
    setLang: (langTo: string) => void;
}

export class TranslationDirection extends React.Component<IProps & IActionProps> {
    render() {
        const dropdownLangTo = <select value={this.props.lang}
            onChange={e => { console.log(e.target.value, e); this.props.setLang(e.target.value); }}>
            {Languages.getAllCodes({ except: [Languages.auto] }).map(code =>
                <option key={code} value={code} label={Languages.list[code]} />)}
        </select>

        return <div>
            {dropdownLangTo}
        </div>;
    }
}