<template>
    <div class="modal-layer">
        <div class="modal-box">
            <h3>Удалить "{{ getModal.title }}" из {{ this.list }}?</h3>
            <div class="controls">
                <button
                        class="btn btn--remove"
                        @click="answer(true)"
                >Да</button>
                <button
                        class="btn btn--cancel"
                        @click="answer(false)"
                >Нет</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Modal',
    computed: {
        ...mapGetters('data', ['getModal']),
        list() {
            return this.getModal.targetList === 'projectList' ? 'групп' : 'задач';
        },
    },
    methods: {
        answer(bool) {
            this.$store.dispatch(
                'data/modalAnswer',
                { answer: bool },
            );
        },
    },
};
</script>

<style scoped lang="sass">
    .modal-layer
        position: absolute
        width: 100%
        height: 100%
        background: rgba(0,0,0,0.50)
    .modal-box
        position: absolute
        width: auto
        height: auto
        display: flex
        flex-direction: column
        background: #ffffff
        top: 50%
        left: 50%
        transform:  translate(-50%, -50%)
        padding: 20px
        border-radius: 5px
        h3
            text-align: center
            padding-top: 20px

    .controls
        display: flex
        justify-content: space-around
</style>
