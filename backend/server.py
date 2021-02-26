from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from pymongo import MongoClient
from flask_bcrypt import Bcrypt

import docker
import inspect
import pprint
import json

app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)

def get_necess_data(data, necess_attrs):
    return {
            i: (
                {j: data[i][j] for j in necess_attrs[i] if j in data[i]} 
                if necess_attrs[i] 
                else data[i]
            ) for i in necess_attrs if i in data
        }

class Register(Resource):
    def post(self):
        # cluster = MongoClient("mongodb+srv://admin:admin123@cluster0.ceaix.mongodb.net/metapod?retryWrites=true&w=majority")
        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["users"]
        
        email = request.json['email']
        password = request.json['password']

        if(collection.find_one({'email': email}) is None):
            hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')

            entry = {
                    "email" : email,
                    "password" : hashed_pwd 
                }

            collection.insert_one(entry)

            return {'result': "user registered"}   
        else:
            return {'result': "user already exists"}

class Login(Resource):
    def post(self):
        # cluster = MongoClient("mongodb+srv://admin:admin123@cluster0.ceaix.mongodb.net/metapod?retryWrites=true&w=majority")
        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["users"]

        email = request.json['email']
        password = request.json['password']

        entry = collection.find_one({'email': email})
        
        if(entry is not None):
            result = bcrypt.check_password_hash(entry['password'], password)

            if(result == True):
                return {'result': "user authenticated"}
            else:
                return {'result': "invalid credentials"}

        else:
            return {'result': "user not found"}        


class Containers(Resource):
    def get(self):
        #CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS                   PORTS     NAMES
        #598079914e20   nginx     "/docker-entrypoint.…"   3 hours ago   Exited (0) 3 hours ago             zen_cerf

        # cluster = MongoClient("mongodb+srv://admin:admin123@cluster0.ceaix.mongodb.net/metapod?retryWrites=true&w=majority")
        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        contCollection = db["containers"]

        if(contCollection.count_documents({}) != 0):
            contCollection.delete_many({})

        client = docker.from_env()

        for c in client.containers.list(all = True):
            entry = {
                'ContainerId': c.short_id,
                'Image': c.attrs['Config']['Image'],
                'Command': c.attrs['Path'],
                'Created': c.attrs['Created'],
                'Status': c.status + ' (' + str(c.attrs['State']['ExitCode']) + ') at ' + c.attrs['State']['FinishedAt'],
                'Ports': c.ports,
                'Name': c.name
            }

            contCollection.insert_one(entry)

        rulesCollection = db["rules"]

        allRules = []
        allContainers = []

        if(rulesCollection.count_documents({}) != 0):
            for doc in rulesCollection.find({}):
                allRules.append(doc['name'])

        for rule in allRules:
            if(contCollection.find_one({'Name': rule}) is None):
                rulesCollection.delete_one({'name' : rule}) 
        
        for doc in contCollection.find({}): 
            doc.pop('_id')
            allContainers.append(doc)

        return {'containers' : allContainers}, 200

class Container(Resource):
    def get(self, name):
        client = docker.from_env()
        cont = client.containers.get(name)

        necess_attrs = {
            'AppArmorProfile': [],
            'Config': ['Cmd', 'Entrypoint', 'ExposedPorts', 'Hostname', 'Image', 'User', 'Volumes', 'WorkingDir'],
            'Created': [],
            'HostConfig': ['CapAdd', 'CapDrop', 'Cgroup', 'CgroupParent', 'CpuCount', 'CpuQuota', 'CpuShares', 'CpusetCpus', 'CpusetMems', 'DeviceCgroupRules', 'Devices', 'IOMaximumBandwidth', 'IOMaximumIOps', 'IpcMode', 'MaskedPaths', 'Memory', 'MemoryReservation', 'NetworkMode', 'PortBindings', 'Privileged', 'PublishAllPorts', 'ReadonlyPaths', 'ReadonlyRootfs'],
            'Id': [],
            'Image': [],
            'Mounts': [],
            'Name': [],
            'NetworkSettings': [],
            'State': []
        }

        return get_necess_data(cont.attrs, necess_attrs), 200

class Images(Resource):
    def get(self):
        #REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
        #ubuntu       latest    f63181f19b2f   2 weeks ago   72.9MB

        # cluster = MongoClient("mongodb+srv://admin:admin123@cluster0.ceaix.mongodb.net/metapod?retryWrites=true&w=majority")
        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["images"]

        if(collection.count_documents({}) != 0):
            collection.delete_many({})

        client = docker.from_env()

        for i in client.images.list(all = True):
            entry = {
                'Repository': i.tags[0].split(':')[0] if i.tags else '',
                'Tag': i.tags[0].split(':')[1] if i.tags else '',
                'ImageId': i.short_id.split(':')[1],
                'Created': i.attrs['Created'],
                'Size': round(i.attrs['Size'] / 1000000, 1)
            }

            collection.insert_one(entry)

        allImages = []
        for doc in collection.find({}):
            doc.pop('_id')
            allImages.append(doc)

        return {'images' : allImages}, 200

