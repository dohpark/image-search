function DarkMode(target) {
  this.button = null;
  this.state = null;

  const createButton = () => {
    const button = document.createElement("button");
    button.className = "mode-button";
    return button;
  };

  this.init = () => {
    this.button = createButton();
    target.appendChild(this.button);
    this.state = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (this.state) {
      const body = document.body;
      body.classList.toggle("dark-mode");
      this.button.innerHTML = "Ligth Mode";
    } else {
      this.button.innerHTML = "Dark Mode";
    }
    this.bindEvents();
  };

  this.bindEvents = () => {
    this.button.addEventListener("click", (e) => {
      const body = document.body;
      body.classList.toggle("dark-mode");
      if (this.state) {
        this.state = false;
        this.button.innerHTML = "Dark Mode";
      } else {
        this.state = true;
        this.button.innerHTML = "Ligth Mode";
      }
    });
  };

  this.init();
}

export default DarkMode;
