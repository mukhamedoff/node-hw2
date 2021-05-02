import {
    ContainerTypes,
    ValidatedRequestSchema,
} from 'express-joi-validation';
import Permission from '../permission.type';

export interface GroupRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        name: string,
        permissions: Array<Permission>
    }
};