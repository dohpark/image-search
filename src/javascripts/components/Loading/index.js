function Loading() {
  this.body = null;
  this.loading = null;
  this.state = false;

  this.init = () => {
    this.body = document.querySelector("body");
    this.loading = createLoadingElement();
  };

  const createLoadingElement = () => {
    const loadingWrapper = document.createElement("div");
    const loadingContent = document.createElement("div");
    const loadingImage = document.createElement("img");

    loadingWrapper.classList.add("modal", "loading");
    loadingContent.classList.add("loading-content");
    loadingImage.src = "../../../images/loading.gif";

    loadingContent.appendChild(loadingImage);
    loadingWrapper.appendChild(loadingContent);

    return loadingWrapper;
  };

  this.on = () => {
    this.state = true;
    this.render();
  };

  this.off = () => {
    this.state = false;
    this.render();
  };

  this.render = () => {
    if (this.state) {
      this.body.appendChild(this.loading);
    } else {
      this.body.removeChild(this.loading);
    }
  };

  this.init();
}

export default Loading;
