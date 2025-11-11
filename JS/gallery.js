// Gallery filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    const filterValue = button.getAttribute('data-filter');
    
    // Filter gallery items
    galleryItems.forEach(item => {
      if (filterValue === 'all') {
        item.classList.remove('hidden');
      } else {
        if (item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      }
    });
  });
});

// Modal functionality for image enlargement
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.querySelector('.close');

// Add click event to all gallery items
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const title = item.querySelector('.image-info h3')?.textContent || 'Bilde';
    const description = item.querySelector('.image-info p')?.textContent || '';
    
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });
});

// Close modal when clicking X
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Load more functionality (placeholder)
const loadMoreBtn = document.getElementById('loadMore');
loadMoreBtn.addEventListener('click', () => {
  // This would typically load more images from a server
  alert('Flere bilder vil bli lastet inn her i en produksjonsversjon!');
  // For now, just disable the button
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Alle Bilder Vist';
});

// Lazy loading enhancement
if ('IntersectionObserver' in window) {
  const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove('lazy');
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    lazyImageObserver.observe(img);
  });
}