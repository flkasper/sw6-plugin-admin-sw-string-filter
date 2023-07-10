# Shopware 6 Plugin: Admin sw-string-filter

Shopware-Version: >= 6.4.4

Plugin that adds the missing sw-string-filter in admin.

## Checkout

```bash
git clone git@github.com:flkasper/sw6-plugin-admin-sw-string-filter.git FlkasperAdminSwStringFilter
```

## (Filter) Props

| (Filter) Props         | Type    | Default          | Valid_values                                      | Description                                                                     |
|------------------------|---------|:-----------------|:--------------------------------------------------|:--------------------------------------------------------------------------------|
| ```comparator```       | string  | ```'contains'``` | ```contains, equals, equalsAny, prefix, suffix``` | Set the comparator or the initial value, if ```enableManualMode``` ist enabled. |
| ```enableManualMode``` | boolean | ```false```      | ```true, false```                                 | Enable manual mode to let the user choose the comparator.                       |

## Example

```
// vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-list/index.js

// add to defaultFilters in data():
defaultFilters: [
    'productNumber-filter',
    // ...
];
// add to listFilterOptions() in computed
listFilterOptions() {
    return {
        'productNumber-filter': {
            property: 'productNumber',
            label: this.$tc('sw-product.filters.productNumberFilter.label'),
            placeholder: this.$tc('sw-product.filters.productNumberFilter.placeholder'),
            // type: 'string-filter', // if no string property
            // enableManualMode: true, // enable manual mode to let user choose comparator
            // comparator: 'contains', // of contains|equals|equalsAny|prefix|suffix
        },
        // ...
    };
};



```
