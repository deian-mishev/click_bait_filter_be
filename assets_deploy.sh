#!/bin/sh
git checkout heroku
git pull --rebase origin develop
git push heroku origin:master
git checkout develop