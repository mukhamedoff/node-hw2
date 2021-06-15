import { UsersController } from './controllers/users.controllers';
import { Sequelize, DataTypes } from 'sequelize';
import { Router } from 'express';
import * as Joi from 'joi'
import {
    createValidator
} from 'express-joi-validation';
import { authenticateJWT } from '../middleware/authMiddleware';

const userController = new UsersController();
const usersRouter = Router();
const validator = createValidator();
const bodySchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    age: Joi.number().integer().min(4).max(130).required()
});

usersRouter.get('/', authenticateJWT, userController.getAll);
usersRouter.post('/', [authenticateJWT, validator.body(bodySchema)], userController.createUser);

usersRouter.get('/:userId', authenticateJWT, userController.getById);
usersRouter.put('/:userId', authenticateJWT, userController.updateUser);
usersRouter.delete('/:userId',authenticateJWT, userController.deleteUser);

usersRouter.post('/:userId/addToGroup', authenticateJWT, userController.addUsersToGroup)

export default usersRouter;