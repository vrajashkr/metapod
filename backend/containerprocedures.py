import docker
from status import Status
import json
from pymongo import MongoClient

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

    def applySecurityOpts(containerName, args):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")

        opts = []
        opts.append(args[0])

        # Get container data
        cpu_quota = cont.attrs['HostConfig']['CpuQuota']
        mem_limit = cont.attrs['HostConfig']['Memory']
        ports = cont.ports
        image = cont.attrs['Config']['Image']
        cap_drop = cont.attrs['HostConfig']['CapDrop']

        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["rules"]

        entry = {
            'type' : "container",
            'name' : containerName,
            'cpu_quota' : cpu_quota,
            'memory_limit' : mem_limit,
            'cap_drop' : cap_drop
        }

        collection.replace_one({'type': 'container', 'name': containerName}, entry, upsert=True)
        if (cont.status == "running"):
            cont.stop()
            cont.remove()
            client.containers.run(image = image, name = containerName, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports, detach=True, security_opt=opts)
        else:
            cont.remove()
            client.containers.create(image = image, name = containerName, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports, security_opt=opts)
        return Status(200, "Ok", "Successfully updated security opts")


    def readSecurityOpts(containerName):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")
        securityOpts = cont.attrs["HostConfig"].get("SecurityOpt", False)
        if securityOpts:
            return (True, json.dumps(securityOpts))
        return (False, "N/A")

    def applyPidsLimit(containerName, args):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")

        pidLimit = int(args[0])

        # Get container data
        cpu_quota = cont.attrs['HostConfig']['CpuQuota']
        mem_limit = cont.attrs['HostConfig']['Memory']
        ports = cont.ports
        image = cont.attrs['Config']['Image']
        cap_drop = cont.attrs['HostConfig']['CapDrop']
        security_opt = cont.attrs['HostConfig'].get('SecurityOpt', [])

        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["rules"]

        entry = {
            'type' : "container",
            'name' : containerName,
            'cpu_quota' : cpu_quota,
            'memory_limit' : mem_limit,
            'cap_drop' : cap_drop
        }

        collection.replace_one({'type': 'container', 'name': containerName}, entry, upsert=True)
        if (cont.status == "running"):
            cont.stop()
            cont.remove()
            client.containers.run(image = image, name = containerName, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports, detach=True, security_opt=security_opt, pids_limit=pidLimit)
        else:
            cont.remove()
            client.containers.create(image = image, name = containerName, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports, security_opt=security_opt, pids_limit=pidLimit)
        return Status(200, "Ok", "Successfully updated PIDs limit")


    def readPidsLimit(containerName):
        client = docker.from_env()
        cont = None
        try:
            cont = client.containers.get(containerName)
        except:
            return Status(400, "Invalid Request", "Container not found")
        pidsLimit = cont.attrs["HostConfig"].get("PidsLimit", False)
        if pidsLimit:
            return (True, pidsLimit)
        return (False, "N/A")