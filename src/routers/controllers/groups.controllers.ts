
import {
    ValidatedRequest
} from 'express-joi-validation';
import Group from '../../models/groups/group.types';
import { GroupRequestSchema } from '../../models/groups/groups.interface';
import { v4 as uuidv4 } from 'uuid';
import GroupsServices from '../../services/groups.service';
import { errorLog } from '../../utils/decorators/loggers/errorLog';

export class GroupsController {
    @errorLog()
    async getAll(req:any, res:any) {
        return res.json(await GroupsServices.getAllGroups());
    }

    @errorLog()
    async createGroup(req: ValidatedRequest<GroupRequestSchema>, res:any) {
        const group: Group = {
            group_uid: uuidv4(),
            ...req.body
        };
        await GroupsServices.createGroup(group);
        return res.json(group);
    }

    @errorLog()
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

    @errorLog()
    async getById(req:any, res:any) {
        const { groupId } = req.params;
        try{
            const group = await GroupsServices.findById(groupId);
            return res.json(group || {error: 404, message: "Group is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    @errorLog()
    async deleteGroup(req:any, res:any) {
        const { groupId } = req.params;
        
        try{
            const group = await GroupsServices.deleteGroup(groupId);
            return res.json(group || {error: 404, message: "Group is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }
}