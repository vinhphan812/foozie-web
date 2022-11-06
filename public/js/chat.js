let socket;

let countNotify = 0;

const $chat = $("#chat");
const $inpChat = $("#inpChat");
const $btnSend = $("#send");
const $notify = $(".notify");

$("#close-chat").click(() => {
     $("#open-chat").prop("checked", false);
     $(".wrapper").toggleClass("d-none");
});

$("#registChat").submit(() => {
     const form = document.forms["registChat"];
     const name = form.name.value;
     const email = form.email.value;
     const phone = form.phone.value;

     initChat({ name, email, phone });

     return false;
});

$btnSend.click((event) => {
     const message = $inpChat.val();
     renderNotifyCount();
     if (message) sendMessage(message);
});

$("#open-chat").click(() => {
     const check = $("#open-chat").prop("checked");
     countNotify = 0;
     renderNotifyCount();
     if (id) if (check) initChat();
     $(".wrapper").toggleClass("d-none");
});

$inpChat.on("keydown", (event) => {
     if (event.key == "Enter") {
          const message = event.target.value;
          if (message) sendMessage(message);
     }
});

function scrollEnd() {
     $chat.scrollTop($chat.children().last().position().top * 2);
}

function sendMessage(message) {
     $inpChat.val("");
     if (!initSocket()) {
          console.log("Sending message failed");
          return false;
     }

     if (!message) return;

     $chat.append(`<div class="d-flex justify-content-end px-2 my-1"><div class="alert alert-primary my-0 d-flex flex-column py-1">
               <span>${message}</span>
          </div></div>`);
     scrollEnd();
     socket.emit("message", { message });
}

function initSocket(query) {
     if (socket && socket.connected) return true;

     socket = io("/chats", { query: id ? { id } : query });
     return socket.connected;
}

function initChat(query) {
     initSocket(query);

     socket.on("connect", () => {
          $chat.empty();
          $(".invisible").removeClass("invisible");
          console.log(socket.id);
     });

     socket.on("message", appendMessage);
     socket.once("first", appendMessage);
}

function renderChat() {}

function renderNotifyCount() {
     $notify.text(countNotify);
     if (countNotify > 0) {
          $notify.removeClass("invisible");
     } else $notify.addClass("invisible");
}

function appendMessage({ message, name, activities }) {
     if (!$("#open-chat").prop("checked")) {
          countNotify++;
     }
     renderNotifyCount();
     $chat.append(`
     <div class="my-1">
          <div class="d-flex align-items-end px-2">
               <img src="/public/images/assets/user.png" width="32px" height="32px" class="rounded-circle img-thumbnail me-2"/>
               <div class="alert alert-primary my-0 d-flex flex-column py-1">
                    <span class="text-muted small">${name || "name"}</span>
                    <span>${message}</span>
                    ${
                         activities && activities.length
                              ? renderAtivities(activities)
                              : ""
                    }
               </div>
          </div>
     </div>`);
     scrollEnd();

     // active
     if (activities && activities.length)
          $(".activity").click(function (e) {
               this.disabled = true;

               const message = this.attributes["activity-data"].value;
               console.log(message);
               sendMessage(message);
          });
}

function renderAtivities(activities) {
     return `<div class="my-1">
          ${activities
               .map(
                    (e) =>
                         `<button class="btn btn-primary w-100 activity mb-1" activity-data='${e.reply}'>${e.title}</button>`
               )
               .join("")}
     </div>`;
}

function activityHandle(message) {}
