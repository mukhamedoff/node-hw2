
import {
    ValidatedRequest
} from 'express-joi-validation';
import User from '../../models/user.type';
import { UserRequestSchema } from '../../models/users.interface';
import { v4 as uuidv4 } from 'uuid';
import UsersServices from '../../services/users.service';

export class UsersController {
    async getAll(req:any, res:any) {
        const { loginSubstring, limit } = req.query;
        return res.json(await UsersServices.getAutoSuggestUsers(loginSubstring?.toString(), limit ? +limit.toString() : 0));
    }

    createUser(req: ValidatedRequest<UserRequestSchema>, res:any) {
        const user: User = {
            user_uid: uuidv4(),
            ...req.body,
            isdeleted: false
        };
        UsersServices.createUser(user);
        return res.json(user);
    }

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

    async getById(req:any, res:any) {
        const { userId } = req.params;
        try{
            const user = await UsersServices.findById(userId);
            return res.json(user || {error: 404, message: "User is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }

    async deleteUser(req:any, res:any) {
        const { userId } = req.params;
        
        try{
            const user = UsersServices.updateUser(userId, { isdeleted: true });
            return res.json(user || {error: 404, message: "User is not exists"});
        } catch (err) {
            return {error: 500, message: err};
        }
    }
}