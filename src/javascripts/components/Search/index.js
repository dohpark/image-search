import api from "../../api/index.js";
import debounce from "../../utils/debounce.js";
import ImageViewer from "../ImageViewer/index.js";

function Search(target) {
  this.data = [];
  this.searchBar = null;
  this.searchResult = null;
  this.keyword = null;
  this.page = 0;
  this.imageViewer = null;

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
    this.imageViewer = new ImageViewer(target);
    target.appendChild(this.searchBar);
    target.appendChild(this.searchResult);
    this.bindEvents();
  };

  this.render = () => {
    this.searchResult.innerHTML = this.data
      .map((result) => {
        return `
          <div class="item">
            <img src=${result.urls.regular} alt=${result.alt_description} data-id=${result.id}/>
          </div>
        `;
      })
      .join("");

    this.searchResult.querySelectorAll(".item").forEach((item, index) => {
      item.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        this.imageViewer.open(id);
      });
    });
  };

  this.bindEvents = () => {
    this.searchBar.addEventListener("keyup", async (e) => {
      if (e.keyCode === 13) {
        this.page = 1;
        this.keyword = this.searchBar.value;
        const result = await api.searchPhotos(this.keyword, this.page);
        this.data = result.results;
        this.render();
        console.log(this.data);
      }
    });

    window.addEventListener(
      "scroll",
      debounce(async (e) => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight &&
          this.data.length
        ) {
          this.page += 1;
          const result = await api.searchPhotos(this.keyword, this.page);
          this.data = result.results;

          console.log(this.data);

          this.searchResult.innerHTML += this.data
            .map((result) => {
              return `
          <div class="item">
            <img src=${result.urls.regular} alt="${result.alt_description}" data-id=${result.id}/>
          </div>
        `;
            })
            .join("");

          this.searchResult.querySelectorAll(".item").forEach((item, index) => {
            item.addEventListener("click", (e) => {
              const id = e.target.getAttribute("data-id");
              this.imageViewer.open(id);
            });
          });
        }
      }, 300)
    );
  };

  this.init();
}

export default Search;
