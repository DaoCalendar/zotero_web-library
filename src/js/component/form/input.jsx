/* eslint-disable react/no-deprecated */
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { noop } from '../../utils';
import { pick } from '../../common/immutable';
import AutoResizer from './auto-resizer';
import Spinner from '../ui/spinner';
import Suggestions from './suggestions';

class Input extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			hasCancelledSuggestions: false,
			value: props.value
		};
		this.suggestions = React.createRef();
	}

	cancel(event = null) {
		this.props.onCancel(this.hasChanged, event);
		this.hasBeenCancelled = true;
		this.input.blur();
	}

	commit(event = null) {
		this.props.onCommit(this.state.value, this.hasChanged, event);
		this.hasBeenCommitted = true;
	}

	focus() {
		if(this.input != null) {
			this.input.focus();
			this.props.selectOnFocus && this.input.select();
		}
	}

	UNSAFE_componentWillReceiveProps({ value }) {
		if (value !== this.props.value) {
			this.setState({ value });
		}
	}

	handleChange({ target }) {
		this.setState({
			hasCancelledSuggestions: false,
			value: target.value,
		});
		this.props.onChange(target.value);
	}

	handleBlur(event) {
		if(event.relatedTarget && event.relatedTarget.dataset.suggestion) {
			return;
		}
		const shouldCancel = this.props.onBlur(event);
		if (this.hasBeenCancelled || this.hasBeenCommitted) { return; }
		shouldCancel ? this.cancel(event) : this.commit(event);
	}

	handleFocus(event) {
		this.props.selectOnFocus && event.target.select();
		this.props.onFocus(event);
	}

	handleKeyDown(event) {
		const { suggestions } = this.props;
		const { hasCancelledSuggestions } = this.state;
		switch (event.key) {
			case 'Escape':
				if(suggestions.length && !hasCancelledSuggestions) {
					this.setState({ hasCancelledSuggestions: true });
					event.stopPropagation();
				} else {
					this.cancel(event);
				}
			break;
			case 'Enter':
				if(suggestions.length && !hasCancelledSuggestions) {
					const value = this.suggestions.current.getSuggestion() || this.state.value;
					event.persist();
					this.setState({ value }, () => this.commit(event));
				} else {
					this.commit(event);
				}
			break;
		}
		this.props.onKeyDown(event);
	}

	handleSuggestionSelect = (suggestion, event) => {
		event.persist();
		this.setState({ value: suggestion }, () => this.commit(event));
	}

	get value() {
		return this.state.value;
	}

	get hasChanged() {
		return this.state.value !== this.props.value;
	}

	renderInput() {
		this.hasBeenCancelled = false;
		this.hasBeenCommitted = false;

		const inputProps = {
			disabled: this.props.isDisabled,
			onBlur: this.handleBlur.bind(this),
			onChange: this.handleChange.bind(this),
			onFocus: this.handleFocus.bind(this),
			onKeyDown: this.handleKeyDown.bind(this),
			readOnly: this.props.isReadOnly,
			ref: input => this.input = input,
			required: this.props.isRequired,
			value: this.state.value,
			...pick(this.props, ['autoFocus', 'className', 'form', 'id', 'inputMode', 'max',
				'maxLength', 'min', 'minLength', 'name', 'placeholder', 'type', 'spellCheck',
				'step', 'tabIndex']),
			...pick(this.props, key => key.match(/^(aria-|data-).*/))
		};

		const shouldUseSuggestions = !this.state.hasCancelledSuggestions && this.props.suggestions.length;

		var input = shouldUseSuggestions ? (
			<Suggestions
				onSelect={ this.handleSuggestionSelect }
				ref={ this.suggestions }
				inputProps={ inputProps }
				{ ...pick(this.props, ['suggestions']) }
			/>
		) : (
			<input { ...inputProps } />
		);

		if(this.props.resize) {
			input = (
				<AutoResizer
					content={ this.state.value }
					vertical={ this.props.resize === 'vertical' }
				>
					{ input }
				</AutoResizer>
			);
		}

		return input;
	}

	renderSpinner() {
		return this.props.isBusy ? <Spinner /> : null;
	}

	render() {
		const className = cx({
			'input-group': true,
			'input': true,
			'busy': this.props.isBusy
		}, this.props.inputGroupClassName);
		return (
			<div className={ className }>
				{ this.renderInput() }
				{ this.renderSpinner() }
			</div>
		);
	}

	static defaultProps = {
		className: 'form-control',
		onBlur: noop,
		onCancel: noop,
		onChange: noop,
		onCommit: noop,
		onFocus: noop,
		onKeyDown: noop,
		tabIndex: -1,
		type: 'text',
		value: '',
		suggestions: []
	};

	static propTypes = {
		autoFocus: PropTypes.bool,
		className: PropTypes.string,
		form: PropTypes.string,
		id: PropTypes.string,
		inputGroupClassName: PropTypes.string,
		inputMode: PropTypes.string,
		isBusy: PropTypes.bool,
		isDisabled: PropTypes.bool,
		isReadOnly: PropTypes.bool,
		isRequired: PropTypes.bool,
		max: PropTypes.number,
		maxLength: PropTypes.number,
		min: PropTypes.number,
		minLength: PropTypes.number,
		name: PropTypes.string,
		onBlur: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired,
		onCommit: PropTypes.func.isRequired,
		onFocus: PropTypes.func.isRequired,
		onKeyDown: PropTypes.func,
		placeholder: PropTypes.string,
		resize: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
		selectOnFocus: PropTypes.bool,
		spellCheck: PropTypes.bool,
		step: PropTypes.number,
		tabIndex: PropTypes.number,
		type: PropTypes.string.isRequired,
		value: PropTypes.string.isRequired,
		suggestions: PropTypes.array,
	};
}

export default Input;
