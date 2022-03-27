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
    this.darkmode = new DarkMode(this.renderElement);
    this.searchBox = new SearchBox(this.renderElement, {
      setData: this.setData,
      setPage: this.setPage,
      setKeyword: this.setKeyword,
    });
    this.searchResult = new SearchResult(this.renderElement, {
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
