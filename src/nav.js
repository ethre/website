/*********************************************/
/*  About Overlay                            */
/*********************************************/
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
  console.log("Image clicked:", imgEl.src);
  const modal = document.getElementById("imageModal");
  const fullImg = document.getElementById("fullscreenImg");

  fullImg.src = imgEl.src; // Set the clicked image's src to the fullscreen image

  modal.classList.remove("hidden");
  void modal.offsetWidth; // Trigger reflow for animation
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
    // Check and close About Overlay
    const aboutOverlay = document.getElementById("aboutOverlay");
    if (aboutOverlay && aboutOverlay.classList.contains("show")) {
      closeAbout();
    }

    // Check and close Contact Overlay
    const contactOverlay = document.getElementById("contactOverlay");
    if (contactOverlay && contactOverlay.classList.contains("show")) {
      closeContact();
    }

    // Check and close Image Modal
    const imageModal = document.getElementById("imageModal");
    if (imageModal && !imageModal.classList.contains("hidden")) {
      closeImageModal();
    }

    // Check and close Photography Overlay
    const photographyOverlay = document.getElementById("photographyOverlay");
    if (photographyOverlay && photographyOverlay.classList.contains("show")) {
      closePhotography();
    }
  }
}

// Attach the keydown event listener to the document
document.addEventListener("keydown", handleKeydown);

// Expose functions globally if needed for inline onClick attributes
window.openAbout = openAbout;
window.closeAbout = closeAbout;
window.openContact = openContact;
window.closeContact = closeContact;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.openPhotography = openPhotography;
window.closePhotography = closePhotography;
