# **SocketChat**

A Group Chat App built with Express.js, Socket.io, Prisma, Vite and Typescript.

## Basic Overview

A simple group chat app that allows users to enter a username and send messages in a global group chat. The messages are sent with Web Socket connections for blazingly fast delivery.

### Test the app live

Use the link below to test the app:

[https://socketio.ahnafwafiq.com]()

### Test the code locally

The main api is protected by CORS policy and can only recieve requests from verified origins. If you clone the repo to test the code on your local system, use the command below to clone the branch that we designed to be tested locally.

```shell
~$ git clone -b testing https://github.com/ahnafwafiq-com/socketchat.git
```

The `main.ts` file inside the [app](https://github.com/ahnafwafiq-com/socketchat/tree/main/app) directory will have the Socket.io and API endpoints set to http://localhost:8080. The `app.ts` file inside the [server](https://github.com/ahnafwafiq-com/socketchat/tree/main/server) directory will also include CORS headers for https://localhost:5173 . The Prisma database will also be set the sqlite. Feel free to change it to your prefered database. The production version of the app uses remote MySQL. You need to add a .env file and add the `DATABASE_URL` environment variable with the value of `file:./[filename].db` . Also run the two following commands to sync the database with your schema.

```shell
~$ npx prisma migrate dev --name init
```

```shell
~$ npx prisma generate
```

If you've done these properly, you'll have to run the following command from both the [app](https://github.com/ahnafwafiq-com/socketchat/tree/main/app) and [server](https://github.com/ahnafwafiq-com/socketchat/tree/main/server) directories.

```shell
app$ npm run dev
```

```shell
server$ npm run dev
```

Now, your API should be up and running in http://localhost:8080 and your Front-end end should be live at http://localhost:5173.

### Contributing to the Project

Pull requests are welcomed. We are always looking for new ways to improve this app. Some help from the community is always appreciated. Clone the `testing` branch following the previous steps and make a new branch from that branch by running the following command. Note that you won't be able to push code to the testing branch.

```shell
~$ git checkout -b [branch-name]
```

Then, make the changes you want. Push your code to Github which will automatically create a pull request. A admin will check your code and if the checks pass, merge it with the main branch, which will trigger the CI/CD pipeline and your changes should be live within an hour.
