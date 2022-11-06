let socket, currentRoom;

const $chatUser = $("#chat-user");
const $chatUserFor = $("#chat-user-for");
const $userInfo = $("#user-info");
const $subInfo = $("#sub-info");
const $messageCount = $("#message-count");
setInterval(() => {
     $("a[time-data]").each((i, e) => {
          setTimeStamp(e);
     });
}, 1000);

function setTimeStamp($el) {
     const time =
          (new Date().getTime() - +$el.attributes["time-data"].value) / 60000;
     if (time >= 60) {
          $(".time", $el).text((time / 60).toFixed(0) + " giờ trước");
     } else if (time >= 1) {
          $(".time", $el).text(time.toFixed(0) + " phút trước");
     }
}

function initChat() {
     initSocket();

     if (location.pathname.includes("chats")) socket.emit("req:chats");

     socket.emit("req:count");

     socket.on("changed", (data) => {
          renderNewMessage(data);
     });

     socket.on("connect", () => {
          console.log(socket.id);
     });

     socket.on("user:inbox", (data) => {
          console.log(data);
          socket.emit("req:count");
          renderNewMessage(data);
     });

     socket.on("user:data", renderChat);
     socket.on("res:chats", (datas) => {
          console.log(datas);
          datas.map((data, i) => {
               if (i == 0) {
                    currentRoom = data._id;
                    getRoom(currentRoom);
               }
               renderNewMessage(data);
          });
     });
     socket.on("res:count", renderCount);
     socket.on("res:count:room", reRenderCount);
}

function initSocket() {
     if (socket && socket.connected) return true;

     socket = io("/admin", { forceBase64: true });
     return socket.connected;
}

function reRenderCount({ count, roomid }) {
     const $el = $(`a[roomid=${roomid}]`);
     if ($el) {
          $el.attr("count-data", count);
          const $count = $(".badge.bg-danger.float-end");
          $count.text("");
     }
}

function renderNewMessage(data) {
     console.log(new Date(data.date));
     if (currentRoom == data._id && data.last_message) {
          $chatUserFor.append(renderMessage(data.last_message));
          emitSeenMessage(data.last_message._id);
          scrollEnd();
     }

     let newCount = 1;
     const $lastMessage = $(`a[roomid=${data._id}]`);

     if ($lastMessage.attr("send-data") == "false") {
          newCount += +$lastMessage.attr("count-data");
     }

     $lastMessage.remove();

     $chatUser.prepend(`
          <a roomid="${data._id}" send-data="${
          data.last_message ? data.last_message.is_seen : true
     }" count-data="${newCount}" time-data="${
          data.last_message
               ? new Date(data.last_message.date).getTime()
               : new Date().getTime()
     }" href="#${data._id}" onclick="getRoom('${
          data._id
     }')" class="for-chat list-group-item list-group-item-action d-flex justify-content-between list-group-item-primary mb-2">
               <div class="pt-1" message-id="${
                    data.last_message ? data.last_message._id : ""
               }">
                    <p class="fw-bold mb-0">${
                         data.name ||
                         data.user.last_name + " " + data.user.first_name
                    }</p>
                    <p class="small">${
                         data.last_message
                              ? data.last_message.message
                              : "Hiện chưa có tin nhắn nào"
                    }</p>
               </div>
               <div class="pt-1">
                    <p class="small text-muted mb-1 time">bây giờ</p>
                    <p class="badge bg-danger float-end">${
                         data._id == currentRoom ? "" : newCount
                    }</p>
               </div>
          </a>
     `);

     // $(".for-chat").click(renderChat);
}

function scrollEnd() {
     const child = $chatUserFor.children();
     if (child.length > 0)
          $chatUserFor.scrollTop(child.last().position().top * 2);
}

function getRoom(roomid) {
     currentRoom = roomid;
     $(`a[roomid=${roomid}]`).attr("send-data", true);
     socket.emit("user:chat", { roomid });
}

function renderCount(count) {
     $messageCount.text(count || "");
}

function renderChat({ room, user, messages }) {
     console.log(room, user, messages);
     $userInfo.text(
          user.name ? user.name : user.last_name + " " + user.first_name
     );

     $subInfo.html(
          `<a href="mailto:${user.email}" class="link-secondary">${user.email}</a><span> - </span><a class="link-secondary" href="tel:${user.phone}">${user.phone}</a>`
     );

     // $chatUserFor.remove();
     const htmlRender = messages.map(renderMessage);
     $chatUserFor.html(htmlRender);

     scrollEnd();
}

function emitSeenMessage(messageId) {
     socket.emit("req:seen", messageId);
}

function renderMessage(message) {
     if (message.type == "text")
          return `<li class="d-flex justify-content-between mb-4 w-50" message-id="${message._id}">
               <div class="card w-100">
                    <div class="card-header d-flex justify-content-between p-3">
                         
                         <p class="text-muted small mb-0">
                              <i class="bi bi-clock"></i>
                              <span>${message.date}</span>
                         </p>
                    </div>
                    <div class="card-body">
                         <p class="mb-0">
                              ${message.message}
                         </p>
                    </div>
               </div>
          </li>`;
     else
          return `<div class="text-muted small my-2 text-center">${message.message}</div>`;
}

(() => {
     initChat();
})();
