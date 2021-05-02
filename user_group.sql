/* DROP TABLE IF EXISTS user_group; */
CREATE TABLE user_group (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    group_id UUID NOT NULL,
    user_id UUID NOT NULL
);
