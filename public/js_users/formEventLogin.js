export const declareFormEventsLogin = (_doApi) => {
  let id_log_form = document.querySelector("#id_log_form");

  id_log_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let dataBody = {
      email: document.querySelector("#id_log_email").value,
      password: document.querySelector("#id_log_password").value,
    };

    loginUser(dataBody, _doApi);
  });
};

const loginUser = async (_obj, _doApi) => {
  let url = "http://localhost:3000/users/login";
    fetch(url,{
      method: "POST",
      body: JSON.stringify(_obj),
      // כדי שהשרת יבין שזה גיינסון
      headers: {
        "content-type": "application/json",
      }
    })
      .then(resp => resp.json())
      .then(async (data) => {
        if (data.your_token) {
          window.location.href = "listCakes.html";
        }
        else{
            alert("user or pass not match")
        }
      });

};
