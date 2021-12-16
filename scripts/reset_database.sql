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
            references rooms,
    total_price    numeric(6, 2) not null,
    date_from      timestamp     not null,
    date_to        timestamp     not null,
    date_cancelled timestamp
);

alter table reservations
    owner to developer;

create table guests
(
    id               serial
        constraint guests_pk
            primary key,
    email            varchar(320) not null,
    first_name       varchar(50)  not null,
    last_name        varchar(50)  not null,
    phone_number     varchar(12)  not null,
    date_birth       date         not null,
    discount_percent integer
);

alter table guests
    owner to developer;

create unique index guests_email_uindex
    on guests (email);

create table tickets
(
    id                      serial
        constraint tickets_pk
            primary key,
    price                   numeric(6, 2)         not null,
    reservation_id          integer               not null
        constraint tickets_reservation_id_fk
            references reservations,
    guest_id                integer               not null
        constraint tickets_guest_id_fk
            references guests,
    guest_allowed_to_cancel boolean default false not null
);

alter table tickets
    owner to developer;

create unique index tickets_reservation_id_guest_id_uindex
    on tickets (reservation_id, guest_id);

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

insert into guests (email, first_name, last_name, phone_number, date_birth, discount_percent)
values ('linda.yehudit@gmail.com', 'Linda', 'Yehudit', '48100100100', '1990-01-01', null),
       ('gillian.domantas@gmail.com', 'Gillian', 'Domantas', '48200200200', '1985-02-02', null),
       ('meagan.ikra@gmail.com', 'Meagan', 'Ikra', '48300300300', '1986-03-03', null),
       ('sunil.katenka@gmail.com', 'Sunil', 'Katenka', '48400400400', '1989-04-04', null);

insert into tickets (price, reservation_id, guest_id, guest_allowed_to_cancel)
values (10.00, 1, 1, true),
       (15.00, 2, 2, true),
       (20.00, 3, 3, true),
       (30.00, 4, 4, true);