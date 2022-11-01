const inpAvatar = document.querySelector("input[type=file]");

document.getElementById("edit-avatar").onclick = () => inpAvatar.click();

inpAvatar.onchange = () => {
     postImageHandle();
};
