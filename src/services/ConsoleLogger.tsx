import { environment } from '../enviroment/enviroment';

import { Logger } from './Logger';

export let isDebugMode = !environment.production;

const noop = (): any => undefined;

export class ConsoleLoggerService implements Logger {

    get info() {
        if (isDebugMode) {
            return console.info.bind(console);
        }

        return noop;
    }

    get warn() {
        if (isDebugMode) {
            return console.warn.bind(console);
        }

        return noop;
    }

    get error() {
        if (isDebugMode) {
            return console.error.bind(console);
        }

        return noop;
    }

    invokeConsoleMethod(type: string, args?: any): void {
        const logFn: Function = (console)[type] || console.log || noop;
        logFn.apply(console, [args]);
    }
}
