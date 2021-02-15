import React, {Component} from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            register: true,
            login: false
        }
    }

    render() {
       if(this.state.register === true){
            return (
                <div>
                    <h1 style={{textAlign:"center"}}><i className="material-icons">code</i> Metapod </h1>
                    <br/><br/>
                    <div id="register">
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">Register</h2>
                                <Form>
                                    <Form.Group id="email">
                                        <Form.Label style={{fontSize: "2em"}}>Email</Form.Label>
                                        <Form.Control type="email" onChange={this.props.updateEmail} required />
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label style={{fontSize: "2em"}}>Password</Form.Label>
                                        <Form.Control type="password" onChange={this.props.updatePassword} required />
                                    </Form.Group>
                                    <Button className=" w-100" onClick={this.props.register} type="submit">Register</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="w-100 text-center mt-2">
                            <h6> Already have an account? </h6> <h4 style={{cursor:"pointer", color: "#0066ff"}}
                                onClick={() => {
                                    this.setState({register : false});
                                    this.setState({login : true});
                                }}
                            >Log In</h4>
                        </div>
                    </div>
                </div>
            );
       }
       if(this.state.login === true){
            return (
                <div>
                    <h1 style={{textAlign:"center"}}><i className="material-icons">code</i> Metapod </h1>
                    <br/><br/>
                    <div id="login">
                        <Card>
                            <Card.Body>
                                <h2 className="text-center mb-4">Login</h2>
                                <Form>
                                    <Form.Group id="email">
                                        <Form.Label style={{fontSize: "2em"}}>Email</Form.Label>
                                        <Form.Control type="email" onChange={this.props.updateEmail} required />
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label style={{fontSize: "2em"}}>Password</Form.Label>
                                        <Form.Control type="password" onChange={this.props.updatePassword} required />
                                    </Form.Group>
                                    <Button className=" w-100" onClick={this.props.login} type="submit">Login</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <div className="text-center">
                            <h6> Don't have an account? </h6> <h4 style={{cursor:"pointer", color: "#0066ff"}}
                                onClick={() => {
                                    this.setState({register : true});
                                    this.setState({login : false});
                                }}
                            >Register</h4>
                        </div>
                    </div>
                </div>
            );
       } 
    }
}

export default Register;