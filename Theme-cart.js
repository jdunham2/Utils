/**
 * Theme Cart is a tiny library (<1kb min+gzip) that facilitates requests to Shopify's Cart API and makes it easier to manage cart state.
 * 
 * Modified Theme Cart for JD Theme Development -- turned into a module with typing hinting
 *
 * https://github.com/Shopify/theme-scripts
 * https://github.com/Shopify/theme-scripts/blob/master/packages/theme-cart/README.md
 *
 */

export default new class {

 /** paste latest functions from theme-cart.js file between this comment and the comment at the bottom */
 /** then remove all function declarations ('function ') and add 'this.' and 'self.' inside .then functions fix errors */

  getDefaultRequestConfig() {
    return JSON.parse(
      JSON.stringify({
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json;'
        }
      })
    );
  }

  fetchJSON(url, config) {
    return fetch(url, config).then(function(response) {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    });
  }

  async cart() {
    return await this.fetchJSON('/cart.js', this.getDefaultRequestConfig());
  }

  async cartAdd(id, quantity, properties) {
    var config = this.getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify({
      id: id,
      quantity: quantity,
      properties: properties
    });

    return await this.fetchJSON('/cart/add.js', config);
  }

  cartAddFromForm(formData) {
    var config = this.getDefaultRequestConfig();
    delete config.headers['Content-Type'];

    config.method = 'POST';
    config.body = formData;

    return this.fetchJSON('/cart/add.js', config);
  }

  cartChange(line, options) {
    var config = this.getDefaultRequestConfig();

    options = options || {};

    config.method = 'POST';
    config.body = JSON.stringify({
      line: line,
      quantity: options.quantity,
      properties: options.properties
    });

    return this.fetchJSON('/cart/change.js', config);
  }

  async cartClear() {
    var config = this.getDefaultRequestConfig();
    config.method = 'POST';

    return await this.fetchJSON('/cart/clear.js', config);
  }

  cartUpdate(body) {
    var config = this.getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify(body);

    return this.fetchJSON('/cart/update.js', config);
  }

  cartShippingRates() {
    return this.fetchJSON('/cart/shipping_rates.json', this.getDefaultRequestConfig());
  }

  key(key) {
    if (typeof key !== 'string' || key.split(':').length !== 2) {
      throw new TypeError(
        'Theme Cart: Provided key value is not a string with the format xxx:xxx'
      );
    }
  }

  quantity(quantity) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new TypeError(
        'Theme Cart: An object which specifies a quantity or properties value is required'
      );
    }
  }

  id(id) {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new TypeError(`Theme Cart: Variant ID must be a number. Received: ${id}`);
    }
  }

  properties(properties) {
    if (typeof properties !== 'object') {
      throw new TypeError('Theme Cart: Properties must be an object');
    }
  }

  form(form) {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
    }
  }

  options(options) {
    if (typeof options !== 'object') {
      throw new TypeError('Theme Cart: Options must be an object');
    }

    if (
      typeof options.quantity === 'undefined' &&
      typeof options.properties === 'undefined'
    ) {
      throw new Error(
        'Theme Cart: You muse define a value for quantity or properties'
      );
    }

    if (typeof options.quantity !== 'undefined') {
      this.quantity(options.quantity);
    }

    if (typeof options.properties !== 'undefined') {
      this.properties(options.properties);
    }
  }

  /**
   * Cart Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the Cart template.
   *
   * @namespace cart
   */

  /**
   * Returns the state object of the cart
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  async getState() {
    return await this.cart();
  }

  /**
   * Returns the index of the cart line item
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the index number of the line item
   */
  getItemIndex(key$$1) {
    this.key(key$$1);

    return this.cart().then(function(state) {
      var index = -1;

      state.items.forEach(function(item, i) {
        index = item.key === key$$1 ? i + 1 : index;
      });

      if (index === -1) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }

      return index;
    });
  }

  /**
   * Fetches the line item object
   * @param {string} key The unique key of the line item
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  getItem(key$$1) {
    this.key(key$$1);

    return this.cart().then(function(state) {
      var lineItem = null;

      state.items.forEach(function(item) {
        lineItem = item.key === key$$1 ? item : lineItem;
      });

      if (lineItem === null) {
        return Promise.reject(
          new Error('Theme Cart: Unable to match line item with provided key')
        );
      }

      return lineItem;
    });
  }

  /**
   * Add a new line item to the cart
   * @param {number} id$$1 The variant's unique ID
   * @param {object} options$$1 Optional values to pass to /cart/add.js
   * @param {number} options$$1.quantity The quantity of items to be added to the cart
   * @param {object} options$$1.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  async addItem(id$$1, options$$1) {
    options$$1 = options$$1 || {};

    this.id(id$$1);

    return await this.cartAdd(id$$1, options$$1.quantity, options$$1.properties);
  }

  /**
   * Add a new line item to the cart from a product form
   * @param {object} form$$1 DOM element which is equal to the <form> node
   * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
   */
  addItemFromForm(form$$1) {
    this.form(form$$1);

    var formData = new FormData(form$$1);
    this.id(parseInt(formData.get('id'), 10));

    return this.cartAddFromForm(formData);
  }

  /**
   * Changes the quantity and/or properties of an existing line item.
   * @param {string} key$$1 The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @param {object} options$$1 Optional values to pass to /cart/add.js
   * @param {number} options$$1.quantity The quantity of items to be added to the cart
   * @param {object} options$$1.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  async updateItem(key$$1, options$$1) {
    this.key(key$$1);
    this.options(options$$1);

    const self = this;
    return this.getItemIndex(key$$1).then(function(line) {
      return self.cartChange(line, options$$1);
    });
  }

  /**
   * Removes a line item from the cart
   * @param {string} key$$1 The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  async removeItem(key$$1) {
    this.key(key$$1);

    const self = this;
    return this.getItemIndex(key$$1).then(function(line) {
      return self.cartChange(line, { quantity: 0 });
    });
  }

  /**
   * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
   * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
   */
  clearItems() {
    return this.cartClear();
  }

  /**
   * Gets all cart attributes
   * @returns {Promise} Resolves with the cart attributes object
   */
  async getAttributes() {
    return this.cart().then(function(state) {
      return state.attributes;
    });
  }

  /**
   * Sets all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  updateAttributes(attributes) {
    return this.cartUpdate({ attributes: attributes });
  }

  /**
   * Clears all cart attributes
   * @returns {Promise} Resolves with the cart state object
   */
  clearAttributes() {
    const self = this;
    return this.getAttributes().then(function(attributes) {
      for (var key$$1 in attributes) {
        attributes[key$$1] = '';
      }
      return self.updateAttributes(attributes);
    });
  }

  /**
   * Gets cart note
   * @returns {Promise} Resolves with the cart note string
   */
  getNote() {
    return this.cart().then(function(state) {
      return state.note;
    });
  }

  /**
   * Sets cart note
   * @returns {Promise} Resolves with the cart state object
   */
  updateNote(note) {
    return this.cartUpdate({ note: note });
  }

  /**
   * Clears cart note
   * @returns {Promise} Resolves with the cart state object
   */
  clearNote() {
    return this.cartUpdate({ note: '' });
  }

  /**
   * Get estimated shipping rates.
   * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
   */
  getShippingRates() {
    return this.cartShippingRates();
  }
}

/** paste latest theme-cart.js file functions between this comment and the export at the top */
