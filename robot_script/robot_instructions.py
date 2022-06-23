class RobotInstructions:
    
    def __init__(self):
        self.rotation_speed = 0.0
        self.move_speed = 0.0
        self.direction = 0.0

    def set_move_speed(self, move_speed):
        # type: (float) -> None
        """
        speed between -1.0 and 1.0
        """
        self.speed = move_speed

    def set_rotation_speed(self, rotation_speed):
        # type: (float) -> None
        """
        rotation speed between -1.0 and 1.0
        """
        self.rotation_speed = rotation_speed

    def set_direction(self, direction):
        # type: (float) -> None
        """
        direction between -1.0 and 1.0
        """
        self.direction = direction

    def get_instructions(self):
        # type: () -> dict
        """
        Returns a dictionary with the instruction values for the arduino
        """

        # TODO calculations with the values in the object (success jj xD)

        return {
            "wheel_front_left": 0,
            "wheel_front_right": 0,
            "wheel_back_left": 0,
            "wheel_back_right": 0, 
        }