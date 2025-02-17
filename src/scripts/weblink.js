function handleClickLogout(e) {
  e.preventDefault();
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/";
};
document.getElementById("logout").addEventListener("click", handleClickLogout);

// accessToken 추출
function getAccessTokenFromCookie(name) {
  const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
  return (cookies) ? cookies.get(name) : null;
};
const accessToken = getAccessTokenFromCookie("access_token");

// 전체 링크 조회
async function renderLink(linkId) {
  let data;

  if (!accessToken) return window.location.href = "/index.html";

  const sharingList = document.getElementById("sharing_list");
  sharingList.innerHTML = '<button class="sharing_add_button">+</button>';

  try {
    const response = await fetch(`http://127.0.0.1:5000/link/inquiry/detail?link=${linkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });

    data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("error: ", error.message);
  };

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