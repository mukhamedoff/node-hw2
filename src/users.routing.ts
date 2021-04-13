import { Sequelize, DataTypes, Op } from 'sequelize';
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

const sequelize = new Sequelize('nodejs-mentoring', 'postgres', 'aw3se4', {
    host: 'localhost',
    dialect: 'postgres'
});
const Users = sequelize.define('Users', {
    user_uid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users',
    underscored: false,
    timestamps: false
});

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
const compare = (a:any, b:any): number => {
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
const getAutoSuggestUsers = async (loginSubstring:string = '', limit:number) => { //User[]
    let options = {
        where: {
            isdeleted: {
                [Op.eq]: false
            },
            login: {
                [Op.substring]: loginSubstring || ''
            }
        },
        order: Sequelize.col('login'),
        limit: limit || undefined
    };
    
    return await Users.findAll(options);
}

usersRouter.get('/', async (req, res) => {
    const { loginSubstring, limit } = req.query;
    return res.json(await getAutoSuggestUsers(loginSubstring?.toString(), limit ? +limit.toString() : 0));
});
usersRouter.post('/', validator.body(bodySchema), (req: ValidatedRequest<UserRequestSchema>, res) => {
    const user: User = {
        user_uid: uuidv4(),
        ...req.body,
        isdeleted: false
    };
    Users.create(user);
    return res.json(user);
});

usersRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try{
        const user = await Users.findOne({
            where: {
                user_uid: userId
            }
        });
        return res.json(user || {error: 404, message: "User is not exists"});
    } catch (err) {
        return {error: 500, message: err};
    }
});
usersRouter.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { login, age, password } = req.body;
    
    try{
        const user = await Users.update({ login, age, password }, {
            where: {
                user_uid: userId
            }
        });
        return res.json(user || {error: 404, message: "User is not exists"});
    } catch (err) {
        return {error: 500, message: err};
    }
});
usersRouter.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try{
        const user = await Users.update({ isdeleted: true }, {
            where: {
                user_uid: userId
            }
        });
        return res.json(user || {error: 404, message: "User is not exists"});
    } catch (err) {
        return {error: 500, message: err};
    }
});

export default usersRouter;