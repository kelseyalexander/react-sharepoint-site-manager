import React from 'react';
import { NavLink } from "react-router-dom";
import SharePointNavigation from './sharepoint-navigation';
import './styles/navigation.scss';

export default class Navigation extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<nav className="Navigation">
			    <ul className="nav-items">
			        <li className="nav-item"><NavLink exact={true} activeClassName='is-active' to="/">Home</NavLink></li>
					<li className="nav-item"><NavLink activeClassName='is-active' to="/lists">Manage Lists</NavLink></li>
			    </ul>

			    <SharePointNavigation/>
			</nav>
		)
	}
}