import React from "react";
import { Row, Col, Input, Avatar, Badge, Icon } from "antd";
import styles from "./index.less";
import logoUrl from "@/assets/logo.png";
import { connect } from "react-redux";
import { setLoginStatus } from "@/redux/action";
import { withRouter } from "react-router-dom";
class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  loginOut = () => {
    sessionStorage.removeItem("loginInfo");
    this.props.history.replace("/login");
    this.props.setLoginStatus(false);
  };
  getUserName = () => {
    const loginInfo = sessionStorage.getItem("loginInfo");
    if (loginInfo) {
      return JSON.parse(loginInfo).name;
    } else {
      return "N/A";
    }
  };
  render() {
    // console.log(this.props.userInfo.isLogin);
    return (
      <div className={styles["header-container"]}>
        <div className={styles.logo}>
          <img src={logoUrl}></img>
        </div>

        {this.props.userInfo.isLogin ? (
          <div className={styles["header-action"]}>
            <div className={styles["header-search"]}>
              <Input prefix={<Icon type="search" />}></Input>
            </div>
            <Avatar
              icon={<Icon type="user" />}
              size={30}
              className={styles["header-user-logo"]}
            />
            <p className={styles["header-user-name"]}>{this.getUserName()}</p>
            <div className={styles["header-message"]}>
              <Badge count={2} size="small">
                <Icon
                  type="mail"
                  style={{ fontSize: "25px", color: "white" }}
                ></Icon>
              </Badge>
            </div>
            <div className={styles["header-loginout"]} onClick={this.loginOut}>
              <Icon
                style={{ fontSize: "25px", color: "white" }}
                type="poweroff"
              ></Icon>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default withRouter(
  connect(
    (state) => ({
      userInfo: state.userReducer,
    }),
    { setLoginStatus }
  )(Header)
);
