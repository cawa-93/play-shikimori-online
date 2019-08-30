interface AppErrorSchema {
    name?: string;
    message?: string;
    reason?: string;
    response?: {
        status: number;
        body: {
            [key: string]: any,
        };
    };
    request?: {
        url: string;
        options: {
            [key: string]: any,
        }
    };
}

interface Error {
    alert: () => Error;
    track: () => Error;
    toJSON: () => AppErrorSchema;
}
