import template from './sw-string-filter.html.twig';
import './sw-string-filter.scss';

const {Criteria} = Shopware.Data;
const currentComparatorOptions = [
    "contains",
    "equals",
    "equalsAny",
    "prefix",
    "suffix",
];

export default {
    template,

    props: {
        filter: {
            type: Object,
            required: true,
        },
        active: {
            type: Boolean,
            required: true,
        },
        // comparator: {
        //     type: String,
        //     required: false,
        //     default: 'contains',
        //     validValues: currentComparatorOptions,
        //     validator(value) {
        //         return currentComparatorOptions.includes(value);
        //     },
        // }
        // enableManualMode: {
        //     type: Boolean,
        //     default: false,
        // },
    },

    data() {
        let comparator = this.filter.comparator ?? 'contains';
        if (!currentComparatorOptions.includes(comparator)) {
            throw new TypeError("prop comparator must be one of: equals | contains", comparator);
        }
        return {
            stringValue: null,
            comparator: comparator,
            currentComparator: comparator,
            currentComparatorOptions: currentComparatorOptions,
            enableManualMode: !!(this.filter.enableManualMode ?? false),
        };
    }
    ,

    watch: {
        'filter.value': {
            handler() {
                if (this.filter.value) {
                    this.stringValue = '' + this.filter.value;
                }
            },
        },
        active(value) {
            if (!value) {
                this.resetFilter();
            }
        },
    },

    methods: {
        updateFilter(newValue, skipCheck = false) {
            if (!newValue) {
                this.resetFilter();
                return;
            }
            if (newValue === this.stringValue && !skipCheck) {
                return;
            }
            let filterCriteria = null;
            switch (this.enableManualMode ? this.currentComparator : this.comparator) {
                case 'equals':
                    filterCriteria = [Criteria.equals(this.filter.property, newValue)];
                    break;
                case 'equalsAny':
                    filterCriteria = [Criteria.equalsAny(this.filter.property, newValue.split(' ').map(e => e.trim()))];
                    break;
                case 'prefix':
                    filterCriteria = [Criteria.prefix(this.filter.property, newValue)];
                    break;
                case 'suffix':
                    filterCriteria = [Criteria.suffix(this.filter.property, newValue)];
                    break;
                case 'contains':
                default:
                    filterCriteria = [Criteria.contains(this.filter.property, newValue)];
            }
            this.$emit('filter-update', this.filter.name, filterCriteria, newValue);
        },

        resetFilter() {
            this.stringValue = null;
            this.$emit('filter-reset', this.filter.name, this.stringValue);
        },
    },
};
