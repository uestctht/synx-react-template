import React from "react";
import ScalableForm from "scalable-form-antd";
import PropTypes from "prop-types";
const deepCloneObject = (obj) => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.concat();
  } else {
    return JSON.parse(JSON.stringify(obj));
  }
};
export default class CustomForm extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    jsonSchema: deepCloneObject(this.props.schema.jsonSchema),
    uiSchema: deepCloneObject(this.props.schema.uiSchema),
    formData: deepCloneObject(this.props.schema.formData),
  };
  dealCustomChange = () => {
    setImmediate(() => {
      this.dealCustomValidate();
    });
  };
  /* 处理自定义校验方法 */
  dealCustomValidate = () => {
    let res = this.form.XFormValidateSync();
    const formData = this.form.XFormCurrentFormData();
    const { customValidate } = this.props;
    const newUischema = deepCloneObject(this.state.uiSchema);
    customValidate.forEach((validate, index) => {
      const { key, fn, message } = validate;
      if (formData[key]) {
        const data = formData[key];
        if (fn(data)) {
          if (
            newUischema[key] &&
            newUischema[key]["ui:options"] &&
            newUischema[key]["ui:options"]["_errorType"]
          ) {
            delete newUischema[key]["ui:options"]["_errorType"];
          }
        } else {
          res = false;
          if (newUischema[key]) {
            if (!newUischema[key]["ui:options"]) {
              newUischema[key]["ui:options"] = {};
            }
            newUischema[key]["ui:options"]._errorType = index + "";
            if (!newUischema[key]["ui:options"].validate) {
              newUischema[key]["ui:options"].validate = [];
            }
            if (
              !newUischema[key]["ui:options"].validate.find(
                (obj) => obj.type === index
              )
            ) {
              newUischema[key]["ui:options"].validate.push({
                type: index + "",
                message: message,
              });
            }
          }
        }
      }
    });
    this.setState({
      uiSchema: newUischema,
      formData: formData,
    });
    return res;
  };
  /* 获取校验结果 */
  validate = () => {
    return this.dealCustomValidate();
  };
  /* 获取到表单当前的表单值 */
  getFormData = () => {
    return this.form.XFormCurrentFormData();
  };
  /* 重置表单 */
  reset = () => {
    this.form.XFormReset();
  };
  componentWillReceiveProps(props) {
    setImmediate(() => {
      this.setState({
        jsonSchema: props.schema.jsonSchema,
        uiSchema: props.schema.uiSchema,
        formData: props.schema.formData,
      });
    });
  }
  render() {
    const { jsonSchema, uiSchema, formData } = this.state;
    // console.log(44, this.props);
    return (
      <ScalableForm
        {...this.props}
        ref={(el) => (this.form = el)}
        locale="zh-cn"
        jsonSchema={deepCloneObject(jsonSchema)}
        uiSchema={deepCloneObject(uiSchema)}
        formData={deepCloneObject(formData)}
        onChange={this.dealCustomChange}
      ></ScalableForm>
    );
  }
}
CustomForm.propTypes = {
  customValidate: PropTypes.array,
  schema: PropTypes.object.isRequired,
};
CustomForm.defaultProps = {
  customValidate: [],
  schema: {
    jsonSchema: {},
    uiSchema: {},
    formData: {},
  },
};
