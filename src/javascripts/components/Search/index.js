// import api from "../../api/index.js";
// import debounce from "../../utils/debounce.js";
// import ImageViewer from "../ImageViewer/index.js";
// import Loading from "../Loading/index.js";
// import RandomCarousel from "../RandomCarousel/index.js";
// import checkSearchHistory from "../../utils/checkSearchHistory.js";

// function Search(target) {
//   this.data = [];
//   this.searchHistoryArray = [];
//   this.searchBar = null;
//   this.searchResult = null;
//   this.keyword = null;
//   this.page = 1;
//   this.imageViewer = null;
//   this.loading = null;
//   this.randomCarousel = null;

//   const createSearchBar = () => {
//     // searchWrapper
//     const searchBarWrapper = document.createElement("div");
//     searchBarWrapper.className = "search-input-wrapper";

//     // searchBar
//     const searchBar = document.createElement("input");
//     searchBar.setAttribute("type", "text");
//     searchBar.placeholder = "사진을 검색해보세요.";
//     searchBar.className = "search-input";

//     // searchHistory
//     const searchHistoryWrapper = document.createElement("div");
//     searchHistoryWrapper.className = "search-history-wrapper";

//     const searchHistoryTitle = document.createElement("div");
//     searchHistoryTitle.className = "search-history-title";
//     searchHistoryTitle.innerHTML = "최근 검색 내역";

//     const searchHistoryContent = document.createElement("div");
//     searchHistoryContent.className = "search-history-content";

//     // append
//     searchHistoryWrapper.appendChild(searchHistoryTitle);
//     searchHistoryWrapper.appendChild(searchHistoryContent);
//     searchBarWrapper.appendChild(searchBar);
//     searchBarWrapper.appendChild(searchHistoryWrapper);

//     return searchBarWrapper;
//   };

//   const createSearchResult = () => {
//     const searchResult = document.createElement("div");
//     searchResult.className = "search-result";

//     return searchResult;
//   };

//   this.init = async () => {
//     this.searchBar = createSearchBar();
//     this.randomCarousel = new RandomCarousel();
//     this.searchResult = createSearchResult();
//     this.imageViewer = new ImageViewer(target);
//     this.loading = new Loading();
//     target.appendChild(this.searchBar);
//     target.appendChild(this.searchResult);

//     const localStorageArray = JSON.parse(localStorage.getItem("searchHistory"));

//     // localStorage
//     if (!localStorageArray || !localStorageArray.length) {
//       localStorage.setItem("searchHistory", JSON.stringify([]));
//     } else {
//       this.searchHistoryArray = localStorageArray;
//       this.keyword = this.searchHistoryArray[0];
//       this.loading.on();
//       const result = await api.searchPhotos(this.keyword, this.page);
//       this.data = result.results;
//       setTimeout(() => {
//         this.loading.off();
//       }, 1000);
//     }
//     this.bindEvents();
//     this.render();
//   };

//   this.render = () => {
//     // searchResult
//     if (!this.data.length && this.keyword) {
//       this.searchResult.innerHTML = "검색 결과가 없습니다";
//     } else {
//       this.searchResult.innerHTML = this.data
//         .map((result) => {
//           return `
//           <div class="item">
//             <img src=${result.urls.thumb} alt="${
//             result.alt_description
//           }" data-id=${result.id} data-full=${result.urls.full} title="${
//             result.alt_description ? result.alt_description : "no Title"
//           }" />
//           </div>
//         `;
//         })
//         .join("");
//     }

//     // searchResult event
//     searchResultEvent();

//     // lazy-loading
//     lazyLoading();

//     // searchHistory
//     const searchInput = document.querySelector(".search-input");
//     const searchHistoryWrapper = document.querySelector(
//       ".search-history-wrapper"
//     );

//     searchInput.addEventListener("focusin", () => {
//       searchHistoryWrapper.style.display = "block";
//       searchInput.style["border-bottom-left-radius"] = "0px";
//       searchInput.style["border-bottom-right-radius"] = "0px";
//     });

//     searchHistoryWrapper.addEventListener("mouse", () => {
//       searchHistoryWrapper.style.display = "none";
//       searchInput.style["border-bottom-left-radius"] = "15px";
//       searchInput.style["border-bottom-right-radius"] = "15px";
//     });

