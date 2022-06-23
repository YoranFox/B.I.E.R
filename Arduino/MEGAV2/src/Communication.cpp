//
// Created by jasper-jan on 09-11-21.
//
#include <Arduino.h>
#include <Wire.h>
#include "Communication.h"

CommsPortUART::CommsPortUART(){
//Set the callback function
    command_processor_callback = &CommandProcessor::distribute_received_command;
}

void CommsPortUART::enableUART(int baudRate) {
    Serial.begin(baudRate);
}
void CommsPortUART::disableUART() {
    Serial.end();
}

void CommsPortUART::reset(int baudRate) {
    Serial.flush();
    disableUART();
    // Reset software receive buffer
    rxBufferReadPtr = 0;
    rxBufferWritePtr = 0;
    rxBufferLength = 0;

    // Reset software transmit buffer
    txBufferReadPtr = 0;
    txBufferWritePtr = 0;
    txBufferLength = 0;

    // Reset receive state machine
    pktBufferLength = 0;pyserial to arduino
    rxCrc = 0;
    rxState = idle;
    enableUART(baudRate);
}

/*
 * recieve any data that is in the HW buffer
 */
void CommsPortUART::update() {
    //recieve any data that is in the HW buffer
    receive();
    //parse all the incoming data
    while(rxBufferLength) parseByte(rxPop());
}
/*
*Transfers data from hardware RX buffer to software RX buffer.
*/
 void CommsPortUART::receive() {
    cli();//stop interrupts
    while(Serial.available()) {
        //we stop if we want to write more to the software rx buffer than there is space available
        if (rxBufferLength >= COMMS_UART_RX_BUFFER_SIZE) {
            break;
        }
        //store the actual bytes
        rxBuffer[rxBufferReadPtr] = Serial.read();
        rxBufferReadPtr++;

        //prevent overflow and wrap to front of buffer
        rxBufferReadPtr %= COMMS_UART_RX_BUFFER_SIZE;
        rxBufferLength++;
    }
    sei();//allow interrupts
}
/*
 Pop a byte from the software receive buffer.
 Number of bytes available can be read from rxBufferLength.
*/
int CommsPortUART::rxPop() {
    //disable interrupts to avoid any nasty surprises along the way.
    cli();//stop interrupts
    int b = -1;
    if (rxBufferLength) {
        b = rxBuffer[rxBufferWritePtr];
        rxBufferWritePtr++;

        //prevent overflow and wrap to front of buffer
        rxBufferWritePtr %= COMMS_UART_RX_BUFFER_SIZE;
        rxBufferLength--;
    }
    sei();//allow interrupts
    return b;
}

void CommsPortUART::rxPacket(char *data, int length) {
    //Callback to the function that processes the isolated received command packet.
    (command_processor.*command_processor_callback)(data,length);
}

void CommsPortUART::print_rx_state(){
    Serial.println(rxState);
}
/*
// Parses a byte, calling rxPacket when a correct packet is received.
*/
 void CommsPortUART::parseByte(char b) {
    if (b == COMMS_PACKET_START) {
        // Start of a new packet
        pktBufferLength = 0;
        rxCrc = 0;
        rxState = receiving;
        return;
    }

    if (rxState == idle) {
        // Byte is not part of a packet
        return;
    }

    if (b == COMMS_PACKET_END) {
        // End of a packet
        if (!rxCrc) {
            rxPacket(&pktBuffer[0], pktBufferLength - 1);
        }
        rxState = idle;
        return;
    }

    if (b == COMMS_PACKET_ESCAPE) {
        // Escape character
        rxState = escaping;
        return;
    }

    if (rxState == escaping) {
        // Previous byte was 0x50, so invert this byte to unescape
        rxState = receiving;
        b = ~b;
    }

    if (pktBufferLength == COMMS_UART_PKT_BUFFER_SIZE) {
        // Packet buffer is full, ignore this packet
        rxState = idle;
        return;
    }

    // Store received byte in buffer
    pktBuffer[pktBufferLength++] = b;

    // Update CRC
    rxCrc = crc8(b, rxCrc);
}

void CommsPortUART::txPacket(char *b, uint8_t len) {

}

void CommsPortUART::txPush(char b) {

}

void CommsPortUART::transmit() {

}
void CommsPortUART::txData(char b, char *crc) {

}

char CommsPortUART::crc8(char crc, char data) {
    // Compute CRC
    crc = crc ^ data;
    for (int i = 0; i < 8; i++) {
        if (crc & 1) {
            crc = (crc >> 1) ^ 0x8c;
        } else {
            crc = (crc >> 1);
        }
    }
    return crc;
}

