import template from './sw-string-filter.html.twig';
// import './sw-string-filter.scss';

const {Criteria} = Shopware.Data;

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
        comparator: {
            type: String,
            required: false,
            default: 'contains',
            validValues: ['equals', 'contains'],
            validator(value) {
                return ['equals', 'contains'].includes(value);
            },
        }
    },

    data() {
        return {
            stringValue: null,
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
        updateFilter(newValue) {
            if (!newValue) {
                this.resetFilter();
                return;
            }
            if (newValue === this.stringValue) {
                return;
            }
            let filterCriteria = null;
            switch (this.comparator) {
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
};
