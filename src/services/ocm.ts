import * as cp from 'child_process';

export async function ocm(commandLine: string): Promise<Object> {
    const emptyResp = Promise.resolve({});

    try {
        const { stdout, stderr } = await exec(commandLine, {});
        if (stderr && stderr.length > 0) {
            return Promise.reject(stderr);
        }

        if (stdout) {
            let result = stdout.trim();
            try {
                result = JSON.parse(stdout);
            } catch (e) { }
            return Promise.resolve(result);
        }
    } catch (err) {
        let errMsg;
        if (err.stderr) {
            errMsg = err.stderr;
        } else if (err.stdout) {
            errMsg = err.stdout;
        }
        return Promise.reject(errMsg);
    }

    return emptyResp;
}

function exec(command: string, options: cp.ExecOptions): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        cp.exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            }
            resolve({ stdout, stderr });
        });
    });
}
