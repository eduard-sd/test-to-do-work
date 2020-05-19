<template>
    <div class="card-wrapper">
        <li
                class="card"
                v-for="(project, filteredIndex) in filteredList()"
                :key="filteredIndex"
                :id="project.id"
                :draggable="true"
                @dragstart="dragStart"
        >

            <div class="title-wrapper">
                <div v-if="project.titleEdit"
                     class="card-title"
                >
                    <div v-if="project.senderEdit"
                         class="card-title__view-block card-title__view-block--resend-card"
                    >
                        <h4>Поделиться группой</h4>
                        <div class="resend-block">
                            <input
                                    type="text"
                                    :class="{green: exist, red: hasError}"
                                    v-model="targetProjectName"
                                    placeholder="Найти проект"
                            >
                            <div class="resend-block__controls">
                                <button
                                        class="btn btn--not-done"
                                        @click="sendOriginCard(project.id)"
                                        title="Оправить"
                                ></button>
                                <button
                                        class="btn btn--done"
                                        @click="sendCopyCard(project.id)"
                                        title="Отправить копию"
                                ></button>
                                <button
                                        class="btn btn--delete"
                                        @click="sendCardSwitcher(project.id)"
                                        title="Отменить"
                                >
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else
                         class="card-title__view-block"
                    >
                        <span>
                            <p>Группа:<br></p>
                            <h3 @click="editProjectTitleToggle(project.id)">
                                {{ project.title }}
                            </h3>
                        </span>
                        <div class="card-title__controls">
                            <button
                                    class="btn btn--not-done"
                                    @click="setProjectInWork(project.id)"
                                    title="В работу"
                            ></button>
                            <button
                                    class="btn btn--done"
                                    @click="setProjectDone(project.id)"
                                    title="Готово"
                            ></button>
                            <button
                                    class="btn btn--delete"
                                    @click="softDelete(project.id)"
                                    title="Удалить"
                            >
                            </button>
                            <button
                                    class="btn btn--send"
                                    @click="sendCardSwitcher(project.id)"
                                    title="Отправить тикет в другой проект"
                            >
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="card-title card-title--input-block">
                    <input
                            v-model="newProjectName[getProjectIndexById(project.id)]"
                            @blur="setProjectTitle(project.id)"
                            class="card-title__block"
                            type="text"
                            placeholder="Название тикета"
                            ref="project"
                    >
                    <button
                            class="btn btn--title-add"
                            @click="setProjectTitle(project.id)"
                            title="Сохранить"
                    >
                    </button>
                </div>
            </div>
            <div class="card__task-list">
                <div class="task-title">
                    <h4>Задач: {{ getTaskList(project.id).length }}</h4>
                    <div class="task-title__status">
                        <label class="tasks-in-work">
                            <input
                                    class="visually-hidden"
                                    :id="'in-work'+project.id"
                                    type="radio"
                                    :value="false"
                                    v-model="taskSearchFilter"
                            >
                            <span
                                    :class="{ 'filter-selected': taskSearchFilter===false }"
                            >В работе</span>
                        </label>

                        <span>|</span>

                        <label class="tasks-done">
                            <input
                                    class="visually-hidden"
                                    :id="'done'+project.id"
                                    type="radio"
                                    :value="true"
                                    v-model="taskSearchFilter"
                            >
                            <span
                                    :class="{ 'filter-selected': taskSearchFilter!==false}"
                            >Готово</span>
                        </label>
                    </div>
                </div>
                <ul>
                    <task-list
                            :index="filteredIndex"
                            :projectId="project.id"
                            :taskSearchFilter="taskSearchFilter"
                    />
                </ul>
            </div>
        </li>
    </div>
</template>

<script>
import TaskList from '@/components/TaskList';

import { mapGetters, mapState } from 'vuex';

