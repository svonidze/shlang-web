import * as React from 'react';
import { saveAs } from 'file-saver';

import { VocabularyLocalStorage } from '../services/VocabularyLocalStorage';
import { GoogleDrive } from './integration/GoogleDrive';
import { BACKUP_FILE } from 'src/constants';
import { parseAndSyncUserConfiguration, extractUserConfiguration } from 'src/services/UserConfiguration';
import TranslationDirection from './TranslationDirection';
import UserConfigurationLocalStorage from 'src/services/UserConfigurationLocalStorage';

export interface IActionProps {
    setLangTo: (langTo: string) => void;
}

export default class Settings extends React.Component<IActionProps> {
    readonly vocabularyStorage = new VocabularyLocalStorage();
    readonly userConfigStorage = new UserConfigurationLocalStorage();

    render() {
        return <div>
            <div>
                <label>Backup</label>
                <GoogleDrive />
                <br />
                <button onClick={() => this.exportConfigAsFile()}>Export</button>
                <button onClick={() => this.tryImportConfigFile()}>Import</button>
                <br />
                <TranslationDirection
                    title='Translation language'
                    defaultLang={(this.userConfigStorage.get() || {}).preferedLangTo}
                    setLang={lang => {
                        this.userConfigStorage.set({ preferedLangTo: lang });
                        this.props.setLangTo(lang);
                        // for some reason this will not be rerender even setLangTo dispatces changing of the global state 
                        // probably the reason is due to Setting is placed at
                        // <Switch> <Route exact path='/settings' component={Settings} />
                        this.forceUpdate();
                    }} />
            </div>
        </div>;
    }

    exportConfigAsFile() {
        const configuration = extractUserConfiguration(this.vocabularyStorage);
        const blob = new Blob(
            [JSON.stringify(configuration)],
            { type: BACKUP_FILE.MIME_type });

        saveAs(blob, BACKUP_FILE.name);
    }

    tryImportConfigFile() {
        const uploadDialog = document.createElement('input');
        uploadDialog.setAttribute('type', 'file');
        uploadDialog.setAttribute('style', 'display:none');
        uploadDialog.addEventListener('change', (onChangeEvent) => {

            const files = onChangeEvent!.target!['files'];
            if (!files.length) {
                console.log('No file selected.');
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = (onloadEvent) => {
                parseAndSyncUserConfiguration(onloadEvent.target!['result'], this.vocabularyStorage);
            };

            fileReader.readAsText(files[0]);
        });

        uploadDialog.click();
    }
}