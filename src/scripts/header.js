let isOpen = false;

function updateLayout() {
  const width = window.innerWidth;
  const headerBox = document.querySelector(".header_container");

  if (width < 1040) {
    headerBox.style.transform = `translateX(-100%)`;
  } else {
    headerBox.style.transition = "none";
  }
}

window.addEventListener('resize', updateLayout);
updateLayout();

function handleClickOpenModal(e) {
  e.preventDefault();
  isOpen = !isOpen;

  const headerBox = document.querySelector(".header_container");

  if (isOpen) {
    headerBox.style.transition = "all 0.4s ease-in-out";
    headerBox.style.transform = "translateX(0)";
  } else {
    headerBox.style.transition = "all 0.4s ease-in-out";
    headerBox.style.transform = "translateX(-100%)";
  };
};
document.getElementById("open_header_button").addEventListener("click", handleClickOpenModal);