create table Conversations
(
    id        serial primary key,
    ownerId   int REFERENCES "Users" (id) on delete no action on update cascade not null,
    createdAt timestamp default now()                                           not null,
    updatedAt timestamp default now()                                           not null

);

create table Messages
(
    id             serial primary key,
    body           text      default ''                                                  not null,
    senderId       int references "Users" (id) on delete no action on update cascade     not null,
    conversationId int references Conversations (id) on delete cascade on update cascade not null,
    createdAt      timestamp default now()                                               not null,
    updatedAt      timestamp default now()                                               not null
);

create table Catalogs
(
    id     serial primary key,
    name   varchar(64)                                                       not null,
    userId int references "Users" (id) on delete no action on update cascade not null
);

create table Catalogs_to_Conversations
(
    catalogId      int references catalogs (id) on delete no action on update cascade      not null,
    conversationId int references Conversations (id) on delete no action on update cascade not null,
    primary key (catalogId, conversationId)
);


create table Users_to_Conversations
(
    userId         int references "Users" (id)       not null,
    conversationId int references Conversations (id) not null,
    primary key (userid, conversationId)
);

create table BlackList
(
    userId    int references "Users" (id)       not null,
    blockedId int references Conversations (id) not null check ( blockedId != userId ),
    primary key (userid, blockedId)
);

create table FavoriteList
(
    userId     int references "Users" (id)       not null,
    favoriteId int references Conversations (id) not null check ( favoriteId != userId ),
    primary key (userid, favoriteId)
);


/*1 Вывести кол-во юзеров по ролям*/
SELECT role, COUNT(role) as "Count roles"
FROM "Users"
GROUP BY role;


/*2 Всем юзерам с ролью customer, которые осуществляли заказы в новогодние праздники в период с
25.12 по 14.01, необходимо зачислить по 10% кэшбэка со всех заказов в этот период.*/
create view users_ny_contest
as
/*запрос: сумма заказов и ид людей,кто заказывал в этот период*/
Select U.id, sum(C.prize) as countedValue
from "Users" U
         join "Contests" C on U.id = C."userId"
where role = 'customer'
  and C."createdAt" between '2019-12-25' AND '2020-01-14'
group by U.id;

update "Users" U
set balance= balance + ((select countedValue
                         from users_ny_contest Uc
                         where Uc.id = U.id)
    * 0.1)/*начисляется 10% от их заказов*/
where U.id in (select id
               from users_ny_contest);


/*3 Для роли Creative необходимо выплатить 3-м юзерам с самым высоким рейтингом по 10$ на их счета*/
UPDATE "Users"
SET balance = balance + 10
where id in (Select id
             from "Users"
             where role = 'creator'
             order by rating DESC
             limit 3);
