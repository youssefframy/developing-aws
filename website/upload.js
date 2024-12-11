const API_ENDPOINT =
  "https://wkqqvrg5ck.execute-api.us-east-1.amazonaws.com/Prod";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageName = document.getElementById("imageName").value;
  const category = document.getElementById("category").value;
  const imageFile = document.getElementById("imageFile").files[0];
  const messageDiv = document.getElementById("message");

  try {
    // Convert file to base64
    const base64File = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Prepare the request body - wrap it in the expected format
    const requestBody = {
      body: JSON.stringify({
        // Note the addition of body wrapper here
        name: imageName,
        category: category,
        filename: imageFile.name,
        file: base64File,
      }),
    };

    // Send request to API Gateway
    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // This will now match your working JSON structure
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      messageDiv.innerHTML = "Upload successful!";
      messageDiv.className = "message success";

      // Reset form
      document.getElementById("uploadForm").reset();
    } catch (error) {
      console.error("Full error:", error);
      messageDiv.innerHTML = "Error uploading image: " + error.message;
      messageDiv.className = "message error";
    }
  } catch (error) {
    messageDiv.innerHTML = "Error uploading image: " + error.message;
    messageDiv.className = "message error";
  }
});

function logout() {
  sessionStorage.removeItem("userToken");
  window.location.href = "index.html";
}
