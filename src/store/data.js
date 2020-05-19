const state = {
    mainTitle: '',
    lastProjectId: 0,
    projectList: [
        // {
        //     id: '',
        //     title: 'dcs',
        //     titleEdit: true,
        //     tasksList: [
        //         {
        //             id: '',
        //             text: '',
        //             isDone: false,
        //             textEdit: false,
        //             taskSenderEdit: false,
        //         }
        //     ],
        //     progress: 'Новые',
        //     senderEdit: false
        //     taskSearchFilter: false
        // }
    ],
    searchFilters: {
        new: [],
        in_work: [],
        ready: [],
        archive: [],
    },
    searchHistory: {
        new: [],
        in_work: [],
        ready: [],
        archive: [],
    },
    environmentList: [],
    modal: {
        modalVisible: false,
        title: '',
        targetList: '',
        projectListIndex: null,
        taskListIndex: null,
    },
};

const mutations = {
    initialiseStore(state) {
        if (sessionStorage.getItem('store')) {
            this.replaceState(
                {
                    ...state,
                    ...JSON.parse(sessionStorage.getItem('store')),
                },
            );
        }
    },

    loadFileToStore(state, payload) {
        this.replaceState(
            {
                ...state,
                ...JSON.parse(payload.file),
            },
        );
    },

    setLastProjectId(state) {
        state.lastProjectId += 1;
    },

    setProjects(state, payload) {
        state.projectList = payload;
    },

    editProjectTitleToggle(state, payload) {
        state.projectList[payload.index].titleEdit = !state.projectList[payload.index].titleEdit;
    },

    setProjectTitle(state, payload) {
        state.projectList[payload.index].title = payload.title;
    },

    setMainTitle(state, payload) {
        state.mainTitle = payload.mainTitle;
    },

    setEmptyProjectTitle(state, payload) {
        state.projectList[payload.index].title = '';
    },

    addNewProject(state, payload) {
        state.projectList.push(payload);
    },

    setProjectInWork(state, payload) {
        state.projectList[payload.index].progress = 'В работе';
    },

    setProjectDone(state, payload) {
        state.projectList[payload.index].progress = 'Готово';
    },

    setProjectProgress(state, payload) {
        state.projectList[payload.index].progress = payload.progress;
    },

    deleteProject(state, payload) {
        state.projectList.splice(payload.index, 1);
    },

    setProjectInArchive(state, payload) {
        state.projectList[payload.index].progress = 'Архив';
    },


    editProjectTaskToggle(state, payload) {
        // eslint-disable-next-line max-len
        state.projectList[payload.index].tasksList[payload.taskIndex].textEdit = !state.projectList[payload.index].tasksList[payload.taskIndex].textEdit;
    },

    editProjectTask(state, payload) {
        state.projectList[payload.index].tasksList[payload.taskIndex].text = payload.newText;
    },

    setEmptyTaskText(state, payload) {
        state.projectList[payload.index].tasksList[payload.taskIndex].text = '';
    },

    addNewTask(state, payload) {
        state.projectList[payload.index].tasksList.push(payload.task);
    },

    setTaskDone(state, payload) {
        state.projectList[payload.index].tasksList[payload.taskIndex].isDone = true;
    },

    setTaskNotDone(state, payload) {
        state.projectList[payload.index].tasksList[payload.taskIndex].isDone = false;
    },

    deleteTask(state, payload) {
        state.projectList[payload.index].tasksList.splice(payload.taskIndex, 1);
    },

    addNewColumnSearch(state, payload) {
        state.searchHistory[payload.columnList].push(payload.word);
    },


    addSearchFilter(state, payload) {
        state.searchFilters[payload.columnList] = payload.filterList;
    },

    addEnviromentItem(state, payload) {
        state.environmentList.push(payload.name);
    },

    addEnviromentItemByIndex(state, payload) {
        state.environmentList[payload.index] = payload.name;
    },

    editSenderEditToggle(state, payload) {
        state.projectList[payload.index].senderEdit = !state.projectList[payload.index].senderEdit;
    },

    editTaskSenderEditToggle(state, payload) {
        // eslint-disable-next-line max-len
        state.projectList[payload.projectIndex].tasksList[payload.taskIndex].taskSenderEdit = !state.projectList[payload.projectIndex].tasksList[payload.taskIndex].taskSenderEdit;
    },

    setModalVisibilityToggle(state) {
        state.modal.modalVisible = !state.modal.modalVisible;
    },

    setModal(state, payload) {
        state.modal = {
            modalVisible: true,
            title: payload.title,
            targetList: payload.targetList,
            projectListIndex: payload.projectListIndex,
            taskListIndex: payload.taskListIndex,
        };
    },

    setNewModal(state) {
        state.modal = {
            modalVisible: false,
            title: '',
            targetList: '',
            projectListIndex: '',
            taskListIndex: '',
        };
    },

    setModalTitle(state, payload) {
        state.modal.title = payload.title;
    },

    setModalAnswer(state, payload) {
        state.modal.answer = payload.answer;
    },

    setCheckedFilters(state, payload) {
        state.checkedFilters = payload;
    },

    setTaskSearchFilter(state, payload) {
        state.projectList[payload.index].taskSearchFilter = payload.bool;
    },
};

