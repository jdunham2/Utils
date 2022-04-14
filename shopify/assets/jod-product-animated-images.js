// ts-check
window.addEventListener('DOMContentLoaded', () => {
  const animatedImagesContainer = /** @type {HTMLElement} */ (document.querySelector('.slides-and-animated-images-container .animated-images-container'));
  if (!animatedImagesContainer) return;
  animatedImagesContainer.style.display = 'block'
  const mutationObserver = new MutationObserver(mutationCallback)
  document.querySelectorAll('.product__thumbnail-scroll-shadow .product__thumbnail-item').forEach(thumbnailEl => {
    mutationObserver.observe(thumbnailEl, { attributes: true })
  });
})

/** @type MutationCallback */
function mutationCallback(mutationsList, observer) {
  mutationsList.forEach(mutation => {
    if (mutation.attributeName !== 'aria-current') return;
    const target = /** @type {HTMLButtonElement} */ (mutation.target);
    if (target.getAttribute('aria-current') !== 'true') return;

    const dataMediaId = target.dataset.mediaId;
    /** @type {HTMLElement} */
    const fullImage = document.querySelector(`.product__media-item[data-media-id="${dataMediaId}"]`);

    let variantId;
    Array.from(fullImage.classList).map(className => {
      if (className.includes('featured-image-for__')) {
        variantId = className.replace(/^[\D]*/g, '');
      }
    });

    /** @type {NodeListOf<HTMLElement>} */
    (document.querySelectorAll('.animated-images-container')).forEach(container => container.style.display = 'none');

    if (variantId) {
      /** @type {HTMLElement} */
      (document.querySelector(`.animated-images-for__${variantId}`)).style.display = 'block';
    }
  })
}
