import {errorMessage} from '@/helpers/runtime-messages';


/**
 * Показывает всплывающий попап с ошибкой для пользователя
 */
Error.prototype.alert = function() {
    errorMessage(this.message);
    return this;
};


/**
 * Отправить ошибку в систему трекинга
 */
Error.prototype.track = function() {
    // @ts-ignore
    if (self.Sentry) {
        // @ts-ignore
        self.Sentry.captureException(this);
    } else if (process.env.NODE_ENV === 'production') {
        // @ts-ignore
        console.warn('Невозможно отправить отчет об ошибке', {Sentry: self.Sentry});
    }

    return this;
};


Error.prototype.toJSON = function() {
    const error = {
        name: this.name,
        message: this.message,
        stack: this.stack,
    };

    for (const key in this) {
        // @ts-ignore
        if (typeof this[key] !== 'function') {
            // @ts-ignore
            error[key] = this[key];
        }
    }

    return error;
};


export class AppError extends Error {
    public reason?: string;
    public response?: {
        [key: string]: any,
    };
    public request?: {
        [key: string]: any,
    };

    constructor(error: string | AppErrorSchema = {}) {
        if (typeof error === 'string') {
            error = {message: error};
        }


        if (error.reason) {
            error.message = `${error.message}: ${error.reason}`;
        }


        super(error.message);

        Object.assign(this, {
                name: 'AppError',
                message: 'Невозможно выполнить операцию',
            },
            error,
        );

        // Підтримує правильне трасування стеку в точці, де була викинута помилка (працює лише на V8)
        // @ts-ignore
        if (Error.captureStackTrace) {
            // @ts-ignore
            Error.captureStackTrace(this, this.__proto__.constructor);
        }
    }
}
