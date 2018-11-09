export class LocalStorageWrapper implements Storage {

    private static readonly delimiter = ':';
    private static readonly defaultPrefix = 'sl' 
        + LocalStorageWrapper.delimiter;
    private readonly prefix: string;

    constructor (prefix: string = LocalStorageWrapper.defaultPrefix) {
        if (prefix !== LocalStorageWrapper.defaultPrefix) {
            this.prefix = LocalStorageWrapper.defaultPrefix 
                + prefix
                + LocalStorageWrapper.delimiter 
        }
    }

    [name: string]: any;
    length: number;
    /**
     * Clears all not only application specifc keys
     */
    clear(): void {
        localStorage.clear();
    }
    getItem(key: string): string | null {
        return localStorage.getItem(this.addPrefixToKey(key));
    }
    key(index: number): string | null {
        throw new Error("Method not implemented.");
    }
    removeItem(key: string): void {
        localStorage.removeItem(this.addPrefixToKey(key));
    }
    setItem(key: string, value: string): void {
        return localStorage.setItem(this.addPrefixToKey(key), value);
    }

    keys(): string[] {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => this.removePrefixToKey(key));
    }

    addPrefixToKey(key: string): string {
        return key.startsWith(this.prefix)
            ? key
            : this.prefix + key;
    }

    private removePrefixToKey(key: string): string {
        return key.startsWith(this.prefix)
            ? key.substring(this.prefix.length, key.length)
            : key;
    }
}