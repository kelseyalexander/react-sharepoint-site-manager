import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import ErrorBoundary from '../common/error-boundary';
import Navigation from './navigation';
import { 
    HomeView,
    ListsView, 
} from './index';

import '../common/styles/assimilate-theme.scss';
import './styles/application.scss';

export default class Application extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ErrorBoundary>
                <HashRouter>
                    <div className="Application assimilate-theme">
                        <Navigation/>
                        <Route exact path="/" component={HomeView} />
                        <Route exact path="/lists" component={ListsView} />
                    </div>
                </HashRouter>
            </ErrorBoundary>
        )
    }
}