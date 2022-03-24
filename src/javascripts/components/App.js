import Search from "./Search/index.js";
import DarkMode from "./DarkMode/index.js";

function App() {
  this.renderElement = null;
  this.darkmode = null;
  this.search = null;

  this.init = (elementQuery) => {
    this.renderElement = document.querySelector(elementQuery);
    this.darkmode = new DarkMode(this.renderElement);
    this.search = new Search(this.renderElement);
  };
}

export default App;
