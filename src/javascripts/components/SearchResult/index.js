import api from "../../api/index.js";
import debounce from "../../utils/debounce.js";
import ImageViewer from "../ImageViewer/index.js";
import Loading from "../Loading/index.js";
import lazyLoading from "../../utils/lazyLoading.js";

function SearchResult(target, { getData, getPage, getKeyword }) {
  this.data = null;
  this.page = null;
  this.keyword = null;
  this.loading = null;
  this.imageViewer = null;

  this.init = async () => {
    this.searchResult = createSearchResult();
    this.imageViewer = new ImageViewer(target);
    this.loading = new Loading();
    target.appendChild(this.searchResult);

    this.bindEvents();
  };

  this.render = () => {
    this.data = getData();
    this.keyword = getKeyword();
    this.page = getPage();
    // searchResult
    if (!this.data.length && this.keyword) {
      this.searchResult.innerHTML = "검색 결과가 없습니다";
    } else {
      this.loading.on();
      this.searchResult.innerHTML = this.data
        .map((result) => {
          return `
          <div class="item">
            <img src=${result.urls.thumb} alt="${
            result.alt_description
          }" data-id=${result.id} data-regular=${result.urls.regular} title="${
            result.alt_description ? result.alt_description : "no Title"
          }" />
          </div>
        `;
        })
        .join("");

      setTimeout(() => {
        this.loading.off();
      }, 1000);

      // lazy-loading
      lazyLoading("data-regular", ".item img");
    }
  };

  this.bindEvents = () => {
    // event delegation
    this.searchResult.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      if (id) {
        this.imageViewer.open(id);
      }
    });

    // 무한 스크롤
    window.addEventListener(
      "scroll",
      debounce(async (e) => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight &&
          this.data.length
        ) {
          this.loading.on();
          this.page += 1;
          const result = await api.searchPhotos(this.keyword, this.page);
          this.data = result.results;

          this.searchResult.innerHTML += this.data
            .map((result) => {
              return `
          <div class="item">
            <img src=${result.urls.thumb} alt="${
                result.alt_description
              }" data-id=${result.id} data-regular=${
                result.urls.regular
              } title="${
                result.alt_description ? result.alt_description : "no Title"
              }" />
          </div>
        `;
            })
            .join("");

          setTimeout(() => {
            this.loading.off();
          }, 1000);

          // lazy loading
          lazyLoading("data-regular", ".item img");
        }
      }, 300)
    );
  };

  const createSearchResult = () => {
    const searchResult = document.createElement("div");
    searchResult.className = "search-result";

    return searchResult;
  };

  this.init();
}

export default SearchResult;
