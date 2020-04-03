CREATE DATABASE validate_backend;

USE validate_backend;

CREATE TABLE Users
(
    id int NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255),
    PRIMARY KEY (id)
);