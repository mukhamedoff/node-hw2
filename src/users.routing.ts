import { UsersList } from './users.list';
import { Router } from 'express';
import User from './user.type';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi'
import {
    ContainerTypes,
    ValidatedRequest,
    ValidatedRequestSchema,
    createValidator
} from 'express-joi-validation';

interface UserRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number
    }
};

const usersRouter = Router();
const validator = createValidator();
const bodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    age: Joi.number().integer().min(4).max(130).required()
});
const compare = (a:User, b:User): number => {
    const loginA = a.login.toUpperCase();
    const loginB = b.login.toUpperCase();

    let comparison = 0;
    if (loginA > loginB) {
        comparison = 1;
    } else if (loginA < loginB) {
        comparison = -1;
    }
    return comparison;
}
const getAutoSuggestUsers = (loginSubstring:string = '', limit:number):User[] => {
    let users:User[] = UsersList.filter(user => !user.isDeleted);
    if(loginSubstring) {
        users = users.filter(user => user.login.includes(loginSubstring));
    }
    if(limit) {
        users = users.slice(0, +limit);
    }
    return users.sort(compare);
}

usersRouter.get('/', (req, res) => {
    const { loginSubstring, limit } = req.query;
    return res.json(getAutoSuggestUsers(loginSubstring?.toString(), limit ? +limit.toString() : 0));
});
usersRouter.post('/', validator.body(bodySchema), (req: ValidatedRequest<UserRequestSchema>, res) => {
    const user: User = {
        id: uuidv4(),
        ...req.body,
        isDeleted: false
    };
    UsersList.push(user);
    return res.json(user);
});

usersRouter.get('/:userId', (req, res) => {
    const { userId } = req.params;
    const user = UsersList.filter(user => user.id === userId);
    return res.json(user.length > 0 ? user[0] : {error: 404, message: 'User not founded'});
});
usersRouter.put('/:userId', (req, res) => {
    const { userId } = req.params;
    const { login, age, password } = req.body;
    const user = UsersList.filter(user => user.id === userId);
    if (user.length > 0) {
        user[0].login = login;
        user[0].age = age;
        user[0].password = password;
        return res.json(user[0]);
    }
    return res.json({error: 404, message: 'User not founded'});
});
usersRouter.delete('/:userId', (req, res) => {
    const { userId } = req.params;
    const user = UsersList.filter(user => user.id === userId);
    if (user.length > 0) {
        user[0].isDeleted = true;
        return res.json(user[0]);
    }
    return res.json({error: 404, message: 'User not founded'});
});

export default usersRouter;