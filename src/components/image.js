import React, {Component} from 'react';

class Image extends Component {
	constructor(props){
		super(props);
	}
	render(){		
		return(
			<div className="card">
				<div>
					<div className="card-header">{this.props.id}</div>
					<div className="card-body">
						Tags: {this.props.tags}
						<br />
						Repository: {this.props.repository}
						<br />
						Created : {this.props.created}
					</div>
					<div className="card-footer">
						<button className="btn red" onClick={this.props.clickAction}>More Info</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Image;