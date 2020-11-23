import React from "react";
import { Modal, Button } from "antd";
import PropType from "prop-types";
import CustomForm from "@/components/CustomForm";
import styles from "./index.less";
import { deepClone } from "loadsh";
export default class CustomModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      schema: null,
      formOptions: {},
      formSwitch: true,
      defaultSubmit: null,
    };
  }
  resetForm = () => {
    if (this.form) {
      this.form.reset();
    }
  };
  init = (props) => {
    this.setState({ ...props });
  };
  handleSubmit = () => {
    const { defaultSubmit } = this.state;
    if (this.form && this.form.validate()) {
      const formData = this.form.getFormData();
      defaultSubmit(formData);
    } else {
      message.error("表单校验失败");
    }
  };
  componentWillReceiveProps(props) {
    this.resetForm();
    this.init(props);
  }
  componentDidMount() {
    this.init(this.props);
  }
  render() {
    const { schema, formOptions, formSwitch, defaultSubmit } = this.state;
    console.log(55,schema)
    return (
      <Modal
        {...this.props}
        className={styles["modal-container"]}
        footer={null}
      >
        {schema && formSwitch ? (
          <CustomForm
            schema={schema}
            ref={(el) => (this.form = el)}
            {...formOptions}
          ></CustomForm>
        ) : null}
        {this.props.children}
        {defaultSubmit ? (
          <div className={styles["footer"]}>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        ) : null}
      </Modal>
    );
  }
}

CustomModal.propType = {
  schema: PropType.object,
  formSwitch: PropType.bool,
  formOptions: PropType.object,
  defaultSubmit: PropType.func,
};
CustomModal.defaultProps = {
  schema: null,
  formSwitch: true,
  formOptions: {},
  defaultSubmit: null,
};
