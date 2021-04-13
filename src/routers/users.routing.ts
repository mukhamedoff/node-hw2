import { UsersController } from './controllers/users.controllers';
import { Sequelize, DataTypes } from 'sequelize';
import { Router } from 'express';
import * as Joi from 'joi'
import {
    createValidator
} from 'express-joi-validation';

const userController = new UsersController();
const usersRouter = Router();
const validator = createValidator();
const bodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    age: Joi.number().integer().min(4).max(130).required()
});

usersRouter.get('/', userController.getAll);
usersRouter.post('/', validator.body(bodySchema), userController.createUser);

usersRouter.get('/:userId', userController.getById);
usersRouter.put('/:userId', userController.updateUser);
usersRouter.delete('/:userId', userController.deleteUser);

export default usersRouter;