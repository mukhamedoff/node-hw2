import { Sequelize, DataTypes } from 'sequelize';

export const sequelize = new Sequelize('nodejs-mentoring', 'postgres', 'aw3se4', {
    host: 'localhost',
    dialect: 'postgres'
});
export const Users = sequelize.define('Users', {
    user_uid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isdeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'users',
    underscored: false,
    timestamps: false
});
export const Groups = sequelize.define('Groups', {
    group_uid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    tableName: 'groups',
    underscored: false,
    timestamps: false
});