#!/bin/sh
git checkout heroku
git pull --rebase origin develop
git push heroku heroku:master
git checkout develop