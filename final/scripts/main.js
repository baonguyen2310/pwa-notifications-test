"use strict";

const notificationButton = document.getElementById("enableNotifications");
let swRegistration = null;

initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");

    //Register the service worker
    navigator.serviceWorker
      .register("../../sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);

        swRegistration = swReg;
        subscribeToServer();
        initializeUi();
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
  } else {
    console.warn("Push messaging is not supported");
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
}

function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  }
  // If the user hasn't told if he wants to be notified or not
  // Note: because of Chrome, we are not sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function notification() {
  const options = {
    body: "Testing Our Notification",
    icon: "./bell.png"
  };
  swRegistration.showNotification("PWA Notification!", options);
}


//pushManager
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = "BF371NWi0nygCmaetD44m9pnafi2qLd1yFcQuRBLlMdYQhIDvt0SMnNoCqklGMbkq0TYy38vEHul8p9PSN69i-c";

async function subscribeToServer(){
  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch("https://localhost:443/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });
}

