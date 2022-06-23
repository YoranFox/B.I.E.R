class Location:

    def __init__(self, x, y):
        # type: (int, int) -> None
        self.x = x
        self.y = y
    
    def __str__(self):
        return '(' + self.x + ', ' + self.y + ')'