import api from "../../api/index.js";

function Search(target) {
  this.data = [];
  this.searchBar = null;
  this.searchResult = null;

  const createSearchBar = () => {
    const searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
    searchBar.placeholder = "사진을 검색해보세요.";
    searchBar.className = "search-input";

    return searchBar;
  };

  const createSearchResult = () => {
    const searchResult = document.createElement("div");
    searchResult.className = "search-result";

    return searchResult;
  };

  this.init = () => {
    this.searchBar = createSearchBar();
    this.searchResult = createSearchResult();
    target.appendChild(this.searchBar);
    target.appendChild(this.searchResult);
    this.bindEvents();
  };

  this.render = () => {
    this.searchResult.innerHTML += this.data
      .map((result) => {
        return `
          <div class="item">
            <img src=${result.urls.regular} alt=${result.alt_description} />
          </div>
        `;
      })
      .join("");

    this.searchResult.querySelectorAll(".item").forEach((item, index) => {
      item.addEventListener("click", () => {});
    });
  };

  this.bindEvents = () => {
    this.searchBar.addEventListener("keyup", async (e) => {
      if (e.keyCode === 13) {
        const search = this.searchBar.value;
        const result = await api.searchPhotos(search);
        this.data = result.results;
        this.render();
        console.log(this.data);
      }
    });
  };

  this.init();
}

export default Search;
