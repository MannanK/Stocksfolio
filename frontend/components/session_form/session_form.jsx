import React from 'react';
import { Link } from 'react-router-dom';

export default class SessionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    if (this.props.errors.length !== 0) {
      this.props.deleteSessionErrors();
    }
  }

  handleChange(value) {
    return e => {
      this.setState({
        user : {
          ...this.state.user,
          [value]: e.target.value
        }
      });
    };
  }

  clearForm() {
    this.setState({
      user: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state.user);

    this.props.processForm(user);
  }

  render() {
    const { formType, errors } = this.props;
    const { user } = this.state;

    let formTitle = "Login";
    let nameInput = "";
    let confirmPasswordInput = "";

    if (formType === "SIGNUP") {
      formTitle = "Sign up";

      nameInput = <input
        type="text"
        className="session-form-input"
        value={user.name}
        onChange={this.handleChange("name")}
        placeholder="Name"
      />;

      confirmPasswordInput = <input
        type="password"
        className="session-form-input"
        value={user.confirmPassword}
        onChange={this.handleChange("confirmPassword")}
        placeholder="Confirm Password"
      />;
    }

    let errorEls = errors.map((error, i) => (
      <p className="session-form-error" key={i}>{error}</p>
    ));

    return (
      <div className="session-form-container">
        <form className="session-form" onSubmit={this.handleSubmit}>
          <h1 className="session-form-title">{formTitle}</h1>
          {errorEls}
          {nameInput}

          <input
            type="email"
            className="session-form-input"
            value={user.email}
            onChange={this.handleChange("email")}
            placeholder="Email"
          />

          <input
            type="password"
            className="session-form-input"
            value={user.password}
            onChange={this.handleChange("password")}
            placeholder="Password"
          />

          {confirmPasswordInput}

          <button className="session-form-submit">{formTitle}</button>
        </form>
      </div>
    );
  }
}