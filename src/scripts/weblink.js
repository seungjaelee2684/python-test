const categoryObj = {
  "bookmark": "즐겨찾기",
  "business": "업무 활용 자료",
  "reference": "참고 자료",
  "education": "교육 및 학습 자료"
};

let searchTag = "name";
let post_id;
let rightData;

// accessToken 추출
function getAccessTokenFromCookie(name) {
  const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
  return (cookies) ? cookies.get(name) : null;
};
const accessToken = getAccessTokenFromCookie("access_token");
const myId = getAccessTokenFromCookie("my_id");

// 로그인, 로그아웃
function handleClickLogoutLink(e) {
  e.preventDefault();

  if (accessToken) {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "my_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  } else {
    window.location.href = "join.html";
  };
};
document.getElementById("join_button").addEventListener("click", handleClickLogoutLink);

function handleClickSearchTag(e, tag) {
  e.preventDefault();
  const searchNameBtn = document.getElementById("search_tag_button_name");
  const searchCategoryBtn = document.getElementById("search_tag_button_category");
  searchTag = tag;
  if (tag === "category") {
    searchNameBtn.style.color = "#e9e9e9";
    searchCategoryBtn.style.color = "#ffffff";
    searchNameBtn.style.fontWeight = "400";
    searchCategoryBtn.style.fontWeight = "700";
  } else {
    searchNameBtn.style.color = "#ffffff";
    searchCategoryBtn.style.color = "#e9e9e9";
    searchNameBtn.style.fontWeight = "700";
    searchCategoryBtn.style.fontWeight = "400";
  };
};
document.getElementById("search_tag_button_name").addEventListener("click", (e) => handleClickSearchTag(e, "name"));
document.getElementById("search_tag_button_category").addEventListener("click", (e) => handleClickSearchTag(e, "category"));

function handleClickOpenModalShared(e) {
  e.preventDefault();
  const modalBg = document.getElementById("sharing_id_modal_background");
  const modalBox = document.getElementById("sharing_id_modal_container");
  modalBg.style.visibility = "visible";
  modalBox.style.visibility = "visible";
  modalBox.style.opacity = "1";

  const userId = document.getElementById("sharing_user_id");
  const checkboxRead = document.getElementById("checkbox_input_read");
  const checkboxWrite = document.getElementById("checkbox_input_write");
  userId.value = "";
  checkboxRead.checked = true;
  checkboxWrite.checked = false;
};

function updateSharingId(e) {
  e.preventDefault();

  const rightResult = rightData?.data;

  const userId = document.getElementById("sharing_user_id");
  const checkboxRead = document.getElementById("checkbox_input_read");
  const checkboxWrite = document.getElementById("checkbox_input_write");

  const updateData = {
    id: rightResult?.id,
    post_id: rightResult?.post_id,
    user_id: userId.value,
    can_read: checkboxRead.checked,
    can_write: checkboxWrite.checked
  };

  fetch(`http://127.0.0.1:5000/right/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(updateData)
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.message);
    });
};

async function handleClickOpenUpdateShared(e, rightId) {
  e.preventDefault();
  const modalBg = document.getElementById("sharing_id_modal_background");
  const modalBox = document.getElementById("sharing_id_modal_container");
  modalBg.style.visibility = "visible";
  modalBox.style.visibility = "visible";
  modalBox.style.opacity = "1";

  const updateButtonBox = document.getElementById("modal_sharing_button");
  updateButtonBox.addEventListener("click", updateSharingId);

  const headers = (accessToken)
    ? {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
    : {
      "Content-Type": "application/json",
    };

  try {
    const response = await fetch(`http://127.0.0.1:5000/right/inquiry/detail?right_id=${rightId}`, {
      method: "GET",
      headers: headers,
    });

    rightData = await response.json();
  } catch (error) {
    console.error("error: ", error.message);
  };

  const rightResult = rightData?.data;
  const userId = document.getElementById("sharing_user_id");
  const checkboxRead = document.getElementById("checkbox_input_read");
  const checkboxWrite = document.getElementById("checkbox_input_write");
  userId.value = rightResult?.user_id;
  checkboxRead.checked = Boolean(rightResult?.can_read);
  checkboxWrite.checked = Boolean(rightResult?.can_write);

  console.log(rightResult);
};

