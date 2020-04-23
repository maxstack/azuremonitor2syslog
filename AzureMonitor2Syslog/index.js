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
    try {
        client.log(JSON.stringify(body), options);
        context.log('message sent successfully');
    }
    catch(err) {
        context.log("error sending message");
    }

    context.done();
};

function GetEnvironmentVariable(name)
{
    return process.env[name];
}
