// Forward Sentinel Alerts to Syslog

module.exports = function (context, sentinelMessage) {
    // initializing syslog
    var syslog = require("syslog-client");

    // getting environment variables
    var SYSLOG_SERVER = GetEnvironmentVariable("SYSLOG_SERVER");
    var SYSLOG_PROTOCOL;
    if (GetEnvironmentVariable("SYSLOG_PROTOCOL")=="TCP") {
        SYSLOG_PROTOCOL = syslog.Transport.Tcp;
    } else {
        SYSLOG_PROTOCOL = syslog.Transport.Udp;
    }

    var SYSLOG_HOSTNAME;
    if (GetEnvironmentVariable("SYSLOG_HOSTNAME")=="") {
        SYSLOG_HOSTNAME = "azurefunction"
    } else {
        SYSLOG_HOSTNAME = GetEnvironmentVariable("SYSLOG_HOSTNAME");
    }

    var SYSLOG_PORT = GetEnvironmentVariable("SYSLOG_PORT");

    // options for syslog connection
    var options = {
        syslogHostname: SYSLOG_HOSTNAME,
        transport: SYSLOG_PROTOCOL,
        port: SYSLOG_PORT
    };

    // log connection variables
    context.log('SYSLOG Server: ', SYSLOG_SERVER);
    context.log('SYSLOG Port: ', SYSLOG_PORT);
    context.log('SYSLOG Protocol: ', SYSLOG_PROTOCOL);
    context.log('SYSLOG Hostname: ', SYSLOG_HOSTNAME);

    // log received message from sentinel
    context.log('Sentinel trigger function processed message: ', sentinelMessage);

    // create syslog client
    var client = syslog.createClient(SYSLOG_SERVER, options);

    // capture the boy of the request
    var body = sentinelMessage.body

    // send to syslog server
    var message = "something is wrong with the rsyslog daemon";
 
    client.log(JSON.stringify(body), options, function(error) {
        if (error) {
            console.error(error);
        } else {
            console.log("sent message successfully");
        }
    });

    context.done();
};

function GetEnvironmentVariable(name)
{
    return process.env[name];
}
