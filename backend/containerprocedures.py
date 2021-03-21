import docker
from status import Status
import json

class ContainerProcedures:
    
    def applyRestartPolicy(containerName, args):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")
        policyName = args[0]
        count = int(args[1])

        if (policyName not in ["on-failure", "always", "no"]):
            return Status(400, "Invalid Request", "Non-existent policy")
        cont.update(restart_policy = {"Name": policyName, "MaximumRetryCount": count})
        return Status(200, "Ok", "Successfully updated restart policy")

    def readRestartPolicy(containerName):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")
        restartPolicy = cont.attrs["HostConfig"].get("RestartPolicy", False)
        return (True, json.dumps(restartPolicy))