/**
 * @typedef {object} Cart https://shopify.dev/api/liquid/objects/cart, https://shopify.dev/api/ajax/reference/cart#get-cart-js
 * @property {lineItem[]} items
 * @property {number} item_count
 * @property {object} attributes
 * @property {DiscountApplications} cart_level_discount_applications
 * @property {Currency} currency
 * @property {DiscountApplications} discount_applications
 * @property {number} items_subtotal_price Returns the sum of the cart's line-item prices after any line-item discount. The subtotal doesn't include taxes (unless taxes are included in the prices), cart discounts, or shipping costs.
 * @property {string} note
 * @property {number} original_total_price Returns the subtotal of the cart before any discounts have been applied.
 * @property {boolean} taxes_included Returns true if taxes are included in your products' prices. Otherwise, returns false.
 * @property {number} total_discount Returns the total of all discounts (the amount saved) for the cart.
 * @property {number} total_price Returns the total price of all of the items in the cart after discounts have been applied.
 * @property {number} total_weight
 */
/**
 * @typedef {object} DiscountApplications
 * @property {any} target_selection
 * @property {any} target_type
 * @property {any} title
 * @property {any} total_allocated_amount
 * @property {any} type
 * @property {any} value
 * @property {any} value_type
 */
/**
 * @typedef {object} Currency https://shopify.dev/api/liquid/objects/currency
 * @property {string} currency.name Returns the name of the currency (for example United States dollars or Euro).
 * @property {string} currency.iso_code Returns the ISO code of the currency (for example USD or EUR).
 * @property {string} currency.symbol v
/**
 * @typedef {object} FeaturedImage - Returns the line item's image.
 * @property {string} FeaturedImage.url
 * @property {number} FeaturedImage.aspect_ratio
 * @property {string} FeaturedImage.alt
 */
/**
 * https://shopify.dev/docs/themes/liquid/reference/objects/line_item
 * https://shopify.dev/docs/themes/liquid/reference/objects/product
 * https://shopify.dev/docs/themes/ajax-api/reference/cart#get-cart-js
 * @typedef {object} lineItem - A cart lineItem is a mixture of lineItem object and Product object
 * @property {number} lineItem.id - Returns the line item's ID. -- Returns the ID of the line item's variant. This ID is not unique, and can be shared by multiple items of the same variant.
 * @property {number} lineItem.variant_id - Returns the ID of the line item's variant.
 * @property {number} lineItem.quantity - Returns the quantity of the line item.
 * @property {string} lineItem.key - Returns the line item key, a unique identifier for the line item. The line item key is constructed from the line item's variant ID plus a hash of the line item's properties, even if the item has no additional properties.
 * @property {string} lineItem.title - Returns the title of the line item. line_item.title combines both the line item's product.title and the line item's variant.title, separated by a hyphen.
 * @property {number} lineItem.price - Not sure how differs form line_price
 * @property {number} lineItem.line_price - Not sure how differs form final_line_price
 * @property {number} lineItem.final_price - Returns the price of the line item including all line level discount amounts.
 * @property {number} lineItem.final_line_price - Returns the combined price of all the items in the line item.
 * @property {string} lineItem.sku - Returns the SKU (stock keeping unit) of the line item's variant.
 * @property {number} lineItem.grams - Returns the weight of the line item. Use the weight_with_unit filter to format the weight.
 * @property {string} lineItem.vendor - Returns the vendor of the line item's product.
 * @property {boolean} lineItem.taxable - Returns true if taxes are charged on the line item's variant, or false if they are not.
 * @property {number} lineItem.product_id - Returns the ID of the line item's product.
 * @property {boolean} lineItem.product_has_only_default_variant - Returns true if the product only has the default variant. This lets you determine whether to show a variant picker in your product forms.
 * @property {boolean} lineItem.gift_card - Returns true if the line item's product is a gift card, or false if it is not.
 * @property {string} lineItem.url - Returns the relative URL of the line item's variant. The relative URL does not include your store's root URL (mystore.myshopify.com).
 * @property {FeaturedImage} lineItem.featured_image - Returns the line item's image.
 * @property {string} lineItem.image - Returns the line item's image url
 * @property {string} lineItem.handle - Returns the handle of a product.
 * @property {boolean} lineItem.requires_shipping - Returns true if the variant of the line item requires shipping, or false if it does not.
 * @property {string} lineItem.product_title - Returns the title of the product.
 * @property {string} lineItem.product_description - Returns the description of the product.
 * @property {string} lineItem.product_type - Returns the type of the product.
 * @property {string} lineItem.variant_title - Returns the concatenation of all the variant's product option values, joined by / characters.
 * @property {array} lineItem.variant_options - Returns an array of the variant's product option values.
 * @property {array} lineItem.options_with_values - Returns an array of the variant's product options as objects with name: value: pairs
 * @property {object} lineItem.properties - Returns an object of the variant's properties as name: value: pairs
 */

