/* DROP TABLE IF EXISTS user_group; */
CREATE TABLE user_group (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    group_id UUID NOT NULL,
    user_id UUID NOT NULL
);
SELECT users.login, groups.name
FROM groups
LEFT OUTER JOIN user_group ON (groups.group_uid = user_group.group_id)
LEFT OUTER JOIN users ON (user_group.user_id = users.user_uid);
