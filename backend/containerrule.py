class ContainerRule:
    def __init__(self,ruleName, ruleApplicator, expectedArgs, ruleReader):
        self.ruleName = ruleName
        self.ruleApplicator = ruleApplicator
        self.expectedArgs = expectedArgs
        self.ruleReader = ruleReader

    def apply(self, containerName, args):
        return self.ruleApplicator(containerName, args)

    def readState(self, containerName):
        return self.ruleReader(containerName)