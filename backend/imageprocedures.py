import docker
from status import Status
from io import BytesIO

class ImageProcedures:
    
    def createHealthCheck(imageName, args):
        healthCheckCmd = args[0]
        '''
            Get image
            Create a new Dockerfile
            Build a new image with the same tag
        '''
        client = docker.from_env()
        image = None
        try:
            image = client.images.get(imageName)
        except docker.errors.ImageNotFound:
            return Status(400, "Invalid Request", "Image Not Found")
        
        dockerFileString = "FROM " + imageName + "\n"
        
        if (healthCheckCmd == None or healthCheckCmd == "NONE"):
            #No healthcheck
            dockerFileString += "HEALTHCHECK NONE"
        else:
            dockerFileString += "HEALTHCHECK CMD " + healthCheckCmd
        
        dockerFile = BytesIO(dockerFileString.encode('utf-8'))
        try:
            client.images.build(fileobj = dockerFile, tag = imageName, forcerm = True)
        except docker.errors.BuildError:
            return Status(500, "Error", "Image Rebuild Failed")
        
        return Status(200,"Ok", "Success")
    
    def readHealthCheck(imageName):
        client = docker.from_env()
        image = None
        try:
            image = client.images.get(imageName)
        except docker.errors.ImageNotFound:
            return False, None
        if ("Healthcheck" in image.attrs['Config']):
            #Healthcheck present
            return True, " ".join(image.attrs["Config"]["Healthcheck"]["Test"])
        return False, None