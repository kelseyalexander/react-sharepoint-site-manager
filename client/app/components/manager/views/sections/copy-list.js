import React from 'react';
import StyledRow from '../../../common/styled-row';
import FormLabel from '../../../common/form-label';
import RadioGroup from '../../../common/radio-group';

export default class CopyList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <React.Fragment>
                <StyledRow>
                    <div>
                        <FormLabel label="Instructions">
                            - You must have permission to edit lists for the site you specify.<br/>
                            - Attachments are not copied.<br/>
                        </FormLabel>
                    </div>
                </StyledRow>
                <StyledRow>
                    <div>
                        <FormLabel label="Would you like to copy the data from the source list as well?"/>
                        <RadioGroup
                            options={["Yes", "No"]}
                            value={this.props.copyData}
                            onRadioChange={(e) => this.props.onRadioChange('copyData', e)}
                            name="copyData"
                        />
                    </div>
                </StyledRow>
                <StyledRow>
                    <div>
                        <FormLabel label="Source URL" required={true} value={this.props.source}/>
                        <input 
                            type="text" 
                            value={this.props.source} 
                            onChange={(e) => this.props.onSourceChange(e.currentTarget.value)}
                            placeholder="https://transalta.sharepoint.com/sites/"
                        />
                    </div>
                    <div>
                        <FormLabel label="List Name" required={true} value={this.props.sourceListName}/>
                        <input 
                            type="text" 
                            value={this.props.sourceListName} 
                            onChange={(e) => this.props.onSourceListNameChange(e.currentTarget.value)}
                        />
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
            </React.Fragment>
        )
    }
}

CopyList.defaultProps = {
    source: "",
    sourceListName: "",
    destination: "",
    listName: "",
    copyData: "No"
}