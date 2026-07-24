create table tree (
    id serial PRIMARY KEY,
    session text NOT NULL,
    type text NOT NULL,
    tree JSONB NOT NULL,
);