export default {
    name: 'Card',
    components: {
        TaskList,
    },
    props: {
        value: {
            type: String,
            require: true,
        },
        searchText: {
            type: String,
            require: false,
        },
        connection: BroadcastChannel,
    },
    data() {
        return {
            newProjectName: [],
            projectInFocus: [],
            items: null,
            targetProjectName: '',
            exist: false,
            hasError: false,
            taskSearchFilter: false,
        };
    },
    watch: {
        targetProjectName() {
            const env = this.getEnvironmentList;
            const check = env.includes(this.targetProjectName);
            if (check && this.targetProjectName.length > 0) {
                this.exist = true;
                this.hasError = false;
            } else if (!check && this.targetProjectName.length > 0) {
                this.hasError = true;
                this.exist = false;
            } else {
                this.exist = false;
                this.hasError = false;
            }
        },
    },
    computed: {
        ...mapState('data', ['searchFilters', 'projectList', 'deleteProject']),
        ...mapGetters('data', [
            'getProjectIndexById',
            'getProjectTaskList',
            'getProjectProgressList',
            'getProjectProgressLength',
            'getProjectTitle',
            'getProjectLength',
            'getProjectTaskListLength',
            'getEnvironmentList',
            'getProjectByIndex',
            'getModalAnswer',
            'getColumnSearchFilters',
            'getColumnSearchFiltersNew',
            'getColumnSearchFiltersInWork',
            'getColumnSearchFiltersReady',
            'getColumnSearchFiltersArchive',
        ]),
    },
    methods: {
        getTaskList(project) {
            const index = this.getProjectIndexById(project);
            return this.getProjectTaskList(index);
        },

        setProjectInWork(id) {
            const index = this.getProjectIndexById(id);
            this.$store.commit('data/setProjectInWork', { index });
        },

        setProjectDone(id) {
            const index = this.getProjectIndexById(id);
            this.$store.commit('data/setProjectDone', { index });
        },

        softDelete(id) {
            const index = this.getProjectIndexById(id);
            if (this.projectList[index].progress === 'Архив') {
                const projectTitle = this.getProjectTitle(index);
                this.$store.commit('data/setModal',
                    {
                        title: projectTitle,
                        targetList: 'projectList',
                        projectListIndex: index,
                    });
            } else {
                this.$store.commit('data/setProjectInArchive', { index });
            }
        },

        editProjectTitleToggle(id) {
            const index = this.getProjectIndexById(id);
            this.newProjectName[index] = this.getProjectTitle(index);
            this.$store.commit('data/editProjectTitleToggle', { index });

            if (this.projectInFocus.length === 0) {
                this.$nextTick(() => this.$refs.project[0].focus());
            } else {
                this.projectInFocus[index] = this.$refs.project.length;
                this.$nextTick(() => this.$refs.project[this.projectInFocus[index]].focus());
            }
        },

        setProjectTitle(id) {
            const index = this.getProjectIndexById(id);
            const newName = {
                title: this.newProjectName[index] ? this.newProjectName[index].trim() : 'Без имени',
                index,
            };
            this.$store.commit('data/setProjectTitle', newName);
            this.$store.commit('data/editProjectTitleToggle', { index });
        },

        filteredList() {
            const progressList = this.getProjectProgressList(this.value);

            const filterListInColumn = this.columnNameConvector();
            if (progressList && this.searchText) {
                if (filterListInColumn.includes('groups')
                    && !filterListInColumn.includes('all')
                    && !filterListInColumn.includes('tasks')
                ) {
                    return progressList.filter((project) => {
                        const title = project.title.toLowerCase();
                        const result = title.includes(this.searchText ? this.searchText.toLowerCase() : '');
                        this.items = result.length;
                        return result;
                    });
                }
                if (!filterListInColumn.includes('groups')
                     && !filterListInColumn.includes('all')
                     && filterListInColumn.includes('tasks')
                ) {
                    // eslint-disable-next-line max-len,array-callback-return,consistent-return
                    return progressList.filter((project) => {
                        const tasks = project.tasksList.filter((task) => {
                            const text = task.text.toLowerCase();
                            return text.includes(this.searchText ? this.searchText.toLowerCase() : '');
                        });
                        if (tasks.length > 0) return true;
                    });
                }
                const searchInGroups = progressList.filter((project) => {
                    const title = project.title.toLowerCase();
                    const result = title.includes(this.searchText ? this.searchText.toLowerCase() : '');
                    this.items = result.length;
                    return result;
                });

                // eslint-disable-next-line array-callback-return,consistent-return
                const searchInTask = progressList.filter((project) => {
                    const tasks = project.tasksList.filter((task) => {
                        const text = task.text.toLowerCase();
                        return text.includes(this.searchText ? this.searchText.toLowerCase() : '');
                    });
                    if (tasks.length > 0) return true;
                });
                const mix = searchInGroups.concat(searchInTask);
                return [...new Set(mix)];
            }
            if (progressList && !this.searchText) {
                this.items = progressList.length;
                return progressList;
            }
            this.items = 0;
            return [];
        },

        dragStart(e) {
            const { target } = e;
            e.dataTransfer.setData('card_id', target.id);

            this.$nextTick(() => {
                target.style.opacity = '0.5';
            });
        },

        sendCardSwitcher(id) {
            const index = this.getProjectIndexById(id);
            this.$store.commit('data/editSenderEditToggle', { index });
            this.targetProjectName = '';
        },

        sendOriginCard(id) {
            if (!this.exist) {
                alert('Введите название проекта');
                return;
            }
            this.sendCard(id);
            const index = this.getProjectIndexById(id);
            this.$store.commit('data/deleteProject', { index });

            this.targetProjectName = '';
            alert('Оригинал отправлен');
        },

        sendCopyCard(id) {
            if (!this.exist) {
                alert('Введите название проекта');
                return;
            }
            this.sendCard(id);

            this.targetProjectName = '';
            alert('Копия отправлена');
        },

        sendCard(id) {
            const index = this.getProjectIndexById(id);
            const targetCard = this.getProjectByIndex(index);
            const sendigCard = {
                title: targetCard.title,
                tasksList: targetCard.tasksList,
                progress: targetCard.progress,
            };

            this.connection.postMessage({
                action: 'add-task',
                card: JSON.stringify(sendigCard),
            });
        },

        columnNameConvector() {
            let valueConverted = null;
            if (this.value === 'Новые') {
                valueConverted = this.getColumnSearchFiltersNew;
            } if (this.value === 'В работе') {
                valueConverted = this.getColumnSearchFiltersInWork;
            } if (this.value === 'Готово') {
                valueConverted = this.getColumnSearchFiltersReady;
            } if (this.value === 'Архив') {
                valueConverted = this.getColumnSearchFiltersArchive;
            }
            return valueConverted;
        },
        taskFilter(id) {
            this.$store.commit('data/setTaskSearchFilter', {
                index: this.getProjectIndexById(id),
                filterList: this.taskSearchFilter,
            });
        },
    },
};
</script>

<style scoped lang="sass">
    .card-wrapper
        max-width: 90%
        margin-left: auto
        margin-right: auto

    .card-title
        margin-bottom: 10px

        & h3:hover
            background: #ececec


        &--input-block
            display: flex
            align-items: center
            justify-content: center

        &__block
            width: 90%
            height: 14px

        &__view-block
            display: flex
            justify-content: space-between

        &__view-block--resend-card
            display: flex
            justify-content: space-between
            flex-direction: column

        &__controls
            display: flex
            align-items: center

    .task-title
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between

        .task-title__status
            right: 5px
            font-size: 10px
            line-height: 16px
            width: 100px
            display: flex
            justify-content: space-around
            margin: 0 0 8px
            text-align: center

        .tasks-done,
        .tasks-in-work
            &:hover
                font-weight: bold
                cursor: pointer
            &:checked
                font-weight: bold
    .filter-selected
        font-weight: bold
        text-decoration: underline
</style>
