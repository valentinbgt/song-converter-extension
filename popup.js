//on DOM load, console log debug
document.addEventListener("DOMContentLoaded", function () {
  //on change of the platform select, save the platform in the storage
  document
    .getElementById("platform-select")
    .addEventListener("change", function () {
      browser.storage.local.set({
        platform: this.value,
      });
    });

  //on load, get the platform from the storage
  browser.storage.local.get("platform").then(function (result) {
    document.getElementById("platform-select").value = result.platform;
  });

  //on change of the auto redirect checkbox, save the auto redirect in the storage
  document
    .getElementById("auto-redirect")
    .addEventListener("change", function () {
      console.log("Auto redirect changed to:", this.checked);
      browser.storage.local.set({
        autoRedirect: this.checked,
      });
    });

  //on load, get the auto redirect from the storage
  browser.storage.local.get("autoRedirect").then(function (result) {
    document.getElementById("auto-redirect").checked = result.autoRedirect;
    console.log(result.autoRedirect);
  });

  // Add save button handler
  document
    .getElementById("reload-button")
    .addEventListener("click", function () {
      browser.runtime.reload();
      window.close(); // Ferme la popup après le rechargement
    });

  //track info
  //get the current active tab's URL
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      const url = tabs[0].url;
      document.getElementById("track-info").innerText = url;
    })
    .catch((error) => {
      console.error("Error getting tab URL:", error);
      document.getElementById("track-info").innerText = "Error getting URL";
    });
});
