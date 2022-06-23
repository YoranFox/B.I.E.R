from enum import Enum, unique

from location import Location

@unique
class OrderState(Enum):
    NOT_STARTED = 0,
    MOVING_TO_FRIDGE = 1,
    GETTING_BIER = 2,
    MOVING_TO_LOCATION = 3,
    DONE = 4

class Order:

    def __init__(self, location, bier_id):
        # type: (Location, int) -> None
        self.location = location
        self.bier_id = bier_id
        self.state = OrderState.NOT_STARTED

    def __str__(self):
        return 'Order: location-' + str(self.location) + ' | ' + 'bier_id-' + str(self.bier_id)

    def set_state(self, state):
        # type: (OrderState) -> None
        self.state = state