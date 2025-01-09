function openAbout() {
  const overlay = document.getElementById("aboutOverlay");
  overlay.classList.add("show");
}
function closeAbout() {
  const overlay = document.getElementById("aboutOverlay");
  overlay.classList.remove("show");
}

/*********************************************/
/*  Contact Overlay                          */
/*********************************************/
function openContact() {
  const overlay = document.getElementById("contactOverlay");
  overlay.classList.add("show");
}
function closeContact() {
  const overlay = document.getElementById("contactOverlay");
  overlay.classList.remove("show");
}

/*********************************************/
/*  Fullscreen Image Modal                   */
/*********************************************/
function openImageModal(imgEl) {
  const modal = document.getElementById("imageModal");
  const fullImg = document.getElementById("fullscreenImg");

  // Use data-full if available, else use the same src
  const fullSrc = imgEl.getAttribute("data-full") || imgEl.src;
  fullImg.src = fullSrc;

  modal.classList.remove("hidden");
  void modal.offsetWidth;
  modal.classList.remove("opacity-0", "scale-95");
  modal.classList.add("opacity-100", "scale-100");
}

// Close the image modal
function closeImageModal() {
  const modal = document.getElementById("imageModal");
  const fullImg = document.getElementById("fullscreenImg");

  modal.classList.remove("opacity-100", "scale-100");
  modal.classList.add("opacity-0", "scale-95");
  setTimeout(() => {
    modal.classList.add("hidden");
    fullImg.src = "";
  }, 300);
}

/*********************************************/
/*  Photography Overlay                      */
/*********************************************/
function openPhotography() {
  const overlay = document.getElementById("photographyOverlay");
  overlay.classList.remove("hidden");
  // Force reflow so the transition can start
  void overlay.offsetWidth;
  overlay.classList.add("show");
}

function closePhotography() {
  const overlay = document.getElementById("photographyOverlay");
  overlay.classList.remove("show");
  // Wait for transition, then hide
  setTimeout(() => overlay.classList.add("hidden"), 500);
}

/*********************************************/
/*  Handle Keydown Events                    */
/*********************************************/
function handleKeydown(event) {
  if (event.key === "Escape") { // Check if the Escape key was pressed
    const modal = document.getElementById("imageModal");

    // Close image modal if it's open
    if (!modal.classList.contains("hidden")) {
      closeImageModal();
    }
  }
}

// Attach the keydown event listener to the document
document.addEventListener("keydown", handleKeydown);

// Ensure that openPhotography() is called when you click on the 
// "Photography" navbar link, just like you do with openGallery().

// Expose functions globally if needed for inline onClick attributes
window.openAbout = openAbout;
window.closeAbout = closeAbout;
window.openContact = openContact;
window.closeContact = closeContact;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.openPhotography = openPhotography;
window.closePhotography = closePhotography;
