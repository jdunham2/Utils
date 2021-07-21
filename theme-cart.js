// @ts-check
/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * JD THEME DEV ADDONS --> includes request.js and validate.js exports
 * @namespace cart
 */

/**
 * Returns the state object of the cart
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export async function getState() {
  return request.cart();
}

/**
 * Returns the index of the cart line item
 * @param {string} key The unique key of the line item
 * @returns {Promise} Resolves with the index number of the line item
 */
export async function getItemIndex(key) {
  validate.key(key);

  return request.cart().then(function(state) {
    var index = -1;

    state.items.forEach(function(item, i) {
      index = item.key === key ? i + 1 : index;
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
export async function getItem(key) {
  validate.key(key);

  return request.cart().then(function(state) {
    var lineItem = null;

    state.items.forEach(function(item) {
      lineItem = item.key === key ? item : lineItem;
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
 * @param {number} id The variant's unique ID
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export async function addItem(id, options) {
  validate.id(id);

  return request.cartAdd(id, options.quantity, options.properties);
}

/**
 * Add a new line item to the cart from a product form
 * @param {object} form DOM element which is equal to the <form> node
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export function addItemFromForm(form) {
  validate.form(form);

  var formData = new FormData(form);
  validate.id(parseInt(formData.get('id'), 10));

  return request.cartAddFromForm(formData);
}

/**
 * Changes the quantity and/or properties of an existing line item.
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export async function updateItem(key, options) {
  validate.key(key);
  validate.options(options);

  return getItemIndex(key).then(function(line) {
    return request.cartChange(line, options);
  });
}

/**
 * Removes a line item from the cart
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export async function removeItem(key) {
  validate.key(key);

  return getItemIndex(key).then(function(line) {
    return request.cartChange(line, { quantity: 0 });
  });
}

/**
 * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function clearItems() {
  return request.cartClear();
}

/**
 * Gets all cart attributes
 * @returns {Promise} Resolves with the cart attributes object
 */
export async function getAttributes() {
  return request.cart().then(function(state) {
    return state.attributes;
  });
}

/**
 * Sets all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export function updateAttributes(attributes) {
  return request.cartUpdate({ attributes: attributes });
}

/**
 * Clears all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export async function clearAttributes() {
  return getAttributes().then(function(attributes) {
    for (var key in attributes) {
      attributes[key] = '';
    }
    return updateAttributes(attributes);
  });
}

/**
 * Gets cart note
 * @returns {Promise} Resolves with the cart note string
 */
export async function getNote() {
  return request.cart().then(function(state) {
    return state.note;
  });
}

/**
 * Sets cart note
 * @returns {Promise} Resolves with the cart state object
 */
export async function updateNote(note) {
  return request.cartUpdate({ note: note });
}

/**
 * Clears cart note
 * @returns {Promise} Resolves with the cart state object
 */
export async function clearNote() {
  return request.cartUpdate({ note: '' });
}

/**
 * Get estimated shipping rates.
 * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
 */
export async function getShippingRates() {
  return request.cartShippingRates();
}
export async function fetchJSON(url, config) {
  return fetch(url, config).then(function(response) {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function getDefaultRequestConfig() {
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


/** ==========================================
 * Modified request.js
 =============================================*/
export const request = {
  cart: async () => {
    return fetchJSON('/cart.js', getDefaultRequestConfig());
  },

  cartAdd: async (id, quantity, properties) => {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify({
      id: id,
      quantity: quantity,
      properties: properties
    });

    return fetchJSON('/cart/add.js', config);
  },

  cartAddFromForm: async (formData) => {
    var config = getDefaultRequestConfig();
    delete config.headers['Content-Type'];

    config.method = 'POST';
    config.body = formData;

    return fetchJSON('/cart/add.js', config);
  },

  cartChange: async (line, options) => {
    var config = getDefaultRequestConfig();

    options = options || {};

    config.method = 'POST';
    config.body = JSON.stringify({
      line: line,
      quantity: options.quantity,
      properties: options.properties
    });

    return fetchJSON('/cart/change.js', config);
  },

  cartClear: async () => {
    var config = getDefaultRequestConfig();
    config.method = 'POST';

    return fetchJSON('/cart/clear.js', config);
  },

  cartUpdate: async (body) => {
    var config = getDefaultRequestConfig();

    config.method = 'POST';
    config.body = JSON.stringify(body);

    return fetchJSON('/cart/update.js', config);
  },

  cartShippingRates: () => {
    return fetchJSON('/cart/shipping_rates.json', getDefaultRequestConfig());
  }
}



/** ==========================================
 * validate.js
 * @namespace validate
 =============================================*/
 export const validate = {
   key: (key) => {
    if (typeof key !== 'string' || key.split(':').length !== 2) {
      throw new TypeError(
        'Theme Cart: Provided key value is not a string with the format xxx:xxx'
      );
    }
  },

  quantity: (quantity) => {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new TypeError(
        'Theme Cart: An object which specifies a quantity or properties value is required'
      );
    }
  },

  id: (id) => {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new TypeError('Theme Cart: Variant ID must be a number');
    }
  },

  properties: (properties) => {
    if (typeof properties !== 'object') {
      throw new TypeError('Theme Cart: Properties must be an object');
    }
  },

  form: (form) => {
    if (!(form instanceof HTMLFormElement)) {
      throw new TypeError('Theme Cart: Form must be an instance of HTMLFormElement');
    }
  },

  options: (options) => {
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
      validate.quantity(options.quantity);
    }

    if (typeof options.properties !== 'undefined') {
      validate.properties(options.properties);
    }
  }

 }
