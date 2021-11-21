drop schema if exists public cascade;

create schema public;

alter schema public owner to developer;

create table room
(
    id                serial
        constraint room_pk
            primary key,
    name              varchar(100)  not null,
    base_ticket_price numeric(6, 2) not null,
    min_participants  integer       not null,
    max_participants  integer       not null,
    min_age           integer
);

alter table room
    owner to developer;

create unique index room_name_uindex
    on room (name);

create table reservation
(
    id             serial
        constraint reservation_pk
            primary key,
    room_id        integer       not null
        constraint reservation_room_id_fk
            references room,
    total_price    numeric(6, 2) not null,
    date_from      timestamp     not null,
    date_to        timestamp     not null,
    date_cancelled timestamp
);

alter table reservation
    owner to developer;

create table guest
(
    id               serial
        constraint guest_pk
            primary key,
    email            varchar(320) not null,
    first_name       varchar(50)  not null,
    last_name        varchar(50)  not null,
    phone_number     varchar(12)  not null,
    date_birth       date         not null,
    discount_percent integer
);

alter table guest
    owner to developer;

create unique index guest_email_uindex
    on guest (email);

create table ticket
(
    id                      serial
        constraint ticket_pk
            primary key,
    price                   numeric(6, 2)         not null,
    reservation_id          integer               not null
        constraint ticket_reservation_id_fk
            references reservation,
    guest_id                integer               not null
        constraint ticket_guest_id_fk
            references guest,
    guest_allowed_to_cancel boolean default false not null
);

alter table ticket
    owner to developer;

insert into room (id, name, base_ticket_price, min_participants, max_participants, min_age)
values (1, 'Pharaoh''s Tomb', 10.00, 5, 7, 12),
       (2, 'Enigma Code', 15.00, 6, 9, 15),
       (3, 'Pirate Ship', 20.00, 4, 6, null),
       (4, 'Nuclear Silo', 30.00, 5, 8, 15);

insert into reservation (id, room_id, total_price, date_from, date_to, date_cancelled)
values (1, 1, 10.00, '2021-10-23 17:00:00.000000', '2021-10-23 19:00:00.000000', null),
       (2, 2, 15.00, '2021-10-20 20:00:00.000000', '2021-10-20 22:00:00.000000', null),
       (3, 3, 20.00, '2021-10-25 16:00:00.000000', '2021-10-25 18:00:00.000000', null),
       (4, 4, 30.00, '2021-10-30 22:00:00.000000', '2021-10-31 01:00:00.000000', null);

insert into guest (id, email, first_name, last_name, phone_number, date_birth, discount_percent)
values (1, 'linda.yehudit@gmail.com', 'Linda', 'Yehudit', '48100100100', '1990-01-01', null),
       (2, 'gillian.domantas@gmail.com', 'Gillian', 'Domantas', '48200200200', '1985-02-02', null),
       (3, 'meagan.ikra@gmail.com', 'Meagan', 'Ikra', '48300300300', '1986-03-03', null),
       (4, 'sunil.katenka@gmail.com', 'Sunil', 'Katenka', '48400400400', '1989-04-04', null);

insert into ticket (id, price, reservation_id, guest_id, guest_allowed_to_cancel)
values (1, 10.00, 1, 1, true),
       (2, 15.00, 2, 2, true),
       (3, 20.00, 3, 3, true),
       (4, 30.00, 4, 4, true);