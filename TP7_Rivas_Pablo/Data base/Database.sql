create table persona(
dni INT PRIMARY KEY,
nombre VARCHAR(30) NOT NULL,
apellido VARCHAR(30) NOT NULL
);

create table usuario(
mail VARCHAR(40) PRIMARY KEY,
nickname VARCHAR(20) NOT NULL,
password VARCHAR(20) NOT NULL
);

ALTER TABLE usuario 
ADD COLUMN persona INT;

ALTER TABLE usuario 
ADD CONSTRAINT fk_persona 
FOREIGN KEY (persona) REFERENCES persona(dni);