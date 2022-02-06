
#ifndef MEGAV2_COMMUNICATION_H
#define MEGAV2_COMMUNICATION_H

#include "stdio.h"
// Size of the RX buffers. Should be a power of two for speed.
#define COMMS_UART_RX_BUFFER_SIZE 64

// Size of the TX buffers. Should be a power of two for speed.
#define COMMS_UART_TX_BUFFER_SIZE 64

// Size of the packet buffer. Maximum data length in any received
#define COMMS_UART_PKT_BUFFER_SIZE 32
/**
 * Device configuration
 */
// Size of the packet buffer. Maximum data length in any transmitted
#define COMMS_DEVICE_TX_PACKET_SIZE 32

// Packet reserved bytes
#define COMMS_PACKET_START                    0x55
#define COMMS_PACKET_END                      0x5A
#define COMMS_PACKET_ESCAPE                   0x50


class CommsPortUART {
public:

    CommsPortUART();

    /**
     * Enables the uart communication using the arduino Serial library
     * @param baudRate
     */
    void enableUART(int baudRate);

    /**
     * Disables the serial communication
     */
    void disableUART();

    /**
     * restarts the UART communication and clears the FIFO buffer.
     */
    void reset(int baudRate);

    /**
     * Updates the system internal states and cal rxPacket when new data is recieved
     */
    void update();

    /**
     * Sends the packet over the UART.
     * @param b bytes to be send
     * @param len lengt of the data
     */
    void txPacket(char *b, uint8_t len);

    /**
     * Pushes a byte onto the transmit buffer of the atmega. Drops packet if buffer is full.
     * @param b byte of data
     */
    void txPush(char b);

    //for debugging
    void print_rx_state();

protected:
    /**
     *computes the crc
     */
    static char crc8(char crc, char data);

    //RECEIVING END
    //RX buffer
    volatile char rxBuffer[COMMS_UART_RX_BUFFER_SIZE];
    volatile int rxBufferReadPtr;
    volatile int rxBufferWritePtr;
    volatile int rxBufferLength;

    //Packet buffer
    char pktBuffer[COMMS_UART_PKT_BUFFER_SIZE];
    uint8_t pktBufferLength;

    //Receive CRC
    char rxCrc;

    //Receive state
    enum RxState {
        idle = 0,
        receiving = 1,
        escaping = 2
    } rxState;

    //Transfers data from hardware RX buffer to software RX buffer.
    void receive();

    //Pop a byte from the software receive buffer. Number of bytes available can
    //be read from rxBufferLength.
    int rxPop();

    //Function that processes the received packet.
    //Should be something in robot struct probably
    void rxPacket(char *data, int length);

    //Parses a byte, calling rxPacket when a correct packet is received.
    void parseByte(char b);

    //TRANSMITTING END
    //TX buffer
    volatile char txBuffer[COMMS_UART_TX_BUFFER_SIZE];
    volatile int txBufferReadPtr;
    volatile int txBufferWritePtr;
    volatile int txBufferLength;

    // Transfers data from software TX buffer to hardware TX buffer
    void transmit();

    // Transmit data byte (handles escaping) and compute CRC.
    void txData(char b, char *crc);

};




/**
* Author:  Jeroen van Straten
        * Date:    20120602
* Delft Aerospace Rocket Engineering
*
* Modified by Jasper-Jan Lut for project B.I.E.R.
 *
 *
* Communications library for UART based networks between rockets and
        * PCs, designed specifically to enable routing devices such as the ones
        * in Gabriel v2 and Lucifer v2.
*
* PHYSICAL LAYER IMPLEMENTATION
*  - UART, RS232 or RS485 using LPC UART peripheral modules.
*  - UART config: 8 bits, no parity, 1 stop bit
*
* DATA LINK LAYER IMPLEMENTATION
*  - Handles error detection, drops packets of which the checksum
*    fails.
*  - Frame format:
*
*      0x55  Start byte
*      Data  Data, may be of any length as long as the buffers can
        *            handle it.
*      CRC   CRC over the contents of the data section.
*      0x5A  Stop byte
*
*    To ensure uniqueness of 0x55 and 0x5A, the following escape
        *    sequences are applied to the data and CRC fields:
*
*      0x50  -  0x50 0xAF
*      0x55  -  0x50 0xAA
*      0x5A  -  0x50 0xA5
*
*    Or, in other words, these are the ones complement of the original
*    bytes prepended with 0x50.
*
* NETWORK LAYER IMPLEMENTATION (not implemented only communicating with in the sytem)
*/


#endif //MEGAV2_COMMUNICATION_H
