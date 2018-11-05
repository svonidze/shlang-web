import * as React from "react";
import { loadAndInjectJS } from "../../services/DOM";
import { createFile as createFileOnDrive, readFile as readFileOnDrive, updateFile as updateFileOnDrive } from './GoogleDriveAPI'
import { UserWordLocalStorageService } from "src/services/WordLocalStorage";
import { parseAndSyncUserConfiguration, extractUserConfiguration } from 'src/services/UserConfiguration';
import { BACKUP_FILE } from "src/constants";
import { unicodeToBase64 } from "src/services/Encoding";

// CLIENT_ID for the web version only, CLIENT_ID for the chrome extentions is hardcoded in manifest.json
const CLIENT_ID = '358710366205-qtbhkrq2ovvhqhsl24h61nmp7luafpjg.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCDx1lNwV0JYhYTtDtbqaKCf4r3_7s6JEA';

//const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

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
    chromeExtetntion: boolean,
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
        console.info('ctor');
        super(props);
        this.state = { chromeExtetntion: chrome.identity ? true : false };
        
        this.localConfigStorage = new UserWordLocalStorageService();

        this.onOpenPicker = this.onOpenPicker.bind(this);
        this.createAndFillNewFileOnDrive = this.createAndFillNewFileOnDrive.bind(this);
        this.signIn = this.signIn.bind(this);
        this.syncPickedFileWithInternalStorage = this.syncPickedFileWithInternalStorage.bind(this);
    }

    componentDidMount() {
        loadAndInjectJS(
            'https://apis.google.com/js/api.js',
            document.body,
            () => {
                console.info('api.js loaded');

                gapi.load('client', () => {
                    console.info('client loaded');

                    gapi.client.setApiKey(API_KEY);

                    if (this.state.chromeExtetntion) {
                        chrome.identity.getAuthToken({ interactive: true }, (token) => {
                            console.log('oauthToken from chrome.identity', token);
                            gapi.client.setToken({access_token: token});
                            token && this.setState({ ...this.state, oauthToken: token });
                        });
                    }
                    else {
                        gapi.load('auth2', () => {
                            gapi.auth2.init({
                                client_id: CLIENT_ID,
                                scope: SCOPES.join(' '),
                                //cookie_policy: 'none'
                            }).then(() => {
                                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                                    const token = gapi.auth.getToken().access_token;
                                    this.setState({ ...this.state, oauthToken: token });
                                }
                            })
                        })
                    }
                });
            });
    }

    render() {
        return (
            <div>
                <strong>GoogleDrive authorization</strong>
                <br/>
                {this.state.file &&
                    <a href={this.state.file.url}>{`${this.state.file.name} (${this.state.file.id})`}</a>
                }
                {this.state.oauthToken
                    ?
                    <div>
                        <button onClick={this.onOpenPicker}>Exisitng file</button>
                        <button onClick={this.createAndFillNewFileOnDrive}>New file</button>
                    </div>
                    : <button onClick={this.signIn}>Sign in</button>
                }
            </div>);
    }

    signIn() {
        if (this.state.oauthToken) {
            console.log('auth was already done')
            return;
        }

        if (this.state.chromeExtetntion) {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                console.log('token from chrome.identity', token)
                if (token)
                    this.setState({ ...this.state, oauthToken: token });
            });
            return;
        }

        gapi.auth2.getAuthInstance().signIn().then(user => {
            const token = user.getAuthResponse().access_token;
            this.setState({ ...this.state, oauthToken: token });
        });
    }

    onOpenPicker() {
        gapi.load('picker', () => {
            console.log('picker API loaded');
            if (this.state.oauthToken) {
                const picker = new google.picker.PickerBuilder()
                    .addView(google.picker.ViewId.DOCS)
                    .setOAuthToken(this.state.oauthToken)
                    .setDeveloperKey(API_KEY)
                    .setCallback(this.syncPickedFileWithInternalStorage)
                    .build();
                picker.setVisible(true);
            }
            else {
                this.signIn();
            }
        });
    }

    syncPickedFileWithInternalStorage(data: any) {
        const action = data[google.picker.Response.ACTION];
        if (action == google.picker.Action.PICKED) {
            var doc = data[google.picker.Response.DOCUMENTS][0];
            const fileId = doc[google.picker.Document.ID];
            readFileOnDrive(fileId, this.state.oauthToken!, (content) => {
                console.log('content', content);
                // merge with the internal storage
                parseAndSyncUserConfiguration(content, this.localConfigStorage);

                // overwrite merged data with the external storage
                const configuration = extractUserConfiguration(this.localConfigStorage);
                updateFileOnDrive(
                    fileId,
                    BACKUP_FILE.MIME_type,
                    unicodeToBase64(JSON.stringify(configuration)));
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

    createAndFillNewFileOnDrive() {
        const configuration = extractUserConfiguration(this.localConfigStorage);

        createFileOnDrive(
            BACKUP_FILE.name,
            BACKUP_FILE.MIME_type,
            unicodeToBase64(JSON.stringify(configuration)),
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
