class Status:
    def __init__(self,statusCode, statusName, statusMsg):
        self.status = statusCode
        self.name = statusName
        self.message = statusMsg

    def toJSON(self):
        return {
            "status": self.status,
            "name": self.name,
            "message": self.message,
        }