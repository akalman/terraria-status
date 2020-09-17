const fs = require('fs');
const SSH = require('simple-ssh');
const aws = require('aws-sdk');

const pemfile = 'my.pem';
const ec2 = new aws.EC2();

exports.getInstanceStatus = () => {
    try {
        const params = {
            IncludeAllInstances: true,
            InstanceIds: [ 'i-01805016383fe77b0' ]
        };

        const task = new Promise((resolve, reject) => {
            ec2.describeInstanceStatus(params, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        return task;
    } catch (e) { }
}

exports.startInstance = () => {
    try {
        const params = {
            InstanceIds: [ 'i-01805016383fe77b0' ]
        };

        return new Promise((resolve, reject) => {
                ec2.startInstances(params, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
            .then(res => {
                return new Promise((resolve, reject) => {
                    ec2.waitFor('instanceRunning', {}, (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                });
            });
    } catch (e) { }
}

exports.stopInstance = () => {
    try {
        const params = {
            InstanceIds: [ 'i-01805016383fe77b0' ]
        };

        return new Promise((resolve, reject) => {
                ec2.stopInstances(params, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            })
            .then(res => {
                return new Promise((resolve, reject) => {
                    ec2.waitFor('instanceStopped', {}, (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                });
            });
    } catch (e) { }
}

exports.runSshCommand =  cmd => {
    const ssh = new SSH({
        host: 'terraria.simonspenis.com',
        user: 'ec2-user',
        key: fs.readFileSync(pemfile)
    });

    return new Promise((resolve, reject) => {
        let ourout = '';

        ssh
            .exec(cmd, {
                exit: function() {
                    ourout += "\nsuccessfully exited!";
                    resolve(ourout);
                },
                out: function(stdout) {
                    ourout += stdout;
                }
            })
            .start({
                success: function() {
                    console.log("successful connection!");
                },
                fail: function(e) {
                    console.log("failed connection, boo");
                    console.log(e);
                }
            });
    });
};
