class ImageRule:
    def __init__(self,ruleName, ruleApplicator, expectedArgs, ruleReader):
        self.ruleName = ruleName
        self.ruleApplicator = ruleApplicator
        self.expectedArgs = expectedArgs
        self.ruleReader = ruleReader

    def apply(self, imageName, args):
        return self.ruleApplicator(imageName, args)

    def readState(self, imageName):
        return self.ruleReader(imageName)