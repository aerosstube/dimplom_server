import { Error } from 'sequelize';


export class ApiError extends Error {
    status: number;
    errors: Array<Error>;

    constructor(status: number, message: string, errors: Array<Error> = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message: string) {
        return new ApiError(400, message);
    }

    static AcessDenied() {
        return new ApiError(401, 'Доступ запрещен!');
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован!');
    }

    static ValidationError(error: Array<Error> = []) {
        return new ApiError(400, 'Ошибка валидации', error);
    }
}