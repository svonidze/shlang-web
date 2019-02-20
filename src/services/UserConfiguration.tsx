import { VocabularyLocalStorage } from "./VocabularyLocalStorage";
import { UserConfiguration } from "src/models/UserConfiguration";
import { TransactionSummary } from "src/models/TransactionSummary";

/**
* Parses and syncs/merges passed @type {UserConfiguration} with the internal storage
@param json JSON formated @type {UserConfiguration}
@param storage @type {VocabularyLocalStorage}
*/
export function parseAndSyncUserConfiguration(json: string, storage: VocabularyLocalStorage) : Promise<TransactionSummary> {
    return new Promise((resolve, reject) => {
        let configuration: UserConfiguration;
        try {
            configuration = JSON.parse(json);
        } catch (exception) {
            console.error('Could not read the file.', exception, json);
            throw exception;
        }

        try {
            const importResults = storage.addAll(configuration.userWords);
            resolve(importResults);
        } catch (exception) {
            alert('Could not import configuration from the file. See console/log for details.');
            console.error(exception);
            throw exception;
        }
    });
}

export function extractUserConfiguration(storageService: VocabularyLocalStorage): UserConfiguration {
    const configuration = new UserConfiguration();
    configuration.userWords = storageService.getAll();
    return configuration;
}
