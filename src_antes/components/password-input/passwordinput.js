import React, { PureComponent } from "react";
import { Input, Button } from "semantic-ui-react";

class PasswordInput extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			type: "password"
		};
	}

	handleShowHide = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({
			type: this.state.type === "input" ? "password" : "input"
		});
		this.focus();
	};

	handleRef = c => {
		this.inputRef = c;
	};

	focus = () => {
		this.inputRef.focus();
	};

	render() {
		const { name, value, placeholder, onChange, onBlur, onKeyUp, disabled } = this.props;
		let pic = this.state.type === "password" ? "eye slash" : "eye";

		return (
			<Input
				fluid
				disabled={disabled}
				ref={this.handleRef}
				icon="lock"
				iconPosition="left"
				action={<Button icon={pic} basic onClick={this.handleShowHide} tabIndex={-1} />}
				type={this.state.type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				onKeyUp={onKeyUp}
				onBlur={onBlur}
			/>
		);
	}
}

export default PasswordInput;
