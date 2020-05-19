<template>
    <div>
        <div class="task-list"  v-if="getTaskList()">
            <template v-if="taskSearchFilter">
                <li
                        class="task"
                        v-for="(task, taskIndex) in this.getTaskList(true)"
                        v-bind:key="taskIndex"
                >
                    <div v-if="task.textEdit"
                    >
                        <div v-if="task.taskSenderEdit"
                             class="task-wrapper"
                        >
                            <p>Поделиться задачей</p>
                            <div class="resend-block">
                                <input
                                        type="text"
                                        :class="{ green: exist, red: hasError }"
                                        v-model="targetCardName"
                                        placeholder="Найти группу"
                                >
                                <div class="resend-block__controls">
                                    <button
                                            class="btn btn--not-done"
                                            @click="sendOriginTask(task.id)"
                                            title="Оправить"
                                    ></button>
                                    <button
                                            class="btn btn--done"
                                            @click="sendCopyTask(task.id)"
                                            title="Отправить копию"
                                    ></button>
                                    <button
                                            class="btn btn--delete"
                                            @click="sendTaskSwitcher(task.id)"
                                            title="Отменить"
                                    >
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else
                             class="task-wrapper task-wrapper--row"
                        >
                            <p class="task-wrapper__text"
                               @click="editProjectTaskToggle(taskIndex)"
                               :class="{ 'task-wrapper__text--done': task.isDone }"
                            >
                                {{ task.text }}
                            </p>
                            <div class="task-controls">
                                <button
                                        class="btn btn--not-done"
                                        @click="setTaskNotDone(task.id)"
                                        title="В работу"
                                ></button>
                                <button
                                        class="btn btn--done"
                                        @click="setTaskDone(task.id)"
                                        title="Готово"
                                ></button>
                                <button
                                        class="btn btn--delete"
                                        @click="deleteTask(task.id)"
                                        title="Удалить"
                                ></button>
                                <button
                                        class="btn btn--send"
                                        @click="sendTaskSwitcher(task.id)"
                                        title="Отправить задачу в другую группу"
                                >
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                    <textarea
                            v-model="taskTextList[taskIndex]"
                            class="task__text-field"
                            type="text"
                            placeholder="Задача"
                            ref="taskEdit"
                            @blur="editProjectTask(taskIndex)"
                    ></textarea>
                        <button
                                class="btn btn--save"
                                @click="editProjectTask(taskIndex)"
                        >Сохранить</button>
                    </div>
                </li>
            </template>
            <template v-else-if="!taskSearchFilter">
                <li
                        class="task"
                        v-for="(task, taskIndex) in this.getTaskList(false)"
                        v-bind:key="taskIndex"
                >
                    <div v-if="task.textEdit"
                    >
                        <div v-if="task.taskSenderEdit"
                             class="task-wrapper"
                        >
                            <p>Поделиться задачей</p>
                            <div class="resend-block">
                                <input
                                        type="text"
                                        :class="{ green: exist, red: hasError }"
                                        v-model="targetCardName"
                                        placeholder="Найти группу"
                                >
                                <div class="resend-block__controls">
                                    <button
                                            class="btn btn--not-done"
                                            @click="sendOriginTask(task.id)"
                                            title="Оправить"
                                    ></button>
                                    <button
                                            class="btn btn--done"
                                            @click="sendCopyTask(task.id)"
                                            title="Отправить копию"
                                    ></button>
                                    <button
                                            class="btn btn--delete"
                                            @click="sendTaskSwitcher(task.id)"
                                            title="Отменить"
                                    >
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else
                             class="task-wrapper task-wrapper--row"
                        >
                            <p class="task-wrapper__text"
                               @click="editProjectTaskToggle(taskIndex)"
                               :class="{ 'task-wrapper__text--done': task.isDone }"
                            >
                                {{ task.text }}
                            </p>
                            <div class="task-controls">
                                <button
                                        class="btn btn--not-done"
                                        @click="setTaskNotDone(task.id)"
                                        title="В работу"
                                ></button>
                                <button
                                        class="btn btn--done"
                                        @click="setTaskDone(task.id)"
                                        title="Готово"
                                ></button>
                                <button
                                        class="btn btn--delete"
                                        @click="deleteTask(task.id)"
                                        title="Удалить"
                                ></button>
                                <button
                                        class="btn btn--send"
                                        @click="sendTaskSwitcher(task.id)"
                                        title="Отправить задачу в другую группу"
                                >
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                    <textarea
                            v-model="taskTextList[taskIndex]"
                            class="task__text-field"
                            type="text"
                            placeholder="Задача"
                            ref="taskEdit"
                            @blur="editProjectTask(taskIndex)"
                    ></textarea>
                        <button
                                class="btn btn--save"
                                @click="editProjectTask(taskIndex)"
                        >Сохранить</button>
                    </div>
                </li>
            </template>
        </div>
        <div v-if="!newItem"
                class=""
        >
            <span class="btn btn--add"
                    @click="showFields"
            >Добавить пункт</span>
        </div>
        <div v-else-if="newItem" class="" >
            <textarea
                    v-model="newTask"
                    @blur="addNewTask()"
                    class="task__text-field"
                    type="text"
                    placeholder="Новая задача"
                    ref="task"
            ></textarea>
            <button
                    class="btn btn--save"
                    @click="addNewTask()"
            >Сохранить
            </button>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    name: 'TaskList',
    props: {
        projectId: {
            type: Number,
            require: true,
        },
        taskSearchFilter: {
            type: [Boolean, String],
            require: true,
        },
    },
    data() {
        return {
            newItem: false,
            taskTextList: [],
            taskInFocus: [],
            newTask: null,
            targetCardName: '',
            exist: false,
            hasError: false,
            targetCardIndex: '',
        };
    },
    watch: {
        targetCardName() {
            const env = this.projectList;
            const projectTitleList = env.map((item) => item.title);
            const check = projectTitleList.includes(this.targetCardName);
            if (check && this.targetCardName.length > 0) {
                this.exist = true;
                this.hasError = false;
                this.targetCardIndex = this.getProjectIndexByTitle(this.targetCardName);
            } else if (!check && this.targetCardName.length > 0) {
                this.hasError = true;
                this.exist = false;
            } else {
                this.exist = false;
                this.hasError = false;
            }
        },
    },
    computed: {
        ...mapState('data', ['projectList']),
        ...mapGetters('data', [
            'getTaskText',
            'getTaskTextToggle',
            'getProjectTaskList',
            'getProjectTaskListLength',
            'getProjectIndexById',
            'getTaskIndexById',
            'getProjectIndexByTitle',
            'getTaskText',
            'getTaskSearchFilter',
        ]),
    },
    methods: {
        getTaskList(bool) {
            const index = this.getProjectIndexById(this.projectId);
            const allTasks = this.getProjectTaskList(index);
            const doneTasks = allTasks.filter((task) => task.isDone === true);
            const inWorkTasks = allTasks.filter((task) => task.isDone === false);
            return bool ? doneTasks : inWorkTasks;
        },

        setTaskDone(id) {
            const projectIndex = this.getProjectIndexById(this.projectId);
            const taskTarget = {
                index: projectIndex,
                taskId: id,
            };
            const task = {
                index: projectIndex,
                taskIndex: this.getTaskIndexById(taskTarget),
            };
            this.$store.commit('data/setTaskDone', task);
        },

        setTaskNotDone(id) {
            const projectIndex = this.getProjectIndexById(this.projectId);
            const taskTarget = {
                index: projectIndex,
                taskId: id,
            };
            const task = {
                index: projectIndex,
                taskIndex: this.getTaskIndexById(taskTarget),
            };
            this.$store.commit('data/setTaskNotDone', task);
        },

        deleteTask(id) {
            const projectIndex = this.getProjectIndexById(this.projectId);
            const taskTarget = {
                index: projectIndex,
                taskId: id,
            };
            const task = this.getTaskIndexById(taskTarget);
            const taskText = this.getTaskText({ index: projectIndex, taskIndex: task });
            this.$store.commit('data/setModal',
                {
                    title: taskText,
                    targetList: 'tasksList',
                    projectListIndex: projectIndex,
                    taskListIndex: task,
                });
        },

        showFields() {
            this.newItem = !this.newItem;
            if (this.newItem) this.$nextTick(() => this.$refs.task.focus());
        },

        editProjectTaskToggle(taskIndex) {
            const task = {
                index: this.getProjectIndexById(this.projectId),
                taskIndex,
            };
            this.taskTextList[taskIndex] = this.getTaskText(task);
            this.$store.commit('data/editProjectTaskToggle', task);

            if (this.taskInFocus.length === 0) {
                this.$nextTick(() => this.$refs.taskEdit[0].focus());
            } else {
                this.taskInFocus[taskIndex] = this.$refs.taskEdit.length;
                this.$nextTick(() => this.$refs.taskEdit[this.taskInFocus[taskIndex]].focus());
            }
        },

        editProjectTask(taskIndex) {
            const task = {
                newText: this.taskTextList[taskIndex] ? this.taskTextList[taskIndex].trim() : 'Пусто',
                index: this.getProjectIndexById(this.projectId),
                taskIndex,
            };
            this.$store.commit('data/editProjectTask', task);
            this.$store.commit('data/editProjectTaskToggle', task);
        },

        addNewTask() {
            const index = this.getProjectIndexById(this.projectId);
            const task = {
                task: {
                    id: this.projectList[index].tasksList.length,
                    text: this.newTask ? this.newTask : 'Пусто',
                    isDone: false,
                    textEdit: true,
                    taskSenderEdit: false,
                },
                index,
            };
            this.$store.commit('data/addNewTask', task);
            this.newTask = null;
            this.showFields();
        },

        sendTaskSwitcher(id) {
            const projectIndex = this.getProjectIndexById(this.projectId);
            const taskTarget = {
                index: projectIndex,
                taskId: id,
            };
            const task = {
                projectIndex,
                taskIndex: this.getTaskIndexById(taskTarget),
            };
            this.$store.commit('data/editTaskSenderEditToggle', task);
            this.targetCardName = '';
        },

        sendOriginTask(id) {
            if (!this.exist) {
                alert('Введите название группы');
                return;
            }
            this.sendCard(id);
            const index = this.getProjectIndexById(this.projectId);
            this.$store.commit('data/deleteTask', {
                index,
                taskIndex: this.getTaskIndexById({ index, taskId: id }),
            });
        },

        sendCopyTask(id) {
            if (!this.exist) {
                alert('Введите название группы');
                return;
            }
            this.sendCard(id);
        },

        sendCard(id) {
            const cardIndex = this.getProjectIndexById(this.projectId);
            const taskIndex = this.getTaskIndexById({ index: cardIndex, taskId: id });
            const taskText = this.getTaskText({ index: cardIndex, taskIndex });
            const task = {
                task: {
                    id: this.projectList[this.targetCardIndex].tasksList.length,
                    text: taskText,
                    isDone: false,
                    textEdit: true,
                    taskSenderEdit: false,
                },
                index: this.targetCardIndex,
            };
            this.$store.commit('data/addNewTask', task);
            this.targetCardName = '';
            this.sendTaskSwitcher(id);
        },

    },
};
</script>

<style lang="sass">
.task
    list-style: none

.task-wrapper
    display: flex
    flex-direction: column
    justify-content: space-between

    &__text
        flex-basis: 70%
        max-width: 70%
        padding: 3px
        word-break: break-word

        &:hover
            background: #ececec

    &__text--done
        color: darkgray
        text-decoration: line-through
        font-style: italic

    &--row
        flex-direction: row


.task-controls
    display: flex

.task-list
    margin-bottom: 10px


</style>
