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
    }
]

export default AdditionalContainerRules