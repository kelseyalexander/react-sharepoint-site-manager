import React from 'react';
import Loadable from 'react-loadable';

function Loading() {
    return <div>Loading</div>
}

export const HomeView = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ './views/home-view'),
    loading() {
        return <span></span>
    }
});

export const ListsView = Loadable({
    loader: () => import(/* webpackChunkName: "ListsView" */ './views/lists-view'),
    loading() {
        return <span></span>
    }
});