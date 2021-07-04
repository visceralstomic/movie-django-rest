import React, {Component} from "react";
import UserMvInfo from "./userMvInfo";
import UserStats from "./userStats";
import { TabContent, TabPane, Nav, 
    NavItem, NavLink} from 'reactstrap';
import classnames from "classnames";

export default class UserPage extends Component {
    constructor(props){
        super(props);
        this.uid = this.props.match.params.uid;
        this.state = {
            activeTab: '1'
        }
    }

    toggle = tab => {
        if(this.state.activeTab !== tab) this.setState({activeTab: tab});
      }


    render(){
        const {activeTab} = this.state;


        return (
            <>
                <div className="user-info-nav user-nav-link">
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === '1'})}
                                    onClick={() => { this.toggle('1'); }}>
                                Main
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === '2'})}
                                    onClick={() => { this.toggle('2'); }}>
                                Stats
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <UserMvInfo uid={this.uid} />
                    </TabPane>
                    <TabPane tabId="2">
                        <UserStats />
                    </TabPane>
                </TabContent>

            </>
        )
    }
}