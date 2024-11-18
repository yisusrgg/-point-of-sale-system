drop database if exists Tienda;
create database Tienda;

use Tienda;

create table empleados
(
	id_empleado 	int 	primary key	 auto_increment unique,
    usuario 		varchar(20) 		not null ,
    pass 			varchar(64) 		not null,
    Nombre 			Varchar(25)			not null,
    Apellidos 		varchar(25) 		not null,
    Telefono		varchar(10) 			not null,
    Correo 			Varchar(30)			not null,
    salario 		decimal(10,2)		not null,
    fecha_registro     timestamp default current_timestamp,
	fecha_modificacion timestamp default current_timestamp on update current_timestamp,
	activo             tinyint(1) default 1
); 

create table producto
(
	id_producto 		int	primary key 	auto_increment,
	nombre_producto		varchar(50) 		not null,
    descripcion 		text				not null,
    precio 				decimal(10,2)		not null,
    stock				int					default 0,
    descontinuado 		tinyint(1)			not null default 0,
    fecha_registro     timestamp default current_timestamp,
	fecha_modificacion timestamp default current_timestamp on update current_timestamp
);

create table ticket
(
	id_ticket			int 	primary key 	auto_increment,
    total 				decimal(10,2) 			not null,
    metodo_de_pago		varchar(50)				not null,
    fecha_de_emision 	timestamp 				default current_timestamp
);

create table ventas(
	id_venta 	int 		primary key 	auto_increment,
    id_empleado int 		not null,
    fecha_venta	timestamp 	default current_timestamp,
    foreign key (id_empleado) references empleados(id_empleado)
);

create table venta_detalles(
	id_detalle 	int 	primary key 		auto_increment,
    id_venta 	int not null,
	id_producto	int not null,
    cantidad 	int not null,
    precio_unitario	decimal(10,2) not null,
    foreign key (id_venta) references ventas (id_venta) on delete cascade,
    foreign key (id_producto) references producto (id_producto)
);
create table tickets(
    id_ticket          int primary key auto_increment,
    id_venta           int not null,
    total              decimal(10,2) not null,
    metodo_de_pago     varchar(50) not null,
    fecha_de_emision   timestamp default current_timestamp,
    foreign key (id_venta) references ventas(id_venta) on delete cascade
);

##
INSERT INTO producto (nombre_producto, descripcion, precio, stock)
VALUES ('Camiseta Básica', 'Camiseta de algodón, talla única', 9.99, 100),
('Pantalones Jeans', 'Pantalones vaqueros de alta calidad', 29.99, 50),
('Zapatillas Deportivas', 'Zapatillas cómodas para correr', 49.99, 30),
('Sudadera con Capucha', 'Sudadera de lana con capucha, color negro', 24.99, 40),
('Chaqueta de Invierno', 'Chaqueta acolchada, resistente al agua', 79.99, 20);

select * from producto;


INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo, salario)
VALUES
('jgarcia', SHA2('password123', 256), 'Juan', 'García', '612345678', 'jgarcia@tienda.com', 1231),
('mfernandez', SHA2('password456', 256), 'María', 'Fernández', '623456789', 'mfernandez@tienda.com', 231),
('pcortes', SHA2('password789', 256), 'Pedro', 'Cortés', '634567890', 'pcortes@tienda.com', 123);

INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo, salario)
VALUES ('yop', SHA2('ane', 256), 'Juan', 'Lopez', '612387978', 'ia@tienda.com', 123);


INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo, salario)
VALUES ('Suzuyal', SHA2('lil', 256), 'Jesus', 'Rosiles', '91823932', 'i@tienda.com', 3123);


-- PURUEBAS

select * from empleados;
select * from producto;
-- INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo, salario) VALUES (?,?,?,?,?,?,?);

-- update empleados set usuario = ?, pass = ?, Nombre = 'Nombre', Apellidos = 'Apellido', Telefono = ?, Correo = ? where id_empleado = ?;
update empleados set activo = 1 where id_empleado = 5;
-- INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo) VALUES ('a',SHA2('a', 256),'a','a','a','a@a','a');

UPDATE empleados SET usuario = 'a', pass = 'a', Nombre = 'a', Apellidos = 'a', Telefono = 'a', Correo = 'a', activo = 1 WHERE id_empleado = 2;

-- QUERY PARA VER TODAS LAS VENTAS
SELECT v.id_venta, v.fecha_venta, e.Nombre AS empleado, t.total AS total_venta, t.metodo_de_pago
FROM ventas v
JOIN empleados e ON v.id_empleado = e.id_empleado
JOIN tickets t ON v.id_venta = t.id_venta
ORDER BY v.fecha_venta DESC;

-- QUERY PARA VER LOS DETALLES DE CADA UNA DE LAS VENTAS
SELECT vd.id_detalle, p.nombre_producto, vd.cantidad, vd.precio_unitario, (vd.cantidad * vd.precio_unitario) AS total
FROM venta_detalles vd
JOIN producto p ON vd.id_producto = p.id_producto
WHERE vd.id_venta = 2;


INSERT INTO empleados (usuario, pass, Nombre, Apellidos, Telefono, Correo, salario)
VALUES
('juanp', 'password123', 'Juan', 'Perez', '1234567890', 'juan.perez@email.com', 2000.00),
('mariag', 'password456', 'Maria', 'Gomez', '0987654321', 'maria.gomez@email.com', 2200.00),
('pedroa', 'password789', 'Pedro', 'Alvarez', '1112233445', 'pedro.alvarez@email.com', 2500.00);

INSERT INTO producto (nombre_producto, descripcion, precio, stock, descontinuado)
VALUES
('Producto A', 'Descripción del Producto A', 50.00, 100, 0),
('Producto B', 'Descripción del Producto B', 75.00, 50, 0),
('Producto C', 'Descripción del Producto C', 30.00, 200, 0),
('Producto D', 'Descripción del Producto D', 100.00, 10, 1),
('Producto E', 'Descripción del Producto E', 120.00, 15, 0);

INSERT INTO ticket (total, metodo_de_pago, fecha_de_emision)
VALUES
(150.00, 'Tarjeta de Crédito', '2024-11-01 10:00:00'),
(200.00, 'Efectivo', '2024-11-02 11:15:00'),
(250.00, 'Transferencia Bancaria', '2024-11-05 14:30:00');

INSERT INTO ventas (id_empleado, fecha_venta)
VALUES
(1, '2024-11-01 09:30:00'),
(2, '2024-11-02 10:00:00'),
(3, '2024-11-05 12:00:00');

INSERT INTO venta_detalles (id_venta, id_producto, cantidad, precio_unitario)
VALUES
(1, 1, 2, 50.00),
(1, 2, 1, 75.00),
(2, 3, 3, 30.00),
(2, 5, 2, 120.00),
(3, 4, 1, 100.00),
(3, 2, 1, 75.00);

INSERT INTO tickets (id_venta, total, metodo_de_pago, fecha_de_emision)
VALUES
(1, 175.00, 'Tarjeta de Crédito', '2024-11-01 10:00:00'),
(2, 330.00, 'Efectivo', '2024-11-02 11:15:00'),
(3, 175.00, 'Transferencia Bancaria', '2024-11-05 14:30:00');



