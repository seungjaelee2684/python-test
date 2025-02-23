function handleClickGotoSignup(e) {
    e.preventDefault();
    const width = window.innerWidth;

    if (width < 1040) {
        const formBox1 = document.getElementById("login_form_container_1");
        const formBox2 = document.getElementById("login_form_container_2");
        formBox1.style.transform = "translateX(-100%)";
        formBox2.style.transform = "translateX(-100%)";
    } else {
        const divBox = document.getElementById("bg_form_container");
        const formBox1 = document.getElementById("login_form_container_1");
        const formBox2 = document.getElementById("login_form_container_2");
        divBox.style.transform = "translateX(-100%)";
        divBox.innerText = "새로운 계정을 만들어보세요!";
        formBox1.style.opacity = "0";
        formBox2.style.opacity = "1";
    };
};

function handleClickGotoLogin(e) {
    e.preventDefault();
    const width = window.innerWidth;

    if (width < 1040) {
        const formBox1 = document.getElementById("login_form_container_1");
        const formBox2 = document.getElementById("login_form_container_2");
        formBox1.style.transform = "translateX(0)";
        formBox2.style.transform = "translateX(0)";
    } else {
        const divBox = document.getElementById("bg_form_container");
        const formBox1 = document.getElementById("login_form_container_1");
        const formBox2 = document.getElementById("login_form_container_2");
        divBox.style.transform = "translateX(0)";
        divBox.innerText = "내 계정에 로그인";
        formBox2.style.opacity = "0";
        formBox1.style.opacity = "1";
    };
};

document.getElementById("goSignup").addEventListener("click", handleClickGotoSignup);
document.getElementById("goLogin").addEventListener("click", handleClickGotoLogin);


function postHandleClickLogin(e) {
    e.preventDefault();
    const id = document.getElementById("login_id").value;
    const password = document.getElementById("login_password").value;
    const errorText = document.getElementById("login_error_text");

    const fetchData = {
        username: id,
        password: password
    };

    if (id.length <= 0) return errorText.innerText = "아이디를 입력해주세요.";
    if (password.length <= 0) return errorText.innerText = "비밀번호를 입력해주세요.";

    fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fetchData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.state === 201) {
                errorText.style.color = "#333333";
                errorText.innerText = "";

                const newDate = new Date();
                newDate.setTime(newDate.getTime() + (60 * 60 * 1000));

                document.cookie = `access_token=${data.access_token}; expires=${newDate.toUTCString()}; path=/;`;
                document.cookie = `my_id=${data.user_id}; expires=${newDate.toUTCString()}; path=/;`;
                window.location.href = "/";
            } else {
                errorText.innerText = data.error;
            };
        });
};

function postHandleClickSignup(e) {
    e.preventDefault();
    const id = document.getElementById("signup_id").value;
    const password = document.getElementById("signup_password").value;
    const passwordCurrent = document.getElementById("signup_password_current").value;
    const errorText = document.getElementById("signup_error_text");

    const fetchData = {
        username: id,
        password: password
    };

    const idRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{3,16}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&,.])[A-Za-z\d@$!%*?&,.]{8,}$/;

    if (id.length <= 0) return errorText.innerText = "아이디를 입력해주세요.";
    if (password.length <= 0) return errorText.innerText = "비밀번호를 입력해주세요.";
    if (!idRegex.test(id)) return errorText.innerText = "아이디는 3~16자리, 영문(소문자)과 숫자조합이어야 합니다.";
    if (!passwordRegex.test(password)) return errorText.innerText = "비밀번호는 최소 8자리 이상, 영문, 숫자, 특수문자를 포함해야 합니다.";
    if (password !== passwordCurrent) return errorText.innerText = "입력하신 비밀번호가 서로 일치하지 않습니다.";

    fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fetchData)
    })
        .then(res => res.json())
        .then(data => {
            if (data.state === 201) {
                alert(data.message);
                errorText.style.color = "#333333";
                errorText.innerText = "";
                window.location.reload();
            } else {
                errorText.innerText = data.error;
            };
        })
        .catch(error => {
            errorText.innerText = "오류가 발생했습니다.";
        });
};

document.getElementById("login_form_container_1").addEventListener("submit", postHandleClickLogin);
document.getElementById("login_form_container_2").addEventListener("submit", postHandleClickSignup);