import api from "../../api/index.js";
import debounce from "../../utils/debounce.js";
import ImageViewer from "../ImageViewer/index.js";

function SearchResult(target, { getData, getPage, getKeyword }) {
  this.data = null;
  this.page = null;
  this.keyword = null;

  this.init = async () => {
    this.searchResult = createSearchResult();
    this.imageViewer = new ImageViewer(target);
    target.appendChild(this.searchResult);

    this.bindEvents();
    this.render();
  };

  this.render = () => {
    this.data = getData();
    this.keyword = getKeyword();
    this.page = getPage();
    console.log(this.data, this.keyword);
    // searchResult
    if (!this.data.length && this.keyword) {
      this.searchResult.innerHTML = "검색 결과가 없습니다";
    } else {
      this.searchResult.innerHTML = this.data
        .map((result) => {
          return `
          <div class="item">
            <img src=${result.urls.thumb} alt="${
            result.alt_description
          }" data-id=${result.id} data-full=${result.urls.full} title="${
            result.alt_description ? result.alt_description : "no Title"
          }" />
          </div>
        `;
        })
        .join("");
    }

    // searchResult event
    searchResultEvent();

    // lazy-loading
    lazyLoading();
  };

  this.bindEvents = () => {
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
          console.log(this.page);

          this.searchResult.innerHTML += this.data
            .map((result) => {
              return `
          <div class="item">
            <img src=${result.urls.thumb} alt="${
                result.alt_description
              }" data-id=${result.id} data-full=${result.urls.full} title="${
                result.alt_description ? result.alt_description : "no Title"
              }" />
          </div>
        `;
            })
            .join("");

          // searchResult event
          searchResultEvent();

          // lazy loading
          lazyLoading();
        }
      }, 300)
    );
  };

  const lazyLoading = () => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };
    let callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let imageUrl = entry.target.getAttribute("data-full");
          if (imageUrl) {
            entry.target.src = imageUrl;
            observer.unobserve(entry.target);
          }
        }
      });
    };
    let observer = new IntersectionObserver(callback, options);
    const imgs = document.querySelectorAll(".item img");
    imgs.forEach((img) => {
      observer.observe(img);
    });
  };

  const searchResultEvent = () => {
    this.searchResult.querySelectorAll(".item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        this.imageViewer.open(id);
      });
    });
  };

  const createSearchResult = () => {
    const searchResult = document.createElement("div");
    searchResult.className = "search-result";

    return searchResult;
  };

  this.init();
}

export default SearchResult;
