const categoryObj = {
    "bookmark": "즐겨찾기",
    "business": "업무 활용 자료",
    "reference": "참고 자료",
    "education": "교육 및 학습 자료"
};

function getAccessTokenFromCookie(name) {
    const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
    return (cookies) ? cookies.get(name) : null;
};

const accessToken = getAccessTokenFromCookie("access_token");
const userId = getAccessTokenFromCookie("user_id");

function handleClickLogout(e) {
    e.preventDefault();
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
};

document.getElementById("logout").addEventListener("click", handleClickLogout);

function getCategoryFromHash() {
    return window.location.hash.replace("#", "") || null; // 기본값 설정
}

async function renderList(category) {
    let data;

    if (!accessToken) return window.location.href = "/index.html";

    const headerTitle = document.getElementById("dashboard_header_title");
    headerTitle.innerText = `어서오세요, ${userId} 님!`;

    const ul = document.getElementById("dashboard_post_list");
    ul.innerHTML = "";

    const fetchLink = (category)
        ? `http://127.0.0.1:5000/link/inquiry?tag=${category}`
        : "http://127.0.0.1:5000/link/inquiry"

    try {
        const response = await fetch(fetchLink, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        data = await response.json();
    } catch (error) {
        console.error("error: ", error.message);
    };

    data?.data.forEach(item => {
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

        a.href = item?.url;
        a.target = '_blank';
        spanTag.textContent = `# ${categoryObj[item?.category]}`;
        label.textContent = `${item?.name}`;
        spanId.textContent = `${item?.created_by} 님`;

        a.appendChild(spanTag);
        a.appendChild(label);
        a.appendChild(spanId);
        li.appendChild(a);
        ul.appendChild(li);
    });
}

function updateList() {
    const category = getCategoryFromHash();
    renderList(category);
}

window.addEventListener("hashchange", updateList);
updateList();

function handleClickAddLinkModalOpen() {
    const modalBg = document.getElementById("modal_background");
    const modalBox = document.getElementById("modal_container");
    modalBg.style.visibility = "visible";
    modalBox.style.visibility = "visible";
    modalBox.style.opacity = "1";
};
document.getElementById("add_link_button").addEventListener("click", handleClickAddLinkModalOpen);

function handleClickCloseModal(e) {
    e.preventDefault();
    const modalBg = document.getElementById("modal_background");
    const modalBox = document.getElementById("modal_container");
    modalBg.style.visibility = "hidden";
    modalBox.style.visibility = "hidden";
    modalBox.style.opacity = "0";
};
document.getElementById("modal_close_button").addEventListener("click", handleClickCloseModal);

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
                window.location.href = "/";
            } else {
                alert(data.message);
            };
        });
};
document.getElementById("modal_upload_button").addEventListener("click", handleClickUploadLink);