import React from "react";
import PropType from "prop-types";
import { debounce } from "loadsh";
import { Select, Spin } from "antd";
import classnames from "classnames";
const { Option } = Select;
export default class AutoComplete extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      loading: false,
      value: undefined,
      value: "",
      mode: "",
    };
    this.handleSearch = debounce(this.handleSearch, 1000);
  }
  setLoading = (status) => {
    this.setState({ loading: status });
  };
  setOptions = (data) => {
    this.setState({ options: data });
  };
  handleSearch = (
    value = "",
    setOptions = (options) => this.setState({ options: options }),
    setLoading = (status) => this.setState({ loading: status })
  ) => {
    if (
      this.state.options.find((option) => option.label.indexOf(value) !== -1)
    ) {
      this.setState({
        options: this.state.options.filter(
          (option) => option.label.indexOf(value) !== -1
        ),
      });
    }
    if (this.props.getOptions) {
      this.setState({
        options: [],
      });
      this.props.getOptions(value, setOptions, setLoading);
    }
  };
  handleChange = (value) => {
    //console.log(value);
    // console.log(this.props);
    this.props.onChange && this.props.onChange(value);
    this.setState({ value: value });
  };
  _getValidateMessage(errorType, validate) {
    let errorMessage = "";
    validate.map((validateItem) => {
      if (validateItem.type === errorType) {
        errorMessage = validateItem.message;
        return false;
      }
    });
    return errorMessage;
  }

  componentDidMount() {
    this.setState({
      value: this.props.value,
      mode: this.props.mode,
    });
    this.handleSearch();
  }
  componentWillReceiveProps(props) {
    this.setState({
      value: "",
      mode: "",
    });
    setImmediate(() => {
      this.setState({
        value: props.value,
        mode: props.mode,
      });
      this.handleSearch();
    });
  }
  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    const { optionsRender } = this.props;
    let { _errorType, validate, ...otherOptions } = this.props.options;
    let validateMessage = "";
    _errorType = _errorType || "";
    if (_errorType !== "" && typeof validate !== "undefined") {
      validateMessage = this._getValidateMessage(_errorType, validate);
    }

    return (
      <div
        className={classnames({
          "ant-form-item-control": true,
          "xform-custom-widget": true,
          "xform-custom-input": true,
          "has-error": _errorType !== "",
        })}
      >
        <Select
          // {...this.props}
          mode={this.state.mode}
          showSearch
          value={this.state.value}
          notFoundContent={
            this.state.loading ? <Spin size="small" /> : "暂无数据"
          }
          showArrow={false}
          filterOption={false}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
        >
          {optionsRender
            ? optionsRender(this.state.options)
            : this.state.options.map((option, index) => (
                <Option value={option.value} key={option.value}>
                  {option.label}
                </Option>
              ))}
        </Select>
        <div className="ant-form-explain">{validateMessage}</div>
      </div>
    );
  }
}
AutoComplete.propType = {
  getOptions: PropType.func,
  optionsRender: PropType.func,
};
