const filterTags = document.querySelectorAll(".filter-tag");
const clearFilterBtn = document.getElementById("filter-tag-clear");

// when clicking on a filter tag, add it to the url query string like /class/filter?tags=tag1,tag2
filterTags.forEach((tag) => {
  tag.addEventListener("click", (e) => {
    const tag = e.target.value;

    //url encode the tag
    const encodedTag = encodeURIComponent(tag);

    const tags = new URLSearchParams(window.location.search).get("tags");

    // if the tag is already in the query string, remove it
    let newTags = "";

    if (tags) {
      const tagArr = tags.split(",");
      if (tagArr.includes(tag)) {
        tagArr.splice(tagArr.indexOf(tag), 1);
      } else {
        tagArr.push(encodedTag);
      }
      newTags = tagArr.join(",");
    } else {
      newTags = tag;
    }
    window.location.href = `/class/filter?tags=${newTags}`;
  });
});

clearFilterBtn.addEventListener("click", (e) => {
  window.location.href = `/class/filter`;
});
