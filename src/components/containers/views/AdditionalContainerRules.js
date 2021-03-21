import {TextField} from '@material-ui/core';

const AdditionalContainerRules = [
    {
        "key": "Restart Policy",
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
    }
]

export default AdditionalContainerRules