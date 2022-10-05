// 登录和注册通用代码

// 创建一个验证表单的类
class FieldValidator {
  /**
   *
   * @param {string} txtId 传入表单的id名
   * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，调用该函数；若验证失败，返回错误消息，若成功，无返回值
   */
  constructor(txtId, validatorFunc) {
    this.input = $(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    }; //失去焦点验证，是个事件监听；即验证器对象一创建就开始
  }

  /**
   * 调用验证规则函数，获取其返回值，即验证结果；
   * @returns 若失败返回false，成功返回true
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 验证所有表单
   * @param  {FieldValidator[]} validators 传入所有需要验证的验证器，若全部通过返回true，否则返回false
   * @returns
   */
  static async validate(...validators) {
    const promArr = validators.map((item) => item.validate());
    const results = await Promise.all(promArr);
    return results.every((item) => item);
  }
}
