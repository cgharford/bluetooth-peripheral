// External requirements and dependencies
var util = require('util');
var bleno = require('/playpen/node_modules/bleno');
var child_process = require('child_process');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

// Initially set notifications off (not subscribed yet)
var notify = 0;

// Defines the Uptime characteristic and descriptor
var UptimeCharacteristic = function() {
    // Give the characteristic a random uuid and make it readable/notifiable
    // Value is initially null, will be changed on first read or subscription request
    UptimeCharacteristic.super_.call(this, {
        uuid: '1234',
        properties: ['notify', 'read'],
        value: null,

        // Returns the current system uptime on a read request
        onReadRequest: function(offset, callback) {
            // Get the system uptime and convert to minutes by calling a shell command 
            // synchronously with exec and parsing the output
            var result = child_process.execSync('cat /proc/uptime');
            var uptime = result.toString();
            var arr = uptime.match(/\S+/g);
            uptime = (arr[0]/60).toFixed(2);  

            // Get the system load average for the past 15 minutes by calling a 
            // shell command synchronously with exec and parsing the output
            result = child_process.execSync('uptime');
            loadAverage = result.toString();
            arr = loadAverage.match(/\S+/g);
            uptime += ", " + arr[9];

            console.log('UptimeCharacteristic & load avg- onReadRequest -  values: ' + uptime);

            // Puts the uptime into a buffer and updates the characteristic's values
            var data = new Buffer(uptime.length);
            data.write(uptime);
            callback(this.RESULT_SUCCESS, data);
        },

        // When user subscribes, update the uptime value every 5 seconds until they 
        // unsubscribe or until the device disconnects
        onSubscribe:  function(maxSize, updateValueCallback){
            console.log('UptimeCharacteristic - onSubscribed');
            notify = 1;
            var interval = setInterval(function() {
                // If notify has been set to false, stop the interval notifiations 
                if (!Boolean(notify)) {
                    clearInterval(interval);
                }
                // Put the uptime value into a buffer and update the characteristic value
                var result = child_process.execSync('cat /proc/uptime');
                var uptime = result.toString();
                var arr = uptime.match(/\S+/g);
                uptime = (arr[0]/60).toFixed(2);

                result = child_process.execSync('uptime');
                loadAverage = result.toString();
                arr = loadAverage.match(/\S+/g);
                uptime += ", " + arr[9];

                var data = new Buffer(uptime.length);
                data.write(uptime);

                console.log("Updated uptime & load avg values (subscribed): " + data);
                updateValueCallback(data);
            }, 5000);
        },

        // When unsubscribed, set notify to false to end the notifications in 
        // the setInterval function 
        onUnsubscribe: function () {
            console.log('UptimeCharacteristic - onUnsubscribe');
            notify = 0;
        },

        // Characteristic user description that specifies format of information
        descriptors: [
            new Descriptor({
                uuid: '2902',
                value: "Current system uptime in minutes and system load average for the past 15 minutes"
            })
        ]
    });
    this._value = new Buffer(0);
};

// Sets the notify variable to turn notifications on/off
setNotify = function(value){
    notify = value;
};

util.inherits(UptimeCharacteristic, BlenoCharacteristic);

// Export UptimeCharacteristic and setNotify function
module.exports = UptimeCharacteristic;
module.exports.setNotify = setNotify;
