drop schema if exists public cascade;

create schema public;

alter
    schema public owner to developer;

create table rooms
(
    id                serial
        constraint rooms_pk
            primary key,
    name              varchar(100)  not null,
    base_ticket_price numeric(6, 2) not null,
    min_participants  integer       not null,
    max_participants  integer       not null,
    min_age           integer
);

alter table rooms
    owner to developer;

create unique index room_name_uindex
    on rooms (name);

create table reservations
(
    id             serial
        constraint reservations_pk
            primary key,
    room_id        integer       not null
        constraint reservations_room_id_fk
            references rooms
            on update restrict on delete restrict,
    total_price    numeric(6, 2) not null,
    date_from      timestamp     not null,
    date_to        timestamp     not null,
    date_cancelled timestamp
);

alter table reservations
    owner to developer;

create table roles
(
    id   serial
        constraint roles_pk
            primary key,
    name varchar(50) not null
);

alter table roles
    owner to developer;

create unique index roles_name_uindex
    on roles (name);

create table users
(
    id           serial
        constraint users_pk
            primary key,
    first_name   varchar(50)               not null,
    last_name    varchar(50)               not null,
    phone_number varchar(12)               not null,
    date_birth   date                      not null,
    email        varchar(320)              not null,
    password     varchar(64) default ''    not null,
    is_active    boolean     default false not null,
    role_id      integer                   not null
);

alter table users
    owner to developer;

create unique index users_email_uindex
    on users (email);

create table guests
(
    id               serial
        constraint guests_pk
            primary key,
    user_id          integer not null
        constraint guests_users_id_fk
            references users
            on update restrict on delete restrict,
    discount_percent integer
);

alter table guests
    owner to developer;

create table tickets
(
    id                      serial
        constraint tickets_pk
            primary key,
    price                   numeric(6, 2)         not null,
    reservation_id          integer               not null
        constraint tickets_reservation_id_fk
            references reservations
            on update restrict on delete restrict,
    guest_id                integer               not null
        constraint tickets_guest_id_fk
            references guests
            on update restrict on delete restrict,
    guest_allowed_to_cancel boolean default false not null
);

alter table tickets
    owner to developer;

create unique index tickets_reservation_id_guest_id_uindex
    on tickets (reservation_id, guest_id);

create table reviews
(
    id       serial
        constraint reviews_pk
            primary key,
    guest_id integer                 not null
        constraint reviews_guests_id_fk
            references guests
            on update restrict on delete restrict,
    room_id  integer                 not null
        constraint reviews_rooms_id_fk
            references rooms
            on update restrict on delete restrict,
    rating   integer                 not null,
    comment  varchar(300) default '' not null,
    reply    varchar(300) default '' not null
);

alter table reviews
    owner to developer;

create unique index reviews_guest_id_room_id_uindex
    on reviews (guest_id, room_id);

insert into rooms (name, base_ticket_price, min_participants, max_participants, min_age)
values ('Pharaoh''s Tomb', 10.00, 5, 7, 12),
       ('Enigma Code', 15.00, 6, 9, 15),
       ('Pirate Ship', 20.00, 4, 6, null),
       ('Nuclear Silo', 30.00, 5, 8, 15);

insert into reservations (room_id, total_price, date_from, date_to, date_cancelled)
values (1, 10.00, '2021-10-23 17:00:00.000000', '2021-10-23 19:00:00.000000', null),
       (2, 15.00, '2021-10-20 20:00:00.000000', '2021-10-20 22:00:00.000000', null),
       (3, 20.00, '2021-10-25 16:00:00.000000', '2021-10-25 18:00:00.000000', null),
       (4, 30.00, '2021-10-30 22:00:00.000000', '2021-10-31 01:00:00.000000', null);

insert into users (first_name, last_name, phone_number, date_birth, email, password, is_active, role_id)
values ('Linda', 'Yehudit', '48100100100', '1990-01-01', 'linda.yehudit@gmail.com',
        '$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa', true, 1),
       ('Gillian', 'Domantas', '48200200200', '1985-02-02', 'gillian.domantas@gmail.com',
        '$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa', true, 1),
       ('Meagan', 'Ikra', '48300300300', '1986-03-03', 'meagan.ikra@gmail.com',
        '$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa', true, 1),
       ('Sunil', 'Katenka', '48400400400', '1989-04-04', 'sunil.katenka@gmail.com',
        '$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa', true, 1),
       ('Adam', 'Admin', '48600600600', '1988-06-06', 'admin@gmail.com',
        '$2a$12$OFjTdVVs//MJ7uPrnNA5wON5.cR3yQqikVvqwhAU3moX2vUzImMBa', true, 2);

insert into roles (name)
values ('Guest'),
       ('Admin');

insert into guests (user_id, discount_percent)
values (1, null),
       (2, null),
       (3, null),
       (4, null);

insert into tickets (price, reservation_id, guest_id, guest_allowed_to_cancel)
values (10.00, 1, 1, true),
       (15.00, 2, 2, true),
       (20.00, 3, 3, true),
       (30.00, 4, 4, true);