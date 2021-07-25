import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import Products from './pages/Products';
import ProductInfo from './pages/ProductInfo';

const App = () => {

    return (
        <div className='App container'>
            <Switch>
                <Route exact path='/' component={Products} />
                <Route path='/product/:id' component={ProductInfo} />
                {/* <Route exact path='/'>
                    <Products />
                </Route>
                <Route path='/product/:id'>
                    <ProductInfo />
                </Route> */}
            </Switch>
        </div>
    );
};

export default App;