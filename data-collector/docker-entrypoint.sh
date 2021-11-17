#!/bin/bash

# we're running a bash script here, and we're letting the user know that the Docker container is running (as specified in docker-shell.sh script)
echo "Data Collector is running!!!"

# activating the pipenv shell
# source: https://docs.pipenv.org/
pipenv shell