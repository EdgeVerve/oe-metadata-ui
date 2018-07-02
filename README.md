# oe-skeleton project 

This module can be used for reference

## dependency
* oe-cloud
* oe-logger

## Installation, test cases and code coverage

### Pre-requisite

- you should able to connecto to [evgit](http://evgit), [npmjs](http://registry.npmjs.org) and [github](https://github.com) when you use npm on command line
- For that use .npmrc and .gitconfig as shown below

*.npmrc*

```
http-proxy=http://<username>:<password>@10.68.248.102:80/
https-proxy=http://<username>:<password>@10.68.248.102:80/
registry="http://registry.npmjs.org"
no_proxy=
strict-ssl=false
python=E:\Python27\python.exe
```

*.gitconfig*

```
[http]
proxy = http://<username>:<password>@10.68.248.102:80/
[https]
proxy = http://<username>:<password>@10.68.248.102:80/
[http "http://10.73.97.24"]
                sslVerify = false
                proxy =
[http "http://evgit"]
                sslVerify = false
                proxy =
[http "http://10.188.25.62"]
                sslVerify = false
                proxy =		                
				
[user]
	name = atul-github
	email = atul_pandit@yahoo.com
```



### Installation

```sh
$ git clone http://evgit/atul/oe-skeleton.git
$ cd oe-skeleton
$ npm install --no-optional
```



### Run Test cases

```sh
mocha test/test.js
```

### Run test with coverage

Run test cases along with code coverage - code coverage report will be available in coverage folder

```sh
$ npm run grunt-cover
```

### Run as independent Server

```sh
$ node test/server.js
```

browse  [http://localhost:3000/explorer](http://localhost:3000/explorer) 

## CI CD

CI CD is available and you may have to do minor changes as below.

### .gitlab-ci.yml

This file is responsible for running CI/CD in gitlabs. *you don't have to chagne anything in file*. It will run *npm run grunt-cover* job which will internally run mocha test/test.js along with coverage.


### Gruntfile.js

This file is used when CI/CD run test and coverage. you may want to modify following acceptance parameters.


```
 check: {
            lines: 90,
            statements: 90,
            branches: 50,
            functions: 100
          },

```

### README.md

you should change this file as per your module.

### ESLint

.eslintrc and .eslintignore files you need not to modify. However it is good practice to run following command before you push into git. Or else CI/CD pipeline will fail.

```sh
$ eslint . --fix
```

## Developing oe-cloud module

You can do following things in this oe-cloud module.

* Add models specific to your module (see common/modles folder)
* Add mixins which will get attached to BaseEntity (see common/mixins folder)
* Add middleware (see server/middleware folder and server/middleware.json)
* Add Boot script (see server/boot folder)

## Developing test script 

There is test folder created. you need to modify following files for your project

### datasources*.json 

There are several total 3 datasource.x.json files each for Mongo, PostgreSQL and Oracle. you should change database name at least for Mongo and PostgreSQL

### server.js

you may want to run this module as independent server during your development.  Mostly you don't have to chagne this file unless you are having mixin. For that have line similar to below for your mixin.

```javascript
oecloud.attachMixinsToBaseEntity("SkeletonMixin");

```

### test.js

This is typical mocha unit test case file. you can keep adding test cases to it.

### Adding models to your test scripts

you can add models that you want to use only for your test scripts in test/common/models folder and then modify test/model-config.json file to have entry for the model.

### Adding boot script to your test scripts

you can add boot script in test/boot folder. This will be executed as part of boot in application.

Similarly you can also have middleware/mixins for testing - which is mostly not required.
