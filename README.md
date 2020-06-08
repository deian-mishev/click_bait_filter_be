# CLICKBAIT-FILTER-SERVICE

[![ClickBaitSite](https://click-bait-filtering-plugin.com/assets/images/icon-128-122x122.png)](https://click-bait-filtering-plugin.com/index.html)

## Technologies

CLICKBAIT-FILTER-SERVICE uses a number of open source projects:

  * [NODE.JS] - JAVASCRIPT RUNTIME ENVIRONMENT
  * [EXPRESS.JS] - JAVASCRIPT WEB FRAMEWORK
  * [TENSORFLOW] - MACHINE LEARNING LIBRARY
  * [MONGOOSE] - MONGODB OBJECT MODELING
  * [AXIOS] - HTTP CLIENT LIBRARY
  * [EXPRESS-JWT] - EXPRESS JWT MIDDLEWARE
  * [EXPRESS-JWT-AUTHZ] - JWT VALIDATION LIBRARY
  * [NODE-JWT] - NODE JWT LIBRARY
  * [DOTENV] - ENVIRONMENT VARIABLE LOADER
  * [COMPRESSION] - HTTP COMPRESSION MIDDLEWARE
  * [NODE-SCHEDULE] - CRON LIKE NOT TASK SCHEDULER

## Installation

CLICKBAIT-FILTER-SERVICE requires [Node.js](https://nodejs.org/) v10+ to run.

Install node dependancies for the project:
```sh
$ cd click_bait_filter_be
$ npm install
```

## Applications Scopes

This service is a part of a multi application project that features the following git repositories:

| Service Name                                  | Description                         | Maintainer              |
| ----------------------------------------      |:------------------------------------|:------------------------|
| [webpack-chrome-extension-reloader]           | Chrome Extension Reloader/Builder   | [rubenspgcavalcante]    |
| [click_bait_filter_extension]                 | Chrome Extensions Plugin            | [LeadShuriken]          |
| [click_bait_filter_be]                        | Node Application Server             | [LeadShuriken]          |
| [click_bait_filter_ml]                        | TensorFlow Model Generator/Updater  | [LeadShuriken]          |
| [click_bait_filter_portal]                    | Service and Information Portal      | [LeadShuriken]          |

These application have the following folder structure:
```sh
 | .
 | +-- webpack-chrome-extension-reloader
 |      +-- click_bait_filter_extension
 |      +-- click_bait_filter_be
 |      +-- click_bait_filter_ml
 | +-- click_bait_filter_portal
```

## Running and Building

This application is an **Express Application**;


### 2. Runing the service
---

* **WITH MICROSOFT VISUAL STUDIO CODE**

  To run the application, open the project in Microsoft VS Code and navigate to the .vscode folder.
  
  There you will see the **launch.json** file. And create this run configuration:
  
  ```sh
  {
      "type": "node",
      "request": "launch",
      "name": "LAUNCH",
      "env": {
          "API_URL": "/api",
          "MONGODB_URI": "<MONGO CONNECTION STRING>",
          "PORT": "4000"
      },
      "program": "${workspaceFolder}/index.js",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
  }
  ```
  More information on [MONGO CONNECTION STRING] formats.

* **WITH CLI COMMANDS**

  Open the terminal and navigate to the root project folder.

  ```sh
  $ API_URL=/api MONGODB_URI=<MONGO CONNECTION STRING> PORT=4000 node index.js
  ```

  This launches the service on: **http://localhost:4000** 

### Todos

 - Tests and Docs

  [NODE.JS]: <https://github.com/nodejs/node>
  [EXPRESS.JS]: <https://github.com/expressjs/express>
  [TENSORFLOW]: <https://github.com/tensorflow/tfjs/tree/master/tfjs-node>
  [MONGOOSE]: <https://github.com/Automattic/mongoose>
  [AXIOS]: <https://github.com/axios/axios>
  [COMPRESSION]: <https://github.com/expressjs/compression>  
  [DOTENV]: <https://github.com/motdotla/dotenv>
  [EXPRESS-JWT]: <https://github.com/auth0/express-jwt>
  [EXPRESS-JWT-AUTHZ]: <https://github.com/auth0/express-jwt-authz>
  [NODE-JWT]: <https://github.com/auth0/node-jsonwebtoken>
  [NODE-SCHEDULE]: <https://github.com/node-schedule/node-schedule>
  [MONGO CONNECTION STRING]: <https://docs.mongodb.com/manual/reference/connection-string>
  [webpack-chrome-extension-reloader]: <https://github.com/LeadShuriken/webpack-chrome-extension-reloader>
  [click_bait_filter_extension]: <https://github.com/LeadShuriken/click_bait_filter_extension>
  [click_bait_filter_be]: <https://github.com/LeadShuriken/click_bait_filter_be>
  [click_bait_filter_ml]: <https://github.com/LeadShuriken/click_bait_filter_ml>
  [click_bait_filter_portal]: <https://github.com/LeadShuriken/click_bait_filter_portal>
  [LeadShuriken]: <https://github.com/LeadShuriken>
  [rubenspgcavalcante]: <https://github.com/rubenspgcavalcante>