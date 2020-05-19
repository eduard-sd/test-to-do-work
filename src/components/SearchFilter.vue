<template>
    <div>
        <label class="search-wrapper">
            <input
                    type="text"
                    :class="this.index"
                    v-model="searchText"
                    placeholder="Поиск"
                    @blur="searchBlur"
            >
        </label>
        <div class="filters">
            <span>Искать в:</span>
            <label class="filter-title">
                <input
                        class="visually-hidden"
                        @change="cleanSearch"
                        type="checkbox"
                        value="groups"
                        v-model="searchFilters"
                >
                <span
                        :class="{ 'filter-selected': isChecked('groups') }"
                >Группы</span>
            </label>
            <label class="filter-title">
                <input
                        class="visually-hidden"
                        @change="cleanSearch"
                        type="checkbox"
                        value="tasks"
                        v-model="searchFilters"
                >
                <span
                        :class="{ 'filter-selected': isChecked('tasks') }"
                >Задачи</span>
            </label>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SearchFilter',
    props: {
        index: Number,
        lastSearchedText: String,
        columnNameConvector: {
            type: String,
            require: true,
        },
    },
    data() {
        return {
            searchText: '',
            searchFilters: [],
        };
    },
    watch: {
        searchText(text) {
            this.$emit('searchText', text);
        },
        searchFilters(event) {
            this.$store.commit('data/addSearchFilter', {
                columnList: this.columnNameConvector,
                filterList: event,
            });
        },
    },

    created() {
        this.$parent.$on('searchLast', (data) => {
            this.searchText = data.word;
        });
    },

    methods: {
        searchBlur() {
            if (this.searchText) {
                this.$emit('searchBlur', this.searchText);
            }
        },
        cleanSearch() {
            this.searchText = '';
        },
        isChecked(value) {
            return this.searchFilters.includes(value);
        },
    },
};
</script>

<style scoped lang="sass">
    .search-wrapper
        display: flex
        flex-direction: column

        margin-bottom:  10px

    .filters
        display: flex
        align-items: center
        font-size: 12px
        line-height: 14px
        justify-content: flex-start

    .filter-title
        font-size: 12px
        line-height: 14px
        margin-left: 10px
        cursor: pointer
        .filter-selected
            font-weight: bold
            text-decoration: underline

</style>
