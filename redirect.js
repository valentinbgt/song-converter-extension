//get the url of the current page
const url = window.location.href;

//check if autoRedirect is true
browser.storage.local.get("autoRedirect").then(function (result) {
  if (result.autoRedirect) {
    redirect(url);
    //create a MutationObserver to watch for URL changes
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        redirect(currentUrl);
      }
    });

    //start observing the document with the configured parameters
    observer.observe(document, { subtree: true, childList: true });

    //on url change, redirect to deezer (for browser navigation)
    window.addEventListener("popstate", () => {
      redirect(window.location.href);
    });
  }
});

function redirect(currentUrl) {
  //define the favourite platform from the storage
  browser.storage.local.get("platform").then(function (result) {
    const favouritePlatform = result.platform || "none";
    console.log("Favorite platform:", favouritePlatform);

    if (favouritePlatform === "none") {
      console.log("No favourite platform defined");
      return;
    }

    //check if the url contains deezer or spotify
    if (currentUrl.includes(favouritePlatform)) {
      console.log("Already on the favourite platform");
      return;
    }

    console.log("Checking if the url contains /track/");
    //check if "/track/" is in the url
    if (currentUrl.includes("/track/")) {
      console.log("Redirecting to the favourite platform");

      //request the api https://music.storry.fr/api/convert
      fetch("https://music.storry.fr/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: currentUrl,
          targetPlatform: favouritePlatform,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Music Anywhere - Redirector: HTTP error! status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);

          if (data[favouritePlatform].redirectUrl) {
            //redirect to the new url
            window.location.href = data[favouritePlatform].redirectUrl;
          } else {
            console.log(
              "Music Anywhere - Redirector: Error catched",
              data.error
            );
          }
        })
        .catch((error) =>
          console.error(
            "Music Anywhere - Redirector: API Error:",
            error.message
          )
        );
    }
  });
}
