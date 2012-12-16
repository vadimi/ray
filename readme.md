ray
=======

### Introduction

**Ray** is internet radio player used on [Raspberry Pi](http://www.raspberrypi.org) to stream music to connected to it audio system. It uses ```mpg123``` console app to stream audio.

### Run as deamon

1. Install [forever](https://github.com/nodejitsu/forever)
2. Run this script

  ```
  NODE_ENV=production forever start -l forever.log -o out.log -e err.log -c coffee app.coffee
  ```