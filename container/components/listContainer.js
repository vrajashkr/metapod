import React from 'react';
import Container from './container';

const ListContainer = (props) => {
	return (
		<div>
			<p>{props.title}</p>
			<div style={{display: "grid", margin: "20px 0 50px 0",
    		gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gridGap: '1em'}}>
				{
					props.container_list.map((cont, i) => {
						return <Container 
									key = {i}
									name = {cont.name}
									status = {cont.status}
									image = {cont.image}
							   />
					})
				}
			</div>
		</div>
	)
}

export default ListContainer;