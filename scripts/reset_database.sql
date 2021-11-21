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
