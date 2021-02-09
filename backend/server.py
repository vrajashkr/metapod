from flask import Flask, jsonify
from flask_restful import Api, Resource
import docker
import inspect
import pprint

app = Flask(__name__)
api = Api(app)

class Containers(Resource):
    def get(self):
        #CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS                   PORTS     NAMES
        #598079914e20   nginx     "/docker-entrypoint.…"   3 hours ago   Exited (0) 3 hours ago             zen_cerf
        client = docker.from_env()
        cont_list = client.containers.list(all = True)
        cont_list = [{
                'ContainerId': c.short_id,
                'Image': c.image.tags[0].split(':')[0],
                'Command': c.attrs['Path'],
                'Created': c.attrs['Created'],
                'Status': c.status + ' (' + str(c.attrs['State']['ExitCode']) + ') at ' + c.attrs['State']['FinishedAt'],
                'Ports': c.ports,
                'Name': c.name
            } for c in cont_list]
        return jsonify({'containers' : cont_list})

class Container(Resource):
    def get(self,id):
        client = docker.from_env()
        cont = client.containers.get(id)
        
        print('\n\n\n\n\n')
        for i in inspect.getmembers(cont):
            if not i[0].startswith('_'):
                if not inspect.ismethod(i[1]):  
                    pprint.pprint(i) 
        print('\n\n\n\n\n')
        
        return cont.attrs, 200

class Images(Resource):
    def get(self):
        #REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
        #ubuntu       latest    f63181f19b2f   2 weeks ago   72.9MB
        client = docker.from_env()
        img_list = client.images.list(all = True)
        img_list = [{
                'Repository': i.tags[0].split(':')[0],
                'Tag': i.tags[0].split(':')[1],
                'ImageId': i.short_id.split(':')[1],
                'Created': i.attrs['Created'],
                'Size': round(i.attrs['Size'] / 1000000, 1)
            } for i in img_list]
        return jsonify({'images' : img_list})

class Image(Resource):
    def get(self,id):
        client = docker.from_env()
        img = client.images.get(id)

        print('\n\n\n\n\n')
        for i in inspect.getmembers(img):
            if not i[0].startswith('_'):
                if not inspect.ismethod(i[1]):  
                    pprint.pprint(i) 
        print('\n\n\n\n\n')

        return img.attrs, 200

api.add_resource(Containers, '/api/v1/containers')
api.add_resource(Container, '/api/v1/containers/<string:id>')
api.add_resource(Images, '/api/v1/images')
api.add_resource(Image, '/api/v1/images/<string:id>')

if __name__ == '__main__':
    app.run(debug=True)
    #app.run(host='0.0.0.0', port=80, debug=True)
