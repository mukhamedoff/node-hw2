DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    group_uid UUID NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    permissions TEXT[] NOT NULL
);
