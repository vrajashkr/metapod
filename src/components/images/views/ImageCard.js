import React, {Component} from 'react';

class ImageCard extends Component {
	constructor(props){
		super(props);
	}
	render(){		
		return(
			<div className="card">
				<div>
					<div className="card-header">{this.props.name === "" ? this.props.id : this.props.name}</div>
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

export default ImageCard;