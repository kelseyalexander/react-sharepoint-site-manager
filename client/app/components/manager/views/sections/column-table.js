import React from 'react';
import { FieldSchema } from '../../../../schemas/fields';
import './styles/column-table.scss';

export default class ColumnTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            item: {
                InternalName: "",
                Type: "Text",
                DisplayName: "",
                Required: "No",
                Option1: "",
                Option2: "",
                Option3: "",
            }
        }

        this.onColumnChange = this.onColumnChange.bind(this);
        this.onColumnRemove = this.onColumnRemove.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
    }

    onColumnAdd() {
        let items = JSON.parse(JSON.stringify(this.props.columns));
            items.push(JSON.parse(JSON.stringify(this.state.item)));

        this.props.onColumnsChange(items);
    }

    onColumnChange(key, value, index) {
        let items = JSON.parse(JSON.stringify(this.props.columns));
        let item = JSON.parse(JSON.stringify(items[index]));
            item[key] = value;

        if (key === "Type") {
            item.Option1 = FieldSchema[value].Option1 ? FieldSchema[value].Option1.default : "";
            item.Option2 = FieldSchema[value].Option2 ? FieldSchema[value].Option2.default : "";
            item.Option3 = FieldSchema[value].Option3 ? FieldSchema[value].Option3.default : "";
        }

        items[index] = item;
        this.props.onColumnsChange(items);
    }

    onColumnRemove(item, index) {
        let items = JSON.parse(JSON.stringify(this.props.columns));
        items.splice(index, 1);

        this.props.onColumnsChange(items);
    }

    /**
     * Check if the value of the key-value pair for an item is empty
     * @param {String} key 
     * @param {Integer} index 
     */
    isEmpty(key, index) {
        let item = this.props.columns[index];
        let empty = item[key] === undefined ||
            item[key] === null || 
            item[key] === "" ||
            (Array.isArray(item[key]) && item[key].length === 0);

        return empty;
    }

    render() {
        return(
            <div className="ColumnTable">
                <div className="column-table-container">
                    <div className="new-column">
                        <button 
                            type="button"  
                            onClick={this.onColumnAdd.bind(this)}>
                            <span className="fa fa-plus"></span>Add new
                        </button>
                    </div>
                    <div className="column-table">
                        <div className="column-header column-row">
                            <div>Internal Name</div>
                            <div>Type</div>
                            <div>Display Name</div>
                            <div>Required</div>
                            <div>Option 1</div>
                            <div>Option 2</div>
                            <div>Option 3</div>
                            <div className="remove">Remove</div>
                        </div>
                        {this.props.columns.length > 0 && (
                            <React.Fragment>
                                {this.props.columns.map((column, i) => {
                                    return(
                                        <div className="column-row" key={i}>
                                            <div>
                                                <input type="text" 
                                                    value={column.InternalName} 
                                                    onChange={(e) => this.onColumnChange('InternalName', e.currentTarget.value, i)}
                                                    className={this.isEmpty('InternalName', i) ? 'required' : ''} 
                                                />
                                            </div>
                                            <div>
                                                <select 
                                                    value={column.Type} 
                                                    onChange={(e) => this.onColumnChange('Type', e.currentTarget.value, i)} 
                                                    className={this.isEmpty('Type', i) ? 'required' : ''} 
                                                >
                                                    <option value="" disabled>Please choose an option...</option>
                                                    <option value="Text">Text</option>
                                                    <option value="Note">Note</option>
                                                    <option value="Number">Number</option>
                                                    <option value="DateTime">DateTime</option>
                                                    <option value="Choice">Choice</option>
                                                    <option value="MultiChoice">MultiChoice</option>
                                                    <option value="Currency">Currency</option>
                                                    <option value="User">User</option>
                                                    <option value="Lookup">Lookup</option>
                                                    <option value="LookupMulti">LookupMulti</option>
                                                    <option value="URL">URL</option>
                                                    <option value="Calculated">Calculated</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input type="text" 
                                                    value={column.DisplayName} 
                                                    onChange={(e) => this.onColumnChange('DisplayName', e.currentTarget.value, i)} 
                                                    className={this.isEmpty('DisplayName', i) ? 'required' : ''} 
                                                />
                                            </div>
                                            <div>
                                                <select 
                                                    value={column.Required} 
                                                    onChange={(e) => this.onColumnChange('Required', e.currentTarget.value, i)} 
                                                >
                                                    <option value="" disabled>Please choose an option...</option>
                                                    <option value="No">No</option>
                                                    <option value="Yes">Yes</option>
                                                </select>
                                            </div>
                                            {["Option1", "Option2", "Option3"].map((key, j) => {
                                                let schema = FieldSchema[column.Type][key] !== undefined ? FieldSchema[column.Type][key] : "";
                                                return(
                                                    <div key={j}>
                                                        {schema !== "" && (
                                                            <React.Fragment>
                                                                {schema.type === "Text" && (
                                                                    <input type="text" 
                                                                        value={column[key]} 
                                                                        onChange={(e) => this.onColumnChange(key, e.currentTarget.value, i)} 
                                                                        placeholder={schema.placeholder}
                                                                        className={schema.required && this.isEmpty(key, i) ? 'required' : ''}
                                                                    />
                                                                )}
                                                                {schema.type === "Number" && (
                                                                    <input type="number" 
                                                                        value={column[key]} 
                                                                        onChange={(e) => this.onColumnChange(key, e.currentTarget.value, i)} 
                                                                        className={schema.required && this.isEmpty(key, i) ? 'required' : ''}
                                                                        min="0"
                                                                    />
                                                                )}
                                                                {schema.type === "Choice" && (
                                                                    <select
                                                                        value={column[key]}
                                                                        onChange={(e) => this.onColumnChange(key, e.currentTarget.value, i)}
                                                                        className={schema.required && this.isEmpty(key, i) ? 'required' : ''}
                                                                    >
                                                                        <option value="" disabled>{schema.placeholder}</option>
                                                                        {schema.options.map((opt, k) => {
                                                                            return(
                                                                                <option key={k} value={opt}>{opt}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                )}
                                                            </React.Fragment>
                                                            
                                                        )}
                                                    </div>
                                                )
                                            })}
                                            <div className="remove" style={{marginTop: '5px'}}>
                                                <span className="fa fa-trash" onClick={(e) => this.onColumnRemove(column, i)}></span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </React.Fragment>
                        )}
                        {this.props.columns.length === 0 && (
                            <span style={{
                                display: 'block',
                                textAlign: 'center',
                                width: '100%',
                                fontWeight: '500',
                                padding: '4px'
                            }}
                            >
                                Add items by clicking the "add new" button
                            </span>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

ColumnTable.defaultProps = {
    columns: []
}