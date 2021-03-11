import { TableRow, TableHead, Button, Typography, Checkbox, CircularProgress, Grid, Snackbar } from '@material-ui/core';
import React from 'react';
import Rules from './Rules';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ImageRules(props){

    const [fullDisable, setFullDisable] = React.useState(true);
    const [applied, setApplied] = React.useState(Array(Rules.length).fill(false));
    const [appliedData, setAppliedData] = React.useState(Array(Rules.length).fill(""));

    const findAppliedRules = (imageName) => {
        let appliedRules = Array(Rules.length).fill(false);
        let appliedRuleData = Array(Rules.length).fill("");
        //DB Query
        fetch("/api/v1/images/"+imageName+"/rules", {
            method: "get",
        }).then((response) => { 
            response.json().then(data => {
                if (response.status === 200){
                    let dbRules = data["data"];
                    for (let i = 0; i < Rules.length; i++){
                        if (Object.keys(dbRules).includes(Rules[i]["title"])){
                            // the rule has been applied
                            appliedRules[i] = true;
                            appliedRuleData[i] = dbRules[Rules[i]["title"]];
                        }
                    }
                    setApplied(appliedRules);
                    setAppliedData(appliedRuleData);
                    console.log(appliedRuleData);
                    setFullDisable(false);
                }
            })
        })
    }

    React.useEffect(() => {
        if (props.modaldata["ImageName"] !== "") {
            findAppliedRules(props.modaldata["ImageName"])
        };
     }, []);

    const tableHeadings = [
        "Index",
        "Rule",
        "Description",
        "Current Additional Data",
        "Additional Data",
        "Applied?",
    ];

    const handleChange = (index) => {
        let newApplication = applied.map(e => {return e});
        if (applied[index] === false){
            newApplication[index] = true;
        }else{
            newApplication[index] = false;
        }
        console.log(newApplication);
        setApplied(newApplication);
    };

    const [processing, setProcessing] = React.useState(false);

    const handleApplyChange = () => {
        // Create JSON and make request
        let dataJSON = {
            "Rules": []
        };

        for (let i = 0; i < Rules.length; i++){
            dataJSON["Rules"].push({"RuleName": Rules[i].title, "Checked": applied[i], "Args": Rules[i].reader()});
        }

        console.log(dataJSON);
        setProcessing(true);
        
        fetch("/api/v1/images/"+props.modaldata["ImageName"]+"/rules", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJSON)

        }).then((response) => { 

            console.log(response);
            setProcessing(false);
            if (response.status === 200){
                handleSnackOpen("Success!", "success");
            }else{
                handleSnackOpen("An error has occurred!", "error");
            }

        }).catch(error => {
            console.log(error);
            setProcessing(false);
            handleSnackOpen("A next-level error has occurred", "error");
        });
    };

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("");
    
    const handleSnackOpen= (message, severity) => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
        setTimeout(() => {
            setSnackOpen(false);
        }, 5000);
    }


    return (
        <>
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableHead>
                    <TableRow>
                        {
                            tableHeadings.map(heading =>
                                <TableCell>
                                    <Typography>
                                        {heading}
                                    </Typography>
                                </TableCell>
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        Rules.map((entry,index) =>
                            <TableRow>
                                <TableCell>
                                    <Typography>
                                        {index}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {entry["title"]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {entry["desc"]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        {
                                            appliedData[index] === ""
                                            ?
                                            "N/A"
                                            :
                                            appliedData[index]
                                        }
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        {entry["data"]}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={applied[index]}
                                        onClick={() => {handleChange(index)}}
                                        disabled={fullDisable}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <Grid container alignItems="center" justify="center" direction="column" spacing={3}>
            <Grid item xs={12}>
                <Button style={{marginTop:"2em"}} disabled={processing} color="secondary" variant='contained' onClick={handleApplyChange}>Apply Rule Changes</Button>
            </Grid>
            {
                processing 
                ?
                <Grid item xs={12}> 
                    <CircularProgress/> 
                </Grid>
                : 
                <></>
            }
        </Grid>
        <Snackbar open={snackOpen} anchorOrigin={{"vertical": "top", "horizontal":"right" }}>
                <Alert severity={snackSeverity}>
                    {snackMessage}
                </Alert>
        </Snackbar>
        </>
    );
}