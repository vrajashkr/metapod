import React, {Component} from 'react';
import classNames from 'classnames';

class Container extends Component {

	isRunning() {
		return this.props.status === 'Running';
	}

	render(){
		// const buttonText = this.isRunning() ? "Stop" : "Start"
		const classVar = this.isRunning() ? "success" : "danger"
		const border = this.isRunning() ? "border-success" : "border-danger"

		const style = classNames('card', `border ${border}`)
		const headerStyle = classNames('card-header', `bg-${classVar}`)
		
		return(
			<div className={style}>
				<div>
					<div className={headerStyle}>{this.props.name}</div>
					<div className="card-body">
						Status: {this.props.status}
						<br />
						Image: {this.props.image}
					</div>
					<div className="card-footer">
						<button className="btn btn-default">More Info</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Container;