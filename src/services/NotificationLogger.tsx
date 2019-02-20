import { System } from 'react-notification-system';
import { ConsoleLoggerService } from './ConsoleLogger';
import { Logger } from './Logger';
import { isUndefined } from 'util';

export class NotificationLogger implements Logger {
    readonly defaultAutoDismissSeconds: number = 10;

    private notificationSystem: System;
    private isDebugMode: boolean;
    private consoleLog: ConsoleLoggerService;

    constructor(notificationSystem: System, isDebugMode: boolean | undefined = undefined) {
        this.notificationSystem = notificationSystem;

        this.isDebugMode = isUndefined(isDebugMode) 
            ? process.env.NODE_ENV === 'development' 
            : isDebugMode;

        this.consoleLog = new ConsoleLoggerService(isDebugMode);
    }

    debug(message?: any, ...optionalParams: any[]): void {
        this.isDebugMode && this.consoleLog.invokeConsoleMethod('info', 'debug', message, optionalParams);
    }

    info(message?: any, ...optionalParams: any[]): void {
        this.notify('info', message, undefined, optionalParams);
    }

    warn(message?: any, ...optionalParams: any[]): void {
        this.notify('warning', message, undefined, optionalParams);
    }

    error(message?: any, ...optionalParams: any[]): void {
        this.notify('error', message, undefined, optionalParams);
    }

    success(message?: any, ...optionalParams: any[]): void {
        this.notify('success', message, undefined, optionalParams);
    }

    private notify(level: "error" | "warning" | "info" | "success", message?: any, title?: any, ...optionalParams: any[]) {
        let dumpToConosle = this.isDebugMode;

        if (this.notificationSystem) {
            this.notificationSystem.addNotification(
                {
                    title: title || level.toUpperCase(),
                    message: message,
                    autoDismiss: this.defaultAutoDismissSeconds,
                    level: level,
                    position: 'br',
                });
        }
        else {
            this.consoleLog.warn('NotificationSystem not found, the notification will appear in console');
            dumpToConosle = true;
        }

        if (dumpToConosle) {
            this.consoleLog.invokeConsoleMethod(level, title, message, optionalParams);
        }
    }
}