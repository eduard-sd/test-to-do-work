<template>
    <div class="container"
         @dragover.prevent
         @drop.prevent="drop"
    >
        <div class="container__title">
            <div v-if="!titleIsEditing"
                 class="project-title"
            >
                <span>Название проекта:</span>
                <h1 @click="titleSwitcher()">{{ mainProjectTitle }}</h1>
            </div>
            <div v-else class="project-title project-title--input">
                <label for="projectTitle">
                    <span>Название проекта: </span>
                    <input
                            id="projectTitle"
                            v-model="mainProjectTitle"
                            type="text"
                            placeholder="Ваш проект"
                            ref="mainTitle"
                            @blur="editMainTitle()"
                    >
                </label>
                <button
                        class="btn btn--title-add"
                        @click="editMainTitle()"
                        title="Сохранить"
                >
                </button>
            </div>
        </div>
        <div class="container__block">
            <cards-list
                    v-for="(value, index) in columnList"
                    :key="index"
                    :value="value"
                    :index="index"
                    :connection="connection"
            />
        </div>
        <modal v-if="getModalVisibility"></modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import CardsList from '@/components/CardsList';
import Modal from '@/components/Modal.vue';


export default {
    name: 'Board',
    components: {
        CardsList,
        Modal,
    },

    data() {
        return {
            columnList: ['Новые', 'В работе', 'Готово', 'Архив'],
            mainProjectTitle: '',
            titleIsEditing: true,
            fileText: '',
            connection: new BroadcastChannel('thechannel'),
        };
    },

    computed: {
        ...mapGetters('data', ['getMainTitle', 'getLastProjectId', 'getEnvironmentList', 'getModalVisibility']),
    },

    created() {
        this.restoreMainProjectTitle();

        this.connection.onmessage = (event) => {
            const message = event.data;
            if (message.action === 'add-environment') {
                const env = this.getEnvironmentList;
                const index = env.findIndex((title) => title === message.previousTitle);
                if (index === -1) {
                    this.$store.commit('data/addEnviromentItem', { name: message.projectName });
                } else {
                    this.$store.commit('data/addEnviromentItemByIndex', { index, name: message.projectName });
                }
            } else if (message.action === 'add-task') {
                const card = JSON.parse(message.card);
                const project = {
                    id: this.getLastProjectId,
                    title: card.title,
                    titleEdit: true,
                    tasksList: card.tasksList,
                    progress: card.progress,
                    senderEdit: false,
                };

                this.$store.commit('data/addNewProject', project);
                this.$store.commit('data/setLastProjectId');
            }
        };

        if (this.mainProjectTitle.length > 0) {
            this.connection.postMessage({
                action: 'add-environment',
                projectName: this.mainProjectTitle,
                previousTitle: '',
            });
        }
    },

    watch: {
        fileText() {
            this.$store.commit('data/loadFileToStore', { file: this.fileText });
            this.restoreMainProjectTitle();
        },
    },

    methods: {
        titleSwitcher() {
            this.titleIsEditing = !this.titleIsEditing;
            if (this.mainProjectTitle.length === 0) this.titleIsEditing = true;

            if (this.mainProjectTitle) {
                this.$nextTick(() => this.$refs.mainTitle.focus());
            }
        },

        editMainTitle() {
            this.titleSwitcher();

            if (this.mainProjectTitle.length >= 0) {
                this.connection.postMessage({
                    action: 'add-environment',
                    projectName: this.mainProjectTitle,
                    previousTitle: this.getMainTitle,
                });

                this.$store.commit('data/setMainTitle', { mainTitle: this.mainProjectTitle });
            }
        },
        restoreMainProjectTitle() {
            const mainTitle = this.getMainTitle;
            if (mainTitle) {
                this.mainProjectTitle = mainTitle;
                this.titleIsEditing = false;
            }
        },
        drop(e) {
            const cardId = e.dataTransfer.getData('card_id');
            const card = document.getElementById(cardId);
            card.style.opacity = '1';

            const cardList = e.target.closest('.cards-list');
            if (cardList) {
                const wrapper = cardList.querySelector('.card-wrapper');
                const progress = wrapper.id;
                this.$store.commit('data/setProjectProgress', { index: cardId, progress });
            }
        },

    },
};
</script>

<style lang="sass">
    .container
        display: flex
        align-items: center
        width: 100%
        height: 100%
        flex-direction: column

        &__title,
        &__block
            display: flex
            justify-content: space-between
            width: 95%
            align-items: flex-start;

    .project-title
        padding: 20px

        &--input
            display: flex
            flex-direction: row
            position: relative
            justify-content: flex-start
            align-items: center

            input
                height: 50px
                margin-right: 20px

            input[type="text"]
                font-size: 24px


            .btn--title-add
                width: 25px
                height: 25px

    .import-export-wrapper
        display: flex
        align-items: center
        justify-content: space-between
        max-width: 40%
</style>
