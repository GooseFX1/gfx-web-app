type ModuleName = "Common.Api";
declare enum LogLevel {
    Error = 0,
    Warning = 1,
    Info = 2,
    Debug = 3
}
declare class Logger {
    private logLevel;
    private name;
    constructor(params: {
        name: string;
        logLevel?: LogLevel;
    });
    set level(logLevel: LogLevel);
    get time(): string;
    get moduleName(): string;
    private isLogLevel;
    error(...props: unknown[]): Logger;
    logWithError(...props: unknown[]): Logger;
    warning(...props: unknown[]): Logger;
    info(...props: unknown[]): Logger;
    debug(...props: unknown[]): Logger;
}
declare function createLogger(moduleName: string): Logger;
declare function setLoggerLevel(moduleName: string, level: LogLevel): void;

export { LogLevel, Logger, ModuleName, createLogger, setLoggerLevel };
