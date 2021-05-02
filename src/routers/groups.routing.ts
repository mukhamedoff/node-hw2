import { GroupsController } from './controllers/groups.controllers';
import { Sequelize, DataTypes } from 'sequelize';
import { Router } from 'express';
import * as Joi from 'joi'
import {
    createValidator
} from 'express-joi-validation';

const groupController = new GroupsController;
const groupsRouter = Router();
const validator = createValidator();
const bodySchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array()
});

groupsRouter.get('/', groupController.getAll);
groupsRouter.post('/', validator.body(bodySchema), groupController.createGroup);

groupsRouter.get('/:groupId', groupController.getById);
groupsRouter.put('/:groupId', groupController.updateGroup);
groupsRouter.delete('/:groupId', groupController.deleteGroup);

export default groupsRouter;