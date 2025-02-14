function handleClickGotoSignup(e) {
    e.preventDefault();
    const divBox = document.getElementById("bg_form_container");
    const formBox1 = document.getElementById("login_form_container_1");
    const formBox2 = document.getElementById("login_form_container_2");
    divBox.style.transform = "translateX(-100%)";
    divBox.innerText = "새로운 계정을 만들어보세요!";
    formBox1.style.opacity = "0";
    formBox2.style.opacity = "1";
};

function handleClickGotoLogin(e) {
    e.preventDefault();
    const divBox = document.getElementById("bg_form_container");
    const formBox1 = document.getElementById("login_form_container_1");
    const formBox2 = document.getElementById("login_form_container_2");
    divBox.style.transform = "translateX(0)";
    divBox.innerText = "내 계정에 로그인";
    formBox2.style.opacity = "0";
    formBox1.style.opacity = "1";
};

function handleClickLogin(e) {
    e.preventDefault();
    const loginButton = document.getElementById("login");
    window.location.href = "/src/pages/dashboard.html";
};

document.getElementById("goSignup").addEventListener("click", handleClickGotoSignup);
document.getElementById("goLogin").addEventListener("click", handleClickGotoLogin);
document.getElementById("login").addEventListener("click", handleClickLogin);