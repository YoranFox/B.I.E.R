//
// Created by jasper-jan on 09-11-21.
//
#include <Arduino.h>
#include <Wire.h>
#include "Communication.h"

CommsPortUART::CommsPortUART(){
    //nothing
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
    pktBufferLength = 0;
    rxCrc = 0;
    rxState = idle;
    enableUART(baudRate);
}

void CommsPortUART::update() {
    //recieve any data that is in the HW buffer
    receive();
    //parse all the incoming data
    while(rxBufferLength) parseByte(rxPop());
}

void CommsPortUART::txPacket(char *b, uint8_t len) {

}

void CommsPortUART::txPush(char b) {

}
void CommsPortUART::receive() {

}

int CommsPortUART::rxPop() {

}

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

