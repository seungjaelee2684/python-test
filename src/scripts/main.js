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
function handleClickLogout(e) {
    e.preventDefault();

    if (accessToken) {
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "my_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    } else {
        window.location.href = "join.html";
    };
};
document.getElementById("join_button").addEventListener("click", handleClickLogout);

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
async function renderList(category) {
    let data;

    const searchNameBtn = document.getElementById("search_tag_button_name");
    const searchCategoryBtn = document.getElementById("search_tag_button_category");
    searchNameBtn.style.color = "#ffffff";
    searchCategoryBtn.style.color = "#e9e9e9";
    searchNameBtn.style.fontWeight = "700";
    searchCategoryBtn.style.fontWeight = "400";

    const idText = document.getElementById("dashboard_header_title");
    idText.innerText = (myId) ? `${myId} 님` : "";

    const icon = document.getElementById("join_button");
    icon.innerText = (accessToken) ? "Log Out" : "Log In";

    const ul = document.getElementById("dashboard_post_list");
    ul.innerHTML = "";

    const fetchLink = (category)
        ? `http://127.0.0.1:5000/link/inquiry?tag=${category}`
        : "http://127.0.0.1:5000/link/inquiry";

    const headers = (accessToken)
        ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
        : {
            "Content-Type": "application/json",
        };

    try {
        const response = await fetch(fetchLink, {
            method: "GET",
            headers: headers,
        });

        data = await response.json();
    } catch (error) {
        console.error("error: ", error.message);
    };

    data?.data?.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        const spanTag = document.createElement("span");
        const label = document.createElement("label");
        const spanId = document.createElement("span");

        li.classList.add("dashboard_post_lane");
        a.classList.add("post_link");
        spanTag.classList.add("post_tag");
        label.classList.add("post_title");
        spanId.classList.add("post_id");

        a.href = `/weblink.html?link=${item?.id}`;
        spanTag.textContent = `# ${categoryObj[item?.category]}`;
        label.textContent = `${item?.name}`;
        spanId.textContent = (item?.is_owner) ? "내 게시물" : `${item?.created_by} 님`;

        a.appendChild(spanTag);
        a.appendChild(label);
        a.appendChild(spanId);
        li.appendChild(a);
        ul.appendChild(li);

        li.style.backgroundColor = (item?.is_owner) ? "#16456e" : "#619fd5";
    });
}

// 해시태그 이동
function getCategoryFromHash() {
    const hashTag = window.location.hash.replace("#", "") || null;
    return hashTag;
};
function updateList() {
    const category = getCategoryFromHash();
    renderList(category);
    document.querySelectorAll("li#header_nav_button").forEach(li => {
        li.style.backgroundColor = "";
        li.style.fontWeight = "";
    });

    if (!category) {
        const tagButton = document.querySelector(`li#header_nav_button a[href=""]`)?.closest("li");
        tagButton.style.backgroundColor = "#356997";
        tagButton.style.fontWeight = "600";
        return;
    };

    const tagButton = document.querySelector(`li#header_nav_button a[href="#${category}"]`)?.closest("li");
    tagButton.style.backgroundColor = "#356997";
    tagButton.style.fontWeight = "600";
}
window.addEventListener("hashchange", updateList);
updateList();

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
    const description = document.querySelector('textarea[name="description"]').value;
    const url = document.querySelector('input[name="url"]').value;
    const category = document.querySelector('input[name="category"]:checked').value;

    const uploadData = {
        name: name,
        description: description,
        url: url,
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