import { IWord } from './../model/word';
import { UserConfiguration } from './../model/user-configuration';
import { Component, ElementRef } from '@angular/core';
import { saveAs } from 'file-saver';
import { UserWordLocalStorageService } from '../services/user-word-local-storage.service';

@Component({
    selector: 'app-settings',
    templateUrl: '../templates/settings.html',
    styles: ['float:right;']
})
export class SettingsComponent {
    constructor(private storageService: UserWordLocalStorageService) { }

    exportConfigAsFile() {
        const configuration = new UserConfiguration();
        configuration.userWords = this.storageService.getAll();

        const blob = new Blob(
            [JSON.stringify(configuration)],
            { type: 'application/json;charset=utf-8;' });

        saveAs(blob, 'shlang-user-data-backup.json');
    }

    tryImportConfigFile() {
        const uploadDialog = document.createElement('input');
        uploadDialog.setAttribute('type', 'file');
        uploadDialog.setAttribute('style', 'display:none');
        uploadDialog.addEventListener('change', (onChangeEvent) => {
            const files = onChangeEvent.target['files'];
            if (files.length === 0) {
                console.log('No file selected.');
                return;
            }

            const fileReader = new FileReader();
            fileReader.onload = (onloadEvent) => {
                let configuration: UserConfiguration;
                try {
                    configuration = JSON.parse(onloadEvent.target['result']);
                } catch (exception) {
                    alert('Could not read the file. See log for details.');
                    throw exception;
                }

                try {
                    const importResults = this.storageService.addAll(configuration.userWords);
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
}

