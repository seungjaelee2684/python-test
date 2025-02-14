fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
    });

function getAccessTokenFromCookie(name) {
    const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
    return (cookies) ? cookies.get(name) : null;
}

function checkAccessTokenAndRedirect() {
    const accessToken = getAccessTokenFromCookie("access_token");
    const userId = getAccessTokenFromCookie("user_id");
    if (!accessToken) return window.location.href = "/index.html";

    const headerTitle = document.getElementById("dashboard_header_title");
    headerTitle.innerText = `어서오세요, ${userId} 님!`;

    fetch("http://127.0.0.1:5000/inquiry/link", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(res => res.json())
        .then(data => {
            if (data.state === 200) {
                console.log('성공', data.message);
            } else {
                
            };
        });
}

window.onload = checkAccessTokenAndRedirect; // 페이지 로드 시 바로 실행

function handleClickLogout(e) {
    e.preventDefault();
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
};

document.getElementById("logout").addEventListener("click", handleClickLogout);