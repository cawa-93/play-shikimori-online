import {AppError} from '@/helpers/errors/AppError.class';

export class APIError extends AppError {
    constructor(error: string | AppErrorSchema = {}) {

        if (typeof error === 'string') {
            error = {message: error};
        }

        error = Object.assign({
            name: 'APIError',
        }, error);

        super(error);
    }
}
