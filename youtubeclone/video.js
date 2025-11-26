const videocardcontainer = document.querySelector(".video-wrapper");
let api_key = "AIzaSyAs-wD2QWXjf0SLn1ZmUaolVX2tNQCUJd4";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let search_http = "https://www.googleapis.com/youtube/v3/search?";
// Search functionality
    document.getElementById("search-btn").addEventListener("click", () => {
      const query = document.getElementById("search-input").value.trim();
      if (query) fetchVideosByQuery(query);
    });
fetch(
  search_http + new URLSearchParams({
    part: "snippet",
    maxResults: 70,
    regionCode: "IN",
    relevanceLanguage: "te", 
    q: "telugu", 
    type: "video",
    key: api_key,
  })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getVideoDetails(item.id.videoId);
    });
  })
  .catch((err) => console.log(err));

const getVideoDetails = (videoId) => {
  fetch(
    video_http + new URLSearchParams({
      part: "snippet,contentDetails,statistics,player",
      id: videoId,
      key: api_key,
    })
  )
    .then((res) => res.json())
    .then((data) => {
      const videoData = data.items[0];
      getchannelIcon(videoData);
    })
    .catch((err) => console.log(err));
};

// Step 3: Fetch channel icon
const getchannelIcon = (video_data) => {
  fetch(
    channel_http + new URLSearchParams({
      part: "snippet",
      id: video_data.snippet.channelId,
      key: api_key,
    })
  )
    .then((res) => res.json())
    .then((res) => {
      video_data.channelThumbnail = res.items[0].snippet.thumbnails.default.url;
      makeVideocard(video_data);
    })
    .catch((err) => console.log(err));
};

// Step 4: Create video card
const makeVideocard = (data) => {
  const videocard = document.createElement("div");
  videocard.classList.add("video");

  videocard.innerHTML = `
    <div class="video-content">
      <img class="thumbnail" src="${data.snippet.thumbnails.high.url}" alt="thumbnail"/>
      <div class="play-button">▶</div>
    </div>
    <div class="video-details">
      <div class="channel-logo">
        <img src="${data.channelThumbnail}" class="channel-thumbnail" alt=""/>
      </div>
      <div class="details">
        <h3 class="title">${data.snippet.title}</h3>
        <div class="channel-name">${data.snippet.channelTitle}</div>
      </div>
    </div>`;

  videocard.addEventListener("click", () => {
    playvideo(data.player.embedHtml);
  });

  videocardcontainer.appendChild(videocard);
};

// Step 5: Store embed HTML and redirect
const playvideo = (embedHtml) => {
  sessionStorage.setItem("videoembedHtml", embedHtml);
  window.location.href = "video-page.html";
};