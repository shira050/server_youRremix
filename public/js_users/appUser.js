import UserClass from "./userClass.js";
import { declareFormEvents } from "./formEvent.js";

const init = () => {
  doApi();
  declareFormEvents(doApi);
};

const doApi = async () => {
  let url = API_URL+"/users?perPage=8&reverse=yes";
  try {
    let resp = await axios.get(url);
    console.log(resp);
    console.log(resp.data);
    createTable(resp.data);
  } catch (err) {
    console.log(err);
    alert("have problem");
  }
};

const createTable = (_ar) => {
  document.querySelector("#tbody").innerHTML = "";
  _ar.forEach((item, i) => {
    let tr = new UserClass("#tbody", item, i, doApi);
    tr.render();
  });
};

init();
