import { IWord } from './../model/word';
import { UserConfiguration } from './../model/user-configuration';
import { Component, ElementRef, OnInit, NgZone } from '@angular/core';
import { saveAs } from 'file-saver';
import { UserWordLocalStorageService } from '../services/user-word-local-storage.service';
import 'gapi.client';
import { LoggerService } from '../logging/logger.service';

@Component({
    selector: 'app-settings',
    templateUrl: '../templates/settings.html'
})
export class SettingsComponent {
    constructor(
        private storageService: UserWordLocalStorageService,
        private googleDriveApi: GoogleDriveApi) { }

    exportConfigAsFile() {
        const configuration = this.extractUserConfiguration();
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

    saveToCloud(cloudProviderName: string, fileId: string) {
        switch (cloudProviderName) {
            case 'Google Drive':
                {
                    this.googleDriveApi.init();
                    // const configuration = this.extractUserConfiguration();
                    // const json = JSON.stringify(configuration);
                }
                break;

            default: throw Error(`Cloud provider "${cloudProviderName}" not supported.`);

        }
    }

    private extractUserConfiguration(): UserConfiguration {
        const configuration = new UserConfiguration();
        configuration.userWords = this.storageService.getAll();
        return configuration;
    }
}

export class GoogleDriveApi implements OnInit {

    constructor(private zone: NgZone, private log: LoggerService) { }

    CLIENT_ID = '358710366205-qtbhkrq2ovvhqhsl24h61nmp7luafpjg.apps.googleusercontent.com';
    API_KEY = 'AIzaSyCDx1lNwV0JYhYTtDtbqaKCf4r3_7s6JEA';

    // Array of API discovery doc URLs for APIs used by the quickstart
    DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    SCOPES = [
        // 'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
    ];

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    private loadClient(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                   gapi.load('client', {
                       
                   });
            });
       });
   }

    init() {
        gapi.load('client', () =>
            gapi.client.load('drive', 'v3', () => {
                gapi.auth.authorize(
                    {
                        client_id: this.CLIENT_ID,
                        scope: this.SCOPES.join(' '),
                        immediate: true
                    },
                    authResult => {
                        if (authResult && !authResult.error) {
                            /* handle succesfull authorization */
                            this.log.info(authResult);
                        } else {
                            /* handle authorization error */
                            this.log.error(authResult);
                        }
                    });
            }));
    }
}
