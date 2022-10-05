var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  // 注意token的获取
  // fetch()返回的是Promise对象
  //GET请求
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  // POST请求
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  // async 修饰的函数返回的是Promise对象
  // 对象参数
  async function register(userInfo) {
    return await post("/api/user/reg", userInfo).then((resp) => resp.json());
  }
  // 对象参数
  async function login(loginInfo) {
    const respHead = await post("/api/user/login", loginInfo);
    const respBody = await respHead.json();
    // 判断是否成功登录
    if (respBody.code === 0) {
      const token = respHead.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return respBody;
  }
  // 字符串参数
  async function exist(loginId) {
    return await (await get("/api/user/exists?loginId=" + loginId)).json();
  }

  async function profile() {
    return await (await get("/api/user/profile")).json();
  }
  // 字符串参数
  async function chat(content) {
    return await (await post("/api/chat", { content })).json();
  }

  async function getHistory() {
    return await (await get("/api/chat/history")).json();
  }

  // 退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    register,
    login,
    exist,
    profile,
    chat,
    getHistory,
    loginOut,
  };
})();
