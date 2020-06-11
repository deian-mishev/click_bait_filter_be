#!/bin/sh
git checkout heroku
cp -r ./../click_bait_filter_ml/model/* ./model/
git add .
git commit -m 'Model Update and Deploy'
git pull --rebase origin develop
git push -f heroku heroku:master
git checkout develop