/* eslint-disable react/no-deprecated */
'use strict';


//TinyMCE import, do not reorder
import tinymce from 'tinymce';
import 'tinymce/plugins/link';
import 'tinymce/plugins/searchreplace';
import 'tinymce/themes/silver';
import { Editor } from '@tinymce/tinymce-react';

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap/lib';

import Button from './ui/button';
import Icon from './ui/icon';
import { Toolbar, ToolGroup } from './ui/toolbars';
import ColorPicker from './ui/color-picker';

window.tinymce = tinymce;

class RichEditor extends React.PureComponent {
	state = {
		hilitecolor: null,
		content: this.props.value,
		forecolor: null,
	};

	handleEditorInit = (ev, editor) => {
		this.editor = editor;
	}

	handleEditorChange = newContent => {
		const { onChange } = this.props;
		const { content } = this.state;

		// force re-render so that formatting buttons are correctly highlighted
		this.forceUpdate();

		if(newContent === content) {
			return;
		}
		this.setState({ content: newContent });

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			onChange(newContent);
		}, 500);
	}

	handleButtonClick = ev => {
		if(!this.editor) { return; }
		const { command } = ev.currentTarget.dataset;

		if(command === 'forecolor' || command === 'hilitecolor') {
			this.setColor(command, this.state[command]);
		} else {
			this.editor.editorCommands.execCommand(command);
		}
	}

	handleFocus = () => {
		this.setState({ isEditorFocused: true });
	}

	handleBlur = () => {
		if(document.activeElement && document.activeElement.closest('.rich-editor')) {
			return;
		}
		this.setState({ isEditorFocused: false });
	}

	handleForeColorPicked = color => {
		this.setState({ forecolor: color });
		this.setColor('forecolor', color);
	}

	handleHiLiteColorPicked = color => {
		this.setState({ hilitecolor: color });
		this.setColor('hilitecolor', color);
	}

	setColor = (which, color) => {
		if(!color) {
			this.editor.editorCommands.execCommand('mceRemoveTextcolor', which);
		} else {
			this.editor.editorCommands.execCommand(which, undefined, color);
		}

	}

	isEditorCommandState(command) {
		return this.editor && this.state.isEditorFocused &&
			this.editor.editorCommands.queryCommandState(command);
	}

	refreshEditor = () => this.forceUpdate();

	renderEditor() {
		if(process.env.NODE_ENV !== 'test') {
			return (
				<Editor
					disabled={ this.props.isReadOnly }
					value={ this.state.content }
					init={{
						height: '100%',
						base_url: '/static/other/tinymce',
						plugins: 'link searchreplace',
						branding: false,
						toolbar: false,
						menubar: false,
						statusbar: false,
					}}
					onEditorChange={ this.handleEditorChange }
					onFocus={ this.handleFocus }
					onBlur={ this.handleBlur }
					onClick={ this.refreshEditor }
					onInit={ this.handleEditorInit }
				/>
			);
		} else return null;
	}

	render() {
		const { isReadOnly } = this.props;
		return (
			<div className="rich-editor">
				{ !isReadOnly && (
					<React.Fragment>
						<Toolbar className="dense">
							<div className="toolbar-left">
								<ToolGroup>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('bold')
										})}
										title="Bold"
										data-command="bold"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/b" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('italic')
										})}
										title="Italic"
										data-command="italic"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/i" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('underline')
										})}
										title="Underline"
										data-command="underline"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/u" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('strikethrough')
										})}
										title="strikethrough"
										data-command="strikethrough"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/s" width="16" height="16" />
									</Button>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('subscript')
										})}
										title="Subscript"
										data-command="subscript"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/sub" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('superscript')
										})}
										title="Superscript"
										data-command="superscript"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/sup" width="16" height="16" />
									</Button>
								</ToolGroup>
								<ToolGroup>
									<UncontrolledDropdown className="dropdown-wrapper btn-group">
										<Button
											icon
											data-command="forecolor"
											onClick={ this.handleButtonClick }
										>
											<Icon
												color={ this.state.forecolor }
												height="16"
												type="16/editor/fore-color"
												width="16"
											/>
										</Button>
										<DropdownToggle
											color={ null }
											className="btn-icon dropdown-toggle"
										>
											<Icon type="16/chevron-7" width="16" height="16" />
										</DropdownToggle>
										<ColorPicker onColorPicked={ this.handleForeColorPicked } />
									</UncontrolledDropdown>
									<UncontrolledDropdown className="dropdown-wrapper btn-group">
										<Button
											icon
											data-command="hilitecolor"
											onClick={ this.handleButtonClick }
										>
											<Icon
												color={ this.state.hilitecolor }
												height="16"
												type="16/editor/back-color"
												width="16"
											/>
										</Button>
										<DropdownToggle
											color={ null }
											className="btn-icon dropdown-toggle"
										>
											<Icon type="16/chevron-7" width="16" height="16" />
										</DropdownToggle>
										<ColorPicker onColorPicked={ this.handleHiLiteColorPicked } />
									</UncontrolledDropdown>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										title="Clear formatting"
										data-command="removeformat"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/remove-format" width="16" height="16" />
									</Button>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										title="Blockquote"
										data-command="mceblockquote"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/blockquote" width="16" height="16" />
									</Button>
									<Button
										icon
										title="Insert/edit link"
										data-command="mceLink"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/link" width="16" height="16" />
									</Button>
								</ToolGroup>
							</div>
						</Toolbar>
						<Toolbar className="dense">
							<div className="toolbar-left">
								<ToolGroup>
								<UncontrolledDropdown className="dropdown-wrapper">
										<DropdownToggle
											color={ null }
											className="dropdown-toggle btn-icon"
										>
											Paragraph
											<Icon type="16/chevron-7" width="16" height="16" />
										</DropdownToggle>
										<DropdownMenu>
											<DropdownItem>
												Paragraph
											</DropdownItem>
											<DropdownItem>
												Heading 1
											</DropdownItem>
											<DropdownItem>
												Heading 2
											</DropdownItem>
											<DropdownItem>
												Heading 3
											</DropdownItem>
											<DropdownItem>
												Heading 4
											</DropdownItem>
											<DropdownItem>
												Heading 5
											</DropdownItem>
											<DropdownItem>
												Heading 6
											</DropdownItem>
											<DropdownItem>
												<pre>Preformatted</pre>
											</DropdownItem>
										</DropdownMenu>
								</UncontrolledDropdown>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('justifyleft')
										})}
										title="Align left"
										data-command="justifyleft"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/align-left" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('justifycenter')
										})}
										title="Align center"
										data-command="justifycenter"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/align-center" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('justifyright')
										})}
										title="Align right"
										data-command="justifyright"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/align-right" width="16" height="16" />
									</Button>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('insertunorderedlist')
										})}
										title="Bullet list"
										data-command="insertunorderedlist"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/bullet-list" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('insertorderedlist')
										})}
										title="Numbered list"
										data-command="insertorderedlist"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/numbered-list" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('indent')
										})}
										title="Decrease indent"
										data-command="indent"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/indent" width="16" height="16" />
									</Button>
									<Button
										icon
										className={ cx({
											active: this.isEditorCommandState('outdent')
										})}
										title="Increase indent"
										data-command="outdent"
										onClick={ this.handleButtonClick }>
										<Icon type="16/editor/outdent" width="16" height="16" />
									</Button>
								</ToolGroup>
								<ToolGroup>
									<Button
										icon
										title="Find and replace"
										data-command="searchreplace"
										onClick={ this.handleButtonClick }>
										<Icon type="16/magnifier" width="16" height="16" />
									</Button>
								</ToolGroup>
							</div>
						</Toolbar>
					</React.Fragment>
				)}
				<div className="editor-container">
					{ this.renderEditor() }
				</div>
			</div>
		);
	}
}

RichEditor.propTypes = {
	isReadOnly: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
};

RichEditor.defaultProps = {};

export default RichEditor;
