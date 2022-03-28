import debounce from "../../utils/debounce.js";
import checkSearchHistory from "../../utils/checkSearchHistory.js";
import api from "../../api/index.js";

function SearchBox(target, { setData, setPage, setKeyword }) {
  this.searchBox = null;
  this.keyword = null;
  this.history = [];

  this.init = async () => {
    this.searchBar = createSearchBar();
    target.appendChild(this.searchBar);

    // localStorage
    const localStorageHistory = JSON.parse(
      localStorage.getItem("searchHistory")
    );
    if (!localStorageHistory || !localStorageHistory.length) {
      localStorage.setItem("searchHistory", JSON.stringify([]));
    } else {
      this.history = localStorageHistory;
      this.keyword = this.history[0];
      const result = await api.searchPhotos(this.keyword, 1);
      setKeyword(this.keyword);
      setPage(1);
      setData(result.results);
    }

    // bindEvents()
    this.bindEvents();

    // render();
    this.render();
  };

  this.render = () => {
    // searchHistory
    const searchHistoryWrapper = document.querySelector(
      ".search-history-wrapper"
    );

    if (this.history.length) {
      // style
      const input = document.querySelector(".search-input");
      input.style["border-bottom-left-radius"] = "0px";
      input.style["border-bottom-right-radius"] = "0px";
      searchHistoryWrapper.style.display = "block";

      // content
      const searchHistoryContent = document.querySelector(
        ".search-history-content"
      );
      searchHistoryContent.innerHTML = "";
      this.history.map((keyword) => {
        const searchHistoryItem = document.createElement("div");
        searchHistoryItem.innerHTML = keyword;
        searchHistoryItem.className = "search-history-item";
        searchHistoryContent.appendChild(searchHistoryItem);
      });

      // searchHistory event
      searchHistoryContent
        .querySelectorAll(".search-history-item")
        .forEach((item) => {
          item.addEventListener("click", async (e) => {
            this.keyword = e.target.innerHTML;
            this.history = checkSearchHistory(this.history, this.keyword);
            localStorage.setItem("searchHistory", JSON.stringify(this.history));
            const result = await api.searchPhotos(this.keyword, 1);
            setKeyword(this.keyword);
            setData(result.results);
            setPage(1);
            this.render();
          });
        });
    } else {
      searchHistoryWrapper.style.display = "none";
    }
  };

  this.bindEvents = () => {
    const searchBar = this.searchBar.querySelector(".search-input");
    searchBar.focus();

    searchBar.addEventListener("click", () => {
      searchBar.value = null;
    });

    searchBar.addEventListener(
      "keyup",
      debounce(async (e) => {
        if (e.keyCode === 13) {
          this.keyword = searchBar.value;
          this.history = checkSearchHistory(this.history, this.keyword);
          localStorage.setItem("searchHistory", JSON.stringify(this.history));
          const result = await api.searchPhotos(this.keyword, 1);
          setKeyword(this.keyword);
          setPage(1);
          setData(result.results);
          this.render();
        }
      }, 100)
    );
  };

  const createSearchBar = () => {
    // searchWrapper
    const searchBarWrapper = document.createElement("div");
    searchBarWrapper.className = "search-input-wrapper";

    // searchBar
    const searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
    searchBar.placeholder = "사진을 검색해보세요.";
    searchBar.className = "search-input";

    // searchHistory
    const searchHistoryWrapper = document.createElement("div");
    searchHistoryWrapper.className = "search-history-wrapper";

    const searchHistoryTitle = document.createElement("div");
    searchHistoryTitle.className = "search-history-title";
    searchHistoryTitle.innerHTML = "최근 검색 내역";

    const searchHistoryContent = document.createElement("div");
    searchHistoryContent.className = "search-history-content";

    // append
    searchHistoryWrapper.appendChild(searchHistoryTitle);
    searchHistoryWrapper.appendChild(searchHistoryContent);
    searchBarWrapper.appendChild(searchBar);
    searchBarWrapper.appendChild(searchHistoryWrapper);

    return searchBarWrapper;
  };

  this.init();
}

export default SearchBox;
