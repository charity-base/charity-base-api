# open-charities

## Contents
- [Introduction] (#introduction)
- [Prerequisites] (#prerequisites)
- [Installation] (#installation)
- [Advice for small machines] (#advice-for-small-machines)
- [Data] (#data)
- [API] (#api)

## Introduction
[OpenCharities.org.uk] (http://opencharities.org.uk/) is an open source database + API which provides detailed information on the finances, activities and locations of 350,000 charities and subsidiary charities in England & Wales.

The OpenCharities database brings together information published by the Charity Commission in their <a href="http://data.charitycommission.gov.uk/" target="_blank">data download</a> with additional fields shared on their charity search websites (<a href="http://apps.charitycommission.gov.uk/showcharity/registerofcharities/RegisterHomePage.aspx" target="_blank">original</a> and <a href="http://beta.charitycommission.gov.uk/" target="_blank">Beta</a>).

The following gives instruction of how to build your own version of OpenCharities.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).

## Installation

Once you've installed the prerequisites, you're just a few steps away from running your own version of OpenCharities.

First, download the code using Git, which normally comes installed on Mac and Linux.  On the command-line, navigate to the directory you want open-charities to live in and run:
```bash
$ git clone https://github.com/tithebarn/open-charities.git open-charities
```
If that doesn't work you might need to [download & install Git](https://git-scm.com/downloads).

Now simply navigate into the newly created directory and install the dependencies listed in `package.json`:
```bash
$ cd open-charities
$ npm install
```

## Advice for small machines
These steps aren't essential but will help things run smoothly on computers without much memory.
* Allocate swap space - This is good practice in general, and will prevent MongoDB from crashing on systems without much RAM (e.g. [Add swap on ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04))
* Reduce WiredTiger cache - Since version 3.2, MongoDB uses the WiredTiger storage engine by default whose internal cache uses at least 1GB by default.  On smaller machines you should reduce this e.g. if you have 512MB RAM, reduce it to 200MB by including the following in the config file (usually found at /etc/mongod.conf)
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

## Data
The data directory [open-charities/data](https://github.com/tithebarn/open-charities/tree/master/data) contains several scripts for constructing the OpenCharities database on your own computer.  Take a look at the README.md in the data directory for more information.

## API

