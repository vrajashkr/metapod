Step 1 : Build the image

	docker build -t "image-name" .

Step 2 : Create a container from the image

	docker run --name "container-name" "image-name"

	packet will be sent successfully as NET_RAW capability has not been disabled 

Step 4 : Drop NET_RAW capability through web portal

Step 5 : check the logs for the docker container

	docker logs "container-name"
