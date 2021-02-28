#!/bin/bash
echo "Creating a device"
echo "running command mknod /dev/fd2 c 1 8"
`mknod /dev/fd2 c 1 8`
if [ $? -eq 0 ];
then
	echo "Device created successfully!"
elif [ $? -eq -1 ];
then 
	echo "Device creation failed!"
fi