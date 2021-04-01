from flask_restful import Resource
import subprocess
from status import Status
import docker

class ImageScan(Resource):

    def get(self):
        allImages = []
        client = docker.from_env()
        allImages = [i.tags[0] for i in client.images.list(all = False) if len(i.tags) != 0]

        subprocess.Popen(["snyk", "config", "set", "api=4e4de704-21f0-440a-b9a0-5d482b952f25"], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
        subprocess.Popen(["snyk", "config", "set", "disableSuggestions=true"], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
        result = []


        for name in allImages:
            securityCheckProcess = subprocess.Popen(["snyk", "container", "test", name], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
            result.append(securityCheckProcess.communicate()[0].decode("utf-8"))
            result.append("------------------------------------------------------------\n\n")


        response = ' '.join([str(element) for element in result])
        return Status(200, "Success", response).toJSON(), 200