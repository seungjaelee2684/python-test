let linkList = [];

fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
    });

function getAccessTokenFromCookie(name) {
    const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
    return (cookies) ? cookies.get(name) : null;
};

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

    const accessToken = getAccessTokenFromCookie("access_token");
    const userId = getAccessTokenFromCookie("user_id");
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

        a.href = item?.link;
        spanTag.textContent = `# ${item?.category}`;
        label.textContent = `# ${item?.name}`;
        spanId.textContent = `# ${item?.created_by}`;

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