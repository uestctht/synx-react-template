import React from "react";
import styles from "./index.less";
import { Table, Button, Input, message, Icon } from "antd";
import PropType from "prop-types";
import { debounce } from "loadsh";
const { Search } = Input;
export default class CustomTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      loading: true,
      current: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchName: "",
      openFilter: false,
    };
    this.getData = debounce(this.getData, 1000);
  }
  handleSearchChange = (e) => {
    this.setState({
      searchName: e.target.value,
    });
    this.getData(1);
  };
  getData = async (page, filters = []) => {
    const { pageSize, searchName } = this.state;
    this.setState({
      current: page,
    });
    if (this.props.getData) {
      try {
        this.setState({
          loading: true,
        });
        const res = await this.props.getData(
          page,
          pageSize,
          searchName,
          filters
        );
        this.setState({
          dataList: res.dataList,
          total: res.total,
        });
      } catch (e) {
        message.error(e);
      } finally {
        this.setState({
          loading: false,
        });
      }
    } else {
      this.setState({
        dataList: [],
        total: 0,
      });
    }
  };
  /* 通过筛选条件筛选列表，筛选组件回调事件 */
  getDataByFilter = (filters) => {
    console.log(44, filters);
    this.getData(1, filters);
  };
  refresh = () => {
    this.getData(1, 10, "");
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    const { dataList, loading, total, current } = this.state;
    return (
      <div className={styles["custom-table-container"]}>
        <div className={styles["header"]}>
          {this.props.addEvent ? (
            <Button
              type="primary"
              className={styles["button"]}
              onClick={() => {
                this.props.addEvent && this.props.addEvent();
              }}
            >
              新增
            </Button>
          ) : null}
          <div className={styles["filter"]}>
            {this.props.filterOptions ? (
              <div
                className={styles["filter-button"]}
                onClick={() =>
                  this.setState({
                    openFilter: !this.state.openFilter,
                  })
                }
              >
                {this.state.openFilter ? (
                  <Icon
                    type="filter"
                    theme="filled"
                    style={{
                      fontSize: "20px",
                      marginRight: "15px",
                      color: "#1890ff",
                    }}
                  />
                ) : (
                  <Icon
                    type="filter"
                    style={{ fontSize: "20px", marginRight: "15px" }}
                  />
                )}
              </div>
            ) : null}
            <Search
              style={{ width: 250 }}
              placeholder="请输入名称"
              className={styles["input"]}
              value={this.state.searchName}
              onChange={this.handleSearchChange}
            ></Search>
            {/* <Button>重置</Button> */}
          </div>
        </div>
        {this.state.openFilter ? (
          <div className={styles["filter-container"]}>
            {this.props.filterOptions
              ? this.props.filterOptions(this.getDataByFilter)
              : null}
          </div>
        ) : null}
        <div className={styles["content"]}>
          <Table
            rowKey="id"
            dataSource={dataList}
            {...this.props}
            loading={loading}
            scroll={
              this.state.openFilter
                ? { y: "calc(100vh - 520px)" }
                : { y: "calc(100vh - 320px)" }
            }
            pagination={{
              total: total,
              current: current,
              onChange: (page) => {
                this.getData(page);
              },
            }}
          ></Table>
        </div>
      </div>
    );
  }
}
CustomTable.propType = {
  getData: PropType.func,
  addEvent: PropType.func,
  filterOptions: PropType.func,
};
