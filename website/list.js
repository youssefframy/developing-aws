const API_ENDPOINT =
  "https://wkqqvrg5ck.execute-api.us-east-1.amazonaws.com/Prod";

async function loadWallpapers() {
  try {
    const response = await fetch(`${API_ENDPOINT}`);

    if (!response.ok) throw new Error("Failed to fetch wallpapers");

    const responseData = await response.json();
    const wallpapers = JSON.parse(responseData.body);
    const galleryGrid = document.getElementById("wallpapersGrid");

    galleryGrid.innerHTML = wallpapers
      .map(
        (wallpaper) => `
          <div class="card">
            <div class="card-image">
              <a href="${wallpaper.url}" target="_blank">
                <img src="${wallpaper.url}" alt="${wallpaper.name}" loading="lazy">
              </a>
            </div>
            <div class="card-content">
              <h3>${wallpaper.name}</h3>
              <p class="category">${wallpaper.category}</p>
            </div>
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading wallpapers:", error);
  }
}

// Load wallpapers when page loads
document.addEventListener("DOMContentLoaded", loadWallpapers);
