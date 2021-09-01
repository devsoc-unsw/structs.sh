# Galactic Ed Backend

## Installation

`yarn`

## How to run the server

`yarn start` will start a server on localhost:[port] (default port = 3000)

## Graphiql

Go to `localhost:{port}/graphiql` to use the graphiql interface

## Making requests

Make graphql requests to `/graphql`

## Other routes

### `/health-check` [GET]

For determining if the server is running

### `/login` [POST]

Will generate an auth token if provided with valid credentials

## Project Structure

```
src
 -> dbHandlers
    Classes/methods for interacting with the mongoDB database
 -> graphql
    Resolvers, typedefs etc. for graphql
 -> model
    Defines various types and interfaces used in the data model
 -> routes
    Routing definitions, see routes for more details
 -> schemas
    Mongoose schemas for interacting with mongoDB

```

```
.
├── dbHandlers                     # ===== Database Services =====
│   ├── admin.ts
│   ├── content
│   │   ├── component.ts
│   │   ├── course.ts
│   │   ├── lesson.ts              # ... Eg. this file implements CRUD operations on the `Lesson` Mongoose model
│   │   └── question.ts
│   └── user.ts
├── graphql
│   ├── resolvers                  # ===== Resolvers =====
│   │   ├── domains
│   │   │   ├── admin.ts
│   │   │   ├── content.ts         # This contains the actual implementation for query and mutation operations such as `getAllLessons`, `createLesson`, etc.
│   │   │   └── user.ts
│   │   └── index.ts
│   └── typeDefs                   # ===== Type Definitions, Queries & Mutations =====
│       ├── domains                # Contains gql`` type definitions. These are where all GraphQL types are defined
│       │   ├── admin.ts
│       │   ├── content
│       │   │   ├── component.ts
│       │   │   ├── course.ts
│       │   │   ├── lesson.ts      # ... Eg. this file defines `type Lesson { title: String, ... }` and `input CreateLessonInput { courseId, ... }`, etc.
│       │   │   └── question.ts
│       │   └── user.ts
│       ├── mutations              # Defines mutation operations that the client can call. The implementation for these are inside the resolver directory
│       │   ├── admin.ts
│       │   ├── content
│       │   │   ├── component.ts
│       │   │   ├── course.ts
│       │   │   ├── lesson.ts      # ... Eg. this file declares the `createLesson(lesson)` operation, `deleteLesson(id)` operation, etc.
│       │   │   └── question.ts
│       │   ├── index.ts           # Defines `type Mutation` and merges in all `extend type Mutation` definitions from the other files in this directory
│       │   └── user.ts
│       └── queries                # Defines query operations that the client can call. The implementation for these are inside the resolver directory
│           ├── admin.ts
│           ├── content
│           │   ├── component.ts
│           │   ├── course.ts
│           │   ├── lesson.ts      # ... Eg. this file declares the `getAllLessons` and `getLessonById(id: String)` operations
│           │   └── question.ts
│           ├── index.ts           # Defines `type Query` and merges in all `extend type Query` definitions from the other files in this directory
│           └── user.ts
├── model                                 # Contains class definitions that inherit from mongoose.Document which are used extensively by the files in `dbHandlers`
│   ├── admin
│   │   └── Ticket.ts
│   ├── common
│   │   └── Identifiable.ts
│   ├── content
│   │   ├── Component.ts
│   │   ├── Course.ts
│   │   ├── Lesson.ts                     # ... Eg. this file declares the typescript interface: `interface Lesson extends mongoose.Document { ... }`
│   │   └── Question.ts
│   ├── input
│   │   ├── admin
│   │   │   ├── CreateTicketInput.ts
│   │   │   └── UpdateTicketInput.ts
│   │   ├── content
│   │   │   ├── CreateComponentInput.ts
│   │   │   ├── CreateLessonInput.ts
|   |   |   ...
│   │   └── user
│   │       ├── CreateChildInput.ts
|   |       ...
│   └── user
│       ├── Child.ts
│       ├── Config.ts
│       ├── Permissions.ts
│       ├── Theme.ts
│       └── User.ts
├── routes
│   ├── graphql
│   │   └── index.ts
│   ├── health
│   │   └── index.ts
│   ├── index.ts
│   └── user
│       └── index.ts
├── schemas                                # 'Schemas' define the structure of MongoDB documents.
|   |                                      # This differs from 'models' which defines a programming interface for interacting with the database. https://stackoverflow.com/questions/22950282/mongoose-schema-vs-model
|   |                                      # Note: files in this directory will define schemas, create models from them and export subclasses of `mongoose.Model`
|   |                                      #       `mongoose.Model` defines operations such as `find`, `findById`, `create`, `deleteOne`, etc. https://mongoosejs.com/docs/api/model.html
│   ├── admin
│   │   └── ticket.ts
│   ├── content
│   │   ├── component.ts
│   │   ├── course.ts
│   │   ├── lesson.ts
│   │   └── question.ts
│   └── user
│       ├── child.ts
│       └── user.ts
├── server.ts
└── utils
    └── index.ts
```

Core domains which could have their own Class of resolvers:

- User/Auth
- Content
- Ticket
