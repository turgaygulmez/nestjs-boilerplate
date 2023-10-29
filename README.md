# NestJS Boilerplate

A boilerplate to start a BE project with built-in modules and features

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Environment Variables](#environments)
- [Support](#support)
- [Contributing](#contributing)

## Installation

1- Clone the project to your local directory

```sh
git clone https://github.com/turgaygulmez/nestjs-boilerplate.git
```

2- Install dependencies

```sh
npm install
```

3- Create a postgresql database if you dont have any

4- Set environment variables, defined [here](#environments)

5- Set JWT token roles [here](https://github.com/turgaygulmez/nestjs-boilerplate/blob/main/src/constants/roles.ts)

6- Run the project on development mode

```sh
npm run start:dev
```

## Features

Find the list of features/modules included in the boilerplate which are essential in most of the API projects

- Authentication middleware
- Role middleware
- CORS middleware
- RedisCache provider
- Generic Exception
- BaseService
- BaseController
- Pagination
- Typescript support
- DB migration
- Hot reload
- Exception Filter
- Cache Interceptors
- Swagger
- AutoMapper

Feel free to remove any features that aren't applicable to your project.

## Environments

| Variable Name   | Description                                  |
| --------------- | -------------------------------------------- |
| PORT            | Application running port                     |
| API_VERSION     | Version to be used in the exposed urls       |
| JWT_SECRET      | Secret key for JWT token                     |
| ALLOWED_ORIGINS | List of origins used by CORS middleware      |
| DB_PORT         | Postgresql Database port (5433)              |
| DB_NAME         | Postgresql Database name                     |
| DB_USERNAME     | Postgresql Database username (postgres)      |
| DB_PASSWORD     | Postgresql Database password                 |
| DB_URL          | Postgresql Database url (localhost)          |
| ENABLE_REDIS    | Flag to determine if redis should be enabled |
| REDIS_USERNAME  | Redis username                               |
| REDIS_PASSWORD  | Redis password                               |
| REDIS_SENTINELS | Redis sentinels                              |
| REDIS_CERT_PATH | Redis cert path (.crt file)                  |

## Support

Please [open an issue](https://github.com/turgaygulmez/nestjs-boilerplate/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/turgaygulmez/nestjs-boilerplate/compare/).
