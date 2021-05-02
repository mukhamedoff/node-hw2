import { Sequelize, Op } from 'sequelize';
import { Groups as GroupsSchema, sequelize as sequelizeInstance } from '../data-access/postgresql';
import Group from '../models/groups/group.types';
import Permission from '../models/permission.type';

const getAllGroups = async () => {
    return await GroupsSchema.findAll();
}

const createGroup = (group: Group) => {
    GroupsSchema.create(group);
}

const updateGroup = async (id: number, data:{ name?:string; permissions?:Array<Permission> }) => {
    return await GroupsSchema.update(data, {
        where: {
            group_uid: id
        }
    });
}

const findById = async (id: number) => {
    return await GroupsSchema.findOne({
        where: {
            group_uid: id
        }
    });
}

const deleteGroup = async (id: number) => {
    let result = null;
    const query = `
    DELETE FROM user_group WHERE group_id='${id}';
    `;

    sequelizeInstance.transaction(async transaction => {
        try {
            await sequelizeInstance.query(query, { transaction });
            result = await GroupsSchema.destroy({
                where: {
                    group_uid: id
                },
                transaction
            });
        } catch (error) {
            transaction.rollback();
        }
    })

    return await result;
}

export default {
    getAllGroups,
    createGroup,
    findById,
    updateGroup,
    deleteGroup
}