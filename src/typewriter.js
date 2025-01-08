const typewriter = document.getElementById('typewriter');
const phrases = [
  "I'm a student of theoretical physics.",
  "Simplifying complexity through mathematics.",
  "Diving into the world of data science and machine learning.",
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;

function type() {
  const currentPhrase = phrases[currentPhraseIndex];
  // Display the substring of the current phrase
  typewriter.textContent = currentPhrase.slice(0, currentCharIndex);

  // Continue typing if we're not at the end of the phrase
  if (currentCharIndex < currentPhrase.length) {
    currentCharIndex++;
    setTimeout(type, 100); // Typing speed
  } else {
    // Finished typing the entire phrase, pause briefly
    setTimeout(() => {
      // Fade out the typed text
      typewriter.style.transition = 'opacity 0.6s ease';
      typewriter.style.opacity = '0';

      // After fade-out is complete, clear text & move to the next phrase
      setTimeout(() => {
        // Reset text & opacity for the next phrase
        typewriter.textContent = '';
        typewriter.style.opacity = '1';

        // Move to the next phrase
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        currentCharIndex = 0; // Reset char index for next typing

        // Start typing the next phrase
        type();
      }, 600); // Matches the fade-out duration
    }, 2000); // How long text is fully visible before fade-out
  }
}

// Start the typewriter effect after 2.5 seconds once the page loads
window.onload = () => {
  setTimeout(type, 2500); // 2.5-second delay
};
