export const declareFormEvents = (_doApi) => {
 
  let id_form = document.querySelector("#id_form");

  id_form.addEventListener("submit", (e) => {
    e.preventDefault();

    let dataBody = {
      name: document.querySelector("#id_name").value,
      email: document.querySelector("#id_email").value,
      password: document.querySelector("#id_password").value,
    };

    addUser(dataBody, _doApi);
  });

  let id_update = document.querySelector("#id_btn");

  id_update.addEventListener("click", () => {
    let dataBody = {
      name: document.querySelector("#id_name").value,
      email: document.querySelector("#id_email").value,
      password: document.querySelector("#id_password").value,
    };

    updateUser(dataBody, _doApi);
  });
};

const loginUser = async (_obj, _doApi) => {
  let url = "http://localhost:3000/users/login";
  try {
    let resp = await axios({
      url,
      method: "POST",
      data: JSON.stringify(_obj),
      // כדי שהשרת יבין שזה גיינסון
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.data._id) {
      alert("user login");
      _doApi();
    } else {
      alert("There problem, come back later!");
    }
  } catch (err) {
    console.log(err);
    alert("There problem, come back later");
  }
};

const addUser = async (_obj, _doApi) => {
  let url = "http://localhost:3000/users";
  try {
    let resp = await axios({
      url,
      method: "POST",
      data: JSON.stringify(_obj),
      // כדי שהשרת יבין שזה גיינסון
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.data._id) {
      alert("user added");
      _doApi();
    } else {
      alert("There problem, come back later!");
    }
  } catch (err) {
    console.log(err);
    alert("There problem, come back later");
  }
};

const updateUser = async (_obj, _doApi) => {
  let url = "http://localhost:3000/users/" + localStorage.getItem("id_edit");
  try {
    let resp = await axios({
      url,
      method: "PUT",
      data: JSON.stringify(_obj),

      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.data.modifiedCount == 1) {
      alert("user update");
      document.querySelector("#id_name").value = "";
      document.querySelector("#id_email").value = "";
      document.querySelector("#id_password").value = "";
      _doApi();
    } else {
      alert("There problem, come back later!");
    }
  } catch (err) {
    console.log(err);
    alert("There problem, come back later");
  }
};
