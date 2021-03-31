#!/bin/bash
echo "Creating a new user user1"
adduser user1 -D
echo "creating a file in user1's workspace and storing a secret - $2b$12$ropvpY5WZ0ppT.wJP.HgT.Kr2YKd6F7sj4XqJ47sX/IXtmzGx/dH2"
su - user1 -c "touch supersecret; 
               chmod 600 supersecret; 
               echo "$2b$12$ropvpY5WZ0ppT.wJP.HgT.Kr2YKd6F7sj4XqJ47sX/IXtmzGx/dH2" >> supersecret; 
               exit"
echo "Accessing the secret via Root"
cat /home/user1/supersecret