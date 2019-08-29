<template>
    <div>
        <v-snackbar
            :bottom="snackbar.message.y === 'bottom'"
            :color="snackbar.message.color"
            :left="snackbar.message.x === 'left'"
            :multi-line="snackbar.message.mode === 'multi-line'"
            :right="snackbar.message.x === 'right'"
            :timeout="snackbar.message.timeout"
            :top="snackbar.message.y === 'top'"
            :vertical="snackbar.message.mode === 'vertical'"
            close-text="Закрыть сообщение"
            role="alert"
            v-model="snackbar.show"
        >
            <span id="runtime-message-content" v-html="snackbar.message.html"></span>
            <v-btn
                :icon="snackbar.message.mode !== 'vertical'"
                :text="snackbar.message.mode === 'vertical'"
                @click="closeSnackbar"
                aria-label="Закрыть"
            >
                <v-icon v-if="snackbar.message.mode !== 'vertical'">mdi-close-circle</v-icon>
                <span v-else>Закрыть</span>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
    import {shift} from '@/helpers/runtime-messages';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'messages',
    })
    export default class Messages extends Vue {
        public snackbar: {
            show: boolean,
            message: RuntimeMessage | null,
        } = {
            show: false,
            message: null,
        };

        public async loadOneRuntimeMessage() {
            chrome.storage.onChanged.removeListener((c) => this.storageOnChanged(c));

            let message = await shift();

            chrome.storage.onChanged.addListener((c) => this.storageOnChanged(c));

            if (!message) {
                return;
            }

            message = Object.assign(
                {},
                {y: 'top', mode: 'multi-line', timeout: 0},
                message,
            );

            if (!message.html) {
                console.error('Got empty runtime message', {message});
                return;
            }

            this.snackbar.show = true;
            this.snackbar.message = message;
        }

        public closeSnackbar() {
            this.snackbar.show = false;

            setTimeout(() => {
                this.snackbar.message = null;
                this.loadOneRuntimeMessage();
            }, 500);
        }

        public storageOnChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
            if (
                changes.runtimeMessages &&
                changes.runtimeMessages.newValue &&
                changes.runtimeMessages.newValue.length &&
                !this.snackbar.message
            ) {
                this.loadOneRuntimeMessage();
            }
        }

        public mounted() {
            this.loadOneRuntimeMessage();
        }
    }
</script>

<style>
    @media only screen and (min-width: 600px) {
        .v-snack__wrapper {
            max-width: 852px;
        }
    }

    .v-snack__content {
        height: auto !important;
    }
</style>
