const aws = require('aws-sdk');
const core = require('./core');

exports.start = () => {
    return core.startInstance();
}

exports.stop = () => {
    let cmd = 'sudo systemctl stop terraria';
    return core.runSshCommand('sudo systemctl stop terraria')
        .then(res => new Promise((resolve, reject) => setTimeout(resolve, 1000)))
        .then(res => core.stopInstance());
}

exports.status = () => {
    const params = {
        InstanceIds: [ 'i-01805016383fe77b0' ]
    };

    return core.getInstanceStatus()
        .then(status => {
            const statusName = status.InstanceStatuses[0].InstanceState.Name;
            if ( statusName !== 'running') {
                return `server is currently in ${statusName} state`;
            }

            return core.runSshCommand('sudo systemctl status terraria')
                .then(output => {
                    const stateStr = output.substr(output.indexOf("Active:") + 8, 10);
                    const state = stateStr.substring(0, stateStr.indexOf(" "));
                    return `server is running and terraria is ${state}`;
                });
        });
}
