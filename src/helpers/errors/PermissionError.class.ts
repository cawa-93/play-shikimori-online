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
    }

}
