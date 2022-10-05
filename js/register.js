//创建注册页面所有验证器

// 正则表达式
function regExp(value) {
  const reg = /\w+/g;
  return reg.test(value);
}

const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
  else if (!regExp(val.trim())) return "请输入0-9、26个字母或下划线";
  const resp = await API.exist(val);
  if (resp.data) {
    return "该账号已被占用，请重新输入一个账号";
  }
});

const nicknameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "昵称不能为空";
  }
  else if (!regExp(val.trim())) return "请输入0-9、26个字母或下划线";
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
  else if (!regExp(val.trim())) return "请输入0-9、26个字母或下划线";
});

const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "确认密码不能为空";
    }
    else if (!regExp(val.trim())) return "请输入0-9、26个字母或下划线";
    if (val !== loginPwdValidator.input.value) return "两次输入密码不一样";
  }
);

// 对于表单提交事件，不需要对提交按钮注册点击事件，form自带提交、按回车键提交功能
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault(); //清除表单默认行为——刷新页面
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) return;
  const formData = new FormData(form); //传入表单dom，获取一个表单对象；注意：其中input无name属性名的无法获取
  const userInfo = Object.fromEntries(formData.entries());
  // 获取服务器响应结果
  const resp = await API.register(userInfo);
  if (resp.code === 0) {
    alert("注册成功，点击确定跳转到登录页面");
    location.href = "./login.html"; //location是一个全局变量
  }
};
