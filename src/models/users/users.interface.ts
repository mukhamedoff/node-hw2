import {
    ContainerTypes,
    ValidatedRequestSchema,
} from 'express-joi-validation';

export interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number
    }
};