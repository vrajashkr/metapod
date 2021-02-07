import React, {Component} from 'react';

class Image extends Component {
	constructor(props){
		super(props);
	}
	render(){		
		return(
			<div>
				<table className="table table-light">
					<tbody>
						<tr>
							<td>{this.props.id}</td>
							<td>{this.props.tags}</td>
							<td>{this.props.repository}</td>
							<td>{this.props.created}</td>
							<td><button className="btn red" onClick={this.props.clickAction}>View</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default Image;