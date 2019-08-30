import {AppError} from '@/helpers/errors/AppError.class';

export class PermissionError extends AppError {

    constructor(error: string | AppErrorSchema = {}, origin?: string) {

        if (typeof error === 'string') {
            error = {message: error};
        }

        error = Object.assign({
            name: 'PermissionError',
            reason: `вы не дали разрешение на доступ к ресурсу ${origin || ''}`,
        }, error);

        super(error);

        /**
         * Если ошибка произошла из-за отсутствия прав на доступ к ресурсу
         * Нет необходимости её отслеживать
         */
        this.track = function() {
            return this;
        };
    }
}

// @ts-ignore
window.PermissionError = PermissionError;
