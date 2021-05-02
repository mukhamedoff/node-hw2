
import {
    ValidatedRequest
} from 'express-joi-validation';
import Group from '../../models/groups/group.types';
import { GroupRequestSchema } from '../../models/groups/groups.interface';
import { v4 as uuidv4 } from 'uuid';
import GroupsServices from '../../services/groups.service';

export class GroupsController {
    async getAll(req:any, res:any) {
        return res.json(await GroupsServices.getAllGroups());
    }

    createGroup(req: ValidatedRequest<GroupRequestSchema>, res:any) {
        const group: Group = {
            group_uid: uuidv4(),
            ...req.body
        };
        GroupsServices.createGroup(group);
        return res.json(group);
    }

    async updateGroup (req: ValidatedRequest<GroupRequestSchema>, res:any) {
        const { groupId } = req.params;
        const { name, permissions } = req.body;
        
        try{
            const group = await GroupsServices.updateGroup(groupId, { name, permissions });
            return res.json(group || {error: 404, message: "Group is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    async getById(req:any, res:any) {
        const { groupId } = req.params;
        try{
            const group = await GroupsServices.findById(groupId);
            return res.json(group || {error: 404, message: "Group is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    async deleteGroup(req:any, res:any) {
        const { groupId } = req.params;
        
        try{
            const group = GroupsServices.deleteGroup(groupId);
            return res.json(group || {error: 404, message: "Group is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }
}