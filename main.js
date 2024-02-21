//pagination
let currentPage = 1;
let endPage = 1;
window.addEventListener("scroll", () => {
  let endScreen =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight;
  if (endScreen && currentPage <= endPage) {
    getPosts(currentPage++, false);
  }
});
// base word in url
const baseUrl = "https://tarmeezacademy.com/api/v1";
//check the input error
let checkInputError = function (input, divError, pattern, msg) {
  console.log(arguments);
  if (pattern.test(input)) {
    divError.innerHTML = "";
    return true;
  } else {
    divError.innerHTML = msg;
    return false;
  }
};

//update the page ui
const setupUI = function () {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const loginBtn = document.getElementById("btn-login");
  const registerBtn = document.getElementById("btn-register");
  const logoutBtn = document.getElementById("btn-logout");
  const navUserImg = document.getElementById("nav-userimg");
  const navUserName = document.getElementById("nav-username");
  const addPostBtn = document.getElementById("add-post-btn");
  console.log(user);
  if (token) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "block";
    navUserImg.style.display = "block";
    navUserName.style.display = "block";
    addPostBtn.style.display = "block";
    typeof user.profile_image === "string"
      ? (navUserImg.src = user.profile_image)
      : (navUserImg.src = "alt user img.jpg");
    navUserName.innerHTML = user.username;
  } else {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    navUserImg.style.display = "none";
    navUserName.style.display = "none";
    addPostBtn.style.display = "none";
  }
};

//post request
async function getPosts(page = 1, reload = true) {
  let respons = await axios.get(`${baseUrl}/posts?page=${page}`);
  let data = await respons.data.data;
  let posts = document.querySelector(".posts");
  endPage = respons.data.meta.last_page;
  console.log(endPage);
  if (reload) {
    posts.innerHTML = "";
  }
  data.forEach((post) => {
    let author = post.author;
    let htmlPost = `<div class="card shadow mt-4">
      <div class="card-header d-flex align-items-center">
<img
   ${
     typeof post.author.profile_image === "string"
       ? `
        src="${author.profile_image}"
        `
       : `src="alt user img.jpg"`
   }
        style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid var(--main-color);
        "
    />
                <p style="margin: 0; margin-left: 5px">${author.username}</p>
              </div>
              <div class="card-body">
                ${
                  typeof post.image === "string"
                    ? `
                 <img src=${post.image} style="width: 100%" />
        `
                    : ""
                }
                <h6 class="mb-3 mt-1" style="color: #777;font-size:12px">${
                  post.created_at
                }</h6>
                ${
                  post.title
                    ? `<h5 class="card-title">${post.title}</h5>`
                    : `<h5 class="card-title"></h5>`
                }

                <p class="card-text">
               ${post.body}
                </p>
                <hr />
                <div id='postFooter'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-chat-square-text"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
                    />
                    <path
                      d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                  <span>(${post.comments_count}) Comments</span>
                </div>
              </div>
            </div>`;
    posts.insertAdjacentHTML("beforeend", htmlPost);
    //insert the post tag in postfooter
    let tags = post.tags;
    let postFooter = posts.lastElementChild.querySelector("#postFooter");
    tags.forEach((tag) => {
      let htmlTag = `<span class='tag'>${tag.name}</span>`;
      postFooter.insertAdjacentHTML("beforeend", htmlTag);
    });
  });
}
// make any aleart
function shadowAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
}

// log in click
const loginBtnClicked = async function () {
  const username = document.querySelector("#username-input").value;
  const password = document.querySelector("#password-input").value;
  const params = {
    username: username,
    password: password,
  };
  try {
    const respons = await axios.post(`${baseUrl}/login`, params);
    const data = await respons.data;
    console.log(data);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    const modal = document.querySelector("#login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    localStorage.setItem("userImg", data.user.profile_image);
    shadowAlert("login success", "success");

    const alert = bootstrap.Alert.getOrCreateInstance(".alert");
    setTimeout(() => {
      alert.close();
    }, 1000);
  } catch (e) {
    const errorsMsg = e.response.data.errors;
    const usernameError = document.querySelector(".email-error");
    errorsMsg.email
      ? (usernameError.innerHTML = errorsMsg.email)
      : (usernameError.innerHTML = "");
  }
};

//register click
let registerBtnClicked = async function () {
  const username = document.querySelector("#register-username-input").value;
  const name = document.querySelector("#register-name-input").value;
  const password = document.querySelector("#register-password-input").value;
  const img = document.querySelector("#img-input").files[0];
  console.log(username, name, password, img);
  let err;
  //check passwordErrorr
  const passwordError = document.querySelector(".register-password-error");
  const passwordPattern =
    /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  const passwordMsg =
    "Password must be at least 8 characters long and include uppercase, lowercase, digit.";
  let checkPassword = checkInputError(
    password,
    passwordError,
    passwordPattern,
    passwordMsg
  );

  //check usernameErrorr
  const usernameError = document.querySelector(".register-username-error");
  const userimgError = document.querySelector(".register-img-error");
  const usernamePattern = /^[a-zA-Z]+([._]?[a-zA-Z0-9]+){3,}$/;
  const usernameMsg =
    "Username must start with a letter and be at least 4 characters long. It can include numbers&(. _).";
  let checkUsername = checkInputError(
    username,
    usernameError,
    usernamePattern,
    usernameMsg
  );
  err = checkPassword && checkUsername;
  console.log(err);
  let formData = new FormData();
  formData.append("username", username);
  formData.append("name", name);
  formData.append("password", password);
  formData.append("image", img);
  if (err) {
    try {
      const respons = await axios.post(`${baseUrl}/register`, formData);
      const data = await respons.data;
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      const modal = document.querySelector("#register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUI();
      shadowAlert("register success", "success");
      const alert = bootstrap.Alert.getOrCreateInstance(".alert");
      setTimeout(() => {
        alert.close();
      }, 2000);
    } catch (e) {
      const errorsMsg = e.response.data.errors;
      console.log(errorsMsg);
      errorsMsg.username
        ? (usernameError.innerHTML = errorsMsg.username)
        : (usernameError.innerHTML = "");
      errorsMsg.image
        ? (userimgError.innerHTML = errorsMsg.image[1])
        : (userimgError.innerHTML = "");
    }
  }
};

//log out
const logout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  shadowAlert("logout success", "success");
  const alert = bootstrap.Alert.getOrCreateInstance(".alert");
  setTimeout(() => {
    alert.close();
  }, 1000);
};

//add a new Post
let addPostBtnClicked = async function () {
  const title = document.getElementById("addpost-title-input").value;
  const body = document.getElementById("addpost-body-input").value;
  const img = document.getElementById("addpost-img-input").files[0];
  let token = localStorage.getItem("token");
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", img);
  try {
    let respons = await axios.post(`${baseUrl}/posts`, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    let data = await respons.data;
    const modal = document.querySelector("#addpost-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    getPosts();
    shadowAlert("post added", "success");
    const alert = bootstrap.Alert.getOrCreateInstance(".alert");
    setTimeout(() => {
      alert.close();
    }, 1000);
  } catch (e) {
    const errorsMsg = e.response.data.errors;
    const imgError = document.querySelector(".img-error");
    const bodyError = document.querySelector(".body-error");
    console.log(errorsMsg);
    errorsMsg.image
      ? (imgError.innerHTML = `${errorsMsg.image[1]}`)
      : (imgError.innerHTML = "");
    errorsMsg.body
      ? (bodyError.innerHTML = `${errorsMsg.body}`)
      : (bodyError.innerHTML = "");
  }
};

/////
getPosts();
setupUI();
