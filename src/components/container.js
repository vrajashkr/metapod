import React, {Component} from 'react';

class Container extends Component {
	constructor(props){
		super(props);
	}
	render(){		
		return(
			<div className="card">
				<div>
					<div className="card-header">{this.props.name}</div>
					<div className="card-body">
						Status: {this.props.status}
						<br />
						Image: {this.props.image}
					</div>
					<div className="card-footer">
						<button className="btn red" onClick={this.props.clickAction}>More Info</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Container;