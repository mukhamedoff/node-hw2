import { GroupsController } from './../groups.controllers';
import Group from './../../../models/groups/group.types';
import { ValidatedRequest } from 'express-joi-validation';
import { GroupRequestSchema } from './../../../models/groups/groups.interface';
import Permission from '../../../models/permission.type';

const group_Id = 'group-1234';
jest.mock('./../../../services/groups.service', () => {
  return {
    getAllGroups: jest.fn(() => {
      return [{}];
    }),
    createGroup: jest.fn(),
    updateGroup: jest.fn((groupId, { name, permissions }) => {
      if (name === 'Error') throw Error('Error');
      if (groupId !== group_Id) return null;
      return {groupId}
    }),
    findById: jest.fn((groupId) => {
      if (groupId === 'Error') throw Error('Error');
      if (groupId !== group_Id) return null;
      return {groupId}
    }),
    deleteGroup: jest.fn((groupId) => {
      if (groupId === 'Error') throw Error('Error');
      if (groupId !== group_Id) return null;
      return {groupId}
    }),
  }
});
jest.mock('uuid', () => {
  return {
    v4: () => 'group-1234'
  }
});
jest.mock('./../../../utils/decorators/loggers/errorLog.ts', () => ({ errorLog: () => {
  return (target: any, propertyKey: any, descriptor: PropertyDescriptor) => {
    // save a reference to the original method
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const result = await originalMethod.apply(this, args);
      return result;
    };
  
    return descriptor;
  }; 
}}));

describe('Group controller entity', () => {
  let groupController: GroupsController;

  beforeEach(() => {
    groupController = new GroupsController();
  });

  describe('"getAll" method:', () => {
    it('get all groups', async () => {
      const req = {};
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.getAll(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith([{}]);
    });
  });

  describe('"createGroup" method:', () => {
    it('create group', async () => {
      const req = { body: {
        name: 'Name',
        permissions: ['READ' as Permission]
      } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');
      const group: Group = {
        group_uid: group_Id,
        ...req.body
    };

      await groupController.createGroup(req as ValidatedRequest<GroupRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith(group);
    });
  });
  
  describe('"updateGroup" method:', () => {
    it('update group - green flow', async () => {
      const req = {
        body: {
          name: 'Name',
          permissions: ['READ' as Permission]
        },
        params: {
          groupId: group_Id
        }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.updateGroup(req as ValidatedRequest<GroupRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({groupId: group_Id});
    });
    it('update group - not found flow', async () => {
      const req = {
        body: {
          name: 'Name',
          permissions: ['READ' as Permission]
        },
        params: {
          groupId: '1234'
        }
      };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.updateGroup(req as ValidatedRequest<GroupRequestSchema>, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "Group is not exists"});
    });
    it('update group - server error', async () => {
      const req = {
        body: {
          name: 'Error',
          permissions: ['READ' as Permission]
        },
        params: {
          groupId: group_Id
        }
      };
      const res = { json: jest.fn() };

      const result = await groupController.updateGroup(req as ValidatedRequest<GroupRequestSchema>, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });

  describe('"getById" method:', () => {
    it('get group by ID', async () => {
      const req = { params: { groupId: group_Id } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.getById(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({groupId: group_Id});
    });
    it('group does not find', async () => {
      const req = { params: { groupId: "1234" } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.getById(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "Group is not exists"});
    });
    it('cause server error', async () => {
      const req = { params: { groupId: "Error" } };
      const res = { json: jest.fn() };

      const result = await groupController.getById(req, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });

  describe('"deleteGroup" method:', () => {
    it('delete group', async () => {
      const req = { params: { groupId: group_Id } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.deleteGroup(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({groupId: group_Id});
    });
    it('group does not find when delete', async () => {
      const req = { params: { groupId: "1234" } };
      const res = { json: jest.fn() };
      const spyResJson = jest.spyOn(res, 'json');

      await groupController.deleteGroup(req, res);

      expect(spyResJson).toBeCalled();
      expect(spyResJson).toHaveBeenCalledWith({error: 404, message: "Group is not exists"});
    });
    it('cause server error on delete', async () => {
      const req = { params: { groupId: "Error" } };
      const res = { json: jest.fn() };

      const result = await groupController.deleteGroup(req, res);

      expect(result).toStrictEqual({error: 500, message: new Error('Error')});
    });
  });
});