const getters = {
    getLastProjectId(state) {
        return state.lastProjectId;
    },

    getProjectIndexById: (state) => (id) => state
        .projectList.findIndex((project) => project.id === id),

    getProjectIndexByTitle: (state) => (title) => state
        .projectList.findIndex((project) => project.title === title),

    getProjectByIndex: (state) => (index) => state.projectList[index],

    getProjectLength(state) {
        return state.projectList.length;
    },

    getProjectTitle: (state) => (index) => state.projectList[index].title,

    getProjectProgressList(state) {
        return (keyword) => state.projectList.filter((item) => item.progress === keyword);
    },

    getProjectProgressLength(state) {
        return (keyword) => state.projectList.filter((item) => item.progress === keyword).length;
    },

    getProjectTaskList: (state) => (index) => state.projectList[index].tasksList,

    getMainTitle(state) {
        return state.mainTitle;
    },

    getProjectTaskListLength: (state) => (index) => state.projectList[index].tasksList.length,

    getTaskText: (state) => (payload) => state
        .projectList[payload.index].tasksList[payload.taskIndex].text,

    getTaskTextToggle: (state) => (payload) => state
        .projectList[payload.index].tasksList[payload.taskIndex].textEdit,

    getTaskIndexById: (state) => (payload) => state
        .projectList[payload.index].tasksList.findIndex((task) => task.id === payload.taskId),

    getSearchHistory(state) {
        return state.searchHistory;
    },

    getSearchListNew(state) {
        return state.searchHistory.new.slice(-5);
    },

    getSearchListInWork(state) {
        return state.searchHistory.in_work.slice(-5);
    },

    getSearchListReady(state) {
        return state.searchHistory.ready.slice(-5);
    },

    getSearchListArchive(state) {
        return state.searchHistory.archive.slice(-5);
    },

    getEnvironmentList(state) {
        return state.environmentList;
    },

    getModalVisibility(state) {
        return state.modal.modalVisible;
    },

    getModal(state) {
        return state.modal;
    },

    getColumnSearchFiltersNew(state) {
        return state.searchFilters.new;
    },

    getColumnSearchFiltersInWork(state) {
        return state.searchFilters.in_work;
    },

    getColumnSearchFiltersReady(state) {
        return state.searchFilters.ready;
    },

    getColumnSearchFiltersArchive(state) {
        return state.searchFilters.archive;
    },

    getTaskSearchFilter: (state) => (index) => state.projectList[index].taskSearchFilter,
};

const actions = {
    modalQuestion({ commit }, payload) {
        commit('setModal', payload);
    },
    modalAnswer({ commit, getters }, payload) {
        const modal = getters.getModal;
        if (payload.answer) {
            if (modal.targetList === 'projectList') {
                commit('deleteProject', { index: state.modal.projectListIndex });
                commit('setNewModal');
            } else if (modal.targetList === 'tasksList') {
                commit('deleteTask', {
                    index: state.modal.projectListIndex,
                    taskIndex: state.modal.taskListIndex,
                });
                commit('setNewModal');
            }
        } else {
            commit('setModalVisibilityToggle');
            commit('setNewModal');
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};