class Image(Resource):
    def get(self, id_or_name):
        client = docker.from_env()
        img = client.images.get(id_or_name)

        # print('\n\n\n\n\n')
        # for i in inspect.getmembers(img):
        #     if not i[0].startswith('_'):
        #         if not inspect.ismethod(i[1]):  
        #             pprint.pprint(i) 
        # print('\n\n\n\n\n')

        necess_attrs = {
            'Author': [],
            'Config': ['Cmd', 'Entrypoint', 'Env', 'Hostname', 'Image'],
            'Created': [],
            'Id': [],
            'RepoTags': [],
            'Size': [],
            'VirtualSize': []
        }

        return get_necess_data(img.attrs, necess_attrs), 200

class Resources(Resource):
    def post(self, name):
        data = json.loads(request.data.decode("utf-8"))
        cpu_quota = data['CpuQuota']
        mem_limit = data['Memory']
        client = docker.from_env()
        cont = client.containers.get(name)
        cont.update(cpu_quota = cpu_quota, mem_limit = mem_limit)
        return {}, 200

class Rules(Resource):
    def post(self, name):
        data = json.loads(request.data.decode("utf-8"))
        rules = data['Rules']
        rule_action = {
            'Drop NET_RAW': cap_handler('NET_RAW'), 
            'Drop MKNOD': cap_handler('MKNOD')
        }
        for i in rules:
            rule_action[i['RuleName']](name, i['Checked'])
        return {}, 200

def cap_handler(cap):
    def particular_cap_handler(name, checked):
        client = docker.from_env()
        cont = client.containers.get(name)
        cpu_quota = cont.attrs['HostConfig']['CpuQuota']
        mem_limit = cont.attrs['HostConfig']['Memory']
        ports = cont.ports
        image = cont.attrs['Config']['Image']

        if checked:
            cap_drop = [cap]
            if cont.attrs['HostConfig']['CapDrop']:
                cap_drop = list(set(cap_drop) | set(cont.attrs['HostConfig']['CapDrop']))
        if not checked: 
            cap_drop = []
            if cont.attrs['HostConfig']['CapDrop']:
                cap_drop = list(set(cont.attrs['HostConfig']['CapDrop']) - {cap})

        # cluster = MongoClient("mongodb+srv://admin:admin123@cluster0.ceaix.mongodb.net/metapod?retryWrites=true&w=majority")
        cluster = MongoClient('localhost', 27017)

        db = cluster["metapod"]
        collection = db["rules"]

        entry = {
            'type' : "container",
            'name' : name,
            'cpu_quota' : cpu_quota,
            'memory_limit' : mem_limit,
            'cap_drop' : cap_drop
        }

        collection.replace_one({'type': 'container', 'name': name}, entry, upsert=True)
        if (cont.status == "running"):
            cont.stop()
            cont.remove()
            client.containers.run(image = image, name = name, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports, detach=True)
        else:
            cont.remove()
            client.containers.create(image = image, name = name, cap_drop = cap_drop, cpu_quota = cpu_quota, mem_limit = mem_limit, ports = ports)

    return particular_cap_handler

class Execution(Resource):
    def get(self, name, command):
        client = docker.from_env()
        try:
            cont = client.containers.get(name)
        except:
            return {}, 400
        
        try:
            if (command == "start"):
                cont.start()
            elif (command == "stop"):
                cont.stop()
        except:
            return {}, 500
        return {}, 200

class Logs(Resource):
    def get(self, name):
        client = docker.from_env()
        try:
            cont = client.containers.get(name)
        except docker.errors.NotFound:
            return {}, 400
        return {"data":cont.logs().decode('utf-8')}, 200


api.add_resource(Register, '/api/v1/register')
api.add_resource(Login, '/api/v1/login')
api.add_resource(Containers, '/api/v1/containers')
api.add_resource(Container, '/api/v1/containers/<string:name>')
api.add_resource(Images, '/api/v1/images')
api.add_resource(Image, '/api/v1/images/<string:id_or_name>')
api.add_resource(Resources, '/api/v1/containers/<string:name>/resources')
api.add_resource(Rules, '/api/v1/containers/<string:name>/rules')
api.add_resource(Execution, '/api/v1/containers/<string:name>/execute/<string:command>')
api.add_resource(Logs, '/api/v1/containers/<string:name>/logs')

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
