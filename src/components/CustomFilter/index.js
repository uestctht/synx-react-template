import React, { useEffect, useState } from "react";
import styles from "./index.less";
import PropType from "prop-types";
import { Row, Col, Input, Form, Select, Button } from "antd";
import { cloneDeep } from "loadsh";
const componentMap = {
  input: InputFilter,
};
class CustomFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterConfigs: [],
    };
  }
  init = (props) => {
    const filterConfigs = cloneDeep(props.filterConfigs);
    filterConfigs.forEach((filter) => (filter.initalValue = filter.value));
    this.setState({
      filterConfigs: filterConfigs,
    });
  };
  componentDidMount() {
    this.init(this.props);
  }
  componentWillReceiveProps(props) {
    this.init(props);
  }
  renderFilter = () => {
    const configs = this.state.filterConfigs;
    if (configs) {
      return configs.map((config, index) => {
        const Comp = componentMap[config.type];
        return (
          <Col span={8} key={index}>
            <Comp
              config={config}
              onChange={(val) => this.handleFilterValueChange(val, index)}
            ></Comp>
          </Col>
        );
      });
    }
  };
  handleFilterValueChange = (val, index) => {
    const newFilterConfig = cloneDeep(this.state.filterConfigs);
    newFilterConfig[index].value = val;
    this.setState({
      filterConfigs: newFilterConfig,
    });
  };
  setFilter = () => {
    this.props.setFilter(this.state.filterConfigs);
    this.reset();
  };
  reset = () => {
    const newFilterConfigs = cloneDeep(this.state.filterConfigs);
    newFilterConfigs.forEach((filter) => (filter.value = filter.initalValue));
    this.setState({
      filterConfigs: newFilterConfigs,
    });
  };
  render() {
    return (
      <div className={styles["container"]}>
        <Row className={styles["filter-container"]} justify="end" type="flex">
          {this.renderFilter()}
        </Row>
        <div className={styles["operation-container"]}>
          <Button
            type="link"
            className={styles["button"]}
            onClick={this.setFilter}
          >
            筛选
          </Button>
          <Button onClick={this.reset} type="link" style={{ color: "black" }}>
            重置
          </Button>
        </div>
      </div>
    );
  }
}
function InputFilter(props) {
  const { config, onChange } = props;
  const [val, setVal] = useState(config.value);
  useEffect(() => {
    setVal(config.value);
  }, [props.config]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 20 },
    },
  };
  return (
    <Form {...formItemLayout}>
      <Form.Item label={config.label}>
        <Input value={val} onChange={handleChange}></Input>
      </Form.Item>
    </Form>
  );
  function handleChange(e) {
    setVal(e.target.value);
    onChange(e.target.value);
  }
}
CustomFilter.propType = {
  filterConfigs: PropType.array,
  setFilter: PropType.func,
};
CustomFilter.defaultProps = {
  filterConfigs: [],
  setFilter: () => {},
};
export default CustomFilter;
