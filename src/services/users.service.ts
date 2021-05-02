import { Sequelize, Op } from 'sequelize';
import { Users as UsersSchema, sequelize as sequelizeInstance} from '../data-access/postgresql';
import User from '../models/users/user.type';

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

const createUser = (user: User) => {
    UsersSchema.create(user);
}

const updateUser = async (
    id: number,
    data:{ login?:string; age?:number; password?:string; isdeleted?:boolean },
    options?: {}
    ) => {
    return await UsersSchema.update(data, {
        where: {
            user_uid: id
        },
        ...options
    });
}

const deleteUser = async (id: number) => {
    let result = null;
    const query = `
    DELETE FROM user_group WHERE user_id='${id}';
    `;

    sequelizeInstance.transaction(async transaction => {
        try {
            await sequelizeInstance.query(query, { transaction });
            await updateUser(id, { isdeleted: true }, { transaction });
            result = Promise.resolve({ message: "Delete is done" });
        } catch (error) {
            transaction.rollback();
        }
    })

    return await result;
}

const findById = async (id: number) => {
    return await UsersSchema.findOne({
        where: {
            user_uid: id
        }
    });
}

const addUsersToGroup = async (groupId:number, userId:number) => {
    let result = null;
    const query = `
    INSERT INTO user_group (group_id, user_id)
    VALUES ('${groupId}', '${userId}')
    `;

    sequelizeInstance.transaction(async transaction => {
        try {
            const [results, metadata] = await sequelizeInstance.query(query, {transaction});
            result = Promise.resolve({results, metadata});
        } catch (error) {
            transaction.rollback();
        }
    })

    return await result;
}

export default {
    getAutoSuggestUsers,
    createUser,
    findById,
    updateUser,
    deleteUser,
    addUsersToGroup
}