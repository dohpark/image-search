import api from "../../api/index.js";
import lazyLoading from "../../utils/lazyLoading.js";

function ImageViewer(target) {
  this.imageViewer = null;

  const createImageViewer = () => {
    const imageViewerWrapper = document.createElement("section");
    imageViewerWrapper.classList.add("modal", "image-viewer");

    return imageViewerWrapper;
  };

  this.init = () => {
    this.imageViewer = createImageViewer();
    this.bindEvents();
  };

  this.close = () => {
    const content = document.querySelector(".content");
    const fadeIn = document.querySelector(".fadein");
    if (fadeIn) {
      content.classList.remove("fadein");
      content.classList.add("fadeout");
      content.addEventListener("animationend", () => {
        this.imageViewer.innerHTML = "";
        target.removeChild(this.imageViewer);
      });
      document.body.style["overflow-y"] = "scroll";
    }
  };

  this.open = async (id) => {
    document.body.style["overflow-y"] = "hidden";
    const { urls, alt_description, likes, tags, description, user } =
      await api.searchId(id);

    console.log(await api.searchId(id));

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "content";

    const imageInfo = document.createElement("div");
    imageInfo.className = "image-info";

    // likes
    const imageLikes = document.createElement("div");
    imageLikes.className = "likes";
    imageLikes.innerHTML = `🔥 ${likes}`;
    imageInfo.appendChild(imageLikes);

    // description
    const imageDescription = document.createElement("div");
    imageDescription.className = "description";
    imageDescription.innerHTML = `<span class="id">${user.username}</span> ${
      description ? description : ""
    }`;
    imageInfo.appendChild(imageDescription);

    // tags
    if (tags.length) {
      const imageTags = document.createElement("div");
      imageTags.className = "tags";
      let tagsValue = "";
      tags.map((tag) => {
        tagsValue += ` #${tag.title}`;
      });
      imageTags.innerHTML = tagsValue;

      imageInfo.appendChild(imageTags);
    }

    contentWrapper.innerHTML = `
      <div class="title">
        <span>${alt_description ? alt_description : "noTitle"}</span>
        <div class="close">x</div>
      </div>
      <div class="image-container">
        <img src="${urls.thumb}" alt="${
      alt_description ? alt_description : "no description"
    }" data-full=${urls.full} />
      </div>`;

    // appendChild
    contentWrapper.appendChild(imageInfo);
    this.imageViewer.appendChild(contentWrapper);
    target.appendChild(this.imageViewer);

    // fade-in animation
    const content = document.querySelector(".content");
    content.classList.add("fadein");

    // x button
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", (e) => {
      this.close();
    });

    // lazy-loading
    lazyLoading("data-full", ".image-viewer img");
  };

  this.bindEvents = () => {
    this.imageViewer.addEventListener("click", (e) => {
      const currentTarget = e.target;
      if (this.imageViewer === currentTarget) {
        this.close();
      }
    });
  };

  this.init();
}

export default ImageViewer;
