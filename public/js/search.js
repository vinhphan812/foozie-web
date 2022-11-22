document.forms[0].onsubmit = () => {
     const forms = document.forms[0];

     const type = [];
     forms.type.forEach((e) => {
          if (e.checked) type.push(e.value);
     });

     window.location.href = `/search?q=${forms["q"].value}&type=${type}`;
     return false;
};
