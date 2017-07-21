'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const Button = require('./ui/button');
const InjectableComponentsEnhance = require('../enhancers/injectable-components-enhancer');

const slots = ['next', 'current', 'previous', 'before-last'];
const empty = {
	key: null,
	label: ''
};

const getSlot = (index, length) => {
	let slotIndex = length - index - 1;
	if(slotIndex < slots.length) {
		let slot = slots[slotIndex];
		return slot;
	} else {
		return '';
	}
};

const isPathChanged = (oldPath, newPath) => {
	let pathUnchanged = oldPath.length === newPath.length && oldPath.every(
		(v, i) => v.key === newPath[i].key
	);
	return !pathUnchanged;
};

class TouchHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: this.mapPathToHeaders(props.path, empty)
		};
	}

	mapPathToHeaders(path, previous) {
		let headers = [ ...path ];

		// add root path at the begining
		headers.unshift({
			key: null,
			label: '/'
		});

		// add previous node at the end. 
		// This is last "current" node when going up the tree, empty otherwise
		headers.push({
			key: previous.key,
			label: previous.label
		});

		// add two empty nodes to cover for root being current
		headers.unshift(empty);
		headers.unshift(empty);

		// assign slots and ids
		headers = headers.map((h, i) => {
			return {
				id: i,
				slot: getSlot(i, headers.length),
				...h
			};
		});

		return headers;
	}

	componentWillReceiveProps(nextProps) {
		if(isPathChanged(this.props.path, nextProps.path)) {
			let previous;
			if(nextProps.path.length < this.props.path.length) {
				previous = this.state.headers[this.state.headers.length - 2];
			} else {
				previous = empty;
			}
			let headers = this.mapPathToHeaders(nextProps.path, previous);
			this.setState({ headers });
		}
	}

	shouldComponentUpdate(nextProps) {
		if(this.props.editing !== nextProps.editing) {
			return true;
		}

		return isPathChanged(this.props.path, nextProps.path);
	}

	collectionSelectedHandler(key, ev) {
		ev && ev.preventDefault();
		this.props.onCollectionSelected(key, ev);
	}

	render() {
		if(this.props.editing) {
			return (
				<header className="touch-header hidden-sm-up">
					<Button
						onClick={ () => this.props.onEditingToggled(false) }
						className="btn-default btn-options"
					>
						Done
					</Button>
				</header>
			);
		} else {
			return (
				<header className="touch-header hidden-sm-up">
					<nav>
						<ul>
							{ this.state.headers.map(header => {
								if(header.slot) {
									return (
										<li data-id={ header.id} className={ header.slot } key={ header.id } tabIndex="0">
											<div className="center-axis">
												<div className="inner" onClick={ ev => this.collectionSelectedHandler(header.key, ev) }>
													{ header.label }
												</div>
											</div>
										</li>
									);
								} else {
									return null;
								}
							}) }
						</ul>
					</nav>
					{ (() => {
						return this.props.view === 'item-details' && (
							<Button
								onClick={ () => this.props.onEditingToggled(true) }
								className="btn-default btn-options"
							>
								Edit
							</Button>
						);
					})() }
				</header>
			);
		}
	}
}

TouchHeader.propTypes = {
	onCollectionSelected: PropTypes.func,
	onEditingToggled: PropTypes.func,
	path: PropTypes.array,
	editing: PropTypes.bool,
	view: PropTypes.string
};

TouchHeader.defaultProps = {
	path: []
};

module.exports = InjectableComponentsEnhance(TouchHeader);