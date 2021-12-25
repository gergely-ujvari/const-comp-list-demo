# Const Comp List Demo

## Description
This app is a simple coding challenge given by an undisclosed company.

## Setup
The application will install itself if the `make` command is available.

Simply running `make` (or `make dev`) is enough.

The process will install meteor using the [official install script](https://install.meteor.com/). This is the traditional way to install meteor. Recently a global [meteor npm install package](https://www.npmjs.com/package/meteor) is also available to reach the same result, but that is more obtrusive.

## Technical information
### Code & Quality
 - The application is written in [Typescript](https://www.typescriptlang.org/).
 - [ESLint](https://eslint.org/) is used to improve code quality (`make eslint`)
 - [Prettier](https://prettier.io/) is used for consistent code style (`make check-code-format` and `make format-code`)

### Application tech stack
- [Meteor](https://www.meteor.com/) (which is node.js based) is used as the backend both for the Rest endpoints and for hosting the frontend code.
- [Simple:Json-routes](https://meteor-rest.readthedocs.io/en/latest/packages/json-routes/README/) for setting up the Rest endpoints
- [Faker](https://www.npmjs.com/package/faker) for generating test data
- [React](https://reactjs.org/) for building the frontend
- [antd](https://ant.design/) for styled components

## Possible Improvements
