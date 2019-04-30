# chat-app

AngularJS application

## Condition préalable

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Git global setup:
```bash
git config --global user.name "FirstName SecondName"
git config --global user.email "yourmail@sifast.com"
Create Repository
mkdir chat-app
cd chat-app
git init
touch README
git add README
git commit -m 'first commit'
git remote add origin git@gitlab.sifast.lan:hibatallah.aouadni/chat-app.git
git push -u origin master
```
## Existing Git Repo?
```bash
cd existing_git_repo
git remote add git@gitlab.sifast.lan:hibatallah.aouadni/chat-app.git
git push -u origin master
```

## To launch the application
```bash
node chat-server/server.js
```