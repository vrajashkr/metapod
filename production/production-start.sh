#!/bin/sh
nginx
cd /metapod ; ./node_modules/.bin/serve -s ./build -p 6000 &
cd backend ; gunicorn --bind 0.0.0.0:5000 --timeout 1200 server:app --error-logfile gunicorn.error.log --access-logfile gunicorn.log --capture-output
