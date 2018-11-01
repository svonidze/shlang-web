import * as React from 'react';
import { saveAs } from 'file-saver';

import { UserConfiguration } from "../models/UserConfiguration";
import { UserWordLocalStorageService } from '../services/WordLocalStorage';
import { GoogleDrive } from './integration/GoogleDrive';
import { BACKUP_FILE } from 'src/constants';

export default function Settings() {
    const wordStorage = new UserWordLocalStorageService();

    return (
        <div>
            <label>Backup</label>
            <GoogleDrive></GoogleDrive>
            {/* <button onClick={() => saveToCloud('Google Drive')}></button> */}
            <br />
            <button onClick={() => exportConfigAsFile(wordStorage)}>Export</button>
            <button onClick={() => tryImportConfigFile(wordStorage)}>Import</button>
        </div>
    )
}

function exportConfigAsFile(wordStorage: UserWordLocalStorageService) {
    const configuration = extractUserConfiguration(wordStorage);
    const blob = new Blob(
        [JSON.stringify(configuration)],
        { type: BACKUP_FILE.MIME_type });

    saveAs(blob, BACKUP_FILE.name);
}

function tryImportConfigFile(storageService: UserWordLocalStorageService) {
    const uploadDialog = document.createElement('input');
    uploadDialog.setAttribute('type', 'file');
    uploadDialog.setAttribute('style', 'display:none');
    uploadDialog.addEventListener('change', (onChangeEvent) => {

        const files = onChangeEvent!.target!['files'];
        if (files.length === 0) {
            console.log('No file selected.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (onloadEvent) => {
            let configuration: UserConfiguration;
            try {
                configuration = JSON.parse(onloadEvent!.target!['result']);
            } catch (exception) {
                alert('Could not read the file. See log for details.');
                throw exception;
            }

            try {
                const importResults = storageService.addAll(configuration.userWords);
                console.log(importResults);
            } catch (exception) {
                alert('Could not import configuration from the file. See log for details.');
                throw exception;
            }
        };

        fileReader.readAsText(files[0]);
    });

    uploadDialog.click();
}

export function extractUserConfiguration(storageService: UserWordLocalStorageService): UserConfiguration {
    const configuration = new UserConfiguration();
    configuration.userWords = storageService.getAll();
    return configuration;
}