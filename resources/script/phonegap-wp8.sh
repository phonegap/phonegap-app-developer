#!/usr/bin/env bash

npm run build:setup
phonegap --verbose build wp8
npm run build:config-wp8
