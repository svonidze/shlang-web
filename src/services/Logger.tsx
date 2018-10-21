export abstract class Logger {

    info: any;
    warn: any;
    error: any;
}

export class LoggerService implements Logger {

    info: any;
    warn: any;
    error: any;

    invokeConsoleMethod(type: string, args?: any): void { }
}