//     if (this.searchHistoryArray.length) {
//       const input = document.querySelector(".search-input");
//       input.style["border-bottom-left-radius"] = "0px";
//       input.style["border-bottom-right-radius"] = "0px";
//       searchHistoryWrapper.style.display = "block";
//       const searchHistoryContent = document.querySelector(
//         ".search-history-content"
//       );
//       searchHistoryContent.innerHTML = "";
//       this.searchHistoryArray.map((keyword) => {
//         const searchHistoryItem = document.createElement("div");
//         searchHistoryItem.innerHTML = keyword;
//         searchHistoryItem.className = "search-history-item";
//         searchHistoryContent.appendChild(searchHistoryItem);
//       });

//       // searchHistory event
//       searchHistoryContent
//         .querySelectorAll(".search-history-item")
//         .forEach((item) => {
//           item.addEventListener("click", async (e) => {
//             this.keyword = e.target.innerHTML;
//             this.page = 1;
//             this.searchHistoryArray = checkSearchHistory(
//               this.searchHistoryArray,
//               this.keyword
//             );
//             localStorage.setItem(
//               "searchHistory",
//               JSON.stringify(this.searchHistoryArray)
//             );
//             this.loading.on();
//             const result = await api.searchPhotos(this.keyword, this.page);
//             this.data = result.results;
//             this.render();
//             setTimeout(() => {
//               this.loading.off();
//             }, 1000);
//           });
//         });
//     } else {
//       searchHistoryWrapper.style.display = "none";
//     }
//   };

//   this.bindEvents = () => {
//     const searchBar = this.searchBar.querySelector(".search-input");
//     searchBar.focus();

//     searchBar.addEventListener("click", () => {
//       searchBar.value = null;
//     });

//     searchBar.addEventListener(
//       "keyup",
//       debounce(async (e) => {
//         if (e.keyCode === 13) {
//           this.page = 1;
//           this.keyword = searchBar.value;
//           this.searchHistoryArray = checkSearchHistory(
//             this.searchHistoryArray,
//             this.keyword
//           );
//           localStorage.setItem(
//             "searchHistory",
//             JSON.stringify(this.searchHistoryArray)
//           );
//           this.loading.on();
//           const result = await api.searchPhotos(this.keyword, this.page);
//           this.data = result.results;
//           this.render();
//           setTimeout(() => {
//             this.loading.off();
//           }, 1000);
//           console.log(this.data);
//         }
//       }, 100)
//     );

//     window.addEventListener(
//       "scroll",
//       debounce(async (e) => {
//         if (
//           window.innerHeight + window.scrollY >= document.body.offsetHeight &&
//           this.data.length
//         ) {
//           this.page += 1;
//           const result = await api.searchPhotos(this.keyword, this.page);
//           this.data = result.results;

//           console.log(this.data);

//           this.searchResult.innerHTML += this.data
//             .map((result) => {
//               return `
//           <div class="item">
//             <img src=${result.urls.thumb} alt="${
//                 result.alt_description
//               }" data-id=${result.id} data-full=${result.urls.full} title="${
//                 result.alt_description ? result.alt_description : "no Title"
//               }" />
//           </div>
//         `;
//             })
//             .join("");

//           // searchResult event
//           searchResultEvent();

//           // lazy loading
//           lazyLoading();
//         }
//       }, 300)
//     );
//   };

//   const lazyLoading = () => {
//     let options = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0.25,
//     };
//     let callback = (entries, observer) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           let imageUrl = entry.target.getAttribute("data-full");
//           if (imageUrl) {
//             entry.target.src = imageUrl;
//             observer.unobserve(entry.target);
//           }
//         }
//       });
//     };
//     let observer = new IntersectionObserver(callback, options);
//     const imgs = document.querySelectorAll(".item img");
//     imgs.forEach((img) => {
//       observer.observe(img);
//     });
//   };

//   const searchResultEvent = () => {
//     this.searchResult.querySelectorAll(".item").forEach((item) => {
//       item.addEventListener("click", (e) => {
//         const id = e.target.getAttribute("data-id");
//         this.imageViewer.open(id);
//       });
//     });
//   };

//   this.init();
// }

// export default Search;
