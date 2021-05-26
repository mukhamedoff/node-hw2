import User from '../../models/users/user.type';
import AuthService from '../../services/auth.service';
import UsersServices from '../../services/users.service'

export class AuthController {
  async login(req:any, res:any) {
    const { username, password } = req.body;
    const user = await UsersServices.findLogin(username, password);
    const dataValue: User = user?.toJSON() as User;

    if (dataValue) {
        const accessToken = AuthService.login({ username: dataValue.login, id: dataValue.user_uid });
  
        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
  }
}