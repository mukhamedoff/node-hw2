DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_uid UUID NOT NULL PRIMARY KEY,
    login VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    age BIGINT NOT NULL,
    isdeleted BOOLEAN DEFAULT false
);

INSERT INTO users (user_uid, login, password, age, isdeleted) VALUES (uuid_generate_v4(), 'user_banana_cherry', 'user1', 21, false);
INSERT INTO users (user_uid, login, password, age, isdeleted) VALUES (uuid_generate_v4(), 'user_orange_banana', 'user2', 25, false);
INSERT INTO users (user_uid, login, password, age, isdeleted) VALUES (uuid_generate_v4(), 'user_apple_orange', 'user3', 24, false);
INSERT INTO users (user_uid, login, password, age, isdeleted) VALUES (uuid_generate_v4(), 'user_cherry_apple', 'user4', 22, true);