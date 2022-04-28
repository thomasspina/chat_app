CREATE DATABASE IF NOT EXISTS `chat`;
USE `chat`;

CREATE TABLE IF NOT EXISTS `messages` (
    `message_id` int NOT NULL AUTO_INCREMENT,
    `room_id` int NOT NULL,
    `user_id` int NOT NULL,
    `message_text` varchar(1000) NOT NULL,
    `date_time` DATETIME NOT NULL,
    PRIMARY KEY (`message_id`, `room_id`)
);

CREATE TABLE IF NOT EXISTS `rooms` (
    `room_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL UNIQUE,
    PRIMARY KEY (`room_id`)
);
INSERT INTO `rooms` VALUES (DEFAULT, 'room1');
INSERT INTO `rooms` VALUES (DEFAULT, 'room2');
INSERT INTO `rooms` VALUES (DEFAULT, 'room3');

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL UNIQUE,
    `salt` varchar(255) DEFAULT NULL,
    `hash` varchar(255) DEFAULT NULL, 
    PRIMARY KEY (`user_id`)
);


CREATE TABLE IF NOT EXISTS `connected_users` (
    `user_id` int NOT NULL,
    `room_id` int NOT NULL,
    `socket_id` varchar(80) NOT NULL,
    PRIMARY KEY (`user_id`, `socket_id`)
);