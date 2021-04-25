#!/bin/sh
cd /metapod ; BROWSER=none yarn start &
python3 /metapod/backend/server.py
