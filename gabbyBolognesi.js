let partyInterval = null;
let partyTime = false;

function playFunction() {
  document.getElementById("carousel").style.animationPlayState = "running";
}

function pauseFunction() {
  document.getElementById("carousel").style.animationPlayState = "paused";
}

function partyFunction() {
  const carousel = document.getElementById("carousel");
  const folderIcons = document.querySelectorAll(".folder-icon");

  if (!partyTime) {
    document.getElementById("carousel").style.animationPlayState = "running";

    partyTime = true;
    const partyColors = ["#B13BFF", "#FFCC00"];
    let colorIndex = 0;

    partyInterval = setInterval(() => {
      document.body.style.backgroundColor = partyColors[colorIndex];
      colorIndex = (colorIndex + 1) % partyColors.length;
    }, 250);

    alert("YOU HAVE ENTERED PARTY MODE!!!");

    carousel.classList.add("fast");

    folderIcons.forEach((icon) => icon.classList.add("pulse"));
  } else {
    partyTime = false;
    clearInterval(partyInterval);
    document.body.style.backgroundColor = "";
    carousel.classList.remove("fast");

    folderIcons.forEach((icon) => icon.classList.remove("pulse"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".draggable-item");

  items.forEach((item) => {
    const saved = localStorage.getItem(`icon-${item.id}`);
    if (saved) {
      const { top, left } = JSON.parse(saved);
      item.style.top = top;
      item.style.left = left;
    }
  });

  items.forEach((item) => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      offsetX = e.clientX - item.offsetLeft;
      offsetY = e.clientY - item.offsetTop;
      item.style.zIndex = 1000;
      item.style.cursor = "grabbing";

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (isDragging) {
        const desktop = document.getElementById("desktop-area");
        const footer = document.querySelector(".footer");

        const minX = 0;
        const minY = 0;

        const desktopBounds = desktop.getBoundingClientRect();
        const footerBounds = footer.getBoundingClientRect();

        const maxX = desktopBounds.width - item.offsetWidth;
        const maxY = footerBounds.top - desktopBounds.top - item.offsetHeight;

        let newLeft = e.clientX - offsetX;
        let newTop = e.clientY - offsetY;

        newLeft = Math.max(minX, Math.min(newLeft, maxX));
        newTop = Math.max(minY, Math.min(newTop, maxY));

        item.style.left = `${newLeft}px`;
        item.style.top = `${newTop}px`;
      }
    }

    function onMouseUp() {
      if (isDragging) {
        isDragging = false;
        item.style.zIndex = "";
        item.style.cursor = "grab";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const pos = {
          top: item.style.top,
          left: item.style.left,
        };
        localStorage.setItem(`icon-${item.id}`, JSON.stringify(pos));
      }
    }
  });
});

function openFolder(folderId) {
  const overlay = document.getElementById("folderOverlay");
  const contentBox = document.getElementById("folderContent");
  const contentBlock = document.getElementById(`content-${folderId}`);

  contentBox.innerHTML = contentBlock
    ? contentBlock.innerHTML.trim()
    : "No content found.";

  overlay.style.display = "flex";
}

function closeFolder() {
  document.getElementById("folderOverlay").style.display = "none";
}
