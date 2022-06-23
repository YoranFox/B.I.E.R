from Location import Location


class RobotTransform:
    """
    Transform of robot in the 2d space
    """

    def __init__(self, location, rotation):
        # type: (Location, float) -> None
        self.location = location
        self.rotation = rotation

    def __str__(self):
        return 'Location: ' + str(self.location) + ' | Rotation: ' + str(self.rotation)