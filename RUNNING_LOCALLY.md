# Running charity-base-api locally
The following gives instruction of how to build your own version of CharityBase.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting the data](#getting-the-data)
- [Listen for requests](#listen-for-requests)
- [How to use](#how-to-use)
- [Advice for small machines](#advice-for-small-machines)

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js v6.9 - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB v3.2 - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

## Installation

Once you've installed the prerequisites, you're just a few steps away from running your own version of CharityBase.

First, download the code using Git, which normally comes installed on Mac and Linux.  On the command-line, navigate to the directory you want charity-base-api to live in and run:
```bash
$ git clone https://github.com/tythe-org/charity-base-api.git charity-base-api
```
If that doesn't work you might need to [download & install Git](https://git-scm.com/downloads).

Now simply navigate into the newly created directory and install the dependencies listed in `package.json`:
```bash
$ cd charity-base-api
$ npm install
```

## Getting the data
Take a look at the README.md in the data directory [charity-base-api/data](data) for help constructing the CharityBase database on your own computer.

## Listen for requests
Once you've completed the above steps, run the node express server from the parent directory:
```bash
$ node server.js
```
Now visit `http://localhost:3000` in your browser - you should see a welcome message.

## How to use
See the main [README](README.md) for API docs.

## Advice for small machines
These steps aren't essential but will help things run smoothly on computers without much memory.

* Allocate swap space - This is good practice in general, and will prevent MongoDB from crashing on systems without much RAM (e.g. [Add swap on ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04))

* Reduce WiredTiger cache - Since version 3.2, MongoDB uses the WiredTiger storage engine by default whose internal cache uses at least 1GB by default.  On smaller machines you should reduce this e.g. if you have 512MB RAM, reduce it to 200MB by including the following in the config file (usually found at `/etc/mongod.conf`)
    ```bash
    storage:
      wiredTiger:
        engineConfig:
          configString: "cache_size=200M"
    ```
    After updating the config file, restart MongoDB on the command line:
    ```bash
    $ sudo service mongod restart
    ```

