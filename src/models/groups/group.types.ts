import Permission from '../permission.type';

type Group = {
    group_uid?: string;
    name: string;
    permissions: Array<Permission>
}

export default Group;