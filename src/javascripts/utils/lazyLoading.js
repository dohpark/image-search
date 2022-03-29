const lazyLoading = (dataAttribute, className) => {
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.25,
  };
  let callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let imageUrl = entry.target.getAttribute(dataAttribute);
        if (imageUrl) {
          entry.target.src = imageUrl;
          observer.unobserve(entry.target);
        }
      }
    });
  };
  let observer = new IntersectionObserver(callback, options);
  const imgs = document.querySelectorAll(className);
  imgs.forEach((img) => {
    observer.observe(img);
  });
};

export default lazyLoading;
