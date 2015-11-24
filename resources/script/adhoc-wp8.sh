#!/usr/bin/env bash

npm run build:setup:adhoc
phonegap compile wp8 --release --verbose
npm run build:config:restore