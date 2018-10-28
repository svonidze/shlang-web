import * as React from "react";
import { loadAndInjectJS } from "../../services/DOM";

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

export class GoogleDrive extends React.Component {
    oauthToken: any;
    pickerApiLoaded = false;

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
                <button onClick={() => this.auth(false)}>Authorize</button>
                <button onClick={this.onOpenPicker.bind(this)}>Load Files</button>
            </div>);
    }

    auth(immediate: boolean, force = false) {
        if(this.oauthToken && !force){
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
                this.oauthToken = authResult.access_token;
                this.makeApiCall();
            } else {
                //$('#auth-button').show();
                // could show a message here.
            }
        });
        return false;

        /*
        gapi.auth.authorize({ client_id: CLIENT_ID, scope: SCOPES, immediate: true }, authResult => {
                        console.log('GoogleDrive', authResult);
                        if (authResult && !authResult.error) {
                            console.log('success');
                            // handle succesfull authorization 
                        } else {
                            console.warn('fail', authResult.error);
                            // handle authorization error 
                        }
                    });
        */
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
            this.pickerApiLoaded = true;
            this.createPicker();
        });
    }

    createPicker() {
        if (this.pickerApiLoaded && this.oauthToken) {
            var picker = new google.picker.PickerBuilder().
                addView(google.picker.ViewId.DOCS).
                setOAuthToken(this.oauthToken).
                setDeveloperKey(API_KEY).
                setCallback(this.pickerCallback.bind(this)).
                build();
            picker.setVisible(true);
        }
        else{
            console.warn(this.pickerApiLoaded, this.oauthToken)
        }
    }

    // A simple callback implementation.
    pickerCallback(data: any) {
        var url = 'nothing';
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
            var doc = data[google.picker.Response.DOCUMENTS][0];
            url = doc[google.picker.Document.URL];
        }
        var message = 'You picked: ' + url;
        console.warn(message);
    }


}
