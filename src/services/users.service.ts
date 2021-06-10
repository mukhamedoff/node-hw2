import { Sequelize, Op } from 'sequelize';
import {
    Users as UsersSchema,
    sequelize as sequelizeInstance,
    UserGroup as UserGroupSchema
} from '../data-access/postgresql';
import User from '../models/users/user.type';
import bcrypt from 'bcrypt';

const salt ='sDr34#pORtt';

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
    
    return await UsersSchema.findAll(options);
}

const createUser = async (user: User) => {
    const bcryptPromise = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, async function(err, hash) {
                if (hash) {
                    user.password = hash;
                    const userDb = await UsersSchema.create(user);
                    resolve(userDb);
                }
            });
        });
    });
    return await bcryptPromise;
}

const updateUser = async (
    id: number,
    data:{ login?:string; age?:number; password?:string; isdeleted?:boolean },
    options?: {}
    ) => {
    const bcryptPromise = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(data.password as string, salt, function(err, hash) {
                if (hash) {
                    data.password = hash;
                    resolve(hash);
                }
            });
        });
    });
    await bcryptPromise;
    return await UsersSchema.update(data, {
        where: {
            user_uid: id
        },
        ...options
    });
}

const deleteUser = async (id: number) => {
    return new Promise((resolve, reject) => {
        sequelizeInstance.transaction(async transaction => {
            try {
                await UserGroupSchema.destroy({
                    where: {
                        user_id: id
                    },
                    transaction
                });
                await updateUser(id, { isdeleted: true }, { transaction });
                resolve({ message: "Delete is done" });
            } catch (error) {
                transaction.rollback();
            }
        });
    })
}

const findById = async (id: number) => {
    return await UsersSchema.findOne({
        where: {
            user_uid: id
        }
    });
}

const addUsersToGroup = async (groupId:number, userId:number) => {
    sequelizeInstance.transaction(async transaction => {
        try {
            return UserGroupSchema.create({
                group_id: groupId,
                user_id: userId
            });
        } catch (error) {
            transaction.rollback();
        }
    })
}

const findLogin = async (username: string, password: string) => {
    const userDb = await UsersSchema.findOne({
        where: {
            login: username
        }
    });
    const user = userDb?.toJSON() as User;
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        throw new Error('Incorrect login or password');
    }
    return user;
}

export default {
    getAutoSuggestUsers,
    createUser,
    findById,
    updateUser,
    deleteUser,
    addUsersToGroup,
    findLogin
}