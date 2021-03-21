import {TextField, Select, InputLabel, MenuItem, Chip} from '@material-ui/core';

const AdditionalContainerRules = [
    {
        "key": "RestartPolicy",
        "title": "RestartPolicy",
        "desc": "Apply a restart policy for the container",
        "data": function data(props){
                    return(
                        <>
                        <InputLabel id="policyNameLabel">Policy Name</InputLabel>
                        <Select
                            labelId="policyNameLabel"
                            id="policyName"
                            value={props.restartPolicy}
                            onChange={props.setRestartPolicy}
                            >
                            <MenuItem value={'no'}>Never</MenuItem>
                            <MenuItem value={'on-failure'}>On Failure</MenuItem>
                            <MenuItem value={'always'}>Always</MenuItem>
                        </Select>
                        <TextField
                            label="Maximum Retries"
                            variant="standard"
                            defaultValue="0"
                            id="retryCount"
                        />
                        </>
                    );
                },
        "reader": (props) => {return ( {"policyName" : props.restartPolicy, "retryCount" : document.getElementById("retryCount").value})}
    },
    {
        "key": "SecurityOpts",
        "title": "SecurityOpts",
        "desc": "Apply Security options to the container",
        "data": function data(props){
                    return( 
                        <>
                        <InputLabel id="secOptsLabel">Security Options</InputLabel>
                        <Select
                            multiple
                            labelId="secOptsLabel"
                            id="secopt"
                            value={props.secopts}
                            onChange={props.setSecOpts}
                            renderValue={(selected) => (
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </div>
                              )}
                            >
                            <MenuItem value={'no-new-privileges'}>No new privileges</MenuItem>
                        </Select>
                        </>);
                },
        "reader": (props) => {return ({"opts" : props.secopts})}
    },
    {
        "key": "PidsLimit",
        "title": "PidsLimit",
        "desc": "Apply PID Limit to the container and prevent fork bomb attacks",
        "data": function data(props){
                    return(<TextField
                            label="PIDs Limit"
                            variant="standard"
                            defaultValue="-1"
                            id="pidlimit"
                        />);
                },
        "reader": (props) => {return {"limit" : document.getElementById("pidlimit").value}}
    }
]

export default AdditionalContainerRules