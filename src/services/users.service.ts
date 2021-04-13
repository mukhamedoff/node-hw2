import { Sequelize, Op } from 'sequelize';
import { Users as UsersSchema} from '../data-access/postgresql';
import User from '../models/user.type';

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

const updateUser = async (id: number, data:{ login?:string; age?:number; password?:string; isdeleted?:boolean }) => {
    return await UsersSchema.update(data, {
        where: {
            user_uid: id
        }
    });
}

const findById = async (id: number) => {
    return await UsersSchema.findOne({
        where: {
            user_uid: id
        }
    });
}

export default {
    getAutoSuggestUsers,
    createUser,
    findById,
    updateUser
}