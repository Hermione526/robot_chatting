(async function () {
  // 判断是否登录，若未登录，返回登录页
  const resp = await API.profile();
  const userInfo = resp.data;
  if (!userInfo) {
    alert("未登录，点击确定返回登录页");
    location.href = "./login.html";
    return;
  }

  // 下面代码为登录成功后
  doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    msgContainer: $(".msg-container"),
    txtMsg: $("#txtMsg"),
  };

  // 注销事件
  doms.close.onclick = async function () {
    API.loginOut();
    location.href = "./login.html";
  };

  /**
   * 获取用户历史消息
   */
  async function getHistory() {
    const resp = await API.getHistory();
    for (const chatInfo of resp.data) {
      addChat(chatInfo);
    }
    //初次加载时滚动到历史消息底部
    scrollToBottom();
  }
  getHistory();

  // 用户信息显示
  doms.aside.nickname.innerText = userInfo.nickname;
  doms.aside.loginId.innerText = userInfo.loginId;

  doms.msgContainer.onsubmit = async function (e) {
    e.preventDefault();
    sendChat();
  };

  // 发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) return;
    addChat(formatChatInfo(content));
    doms.txtMsg.value = "";
    scrollToBottom();
    const resp = await API.chat(content);
    if (resp.code !== 0) return;
    addChat(resp.data);
    scrollToBottom();
  }

  // 该方法极度费时，交互效果不好，重复请求
  // async function sendChat() {
  //   const sendInfo = doms.txtMsg.value;
  //   doms.txtMsg.value = "";
  //   const resp = await API.chat(sendInfo);
  //   if (resp.code !== 0) return;
  //   const chatInfoArr = (await API.getHistory()).data;
  //   console.log(chatInfoArr);
  //   const lattestMeInfo = chatInfoArr[chatInfoArr.length - 2]; //获取刚刚用户发的消息
  //   addChat(lattestMeInfo);
  //   addChat(resp.data);
  //   doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  // }

  // 将要发送的内容封装成消息对象
  function formatChatInfo(content) {
    return {
      from: resp.data.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    };
  }

  // 滑动到消息区底部
  function scrollToBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  // 加载聊天信息到页面
  function addChat(chatInfo) {
    const div = $$$("div");
    div.className = "chat-item";
    chatInfo.from && div.classList.add("me");

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }
  // 时间格式化
  function formatDate(timeStamp) {
    const time = new Date(timeStamp);
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const day = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
})();
