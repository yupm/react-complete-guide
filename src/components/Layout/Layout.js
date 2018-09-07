import React from 'react';
import Fux from '../../hoc/Fux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';

const layout = ( props ) => (
    <Fux>
        <Toolbar />
        <main className={classes.Content}>
            {props.children}
        </main>
    </Fux>
);

export default layout;