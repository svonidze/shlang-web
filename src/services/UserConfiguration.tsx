import { UserWordLocalStorageService } from "./WordLocalStorage";
import { UserConfiguration } from "src/models/UserConfiguration";

export function parseAndSyncUserConfiguration(json: string, storageService: UserWordLocalStorageService) {
    let configuration: UserConfiguration;
    try {
        configuration = JSON.parse(json);
    } catch (exception) {
        alert('Could not read the file. See log for details.');
        console.error(exception);
        return;
    }

    try {
        const importResults = storageService.addAll(configuration.userWords);
        console.log(importResults);
    } catch (exception) {
        alert('Could not import configuration from the file. See log for details.');
        console.error(exception);
        return;
    }
}

export function extractUserConfiguration(storageService: UserWordLocalStorageService): UserConfiguration {
    const configuration = new UserConfiguration();
    configuration.userWords = storageService.getAll();
    return configuration;
}