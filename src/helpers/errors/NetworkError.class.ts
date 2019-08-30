import {AppError} from '@/helpers/errors/AppError.class';

export class NetworkError extends AppError {
    constructor(error: string | AppErrorSchema = {}) {

        if (typeof error === 'string') {
            error = {message: error};
        }

        error = Object.assign({
            name: 'NetworkError',
            reason: 'нет интернет соединения',
        }, error);

        super(error);
    }
}
