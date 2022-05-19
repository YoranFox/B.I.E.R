import main as m



def main_loop():

    # state machine for actions

    # IDLE

        # check api state for new action

        # if action -> generate action list

            # do actions

    # ACTION

        # MOVING

            # calculate latest location with all data we have

            # update path to take

            # update arduino state

        # WAIT

            # check if wait function is ok

            # if ok -> do next action

        # LOAD

            # Beverage loading on robot (custom logic)
        
        # CHARGE

            # charging logic

    # OFF (charging, chosen that the robot is off)

        # first loop shut down battery eating functions and modules

    # ERROR

        # unable to handle error or exception

        # needs manual reset

    # check api state for interupts

        # api call every 5 seconds probably in seperate process to update api state