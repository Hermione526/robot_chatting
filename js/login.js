// 思路同注册页面

const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (
  val
) {
  if (!val) {
    return "密码不能为空";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = FieldValidator.validate(loginIdValidator, loginPwdValidator);
  if (!result) return;
  const userinfo = Object.fromEntries(new FormData(form).entries());
  const resp = await API.login(userinfo);
  if (resp.code === 0) {
    alert("登录成功，点击确定跳转到聊天机器人首页");
    location.href = "./index.html";
  } else {
    loginPwdValidator.p.innerText = "账号和密码不匹配，请重新输入";
    loginPwdValidator.input.value = "";
  }
};
