import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

let currentRoast = "";
let currentUsername = "";

async function checkUser(username) {
  try {
    const response = await fetch(
      `https://huggingface.co/api/users/${username}/overview`
    );
    return { valid: response.ok };
  } catch {
    return { valid: false };
  }
}

async function roastUser() {
  const username = document.getElementById("username-input").value.trim();
  const language = document.getElementById("language-select").value;
  const errorBox = document.getElementById("error-box");
  const roastBtn = document.getElementById("roast-btn");
  const roastContainer = document.getElementById("roast-container");
  const roastText = document.getElementById("roast-text");

  errorBox.style.display = "none";
  roastContainer.style.display = "none";

  if (!username) {
    errorBox.textContent = "Please provide a username";
    errorBox.style.display = "block";
    return;
  }

  roastBtn.disabled = true;
  roastBtn.textContent = "Roasting in progress...";
  roastBtn.classList.add("animate-pulse");

  const userCheck = await checkUser(username);
  if (!userCheck.valid) {
    errorBox.textContent = `User '${username}' not found on Hugging Face`;
    errorBox.style.display = "block";
    roastBtn.disabled = false;
    roastBtn.textContent = "Roast this Hugger 🔥";
    roastBtn.classList.remove("animate-pulse");
    return;
  }

  try {
    const client = await Client.connect("nroggendorff/hugger-roaster-gradio");
    const result = await client.predict("/roast_user", [username, language]);

    currentRoast = result.data[0];
    currentUsername = username;

    if (
      currentRoast.startsWith("Error") ||
      currentRoast.startsWith("User") ||
      currentRoast.startsWith("Please")
    ) {
      errorBox.textContent = "⚠️ " + currentRoast;
      errorBox.style.display = "block";
    } else {
      roastText.textContent = currentRoast;
      roastContainer.style.display = "block";
      document.getElementById("share-output").style.display = "none";
    }
  } catch (error) {
    errorBox.textContent = "⚠️ Error generating roast: " + error.message;
    errorBox.style.display = "block";
  }

  roastBtn.disabled = false;
  roastBtn.textContent = "Roast this Hugger 🔥";
  roastBtn.classList.remove("animate-pulse");
}

async function shareRoast() {
  const shareBtn = document.getElementById("share-btn");
  const shareOutput = document.getElementById("share-output");

  shareBtn.disabled = true;
  shareBtn.classList.add("animate-pulse");

  try {
    const client = await Client.connect("nroggendorff/hugger-roaster-gradio");
    const result = { data: ["Not Implemented."] }; //await client.predict("/save_roast", [currentRoast, currentUsername]);

    shareOutput.textContent = result.data[0];
    shareOutput.style.display = "block";
  } catch (error) {
    shareOutput.textContent = "Error sharing roast: " + error.message;
    shareOutput.style.display = "block";
  }

  shareBtn.disabled = false;
  shareBtn.classList.remove("animate-pulse");
}

document.getElementById("roast-btn").addEventListener("click", roastUser);
document.getElementById("share-btn").addEventListener("click", shareRoast);
