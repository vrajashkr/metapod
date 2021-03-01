from flask_restful import Resource
import subprocess
from status import Status

class Benchmark(Resource):

    def __init__(self):
        self.command = [
            "docker", "run",
            "--rm",
            "--net", "host",
            "--pid", "host",
            "--userns", "host",
            "--cap-add", "audit_control",
            "-e", "DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST",
            "-v", "/etc:/etc:ro",
            "-v", "/usr/bin/containerd:/usr/bin/containerd:ro",
            "-v", "/usr/bin/runc:/usr/bin/runc:ro",
            "-v", "/usr/lib/systemd:/usr/lib/systemd:ro",
            "-v", "/var/lib:/var/lib:ro",
            "-v", "/var/run/docker.sock:/var/run/docker.sock:ro",
            "--label", "docker_bench_security",
            "docker/docker-bench-security",
        ]

    def get(self):
        securityCheckProcess = subprocess.Popen(self.command, stdout=subprocess.PIPE, stderr= subprocess.PIPE)
        result = securityCheckProcess.communicate()
        return Status(200, "Success", result[0].decode("utf-8")).toJSON(), 200