import Search from "./Search/index.js";

function App() {
  this.renderElement = null;
  this.search = null;

  this.init = (elementQuery) => {
    this.renderElement = document.querySelector(elementQuery);
    this.search = new Search(this.renderElement);
    this.search.render();
  };
}

export default App;
