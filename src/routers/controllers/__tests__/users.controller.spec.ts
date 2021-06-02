import { UsersController } from './../users.controllers';
import User from './../../../models/users/user.type';
import { ValidatedRequest } from 'express-joi-validation';
import { UserRequestSchema } from './../../../models/users/users.interface';

const user_Id = 'qwer-1234';
jest.mock('./../../../services/users.service', () => {
  return {
    getAutoSuggestUsers: jest.fn((loginSubstring, limit) => {
      if(loginSubstring && limit) {
        return [{}, {}]
      }
      return [{}];
    }),
    createUser: jest.fn(),
    updateUser: jest.fn((userId, { login, age, password }) => {
      if (login === 'Error') throw Error('Error');
      if (userId !== user_Id) return null;
      return {userId}
    }),
    findById: jest.fn((userId) => {
      if (userId === 'Error') throw Error('Error');
      if (userId !== user_Id) return null;
      return {userId}
    }),
    deleteUser: jest.fn((userId) => {
      if (userId === 'Error') throw Error('Error');
      if (userId !== user_Id) return null;
      return {userId}
    }),
    addUsersToGroup: jest.fn((groupId, userId) => {
      if (userId !== user_Id) throw Error('Error');
      return 'result';
    }),
  }
});
jest.mock('uuid', () => {
  return {
    v4: () => 'qwer-1234'
  }
});

describe('User controller entity', () => {
  let usersController: UsersController;

  beforeEach(() => {
    usersController = new UsersController();
  });

  describe('"getAll" method:', () => {
    it('get all users', async () => {
      const req = { query: {} };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.getAll(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith([{}]);
    });
    it('get all suggested users', async () => {
      const req = {
        query: {
          loginSubstring: "test",
          limit: 2
        }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');
      
      await usersController.getAll(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith([{}, {}]);
    });
  });

  describe('"createUser" method:', () => {
    it('create user', async () => {
      const req = { body: {
        login: 'test',
        password: 'password',
        age: 20
      } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');
      const user: User = {
        user_uid: user_Id,
        ...req.body,
        isdeleted: false
    };

      await usersController.createUser(req as ValidatedRequest<UserRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith(user);
    });
  });
  
  describe('"updateUser" method:', () => {
    it('update user - green flow', async () => {
      const req = {
        body: {
          login: 'test',
          password: 'password',
          age: 20
        },
        params: {
          userId: user_Id
        }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.updateUser(req as ValidatedRequest<UserRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({userId: user_Id});
    });
    it('update user - not found flow', async () => {
      const req = {
        body: {
          login: 'test',
          password: 'password',
          age: 20
        },
        params: {
          userId: '1234'
        }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.updateUser(req as ValidatedRequest<UserRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "User is not exists"});
    });
    it('update user - server error', async () => {
      const req = {
        body: {
          login: 'Error',
          password: 'password',
          age: 20
        },
        params: {
          userId: '1234'
        }
      };
      const res = { json: jest.fn() };

      const result = await usersController.updateUser(req as ValidatedRequest<UserRequestSchema>, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });

  describe('"getById" method:', () => {
    it('get user by ID', async () => {
      const req = { params: { userId: user_Id } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.getById(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({userId: user_Id});
    });
    it('user does not find', async () => {
      const req = { params: { userId: "1234" } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.getById(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "User is not exists"});
    });
    it('cause server error', async () => {
      const req = { params: { userId: "Error" } };
      const res = { json: jest.fn() };

      const result = await usersController.getById(req, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });

  describe('"deleteUser" method:', () => {
    it('delete user', async () => {
      const req = { params: { userId: user_Id } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.deleteUser(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({userId: user_Id});
    });
    it('user does not find when delete', async () => {
      const req = { params: { userId: "1234" } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.deleteUser(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "User is not exists"});
    });
    it('cause server error on delete', async () => {
      const req = { params: { userId: "Error" } };
      const res = { json: jest.fn() };

      const result = await usersController.deleteUser(req, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });

  describe('"addUsersToGroup" method:', () => {
    it('add user to group', async () => {
      const req = {
        body: { groupId: 'qw-12' },
        params: { userId: user_Id }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await usersController.addUsersToGroup(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({result:'result'});
    });
    it('cause server error on add user to group', async () => {
      const req = {
        body: { groupId: 'qw-12' },
        params: { userId: '1234' }
      };
      const res = { json: jest.fn() };

      const result = await usersController.addUsersToGroup(req, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });
});