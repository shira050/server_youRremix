const { config } = require("../../config/secret");

export default class UserClass{
    constructor(_parent,_item,_index,_doApi) {
      this.parent = _parent;
      this.name = _item.name;
      this.email = _item.email;
      this.date = new Date(_item.date_created).toLocaleDateString();
      this.index = _index;
      this.id = _item._id;
      this.doApi = _doApi;
    }
  
    render(){
      let tr = document.createElement("tr");
      document.querySelector(this.parent).append(tr);
  
      tr.innerHTML = `
      <td>${this.index + 1}</td>
      <td>${this.name}</td>
      <td>${this.email}</td>
      <td>${this.date}</td>
      <td><button class="badge bg-danger del-btn">Del</button></td>
      <td><button class="badge bg-info update-btn">Update</button></td>
      `
  
      let delBtn = tr.querySelector(".del-btn");
      delBtn.addEventListener("click" , () => {
        // alert(this.id);
        confirm("Are you sure you want to delete?") && this.delUser()
      })

      let updateBtn = tr.querySelector(".update-btn");
      updateBtn.addEventListener("click" , () => {
        // alert(this.id);
        document.querySelector("#id_name").value = this.name;
        document.querySelector("#id_email").value = this.email;
        document.querySelector("#id_password").value = this.password;
        document.querySelector("#id_btn").className = "btn btn-info";
        localStorage.setItem("id_edit", this.id)
      })
    }
  
    async delUser(){
      let url = config.apiUrl+ "users/"+this.id;
      try{
        let resp =  await axios({
          url:url,
          method:"DELETE",
          headers:{
            'content-type': "application/json"
          }
        })
        if(resp.data.deletedCount == 1){
      
          this.doApi();
        }
        else{
          alert("There problem")
        }
      }
      catch(err){
        console.log(err);
        alert("There problem, come back later")
      }
    }

    
  }