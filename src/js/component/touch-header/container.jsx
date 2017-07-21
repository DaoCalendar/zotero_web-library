'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { itemProp } = require('../../constants/item');
const { connect } = require('react-redux');
const { push } = require('redux-router');
const { triggerEditingItem } = require('../../actions');
const { getCurrentViewFromState } = require('../../state-utils');
const { getCollections, getCollectionsPath } = require('../../state-utils');
const TouchHeader = require('../touch-header');

class TouchHeaderContainer extends React.Component {
	onCollectionSelected(collectionKey) {
		if(collectionKey) {
			this.props.dispatch(push(`/collection/${collectionKey}`));
		} else {
			this.props.dispatch(push('/'));
		}
	}

	onEditingToggled(editing) {
		this.props.dispatch(
			triggerEditingItem(this.props.item.key, editing)
		);
	}

	render() {
		return (
			<TouchHeader 
				onCollectionSelected={ this.onCollectionSelected.bind(this) }
				onEditingToggled={ this.onEditingToggled.bind(this) }
				{ ...this.props }
			/>
		);
	}
}

TouchHeaderContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	push: PropTypes.func.isRequired,
	path: PropTypes.array,
	item: itemProp
};

const mapStateToProps = state => {
	//@TODO: deduplicate into getItem(state)
	var items, item;
	const selectedCollectionKey = 'collection' in state.router.params ? state.router.params.collection : null;
	const selectedItemKey = 'item' in state.router.params ? state.router.params.item : null;	
	const collections = getCollections(state);

	const path = getCollectionsPath(state).map(
		key => {
			const col = collections.find(
				c => c.key === key
			);
			
			return {
				key: col.key,
				label: col.name
			};
		}
	);

	if(selectedCollectionKey && state.items[selectedCollectionKey]) {
		items = state.items[selectedCollectionKey].items;
	}

	if(items && selectedItemKey) {
		item = items.find(i => i.key === selectedItemKey);
		// Push an empty item to the path to force "current" to become empty
		// when an item is selected
		path.push({key: '', label: ''});
	}

	return {
		editing: item && state.items.editing === item.key,
		view: getCurrentViewFromState(state),
		path,
		item
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch,
		push
	};
};

const TouchHeaderWrapped = connect(mapStateToProps, mapDispatchToProps)(TouchHeaderContainer);

module.exports = TouchHeaderWrapped;