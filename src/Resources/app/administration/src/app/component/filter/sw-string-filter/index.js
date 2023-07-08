import template from './sw-string-filter.html.twig';
import './sw-string-filter.scss';

const {Component} = Shopware;
const {Criteria} = Shopware.Data;

Component.register('sw-string-filter', {
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
        //     validValues: ['equals', 'contains'],
        //     validator(value) {
        //         return ['equals', 'contains'].includes(value);
        //     },
        // }
        // enableManualMode: {
        //     type: Boolean,
        //     default: false,
        // },
    },

    data() {
        const comparator = this.filter.comparator ?? 'contains';
        if (!['equals', 'contains'].includes(comparator)) {
            throw new TypeError("prop comparator must be one of: equals | contains", comparator);
        }
        const enableManualMode = !!(this.filter.enableManualMode ?? false);
        return {
            stringValue: null,
            comparator: comparator,
            currentComparator: comparator,
            enableManualMode: enableManualMode,
        };
    },

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
});
