const postImageHandle = (e) => {
     const files = e.target.files;

     if (FileReader && files && files.length) {
          const fr = new FileReader();
          fr.onload = function () {
               document.getElementById("edit-avatar").src = fr.result;
          };
          fr.readAsDataURL(files[0]);
     }
};
