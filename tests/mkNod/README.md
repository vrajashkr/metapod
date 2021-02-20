Step 1 : Build the image
	docker build -t "image-name" .

Step 2 : Create a container from the image
	docker run --name "container-name" "image-name"

	Device will be created as MKNOD capability has not been disabled 

Step 4 : Drop MKNOD capability through web portal

Step 5 : check the logs for the docker container
	docker logs "container-name"