// 전체 링크 조회
async function renderLink(linkId) {
  let data;
  let shared_list;

  const sharingList = document.getElementById("sharing_list");

  const searchNameBtn = document.getElementById("search_tag_button_name");
  searchNameBtn.style.color = "#ffffff";
  searchNameBtn.style.fontWeight = "700";

  const idText = document.getElementById("dashboard_header_title");
  idText.innerText = (myId) ? `${myId} 님` : "";

  const icon = document.getElementById("join_button");
  icon.innerText = (accessToken) ? "Logout" : "Login";

  const headers = (accessToken)
    ? {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
    : {
      "Content-Type": "application/json",
    };

  try {
    const response = await fetch(`http://127.0.0.1:5000/link/inquiry/detail?link=${linkId}`, {
      method: "GET",
      headers: headers,
    });

    data = await response.json();
  } catch (error) {
    console.error("error: ", error.message);
  };

  const result = data?.data;
  console.log(result);
  const dashboardTitle = document.getElementById("dashboard_title");
  console.log("🚀 ~ renderLink ~ dashboardTitle:", dashboardTitle)
  dashboardTitle.innerText = `${result?.name}`;
  post_id = result?.id;

  if (result?.is_owner) {
    const sharingButton = document.createElement("button");
    sharingButton.classList.add("sharing_add_button");
    sharingButton.setAttribute("id", "sharing_add_button");
    sharingButton.innerText = "+";
    sharingList.prepend(sharingButton);
    sharingButton.addEventListener("click", handleClickOpenModalShared);
  }

  const urlText = document.getElementById("link_detail_a");
  const descriptionText = document.getElementById("link_detail_information");
  urlText.innerText = `${result?.url}`;
  urlText.href = `${result?.url}`;
  urlText.target = "_blank";
  descriptionText.innerText = `${result?.description}`;

  try {
    const res = await fetch(`http://127.0.0.1:5000/right/inquiry?link=${linkId}`, {
      method: "GET",
      headers: headers,
    });

    if (!res.ok) {
      if (res.status !== 200) {
        alert("읽기 권한이 없습니다.");
        window.location.href = "/";
      };
      return; // 더 이상 진행하지 않음
    };

    shared_list = await res.json();
  } catch (error) {
    console.error("error: ", error.message);
  };

  const shared_list_result = shared_list?.data;
  console.log(shared_list_result);
  shared_list_result?.forEach(item => {
    const li = document.createElement("li");
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");

    li.classList.add("sharing_user");
    div1.classList.add("sharing_user_circle");
    div2.classList.add("sharing_user_id");

    div1.innerText = `${item?.user_id.slice(0, 1)}`;
    div2.innerText = `${item?.user_id}`;

    li.appendChild(div1);
    li.appendChild(div2);
    sharingList.appendChild(li);

    if (data?.data?.is_owner && item?.user_id !== myId) {
      li?.addEventListener("click", (e) => handleClickOpenUpdateShared(e, item?.id));
    }
    console.log(data?.data?.is_owner);
  });

  const is_right = shared_list_result?.find(item => (item.user_id === myId) && (item.can_write === 1));
  if (is_right) {
    const div3 = document.getElementById("write_button_wrapper");
    div3.innerHTML = `
      <button id="change_button" class="write_button">수정</button>
      <button id="remove_button" class="write_button">삭제</button>
    `;
  };
  console.log("test", is_right);
};

function updateLink() {
  const params = new URLSearchParams(window.location.search).get("link");
  renderLink(params);
};
updateLink();

// 업로드 모달 창 열기
function handleClickAddLinkModalOpen() {
  if (!accessToken) return alert("로그인이 필요한 서비스입니다.");
  const modalBg = document.getElementById("modal_background");
  const modalBox = document.getElementById("modal_container");
  modalBg.style.visibility = "visible";
  modalBox.style.visibility = "visible";
  modalBox.style.opacity = "1";
};
document.getElementById("add_link_button").addEventListener("click", handleClickAddLinkModalOpen);

// 업로드 모달 창 닫기
function handleClickCloseModal(e) {
  e.preventDefault();
  const modalBg = document.getElementById("modal_background");
  const modalBox = document.getElementById("modal_container");
  modalBg.style.visibility = "hidden";
  modalBox.style.visibility = "hidden";
  modalBox.style.opacity = "0";
};
document.getElementById("modal_close_button").addEventListener("click", handleClickCloseModal);

function handleClickCloseModalShared(e) {
  e.preventDefault();
  const modalBg = document.getElementById("sharing_id_modal_background");
  const modalBox = document.getElementById("sharing_id_modal_container");
  modalBg.style.visibility = "hidden";
  modalBox.style.visibility = "hidden";
  modalBox.style.opacity = "0";
};
document.getElementById("modal_sharing_close_button").addEventListener("click", handleClickCloseModalShared);

// 링크 업로드
function handleClickUploadLink(e) {
  e.preventDefault();
  const name = document.querySelector('input[name="name"]').value;
  const description = document.querySelector('input[name="description"]').value;
  const url = document.querySelector('input[name="url"]').value;
  const shared_id = document.querySelector('input[name="shared_id"]').value;
  const category = document.querySelector('input[name="category"]:checked').value;

  const uploadData = {
    name: name,
    description: description,
    url: url,
    shared_id: (shared_id.length > 0) ? JSON.stringify([shared_id]) : JSON.stringify([]),
    category: category
  };

  fetch("http://127.0.0.1:5000/link/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(uploadData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.state === 200) {
        alert(data.message);
        window.location.href = "";
      } else {
        alert(data.message);
      };
    });
};
document.getElementById("modal_upload_button").addEventListener("click", handleClickUploadLink);

function handleSubmitSharingUser(e) {
  e.preventDefault();
  const userId = document.getElementById("sharing_user_id").value;
  const checkboxRead = document.getElementById("checkbox_input_read").checked;
  const checkboxWrite = document.getElementById("checkbox_input_write").checked;

  const addData = {
    post_id: post_id,
    user_id: userId,
    can_read: checkboxRead,
    can_write: checkboxWrite
  };
  console.log(addData);

  fetch("http://127.0.0.1:5000/right/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(addData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.state === 200) {
        alert(data.message);
        window.location.href = "";
      } else {
        alert(data.message);
      };
    });
};
document.getElementById("sharing_id_modal_container").addEventListener("submit", handleSubmitSharingUser);

function focusInputMoveSearchPage(e) {
  e.preventDefault();
  const searchValue = document.getElementById("dashboard_header_search").value;
  window.location.href = `/search.html?tag=${searchTag}&word=${searchValue}`;
};
document.getElementById("header_search_box").addEventListener("submit", focusInputMoveSearchPage);