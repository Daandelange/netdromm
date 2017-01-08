'use strict';

// shared within all Channel classes.
var allChannels = [];

// Constructor
function Channel(address) {  
    this.address = address;

    // define default values
    this.masterSocket = false;
    this.lastUpdated = Date.now(); // in millis
    this.isAvailable = true;
    this.isWriteable = true;

    allChannels.push( address );
}

// methods
Channel.prototype.listAllChannels = function() {
    return allChannels;
};

Channel.prototype.channelExists = function() {
    // to implement
    return false;
};

// export the class
module.exports = Channel;