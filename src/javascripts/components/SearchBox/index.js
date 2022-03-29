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
        // wrapper
        const searchHistoryItem = document.createElement("div");
        searchHistoryItem.className = "search-history-item";

        // content
        const content = document.createElement("div");
        content.innerHTML = keyword;
        content.className = "history-content";

        // button
        const button = document.createElement("span");
        button.innerHTML = "x";
        button.className = "history-x-button";

        searchHistoryItem.appendChild(content);
        searchHistoryItem.appendChild(button);
        searchHistoryContent.appendChild(searchHistoryItem);
      });

      // searchHistory event
      searchHistoryContent
        .querySelectorAll(".search-history-item .history-content")
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

      searchHistoryContent
        .querySelectorAll(".search-history-item .history-x-button")
        .forEach((item, index) => {
          item.addEventListener("click", () => {
            this.history.splice(index, 1);
            localStorage.setItem("searchHistory", JSON.stringify(this.history));
            this.render();
          });
        });
    } else {
      const input = document.querySelector(".search-input");
      input.style["border-bottom-left-radius"] = "15px";
      input.style["border-bottom-right-radius"] = "15px";
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
        if (e.keyCode === 13 && searchBar.value) {
          this.keyword = searchBar.value;
          this.history = checkSearchHistory(this.history, this.keyword);
          localStorage.setItem("searchHistory", JSON.stringify(this.history));
          const result = await api.searchPhotos(this.keyword, 1);
          setKeyword(this.keyword);
          setPage(1);
          setData(result.results);
          this.render();
        }
      }, 250)
    );
  };

  const createSearchBar = () => {
    // searchWrapper
    const searchBarWrapper = document.createElement("div");
    searchBarWrapper.className = "search-input-wrapper";

    // searchBar
    const searchForm = document.createElement("form");
    const searchBar = document.createElement("input");
    const searchLabel = document.createElement("label");

    searchBar.setAttribute("type", "text");
    searchBar.placeholder = "사진을 검색해보세요.";
    searchBar.className = "search-input";
    searchBar.id = "search-input";

    searchLabel.setAttribute("for", "search-input");
    searchLabel.innerHTML = "사진 검색";
    searchLabel.classList.add("hidden");

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
    searchForm.appendChild(searchBar);
    searchForm.appendChild(searchLabel);
    searchBarWrapper.appendChild(searchForm);
    searchBarWrapper.appendChild(searchHistoryWrapper);

    return searchBarWrapper;
  };

  this.init();
}

export default SearchBox;
