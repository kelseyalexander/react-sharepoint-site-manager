import React from 'react';
import StyledContainer from '../../common/styled-container';
import StyledRow from '../../common/styled-row';
import FormLabel from '../../common/form-label';
import './styles/home-view.scss';

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term: ""
        }
    }

    onChange(e) {
        this.setState({term: e.currentTarget.value});
    }

    onSearch() {

    }

    render() {
        return (
            <div>
                <StyledContainer
                    title="Site Manager"
                    className="HomeView"
                >
                    Welcome to the SharePoint Site Manager!
                    <FormLabel label="What would you like to do?"/>

                    <StyledRow>
                        <div className="col-10">
                            <input type="text" value={this.state.term} placeholder="Enter a keyword" onChange={this.onChange.bind(this)}/>
                        </div>
                        <div className="col-2">
                            <button type="button" className="search-button" onClick={this.onSearch.bind(this)}>Search</button>
                        </div>
                    </StyledRow>
                </StyledContainer>
            </div>
        )
    }
}
