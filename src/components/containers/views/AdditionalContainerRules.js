import {TextField} from '@material-ui/core';

const AdditionalContainerRules = [
    {
        "key": "RestartPolicy",
        "title": "RestartPolicy",
        "desc": "Apply a restart policy for the container",
        "data": <>
                <TextField
                    label="Restart Policy"
                    variant="standard"
                    defaultValue="no"
                    id="policyName"
                />
                <TextField
                    label="Maximum Retries"
                    variant="standard"
                    defaultValue="0"
                    id="retryCount"
                />
                </>,
        "reader": () => {return {"policyName" : document.getElementById("policyName").value, "retryCount" : document.getElementById("retryCount").value}}
    },
    {
        "key": "SecurityOpts",
        "title": "SecurityOpts",
        "desc": "Apply Security options to the container",
        "data": <TextField
                    label="Security Opt"
                    variant="standard"
                    defaultValue=""
                    id="secopt"
                />,
        "reader": () => {return {"opts" : document.getElementById("secopt").value}}
    },
    {
        "key": "PidsLimit",
        "title": "PidsLimit",
        "desc": "Apply PID Limit to the container and prevent fork bomb attacks",
        "data": <TextField
                    label="PIDs Limit"
                    variant="standard"
                    defaultValue="-1"
                    id="pidlimit"
                />,
        "reader": () => {return {"limit" : document.getElementById("pidlimit").value}}
    }
]

export default AdditionalContainerRules