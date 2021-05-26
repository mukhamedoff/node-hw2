
import {
    ValidatedRequest
} from 'express-joi-validation';
import User from '../../models/users/user.type';
import { UserRequestSchema } from '../../models/users/users.interface';
import { v4 as uuidv4 } from 'uuid';
import UsersServices from '../../services/users.service';
import { errorLog } from '../../utils/decorators/loggers/errorLog';
import { authJWT } from '../../utils/decorators/auth';

export class UsersController {
    // @authJWT()
    @errorLog()
    async getAll(req:any, res:any) {
        console.log("req.user", req.user);
        const { loginSubstring, limit } = req.query;
        return res.json(await UsersServices.getAutoSuggestUsers(loginSubstring?.toString(), limit ? +limit.toString() : 0));
    }

    @errorLog()
    createUser(req: ValidatedRequest<UserRequestSchema>, res:any) {
        const user: User = {
            user_uid: uuidv4(),
            ...req.body,
            isdeleted: false
        };
        UsersServices.createUser(user);
        return res.json(user);
    }

    @errorLog()
    async updateUser (req: ValidatedRequest<UserRequestSchema>, res:any) {
        const { userId } = req.params;
        const { login, age, password } = req.body;
        
        try{
            const user = await UsersServices.updateUser(userId, { login, age, password });
            return res.json(user || {error: 404, message: "User is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    @errorLog()
    async getById(req:any, res:any) {
        const { userId } = req.params;
        try{
            const user = await UsersServices.findById(userId);
            return res.json(user || {error: 404, message: "User is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    @errorLog()
    async deleteUser(req:any, res:any) {
        const { userId } = req.params;
        
        try{
            const user = await UsersServices.deleteUser(userId);
            return res.json(user || {error: 404, message: "User is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    @errorLog()
    async addUsersToGroup(req:any, res:any) {
        const { groupId } = req.body;
        const { userId } = req.params;

        try{
            const result = await UsersServices.addUsersToGroup(groupId, userId);
            res.json({result});
        } catch (err) {
            return {error: 500, message: err};
        }
    }
}