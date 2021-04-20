import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import OnTopic from './components/OnTopic';

export default (
    <HashRouter history={hashHistory}>
     <div>
      <Route path='/' component={OnTopic} />
     </div>
    </HashRouter>
);