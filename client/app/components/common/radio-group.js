import React from 'react';

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.onRadioChange = this.onRadioChange.bind(this);
    }

    onRadioChange(e, group) {
        this.props.onRadioChange(e, group);
    }

    render() {
        return (
            <div className="radiogroup">
                <ul className="radio">
                    {this.props.options.map((option, i) => {
                        return (
                            <li key={i}>
                                <input type="radio" 
                                        name={this.props.name} 
                                        value={option} 
                                        onChange={(e) => this.onRadioChange(e, this.props.name)} 
                                        checked={this.props.value === option} 
                                        disabled={this.props.disabled}
                                />
                                <label htmlFor={`${this.props.name}-${option}`}>{option}</label>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

RadioGroup.defaultProps = {
    name: "radio-group",
    options: ["Yes", "No"],
    value: "No",
    disabled: ""
}