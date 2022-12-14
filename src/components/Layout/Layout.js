import React,{Component} from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.module.css'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/Toolbar/SideDrawer/SideDrawer';


class Layout extends Component {

     state = {
         showSideDrawer: true
     }



     sideDrawerClosedHandler = () =>
    {
       this.setState({showSideDrawer:false});

    }
    sideDrawerToggledHandler = () =>
    {
        this.setState((prevState) => {
            return { showSideDrawer: !this.state.showSideDrawer};
        });

    }

    render() {
        return(
        <Aux>
            <Toolbar drawerToggleClicked={this.sideDrawerToggledHandler}/>
            <SideDrawer open={this.state.showSideDrawer} 
            closed={this.sideDrawerClosedHandler}
            />
            <main className={classes.Content}>
            {this.props.children}</main>
        </Aux>
        )


    }   
    
} 

export default Layout;