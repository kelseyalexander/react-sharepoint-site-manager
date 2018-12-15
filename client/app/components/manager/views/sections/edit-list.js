import React from 'react';
import StyledRow from '../../../common/styled-row';
import FormLabel from '../../../common/form-label';
import RadioGroup from '../../../common/radio-group';
import ColumnTable from './column-table';
import { getFields } from '../../../../actions/edit-list';
import './styles/edit-list.scss';
import { toast } from 'react-toastify';

export default class EditList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searched: false
        }
    }

    /**
     * Get the list fields from the provided source list
     */
    getListFields() {
        getFields(this.props.source, this.props.sourceListName).then(result => {
            if (result.status === "success") {
                this.setState({searched: true});
                this.props.onColumnsChange(result.response);
            } else {
                toast.error(JSON.stringify(result.error), {
                    position: toast.POSITION.BOTTOM_LEFT,
                });
            }
        }).catch(ex => {
            toast.error(JSON.stringify(ex), {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        })
    }

    /**
     * Pass the changed items from the table up to the parent
     * @param {Array} items 
     */
    onColumnsChange(items) {
        this.props.onColumnsChange(items);
    }

    render() {
        return(
            <React.Fragment>
                <StyledRow>
                    <div>
                        <FormLabel label="Instructions">
                            - You must have permission to edit lists for the site you specify.<br/>
                        </FormLabel>
                    </div>
                </StyledRow>
                <StyledRow>
                    <div className="col-5">
                        <FormLabel label="URL" required={true} value={this.props.source}/>
                        <input 
                            type="text" 
                            value={this.props.source} 
                            onChange={(e) => this.props.onSourceChange(e.currentTarget.value)}
                            placeholder="https://transalta.sharepoint.com/sites/"
                        />
                    </div>
                    <div className="col-5">
                        <FormLabel label="List Name" required={true} value={this.props.sourceListName}/>
                        <input 
                            type="text" 
                            value={this.props.sourceListName} 
                            onChange={(e) => this.props.onSourceListNameChange(e.currentTarget.value)}
                        />
                    </div>
                    <div className="col-2">
                        <FormLabel label="Get list fields"/>
                        <button type="button" className="search-list" onClick={this.getListFields.bind(this)}>
                            <span className="fas fa-search"></span> Search
                        </button>
                    </div>
                </StyledRow>
                {this.state.searched && (
                    <ColumnTable 
                        columns={this.props.columns}
                        onColumnsChange={this.onColumnsChange.bind(this)}
                    />
                )}
            </React.Fragment>
        )
    }
}

EditList.defaultProps = {
    source: "",
    sourceListName: "",
    columns: []
}