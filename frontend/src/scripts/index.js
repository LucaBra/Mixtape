// Update your index.js - keep existing code but add these
document.addEventListener('DOMContentLoaded', function() {
  const mobilePopup = document.getElementById('mobile-popup');
  const mobilePopupCloseBtn = document.querySelector('.mobile-popup-close');
  
  // Mobile button click handler
  const mobileButton = document.getElementById('btn');
  mobileButton.addEventListener('click', function() {
    if (window.innerWidth < 768) {
        //console.log("Mobile popup working")
        mobilePopup.classList.add('show');
        mobilePopup.style.opacity = '1';
        setTimeout(() => mobilePopup.style.display = 'flex', 100);
    } else {
        window.location.href = "./pages/tape.html";
    }
  });
  
  // Close popup when clicking close button
  if (mobilePopupCloseBtn) {
    mobilePopupCloseBtn.addEventListener('click', function() {
      mobilePopup.classList.remove('show');
      mobilePopup.style.opacity = '0';
      setTimeout(() => {
        mobilePopup.style.display = 'none';
        mobilePopup.classList.remove('show');
      }, 300);
    });
  }
  
  // Close popup when clicking outside
  mobilePopup.addEventListener('click', function(event) {
    if (event.target === mobilePopup) {
      mobilePopup.classList.remove('show');
      mobilePopup.style.opacity = '0';
      setTimeout(() => {
        mobilePopup.style.display = 'none';
      }, 300);
    }
  });
});