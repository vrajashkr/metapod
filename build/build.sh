#!/usr/bin/env bash

## read build mode

# by default dev mode
buildMode=0

while [ $# -gt 0 ]
do
	case $1 in
		-d|--dev) buildMode=0; shift ;;
		-p|--production) buildMode=1;;
		*) echo "[ERR] Unknown build option: $1"; exit 1 ;;
	esac
	shift
done

## functions
buildMetapodBase ()
{
	base=$(basename $PWD)
	if [ "$base" = "build" ]; then
		cd ..
	fi
	docker build -t="metapod/base" -f ./build/base.dockerfile .
}

buildMetapodProduction ()
{
	base=$(basename $PWD)
	if [ "$base" = "build" ]; then
		cd ..
	fi
	docker build -t="metapod-production" -f ./build/production.dockerfile .
}

## Check if Docker exists (on Ubuntu bash)
dockerCheck=$(which docker)
if [ $? -ne 0 ]
then
	echo "[ERR] Docker not installed"
	exit 1
else
	echo "[INFO] Docker installed"
fi

## Check if metapod/base already exists on system
imageCheck=$(docker image ls | grep 'metapod/base')
if [ $? -ne 0 ]
then
	echo "[INFO] metapod/base doesn't exist -> will build from scratch"
	echo "[INFO] Starting metapod/base build process"
	buildMetapodBase
else
	echo "[INFO] metapod/base exists"
fi

## Perform appropriate build
# dev mode
if [ $buildMode -eq 0 ]
then 
	echo "[INFO] DEV mode activated"
	checkContainerExists=$(docker container ls -a | grep 'metapod')
	if [ $? -eq 0 ]; then
		checkContainerRunning=$(docker container ls | grep 'metapod')
		if [ $? -eq 0 ]; then
			echo "[INFO] Container running. Will stop it."
			docker stop metapod-dev
		fi
		echo "[INFO] Container exists. Will delete it."
		docker rm metapod-dev
	fi
	echo "[INFO] Begin container launch."
	docker run -v $(pwd):/metapod -v "/var/run/docker.sock:/var/run/docker.sock:rw" -p 6969:3000 -p 4200:4000 --name=metapod-dev metapod/base
else
	echo "[INFO] Production mode"
	echo "[INFO] Begin production image build"
	buildMetapodProduction
	if [ $? -eq 0 ]; then
		echo "[INFO] Successfully built metapod-production"
	else
		echo "[ERROR] Production image build has failed"
	fi
fi
