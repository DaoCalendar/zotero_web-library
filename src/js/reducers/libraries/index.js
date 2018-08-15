'use strict';

const collections = require('./collections');
const deleting = require('./deleting');
const fetching = require('./fetching');
const items = require('./items');
const itemsByCollection = require('./items-by-collection');
const itemsByParent = require('./items-by-parent');
const itemsTop = require('./items-top');
const itemsTrash = require('./items-trash');
const updating = require('./updating');
const tags = require('./tags');
const tagsByCollection = require('./tags-by-collection');
const tagCountByCollection = require('./tag-count-by-collection');
const itemCountByCollection = require('./item-count-by-collection');
const tagsFromSettings = require('./tags-from-settings.js');
const version = require('./version');
const { get } = require('../../utils');
const actions = Object.entries(require('../../constants/actions'))
		.map(([key, value]) => ([
			'ERROR_CHILD_ITEMS',
			'ERROR_COLLECTIONS_IN_LIBRARY',
			'ERROR_CREATE_ITEM',
			'ERROR_DELETE_COLLECTION',
			'ERROR_DELETE_ITEM',
			'ERROR_DELETE_ITEMS',
			'ERROR_FETCH_ITEMS',
			'ERROR_ITEMS_IN_COLLECTION',
			'ERROR_TOP_ITEMS',
			'ERROR_UPDATE_COLLECTION',
			'ERROR_UPDATE_ITEM',
			'PRE_UPDATE_COLLECTION',
			'PRE_UPDATE_ITEM',
			'RECEIVE_ADD_ITEMS_TO_COLLECTION',
			'RECEIVE_CHILD_ITEMS',
			'RECEIVE_COLLECTIONS_IN_LIBRARY',
			'RECEIVE_CREATE_COLLECTION',
			'RECEIVE_CREATE_ITEM',
			'RECEIVE_DELETE_COLLECTION',
			'RECEIVE_DELETE_ITEM',
			'RECEIVE_DELETE_ITEMS',
			'RECEIVE_FETCH_ITEMS',
			'RECEIVE_ITEMS_IN_COLLECTION',
			'RECEIVE_MOVE_ITEMS_TRASH',
			'RECEIVE_RECOVER_ITEMS_TRASH',
			'RECEIVE_TOP_ITEMS',
			'RECEIVE_TRASH_ITEMS',
			'RECEIVE_UPDATE_COLLECTION',
			'RECEIVE_UPDATE_ITEM',
			'REQUEST_CHILD_ITEMS',
			'REQUEST_COLLECTIONS_IN_LIBRARY',
			'REQUEST_CREATE_ITEM',
			'REQUEST_DELETE_COLLECTION',
			'REQUEST_DELETE_ITEM',
			'REQUEST_DELETE_ITEMS',
			'REQUEST_FETCH_ITEMS',
			'REQUEST_ITEMS_IN_COLLECTION',
			'REQUEST_TOP_ITEMS',
			'REQUEST_UPDATE_COLLECTION',
			'REQUEST_UPDATE_ITEM',
			'TRIGGER_EDITING_ITEM',
			'REQUEST_LIBRARY_SETTINGS',
			'RECEIVE_LIBRARY_SETTINGS',
			'RECEIVE_TAGS_IN_COLLECTION',
			'RECEIVE_TAGS_IN_LIBRARY',
	]).includes(key) ? value : false).filter(Boolean);

const libraries = (state = {}, action) => {
	if(actions.includes(action.type)) {
		return {
			...state,
			[action.libraryKey]: {
				collections: collections(get(state, [action.libraryKey, 'collections']), action),
				deleting: deleting(get(state, [action.libraryKey, 'deleting']), action),
				fetching: fetching(get(state, [action.libraryKey, 'fetching']), action),
				itemCountByCollection: itemCountByCollection(get(state, [action.libraryKey, 'itemCountByCollection']), action),
				items: items(get(state, [action.libraryKey, 'items']), action),
				itemsByCollection: itemsByCollection(get(state, [action.libraryKey, 'itemsByCollection']), action),
				itemsByParent: itemsByParent(get(state, [action.libraryKey, 'itemsByParent']), action),
				itemsTop: itemsTop(get(state, [action.libraryKey, 'itemsTop']), action),
				itemsTrash: itemsTrash(get(state, [action.libraryKey, 'itemsTrash']), action),
				tagCountByCollection: tagCountByCollection(get(state, [action.libraryKey, 'tagCountByCollection']), action),
				tags: tags(get(state, [action.libraryKey, 'tags']), action),
				tagsByCollection: tagsByCollection(get(state, [action.libraryKey, 'tagsByCollection']), action),
				tagsFromSettings: tagsFromSettings(get(state, [action.libraryKey, 'tagsFromSettings']), action),
				updating: updating(get(state, [action.libraryKey, 'updating']), action),
				version: version(get(state, [action.libraryKey, 'version']), action),
			}
		}
	} else { return state; }
}

module.exports = libraries;
