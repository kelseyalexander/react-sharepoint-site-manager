import React from 'react';
import StyledRow from '../../../common/styled-row';
import FormLabel from '../../../common/form-label';
import includes from 'lodash/includes';
import './styles/upload-list.scss';

const accept = [".csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

export default class UploadList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null
        }

        this.onFileChange = this.onFileChange.bind(this);
        this.saveFile = this.saveFile.bind(this);

        this.setFileRef = element => {
            this.fileInput = element;
        }
    }

    /**
     * When there is a change store the new file for saving
     */
    onFileChange(event) {
        let invalidTypes = [];

        if (!event.target.files) {
            return;
        }

        if(!includes(accept, event.target.files[0].type)) {
            invalidTypes.push(event.target.files[0].name);
        }

        if(invalidTypes.length > 0) {
            alert(`Only the following file types are accepted:\n${accept.join(', ')}\n\nInvalid Files:\n${invalidTypes.join(', ')}`);
            this.fileInput.value = null;
            this.setState({file: null});
            return;
        }

        let file = event.target.files[0];
        this.setState({file: file});
    }

    /**
     * Save file to the parent
     */
    saveFile() {
        let file = this.state.file;
        document.getElementById('file-input').value = "";
            
        this.props.saveFile(file);
        this.setState({file: null});
    }

    /**
     * Remove the saved file
     */
    removeFile() {
        this.props.removeFile();
    }

    render() {
        return(
            <React.Fragment>
                <StyledRow>
                    <div>
                        <FormLabel label="Instructions">
                            - Download the template <a href="../SiteAssets/Templates/List Creation Template.xlsx">here</a>.<br/>
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
                <div className="Uploader">
                    <StyledRow rowType="end">
                        {this.props.file === null && (
                            <div className="col-10">
                                <input id="file-input" className={this.props.file === null ? "required" : ""} ref={this.setFileRef} onChange={this.onFileChange} type="file" accept={accept.join(',')}/>
                            </div>
                        )}
                        {this.state.file === null && (
                            <div className="col-2"></div>
                        )}
                        {this.state.file !== null && (
                            <div className="col-2">
                                <button className="save-file" type="button" onClick={this.saveFile}>
                                    <span className="far fa-save"></span> Save file
                                </button>
                            </div>
                        )}
                    </StyledRow>
                    {this.props.file !== null && (
                        <StyledRow>
                            <div>
                                <label>File</label>
                                <div className="file-list">
                                    <div>
                                        <div>
                                            <span className={`FileIcon fas fa-file-excel`}></span>
                                            <span>{this.props.file.name}</span>
                                        </div>
                                        <div>
                                            <button type="button" className='remove-file' onClick={this.props.removeFile.bind(this)}><span className="fa fa-trash"></span> Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StyledRow>
                    )}
                </div>
            </React.Fragment>
        )
    }
}

UploadList.defaultProps = {
    file: null,
    destination: "",
    listName: ""
}