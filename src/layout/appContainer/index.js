import React from "react";
import { Card, Menu, Icon } from "antd";
import styles from "./index.less";
import PrivateRoute from "@/components/PrivateRoute";
import { Route, Switch, withRouter } from "react-router";
import { ApplicationConfig } from "@/config/application";
function getPath(base, path) {
  return base + path;
}
const pageBasePath = "/catra";
class AppContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: [],
    };
  }
  changeCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      selectedKeys: this.state.selectedKeys.filter(
        (key) => key !== "operation"
      ),
    });
  };
  go = (path) => {
    this.props.history.push({ pathname: path });
  };
  dealSelect = (e) => {
    const newSelectKeys = e.selectedKeys;
    if (newSelectKeys[0] !== "operation") {
      this.setState({
        selectedKeys: newSelectKeys,
      });
      this.go(newSelectKeys[0]);
    }
  };

  buildMenuConfig = () => {
    const applicationKeys = Object.keys(ApplicationConfig);
    return applicationKeys.map((key, index) => {
      const app = ApplicationConfig[key];
      return {
        title: app.title,
        icon: app.menuIcon,
        access: app.permissions,
        children: app.routeConfig,
      };
    });
  };
  getMenuItems = () => {
    const MENU_CONFIG = this.buildMenuConfig();
    return MENU_CONFIG.map((item, index) => {
      if (item.children) {
        return (
          <Menu.SubMenu
            key={`${index}${item.title}`}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getSubMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={getPath(pageBasePath, item.path)}>
            <Icon type={item.icon}></Icon>
            <span>{item.title}</span>
          </Menu.Item>
        );
      }
    });
  };
  getSubMenuItems = (children) => {
    return children.map((child, index) => {
      if (child.children) {
        return (
          <Menu.SubMenu
            key={`${index}${child.title}`}
            title={
              <span>
                <span>{child.title}</span>
              </span>
            }
          >
            {this.getSubMenuItems(child.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={getPath(pageBasePath, child.path)}>
          <span>{child.title}</span>
        </Menu.Item>
      );
    });
  };
  getRoutes = () => {
    const applicationKeys = Object.keys(ApplicationConfig);
    return applicationKeys.map((key, index) => {
      const app = ApplicationConfig[key];
      return (
        <PrivateRoute
          path={pageBasePath + "/" + app.name}
          key={app.name}
          exact={false}
          basePath={pageBasePath}
          component={app.component}
          permissions={app.permissions}
        ></PrivateRoute>
      );
    });
  };
  render() {
    return (
      <div className={styles["app-container"]}>
        <div className={styles["nav-bg-full"]}></div>
        <Menu
          className={this.state.collapsed ? styles["nav"] : styles["nav-full"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          selectedKeys={this.state.selectedKeys}
          onSelect={(e) => {
            this.dealSelect(e);
          }}
        >
          <Menu.Item key="/">
            <Icon type="home" />
            <span>返回首页</span>
          </Menu.Item>
          {this.getMenuItems()}
          <Menu.Item
            key="operation"
            onClick={this.changeCollapsed}
            className={styles["collapse-container"]}
          >
            <Icon type={this.state.collapsed ? "menu-unfold" : "menu-fold"} />
            {this.state.collapsed ? (
              <span>展开导航</span>
            ) : (
              <span>折叠导航</span>
            )}
          </Menu.Item>
        </Menu>
        <Card className={styles["app-content"]}>
          <Switch>{this.getRoutes()}</Switch>
        </Card>
      </div>
    );
  }
}
export default withRouter(AppContainer);
