/**
 * Author: JOD
 *
 * This script is to fix the apps that create custom products
 * which do not have prices on the cart page until reloading
 *
 * Can be added to theme.liquid with
 * ```
 *  <script src="{{ 'jod-fix-3rd-party-cart-prices.js' | asset_url  }}" defer></script>
 * ```
 *
 * 3rd parties product properties to look for:
 * MyCustomizer: '_mczr_productTitle'
 * BYOB: ''
 */


window.addEventListener('DOMContentLoaded', async () => {
    const checkIfCasHasCustomPrices = async (reloadAfter = false) => {
      await fetch('/cart.json')
        .then(response => response.json())
        .then(async (data) => {
          // console.log('jeshua', data);

          const itemsNeedingPrices = data.items.filter((cartItem => {
            return (
                cartItem.price == 0 && (
                    '_mczr_productTitle' in cartItem.properties ||
                    '_mczr_productTitle' in cartItem.properties
                )
            )
          }))
          if (itemsNeedingPrices.length) {
            await sleep(1000);
            const response = await checkIfCasHasCustomPrices(true);
            return true;
          }
          if (reloadAfter) {
            console.log('All customized items now have prices, reloading...');
            window.location.reload();
            return false;
          }
        });
    }
    await checkIfCasHasCustomPrices();
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  })
