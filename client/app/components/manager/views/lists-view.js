import React from 'react';
import StyledContainer from '../../common/styled-container';
import StyledRow from '../../common/styled-row';
import FormLabel from '../../common/form-label';
import RadioGroup from '../../common/radio-group';
import CreateList from './sections/create-list';
import UploadList from './sections/upload-list';
import CopyList from './sections/copy-list';
import EditList from './sections/edit-list';
import { ToastContainer, toast } from 'react-toastify';

import { createList } from '../../../actions/create-list';
import { uploadList } from '../../../actions/upload-list';
import { copyList } from '../../../actions/copy-list';
import { FieldSchema } from '../../../schemas/fields';

import 'react-toastify/dist/ReactToastify.css';

export default class ListsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createType: "",
            columns: [],
            destination: "",
            source: "",
            sourceListName: "",
            listName: "",
            file: null,
            copyData: "No"
        }

        this.addDisabled = this.addDisabled.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
    }

    onRadioChange(group, e) {
        this.setState({[group]: e.currentTarget.value});
    }

    onColumnsChange(items) {
        this.setState({columns: items});
    }

    onDestinationChange(value) {
        this.setState({destination: value});
    }

    onSourceChange(value) {
        this.setState({source: value});
    }

    onListNameChange(value) {
        this.setState({listName: value});
    }

    onSourceListNameChange(value) {
        this.setState({sourceListName: value});
    }

    saveFile(file) {
        this.setState({file: file});
    }

    removeFile() {
        this.setState({file: null});
    }

    handleCreateClick(e) {
        if (this.state.createType === "Manually") {
            createList(this.state.destination, this.state.listName, this.state.columns);
        } else if (this.state.createType === "From an Excel file") {
            uploadList(this.state.destination, this.state.listName, this.state.file);
        } else {
            copyList(this.state.destination, this.state.listName, this.state.source, this.state.sourceListName, this.state.copyData);
        }
    }

    handleSaveClick(e) {

    }

    addDisabled() {
        let columns = this.state.columns;
        let file = this.state.file;
        let valid = true;
        let options = ["Option1", "Option2", "Option3"];

        if (this.state.createType === "Manually") {
            for (let i=0; i<columns.length; i++) {
                if (columns[i].InternalName === "" || columns[i].DisplayName === "" || columns[i].Type === "") {
                    valid = false;
                }

                for (let j=0; j<options.length; j++) {
                    if (FieldSchema[columns[i].Type][options[j]] && columns[i][options[j]] === "" && FieldSchema[columns[i].Type][options[j]].required) {
                        valid = false;
                    }
                }
            }

            return !valid || columns.length === 0 || this.state.destination === "" || this.state.listName === "";
        } else if (this.state.createType === "From an Excel file") {
            return file === null || this.state.destination === "" || this.state.listName === "";
        } else {
            return this.state.destination === "" || this.state.listName === "" || this.state.source === "" || this.state.sourceListName === "";
        }
    }
    
    saveDisabled() {
        return this.state.source === "" || this.state.sourceListName === "";
    }

    render() {
        return (
            <div>
                <StyledContainer title="" className="CreateList">
                    <StyledRow>
                        <div className="col-10">
                            <span style={{
                                fontWeight: "600",
                                fontSize: "1.05rem",
                                marginBottom: "10px",
                                display: "block"
                            }}>Create a list</span>
                        </div>
                        <div className="col-2" style={{textAlign: 'right'}}>
                            <button type="button" onClick={this.handleCreateClick.bind(this)} disabled={this.addDisabled()}>
                                <span className="fas fa-plus"></span>Create
                            </button>
                        </div>
                    </StyledRow>
                    <StyledRow>
                        <div>
                            <FormLabel label="How would you like to create your list?"/>
                            <RadioGroup
                                options={["From an Excel file", "Copy another list", "Manually"]}
                                value={this.state.createType}
                                onRadioChange={(e) => this.onRadioChange('createType', e)}
                                name="createType"
                            />
                        </div>
                    </StyledRow>
                    {this.state.createType === "Manually" && (
                        <CreateList 
                            columns={this.state.columns} 
                            onColumnsChange={this.onColumnsChange.bind(this)}
                            onDestinationChange={this.onDestinationChange.bind(this)}
                            onListNameChange={this.onListNameChange.bind(this)}
                            destination={this.state.destination}
                            listName={this.state.listName}
                        />
                    )}
                    {this.state.createType === "Copy another list" && (
                        <CopyList 
                            onRadioChange={this.onRadioChange.bind(this)}
                            onDestinationChange={this.onDestinationChange.bind(this)}
                            onListNameChange={this.onListNameChange.bind(this)}
                            onSourceChange={this.onSourceChange.bind(this)}
                            onSourceListNameChange={this.onSourceListNameChange.bind(this)}
                            destination={this.state.destination}
                            source={this.state.source}
                            sourceListName={this.state.sourceListName}
                            listName={this.state.listName}
                            copyData={this.state.copyData}
                        />
                    )}
                    {this.state.createType === "From an Excel file" && (
                        <UploadList
                            file={this.state.file}
                            onDestinationChange={this.onDestinationChange.bind(this)}
                            onListNameChange={this.onListNameChange.bind(this)}
                            destination={this.state.destination}
                            listName={this.state.listName}
                            saveFile={this.saveFile.bind(this)}
                            removeFile={this.removeFile.bind(this)}
                        />
                    )}
                </StyledContainer>
                <StyledContainer className="EditList">
                    <StyledRow>
                        <div className="col-10">
                            <span style={{
                                fontWeight: "600",
                                fontSize: "1.05rem",
                                marginBottom: "10px",
                                display: "block"
                            }}>Edit a list</span>
                        </div>
                        <div className="col-2" style={{textAlign: 'right'}}>
                            <button type="button" onClick={this.handleSaveClick.bind(this)} disabled={this.saveDisabled()}>
                                <span className="far fa-save"></span>Save
                            </button>
                        </div>
                    </StyledRow>
                    <EditList
                        source={this.state.source}
                        sourceListName={this.state.sourceListName}
                        onSourceChange={this.onSourceChange.bind(this)}
                        onSourceListNameChange={this.onSourceListNameChange.bind(this)}
                        columns={this.state.columns}
                        onColumnsChange={this.onColumnsChange.bind(this)}
                    />
                </StyledContainer>
                <ToastContainer />
            </div>
        )
    }
}