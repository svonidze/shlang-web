import * as React from 'react';
import { saveAs } from 'file-saver';

import { VocabularyLocalStorage } from '../services/VocabularyLocalStorage';
import { GoogleDrive } from './integration/GoogleDrive';
import { BACKUP_FILE } from 'src/constants';
import { parseAndSyncUserConfiguration, extractUserConfiguration } from 'src/services/UserConfiguration';

export default function Settings() {
    const vocabularyStorage = new VocabularyLocalStorage();

    return (
        <div>
            <label>Backup</label>
            <GoogleDrive></GoogleDrive>
            {/* <button onClick={() => saveToCloud('Google Drive')}></button> */}
            <br />
            <button onClick={() => exportConfigAsFile()}>Export</button>
            <button onClick={() => tryImportConfigFile()}>Import</button>
        </div>
    )


    function exportConfigAsFile() {
        const configuration = extractUserConfiguration(vocabularyStorage);
        const blob = new Blob(
            [JSON.stringify(configuration)],
            { type: BACKUP_FILE.MIME_type });

        saveAs(blob, BACKUP_FILE.name);
    }

    function tryImportConfigFile() {
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
                parseAndSyncUserConfiguration(onloadEvent!.target!['result'], vocabularyStorage);
            };

            fileReader.readAsText(files[0]);
        });

        uploadDialog.click();
    }
}