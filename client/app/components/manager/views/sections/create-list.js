import React from 'react';
import StyledRow from '../../../common/styled-row';
import FormLabel from '../../../common/form-label';
import ColumnTable from './column-table';

export default class CreateList extends React.Component {
    constructor(props) {
        super(props);
    }

    onColumnsChange(items) {
        this.props.onColumnsChange(items);
    }

    render() {
        return(
            <React.Fragment>
                <StyledRow>
                    <div>
                        <FormLabel label="Instructions">
                            - The internal name will replace special characters and spaces upon addition to the list in SharePoint (Ex: spaces are replaced with _x0020_).<br/>
                            - The display name will show up in list settings and on list views.<br/>
                            - Options 1, 2, and 3 change depending on the type of column chosen.<br/>
                            - Formulas for calculated columns must be in excel format and use the display name of referenced columns in square brackets.<br/>
                            - Fields for calculated columns must use the internal name of the field.<br/>
                            - You must have permission to edit lists for the site you specify.<br/>
                        </FormLabel>
                    </div>
                </StyledRow>
                <StyledRow>
                    <div>
                        <FormLabel label="Destination URL" required={true} value={this.props.destination}/>
                        <input 
                            type="text" 
                            value={this.props.destination} 
                            onChange={(e) => this.props.onDestinationChange(e.currentTarget.value)}
                            placeholder="https://transalta.sharepoint.com/sites/"
                        />
                    </div>
                    <div>
                        <FormLabel label="List Name" required={true} value={this.props.listName}/>
                        <input 
                            type="text" 
                            value={this.props.listName} 
                            onChange={(e) => this.props.onListNameChange(e.currentTarget.value)}
                        />
                    </div>
                </StyledRow>
                <ColumnTable 
                    columns={this.props.columns}
                    onColumnsChange={this.onColumnsChange.bind(this)}
                />
            </React.Fragment>
        )
    }
}

CreateList.defaultProps = {
    columns: [],
    destination: "",
    listName: ""
}