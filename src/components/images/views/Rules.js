import {TextField} from '@material-ui/core';

const Rules = [
    {
        "key": "healthcheck",
        "title": "Apply HealthCheck",
        "desc": "Applies a HEALTHCHECK to an image",
        "data": <TextField
                    label="HealthCheck Command"
                    variant="standard"
                    defaultValue="NONE"
                    id="healthcheckcmd"
                />,
        "reader": () => {return {"healthCheckCmd" : document.getElementById("healthcheckcmd").value}}
    },
    {
        "key": "fake",
        "title": "This is a fake",
        "desc": "This is a fake",
        "data": "None",
        "reader": () => {return "None"}
    }
 ];
 
export default Rules;