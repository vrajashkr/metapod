Step 1 : Build the image
	docker build -t "image-name" .

Step 2 : Create a container from the image
	docker run --name "container-name" "image-name"

Step 3 : Execute packet spoofing script
	docker exec "container-name" sh -c "python3 net-raw.py"
	The packet will be sent successfully. 

Step 4 : Drop NET_RAW capability through web portal

Step 5 : Re-execute the command in Step 3, you should now see a permission error. 
