import os
while True:
	n = os.fork()
	if n > 0:
		print("Parent process, id is : ", os.getpid())
	else:
		print("Child process, id is : ", os.getpid())