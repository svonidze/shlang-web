import { VocabularyLocalStorage } from "./VocabularyLocalStorage";
import { UserConfiguration } from "src/models/UserConfiguration";

/**
* Parses and syncs/merges passed @type {UserConfiguration} with the internal storage
@param json JSON formated @type {UserConfiguration}
@param storage @type {VocabularyLocalStorage}
*/
export function parseAndSyncUserConfiguration(json: string, storage: VocabularyLocalStorage) {
    let configuration: UserConfiguration;
    try {
        configuration = JSON.parse(json);
    } catch (exception) {
        alert('Could not read the file. See console/log for details.');
        console.error(exception);
        return;
    }

    try {
        const importResults = storage.addAll(configuration.userWords);
        console.log(importResults);
    } catch (exception) {
        alert('Could not import configuration from the file. See console/log for details.');
        console.error(exception);
        return;
    }
}

export function extractUserConfiguration(storageService: VocabularyLocalStorage): UserConfiguration {
    const configuration = new UserConfiguration();
    configuration.userWords = storageService.getAll();
    return configuration;
}
