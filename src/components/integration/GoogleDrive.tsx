import * as React from "react";
import { loadAndInjectJS } from "../../services/DOM";
import { newFile as newDriveFile, downloadDriveFile } from './GoogleDriveAPI'
import { UserWordLocalStorageService } from "src/services/WordLocalStorage";
import { extractUserConfiguration } from "../Settings";
import { BACKUP_FILE } from "src/constants";

// Client ID and API key from the Developer Console
const CLIENT_ID = '358710366205-qtbhkrq2ovvhqhsl24h61nmp7luafpjg.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCDx1lNwV0JYhYTtDtbqaKCf4r3_7s6JEA';

/*
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
*/
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
    //'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.apps.readonly',
];

interface IProps {
}

interface IState {
    oauthToken?: string,
    file?: {
        id: string,
        name: string,
        url: string
    };
}

export class GoogleDrive extends React.Component<IProps, IState> {
    localConfigStorage: UserWordLocalStorageService;

    constructor(props: IProps) {
        super(props);
        this.state = {};
        this.localConfigStorage = new UserWordLocalStorageService();
    }

    componentDidMount() {
        loadAndInjectJS(
            'https://apis.google.com/js/api.js',
            document.body,
            () => {
                console.info('api.js loaded');

                gapi.load("client", () => {
                    console.info('gapi.client loaded');
                    gapi.client.setApiKey(API_KEY);
                    // now we can use gapi.client
                    // gapi.client.load('drive', 'v3', () => {
                    //     console.info('gapi.client.drive loaded');
                    //     // now we can use gapi.client.drive

                    // });
                });
            });
    }

    render() {
        return (
            <div>
                <h1>GoogleDrive authorization</h1>
                {this.state.file &&
                    <section>
                        <a href={this.state.file.url}>{`${this.state.file.name} (${this.state.file.id})`}</a>
                    </section>
                }
                {this.state.oauthToken
                    ?
                    <div>
                        <button onClick={this.onOpenPicker.bind(this)}>Exisitng file</button>
                        <button onClick={this.newFile.bind(this)}>New file</button>
                    </div>
                    : <button onClick={() => this.auth(false)}>Authorize</button>
                }
            </div>);
    }

    auth(immediate: boolean, force = false) {
        if (this.state.oauthToken && !force) {
            console.log('auth was already done')
            return;
        }

        gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: immediate
        }, (authResult) => {
            console.log('authResult', authResult);
            if (authResult && !authResult.error) {
                this.setState({ ...this.state, oauthToken: authResult.access_token });
            } else {
                console.warn('fail', authResult.error);
                //$('#auth-button').show();
                // could show a message here.
            }
        });
    }

    makeApiCall() {
        gapi.client.load('drive', 'v3', () => {
            console.info('gapi.client.drive loaded');
            this.listFiles();
        });
    }

    listFiles() {
        gapi.client.drive.files.list({
            'pageSize': 50,
            'fields': "files(id, name)"
        }).then((response) => {
            const appendPre = (text: string) => {
                console.log(text);
            }
            appendPre('Files:');
            var files = response.result.files;
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    appendPre(file.name + ' (' + file.id + ')');
                }
            } else {
                appendPre('No files found.');
            }
        });
    }

    onOpenPicker() {
        gapi.load('picker', () => {
            console.log('picker API loaded');
            this.createPicker();
        });
    }

    createPicker() {
        if (this.state.oauthToken) {
            const picker = new google.picker.PickerBuilder()
                .addView(google.picker.ViewId.DOCS)
                .setOAuthToken(this.state.oauthToken)
                .setDeveloperKey(API_KEY)
                .setCallback(this.pickerCallback.bind(this))
                .build();
            picker.setVisible(true);
        }
        else {
            this.auth(true, false);
        }
    }

    pickerCallback(data: any) {
        const action = data[google.picker.Response.ACTION];
        if (action == google.picker.Action.PICKED) {
            var doc = data[google.picker.Response.DOCUMENTS][0];
            const fileId = doc[google.picker.Document.ID];
            downloadDriveFile(fileId, this.state.oauthToken!, (content) => {
                console.log(`Read file ${fileId} with content`, content)
            });
            this.setState({
                ...this.state,
                file: {
                    id: fileId,
                    name: doc[google.picker.Document.NAME],
                    url: doc[google.picker.Document.URL]
                }
            });
            console.info('You picked: ' + doc[google.picker.Document.URL], doc);
        }
        else {
            console.warn('Action not hanlded', action, data)
        }
    }

    newFile() {
        const configuration = extractUserConfiguration(this.localConfigStorage);

        newDriveFile(
            BACKUP_FILE.name,
            BACKUP_FILE.MIME_type,
            btoa(JSON.stringify(configuration)),
            (r: any) => {
                this.setState({
                    ...this.state, file: {
                        id: r.id,
                        name: r.title,
                        url: r.defaultOpenWithLink
                    }
                });
            }
        );
    }
}
