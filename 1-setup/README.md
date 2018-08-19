# Lab 1 - Bot Framework Setup

In this lab, we'll setup our VSCode IDE for our Bot Framework development environment using NodeJS + Typescript. This includes

1. Setup VSCode and tools to develop the bot framework project.
2. Creating and running our first Hello World bot project
3. A quick review of Bot Builder SDK for NodeJS.

## Prerequisites

* [Visual Studio Code](https://code.visualstudio.com)
* [NodeJS](https://nodejs.org/en/) - 10.9.0 (Current)
* [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.36)
* [Typescript](https://www.typescriptlang.org/index.html#download-links) - `npm install -g typescript`
* [TSLint](https://github.com/palantir/tslint) - `npm install -g tslint`
* Knowledge of [restify](http://restify.com) and asynchronous programming in JavaScript
* Recommended VSCode extensions
     * TSLint 
     * Prettier - Code Formatter
     * Azure App Service

>[NOTE] For some installations in windows, the install step for restify is giving an error related to node-gyp. If this is the case try running npm install -g windows-build-tools.

## Getting started

1. Create a directory for your bot and navigate to the directory.
    ```sh
    mkdir goodeats && cd $_
    ```
2. Initialize the project using npm. Follow the prompt on the screen to enter information about your bot and npm will create a package.json file that contains the information you provided. The entry point of the file is `app.js`.
    ```sh
    npm init
    ```
3. Install the dependencies and dev dependencies for bot builder project.
    ```sh
    npm i botbuilder --save
    npm i botbuilder-azure --save
    npm i restify --save
    npm i dotenv --save

    npm i @types/node @types/restify @types/dotenv --save-dev
    ```
    >The devDependencies contain the types of the various packages we’ll be using. Types are the various interfaces for the objects and classes in a particular package. So `@types/restify` contains the interfaces provided by restify. This will add IntelliSense to the project. In the case of botbuilder, we don’t need to add a types file, as the framework is written in TypeScript, and contains all of the necessary types.
4. **Configuring Typescript** - The typescript will be transpiled into Javascript. You configure how this occurs using tsconfig.json file. Add a file named tsconfig.json with following content.
    ```json
    {
        "compilerOptions": {
            "module": "commonjs",
            "target": "es6",
            "sourceMap": true,
            "moduleResolution": "node"
        },
        "exclude": [
            "node_modules",
            "**/*.spec.ts"
        ]
    }
    ```
5. Create a file called `app.ts`. To test that you have the TypeScript compiler tsc installed correctly and working, open a terminal and type `tsc` You can use the `Integrated Terminal` directly in VS Code. You should now see the transpiled `app.js` JavaScript file.

6. **Build Task** - Execute `Run Build Task...` from the global Tasks menu. If you created a tsconfig.json file in the earlier section, this should present the following picker:
![](./images/typescript-build.png)
    Select the tsc: build entry. This will produce a app.js and app.js.map file in the workspace.

    If you selected tsc: watch, the TypeScript compiler watches for changes to your TypeScript files and runs the transpiler on each change.
7. **Build Task - Default** - You can also define the TypeScript build task as the default build task so that it is executed directly when triggering `Run Build Task`. To do so select `Configure Default Build Task` from the global Tasks menu. This shows you a picker with the available build tasks. Select TypeScript tsc: watch which generates the following tasks.json file:
    ```json
    {
        "version": "2.0.0",
        "tasks": [
            {
                "type": "typescript",
                "tsconfig": "tsconfig.json",
                "option": "watch",
                "isBackground": true,
                "problemMatcher": [
                    "$tsc-watch"
                ],
                "group": {
                    "kind": "build",
                    "isDefault": true
                }
            }
        ]
    }
    ```
8. **Debug Configuration** - You will need to create a debugger configuration file launch.json for your ChatBot to debug. Click on the Debug icon in the Activity Bar and then the Configure gear icon at the top of the Debug view to create a default launch.json file. Select the Node.js environment by ensuring that the type property in configurations is set to "node". When the file is first created, VS Code will look in package.json for a start script and will use that value as the program for the `Launch Program` configuration.
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Bot",
                "program": "${workspaceFolder}/app.js"
            }
        ]
    }
    ```
9. **Hiding derived JavaScript files** -  When you are working with TypeScript, you often don’t want to see generated JavaScript files in the explorer or in search results. VS Code offers filtering capabilities with a files.exclude workspace setting (File > Preferences > Settings) and you can easily create an expression to hide those derived files:
    ```json
    "files.exclude": {
       ...
       "**/*.js": { "when": "$(basename).ts"},
       "**/*.js.map" : true
   }
    ```

## Develop

Open `app.ts`. We are going to develop a simple hello world bot.
1. Create .env file with following values. These variables will be loaded into process.env variables using `dotenv` module. This file is ignored by git, since it might contain secrets.
    ```
    NODE_ENV=development
    PORT=3978
    MICROSOFT_APP_ID=
    MICROSOFT_APP_PASSWORD=
    ```
2. Import required classes at top of the file
    ```typescript
    import * as restify from 'restify';
    import { MemoryBotStorage, UniversalBot, ChatConnector } from 'botbuilder';
    import { BotServiceConnector } from 'botbuilder-azure';
    ```
3. Create chat connector. 
    ```typescript
    // Load .env files as process variables
    require('dotenv').config();

    const useEmulator = (process.env.NODE_ENV == 'development');

    const connector =  useEmulator ? new ChatConnector() : new BotServiceConnector ({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    ```

4. Create universal bot
   ```typescript
    const bot = new UniversalBot(connector, (session, _args) => 
    {
        // Default dialog handler
    });
   ```
5. Set `InMemoryStorage` to bot
    ```typescript
    bot.set('storage', new MemoryBotStorage());
    ```
6. Create a simple restify server to listen at the endpoint `api/messages` and route to connector.
    ```typescript
    const server = restify.createServer();
    server.post('/api/messages', connector.listen());
    server.listen(process.env.PORT, () => console.log(`${server.name} listening to ${server.url}`));
    ```