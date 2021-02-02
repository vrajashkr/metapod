import React, {Component} from 'react';
import './App.css';

import ListContainer from './components/listContainer';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runningContainers: [{
                id: '1',
                name: 'test container',
                image: 'some image',
                state: 'running',
                status: 'Running'
            },
            {
                id: '2',
                name: 'test container',
                image: 'some image',
                state: 'running',
                status: 'Running'
            }],
            stoppedContainers: [{
                id: '1',
                name: 'another test container',
                image: 'some image',
                state: 'stopped',
                status: 'Stopped'
            },
            {
                id: '2',
                name: 'another test container',
                image: 'some image',
                state: 'stopped',
                status: 'Stopped'
            }]
        }
    }  

    render() {
        return (
            <div>   
                <ListContainer title="Running Containers" container_list={this.state.runningContainers} />
                <ListContainer title="Stopped Containers" container_list={this.state.stoppedContainers} />
            </div>
        );
    }
}

export default App;
