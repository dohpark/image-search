import api from "../../api/index.js";

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
    content.classList.remove("fadein");
    content.classList.add("fadeout");
    setTimeout(() => {
      this.imageViewer.innerHTML = "";
      target.removeChild(this.imageViewer);
    }, 600);
  };

  this.open = async (id) => {
    let count = 2;
    const { urls, alt_description, likes, tags, description } =
      await api.searchId(id);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "content";

    const imageInfo = document.createElement("div");
    imageInfo.className = "image-info";

    const imageLikes = document.createElement("div");
    imageLikes.className = "likes";
    imageLikes.innerHTML = `🔥 ${likes}`;
    imageInfo.appendChild(imageLikes);

    if (description) {
      count++;
      const imageDescription = document.createElement("div");
      imageDescription.className = "description";
      imageDescription.innerHTML = `${description}`;
      imageInfo.appendChild(imageDescription);
    }

    if (tags.length) {
      count++;
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
        <img src="${urls.regular}" alt="${
      alt_description ? alt_description : "no description"
    }"/>
      </div>`;

    contentWrapper.appendChild(imageInfo);
    this.imageViewer.appendChild(contentWrapper);
    target.appendChild(this.imageViewer);

    const content = document.querySelector(".content");
    content.classList.add("fadein");

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", (e) => {
      this.close();
    });
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
