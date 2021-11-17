#!/bin/bash

echo "Container is running!!!"

# this will run the api/service.py file with the instantiated app FastAPI
uvicorn_server() {
    uvicorn api.persistent-folder.artemis.artemis.scripts.service:app --host 0.0.0.0 --port 8080 --log-level debug --reload --reload-dir api/persistent-folder/artemis/artemis/scripts "$@"
}

uvicorn_server_production() {
    pipenv run uvicorn api.persistent-folder.artemis.artemis.scripts.service:app --host 0.0.0.0 --port 8080 --lifespan on
}

export -f uvicorn_server
export -f uvicorn_server_production

echo -en "\033[92mu
The following commands are available:
    uvicorn_server
        Run the Uvicorn Server
\033[0m
"

if [ "${DEV}" = 1 ]; then
  pipenv shell
else
  uvicorn_server_production
fi
