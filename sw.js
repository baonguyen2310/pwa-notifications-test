console.log('Service Worker');
self.addEventListener("push", function(event) {
    const data = event.data.json();
    self.registration.showNotification(
        data.title,
        {
            body: "hehe",
            icon: "./final/bell.png"
        }
    )
})