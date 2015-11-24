#!/usr/bin/env bash

npm run build:setup:adhoc
phonegap --verbose build wp8
npm run build:config:restore