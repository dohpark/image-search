import DarkMode from "./DarkMode/index.js";
import SearchBox from "./SearchBox/index.js";
import SearchResult from "./SearchResult/index.js";

function App() {
  this.renderElement = null;
  this.darkmode = null;
  this.searchBox = null;
  this.searchResult = null;
  this.data = [];
  this.keyword = null;
  this.page = 1;

  this.init = (elementQuery) => {
    this.renderElement = document.querySelector(elementQuery);

    // header
    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    h1.classList.add("hidden");
    h1.innerHTML = "이미지 검색";
    header.appendChild(h1);
    this.darkmode = new DarkMode(header);
    this.renderElement.appendChild(header);

    // navigation
    const nav = document.createElement("nav");
    this.renderElement.appendChild(nav);
    this.searchBox = new SearchBox(nav, {
      setData: this.setData,
      setPage: this.setPage,
      setKeyword: this.setKeyword,
    });

    // main
    const main = document.createElement("main");
    this.renderElement.appendChild(main);
    this.searchResult = new SearchResult(main, {
      getData: this.getData,
      getPage: this.getPage,
      getKeyword: this.getKeyword,
      setPage: this.setPage,
      setData: this.setData,
    });
  };

  // this.data
  this.getData = () => {
    return this.data;
  };
  this.setData = (data) => {
    this.data = data;
    this.searchResult.render();
  };

  // this.keyword
  this.getKeyword = () => {
    return this.keyword;
  };
  this.setKeyword = (keyword) => {
    this.keyword = keyword;
  };

  // this.page
  this.getPage = () => {
    return this.page;
  };
  this.setPage = (page) => {
    this.page = page;
  };
}

export default App;
