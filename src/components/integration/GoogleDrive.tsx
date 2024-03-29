import * as React from "react";
import { loadAndInjectJS } from "../../services/DOM";
import { createFile as createFileOnDrive, readFileAsText as readFileOnDrive, updateFile as updateFileOnDrive } from './GoogleDriveAPI'
import { VocabularyLocalStorage } from "src/services/VocabularyLocalStorage";
import { parseAndSyncUserConfiguration, extractUserConfiguration } from 'src/services/UserConfiguration';
import { BACKUP_FILE } from "src/constants";
import { unicodeToBase64 } from "src/services/Encoding";
import { LocalStorageWrapper } from "src/services/LocalStorageWrapper";

import * as NotificationSystem from 'react-notification-system';
import { NotificationLogger } from "src/services/NotificationLogger";


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
    file?: IDriveFile
}

interface IDriveFile {
    id: string,
    name: string,
    url: string
}

export class GoogleDrive extends React.Component<IProps, IState> {
    vocabularyStorage: VocabularyLocalStorage;
    configStore: LocalStorageWrapper;
    log: NotificationLogger;

    constructor(props: IProps) {
        super(props);
        this.onOpenPicker = this.onOpenPicker.bind(this);
        this.createAndFillNewFileOnDrive = this.createAndFillNewFileOnDrive.bind(this);
        this.signIn = this.signIn.bind(this);
        this.syncPickedFileWithInternalStorage = this.syncPickedFileWithInternalStorage.bind(this);
        this.forceVocabluraryFileSync = this.forceVocabluraryFileSync.bind(this);
        this.detachDriveFile = this.detachDriveFile.bind(this);

        this.vocabularyStorage = new VocabularyLocalStorage();
        this.configStore = new LocalStorageWrapper('config');


        const configFileJson = this.configStore.getItem('file');

        this.state = {
            chromeExtetntion: chrome.identity ? true : false,
            file: configFileJson && JSON.parse(configFileJson)
        };
    }

    componentDidMount() {
        this.log = new NotificationLogger(this.refs.notificationSystem as NotificationSystem.System);

        loadAndInjectJS(
            'https://apis.google.com/js/api.js',
            document.body,
            () => {
                this.log.debug('api.js loaded');

                gapi.load('client', () => {
                    this.log.debug('client loaded');

                    gapi.client.setApiKey(API_KEY);

                    if (this.state.chromeExtetntion) {
                        chrome.identity.getAuthToken({ interactive: true }, (token) => {
                            this.log.debug('oauthToken from chrome.identity', token);
                            gapi.client.setToken({ access_token: token });
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
        const FileInfo = (file: IDriveFile) =>
            <a href={file.url}>
                {`${file.name} (${file.id})`}
            </a>;
        const SyncFileButton = (file: IDriveFile | undefined) =>
            <button
                disabled={!file}
                onClick={() => this.forceVocabluraryFileSync(file!.id)}>
                Force sync
            </button>;

        const DetachFileButton = (file: IDriveFile | undefined) =>
            <button
                disabled={!file}
                onClick={this.detachDriveFile}>
                Detach file
            </button>;
        return (
            <div>
                <strong>GoogleDrive authorization</strong>
                <br />
                {this.state.file && <FileInfo {...this.state.file} />}
                {this.state.oauthToken
                    ?
                    <div>
                        {SyncFileButton(this.state.file)}
                        <button onClick={this.onOpenPicker}>Exisitng file</button>
                        <button onClick={this.createAndFillNewFileOnDrive}>New file</button>
                        {DetachFileButton(this.state.file)}
                    </div>
                    : <button onClick={this.signIn}>Sign in</button>
                }
                <NotificationSystem ref="notificationSystem" />
            </div>);
    }

    signIn() {
        if (this.state.oauthToken) {
            this.log.debug('auth was already done')
            return;
        }

        if (this.state.chromeExtetntion) {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                this.log.debug('token from chrome.identity', token)
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
            this.log.debug('picker API loaded');
            if (this.state.oauthToken) {
                const picker = new google.picker.PickerBuilder()
                    .addView(google.picker.ViewId.DOCS)
                    .addView(new google.picker.DocsView())
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

            const driveFile: IDriveFile = {
                id: doc[google.picker.Document.ID],
                name: doc[google.picker.Document.NAME],
                url: doc[google.picker.Document.URL]
            };
            this.log.debug('You picked: ' + driveFile.url, doc);

            this.forceVocabluraryFileSync(driveFile.id);
            this.updateStateWith(driveFile);
        }
        else {
            this.log.debug('Action not hanlded', action, data)
        }
    }

    createAndFillNewFileOnDrive() {
        const configuration = extractUserConfiguration(this.vocabularyStorage);

        createFileOnDrive(
            BACKUP_FILE.name,
            BACKUP_FILE.MIME_type,
            unicodeToBase64(JSON.stringify(configuration)),
            (r: any) => {
                this.updateStateWith({
                    id: r.id,
                    name: r.title,
                    url: r.defaultOpenWithLink
                });
            }
        );
    }

    forceVocabluraryFileSync(fileId: string): void {
        if (!fileId) {
            this.log.error('fileId not provided to finish sync');
            return;
        }
        readFileOnDrive(fileId, this.state.oauthToken!)
            .then(content => {
                this.log.debug('readFileOnDrive', content);
                parseAndSyncUserConfiguration(content, this.vocabularyStorage);

                // overwrite merged data with the external storage
                const configuration = extractUserConfiguration(this.vocabularyStorage);
                updateFileOnDrive(
                    fileId,
                    BACKUP_FILE.MIME_type,
                    unicodeToBase64(JSON.stringify(configuration)));
                this.log.success(`${configuration.userWords.length} words were imported to ${fileId}`)
            })
            .catch(reason => this.log.error(reason));
    }

    private detachDriveFile() {
        this.updateStateWith(undefined);
    }

    private updateStateWith(configFile: IDriveFile | undefined) {
        if (configFile) {
            this.configStore.setItem('file', JSON.stringify(configFile));
            this.log.success(`Google ${configFile.id} Drive file were updated`);
        }
        else {
            this.configStore.removeItem('file');
            this.log.warn(`Google Drive file were removed`);
        }

        this.setState({
            ...this.state,
            file: configFile
        });

    }
}
