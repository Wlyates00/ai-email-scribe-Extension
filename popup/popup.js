document.getElementById("submit").addEventListener("click", async function () {
  const tone = document.getElementById("custom-tone").value;
  const promptText = document.getElementById("field").value;

  try {
    // Send a POST request to your backend API
    const response = await fetch("http://localhost:3200/api/generate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tone: tone,
        promptText: promptText,
      }),
    });

    // Checking if API call was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate email");
    }

    // Wait for response and grab generatedemail
    const data = await response.json();
    const generatedEmail = data.generatedEmail.trim();

    // Save the generated email to localStorage
    localStorage.setItem("lastGeneratedEmail", generatedEmail);

    // Display the generated email in the output div
    document.getElementById("emailOutput").innerText = generatedEmail;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById(
      "emailOutput"
    ).innerText = `Error: ${error.message}`;
  }
});

// ON PAGE LOAD EVENT (RETAIN LAST GENERATED EMAIL)
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the last generated email from localStorage
  const lastGeneratedEmail = localStorage.getItem("lastGeneratedEmail");

  if (lastGeneratedEmail) {
    // Display the last generated email in the output div
    document.getElementById("emailOutput").innerText = lastGeneratedEmail;
  }
});
