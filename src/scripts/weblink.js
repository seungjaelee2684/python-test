const categoryObj = {
  "bookmark": "즐겨찾기",
  "business": "업무 활용 자료",
  "reference": "참고 자료",
  "education": "교육 및 학습 자료"
};

let searchTag = "name";

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

// 전체 링크 조회
async function renderLink(linkId) {
  let data;

  const searchNameBtn = document.getElementById("search_tag_button_name");
  searchNameBtn.style.color = "#ffffff";
  searchNameBtn.style.fontWeight = "700";

  const idText = document.getElementById("dashboard_header_title");
  idText.innerText = (myId) ? `${myId} 님` : "";

  const icon = document.getElementById("join_button");
  icon.innerText = (accessToken) ? "Logout" : "Login";

  const sharingList = document.getElementById("sharing_list");
  sharingList.innerHTML = '<button class="sharing_add_button">+</button>';

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

  // data?.data.forEach(item => {
  //   const li = document.createElement("li");
  //   const a = document.createElement("a");
  //   const spanTag = document.createElement("span");
  //   const label = document.createElement("label");
  //   const spanId = document.createElement("span");

  //   li.classList.add("dashboard_post_lane");
  //   a.classList.add("post_link");
  //   spanTag.classList.add("post_tag");
  //   label.classList.add("post_title");
  //   spanId.classList.add("post_id");

  //   a.href = `/weblink.html?link=${item?.id}`;
  //   spanTag.textContent = `# ${categoryObj[item?.category]}`;
  //   label.textContent = `${item?.name}`;
  //   spanId.textContent = `${item?.created_by} 님`;

  //   a.appendChild(spanTag);
  //   a.appendChild(label);
  //   a.appendChild(spanId);
  //   li.appendChild(a);
  //   ul.appendChild(li);
  // });
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

function focusInputMoveSearchPage(e) {
  e.preventDefault();
  const searchValue = document.getElementById("dashboard_header_search").value;
  window.location.href = `/search.html?tag=${searchTag}&word=${searchValue}`;
};
document.getElementById("header_search_box").addEventListener("submit", focusInputMoveSearchPage);