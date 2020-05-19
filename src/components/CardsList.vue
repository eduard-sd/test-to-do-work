<template>
    <div class="cards-list scroll"
    >
        <div class="cards-list__title">
            <h2>{{value}} {{ getProjectProgressLength(value) }}</h2>
        </div>
        <div class="card-list__search">
            <search-filter
                    class="search"
                    @searchText="searchTextUpdate"
                    @searchBlur="searchHistory()"
                    :index="index"
                    :columnNameConvector="columnNameConvector()"
            />
            <ul class="search-history"
                v-if="value === 'Новые'"
            >
                <li v-for="(word, searchIndex) in getSearchListNew"
                    :key="searchIndex"
                    class="search-history__item"
                    @click="searchSettings(word)"
                >
                    <span>{{ word }}</span>
                </li>
            </ul>
            <ul class="search-history"
                v-else-if="value === 'В работе'"
            >
                <li v-for="(word, index) in getSearchListInWork"
                    :key="index"
                    class="search-history__item"
                    @click="searchSettings(word)"
                >
                    <span>{{ word }}</span>
                </li>
            </ul>
            <ul class="search-history"
                v-else-if="value === 'Готово'"
            >
                <li v-for="(word, index) in getSearchListReady"
                    :key="index"
                    class="search-history__item"
                    @click="searchSettings(word)"
                >
                    <span>{{ word }}</span>
                </li>
            </ul>
            <ul class="search-history"
                v-else-if="value === 'Архив'"
            >
                <li v-for="(word, index) in getSearchListArchive"
                    :key="index"
                    class="search-history__item"
                    @click="searchSettings(word)"
                >
                    <span>{{ word }}</span>
                </li>
            </ul>
        </div>
        <ul class="cards-list__content" >
            <card
                    :searchText="searchText"
                    :value="value"
                    :id="value"
                    :connection="connection"
            />
        </ul>
        <div v-if="value === 'Новые'">
            <div v-if="!newItem"
                 class="cards-list__add-new"
            >
            <span class="btn btn--add"
                  @click="showFields"
            >
                Добавить еще одну группу
            </span>
            </div>
            <div v-else-if="newItem" class="" >
            <textarea
                    v-model="newTitleProject"
                    @blur="addNewProject()"
                    class="cards-list__text-field"
                    type="text"
                    placeholder="Заголовок для этой карточки"
                    ref="list"
            ></textarea>
                <button
                        class="btn btn--save"
                        @click="addNewProject()"
                >Сохранить
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Card from '@/components/Card';
import SearchFilter from '@/components/SearchFilter';
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'CardsList',
    components: {
        Card,
        SearchFilter,
    },
    props: {
        value: {
            type: String,
            require: true,
        },
        index: Number,
        connection: BroadcastChannel,
    },
    data() {
        return {
            newItem: false,
            newTitleProject: null,
            searchText: '',
        };
    },
    computed: {
        ...mapState('data', ['projectList']),
        ...mapGetters('data', [
            'getLastProjectId',
            'getProjectProgressLength',
            'getSearchListNew',
            'getSearchListInWork',
            'getSearchListReady',
            'getSearchListArchive',
            'getSearchHistory',
        ]),
    },
    methods: {
        searchTextUpdate(value) {
            this.searchText = value;
        },
        showFields() {
            this.newItem = !this.newItem;
            if (this.newItem) this.$nextTick(() => this.$refs.list.focus());
        },
        addNewProject() {
            const project = {
                id: this.getLastProjectId,
                title: this.newTitleProject !== null ? this.newTitleProject : 'Без имени',
                titleEdit: true,
                tasksList: [],
                progress: 'Новые',
                senderEdit: false,
                taskSearchFilter: false,
            };
            this.$store.commit('data/addNewProject', project);
            this.newTitleProject = null;
            this.$store.commit('data/setLastProjectId');
            this.showFields();
        },
        searchHistory() {
            if (this.searchText) {
                this.$store.commit('data/addNewColumnSearch', {
                    columnList: this.columnNameConvector(),
                    word: this.searchText,
                });
            }
        },
        searchSettings(word) {
            this.$emit('searchLast', { word });
        },

        columnNameConvector() {
            let valueConverted = '';
            if (this.value === 'Новые') {
                valueConverted = 'new';
            } if (this.value === 'В работе') {
                valueConverted = 'in_work';
            } if (this.value === 'Готово') {
                valueConverted = 'ready';
            } if (this.value === 'Архив') {
                valueConverted = 'archive';
            }
            return valueConverted;
        },
    },

};
</script>

<style lang="sass">
    .cards-list
        width: 23%
        height: 100%
        overflow-y: auto
        box-shadow: 0 0 5px 4px grey
        padding: 5px
        background-color: #b6bbd2
        border-radius: 3px
        box-sizing: border-box
        display: flex
        flex-direction: column
        max-height: 100%
        position: relative
        white-space: normal

        &__title
            font-size: 12px
            text-align: center
            margin-bottom: 10px

        &__search
            display: flex
            justify-content: space-between
            margin-bottom: 10px

        &__content
            padding: 0

        &__add-new
            min-height: 38px
            max-height: 38px
            display: flex
            justify-content: space-between

    .search
        width: 100%


    .card
        list-style: none
        padding: 5px
        font-size: 12px
        background-color: #fff
        border-radius: 3px
        box-shadow: 0 1px 0 rgba(9,30,66,.25)
        display: block
        margin-bottom: 8px
        min-height: 20px
        position: relative
        text-decoration: none
        z-index: 0
        transition: 0.3s ease

        &:hover
            outline: 0
            color: #091e42
            background: #f7f8fa
            box-shadow: 5px 5px 0 rgba(9, 30, 66, 0.25)
            transition: 0.3s ease

        &-list__search
            width: 90%
            margin-left: auto
            margin-right: auto

    .search-wrapper:hover
        outline: 0
        color: #091e42
        background: #f7f8fa
        box-shadow: 7px 4px 0 rgba(9, 30, 66, 0.25)
        transition: 0.3s ease

</style>
