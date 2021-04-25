from flask_restful import Resource
import subprocess
from status import Status
import docker
import pathlib
import configparser

class ImageScan(Resource):

    def get(self):
        allImages = []
        client = docker.from_env()
        allImages = [i.tags[0] for i in client.images.list(all = False) if len(i.tags) != 0]
        serverDirPath = str(pathlib.Path(__file__).parent.parent.absolute())
        snykExecutablePath = serverDirPath + "/node_modules/.bin/snyk"
        print(f"[INFO] Using Snyk executable at {snykExecutablePath}")

        settingsParser = configparser.ConfigParser()

        with open(serverDirPath+"/backend/settings.config", "r") as settingsFileHandle:
            settingsParser.read_file(settingsFileHandle)

        snykApiKey = settingsParser.get("SNYK", "apiKey")

        if (snykApiKey == ""):
            return Status(500, "Error", "Missing API key for Snyk").toJSON(), 500
        
        print(f"Using Snyk API Key {snykApiKey}")
        subprocess.Popen([snykExecutablePath, "config", "set", f"api={snykApiKey}"], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
        subprocess.Popen([snykExecutablePath, "config", "set", "disableSuggestions=true"], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
        result = []


        for name in allImages:
            securityCheckProcess = subprocess.Popen([snykExecutablePath, "container", "test", name], stdout=subprocess.PIPE, stderr= subprocess.PIPE)
            result.append(securityCheckProcess.communicate()[0].decode("utf-8"))
            result.append("------------------------------------------------------------\n\n")


        response = ' '.join([str(element) for element in result])
        return Status(200, "Success", response).toJSON(), 200