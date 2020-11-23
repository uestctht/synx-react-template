import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Route, Redirect, withRouter } from "react-router-dom";
import { message } from "antd";
class PrivateRoute extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  isLogin = () => {
    return this.props.userInfo.isLogin;
  };
  hasPermission = () => {
    const permissions = this.props.userInfo.permissions;
    const needPermissions = this.props.permissions;
    for (let i = 0; i < needPermissions.length; i++) {
      const per = needPermissions[i];
      if (!permissions.find((item) => item === per)) {
        return false;
      }
    }
    return true;
  };
  componentDidMount() {
    if (!this.isLogin()) {
      message.error("未检测到登录状态");
      const { location } = this.props;
      const newPath = `/login?redirect=${location.pathname}`;
      setImmediate(() => {
        this.props.history.replace(newPath);
      }, 1000);
    }
  }
  render() {
    const { path, exact, component: Component } = this.props;
    if (!this.isLogin()) {
      return null;
    }
    return this.hasPermission() ? (
      <Route
        path={path}
        exact={exact}
        render={(props) => <Component {...props} {...this.props} />}
      />
    ) : (
      <Redirect
        to={{
          pathname: "/noPermission",
        }}
      />
    );
  }
}
PrivateRoute.propTypes = {
  permissions: PropTypes.array,
  component: PropTypes.func,
  path: PropTypes.string,
  exact: PropTypes.bool,
};
PrivateRoute.defaultProps = {
  permissions: [],
  component: null,
  path: "/",
  isExact: true,
};

export default withRouter(
  connect((state) => ({
    userInfo: state.userReducer,
  }))(PrivateRoute)
);
