#!/bin/bash
echo ******************************
echo "starting the replica set"
echo ******************************

sleep 10 | echo "sleeping"
monogo mongodb://primary:27017 replica-set-configs.js
