<template>
  <div>
    <v-snackbar
      v-model="snackbar.show"
      :bottom="snackbar.message.y === 'bottom'"
      :left="snackbar.message.x === 'left'"
      :multi-line="snackbar.message.mode === 'multi-line'"
      :right="snackbar.message.x === 'right'"
      :timeout="snackbar.message.timeout"
      :top="snackbar.message.y === 'top'"
      :vertical="snackbar.message.mode === 'vertical'"
      :color="snackbar.message.color"
    >
      <span v-html="snackbar.message.html" id="runtime-message-content"></span>
      <v-btn
        :icon="snackbar.message.mode !== 'vertical'"
        :flat="snackbar.message.mode === 'vertical'"
        @click="closeSnackbar"
      >
        <v-icon v-if="snackbar.message.mode !== 'vertical'">close</v-icon>
        <span v-else>Закрыть</span>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { shift as getMessage } from "../../../helpers";

export default {
  name: "messages",

  data() {
    return {
      snackbar: {
        show: false,
        message: {}
      }
    };
  },

  methods: {
    async loadOneRuntimeMessage() {
      chrome.storage.onChanged.removeListener(this.storageOnChanged);

      let message = await getMessage();

      chrome.storage.onChanged.addListener(this.storageOnChanged);

      if (!message) {
        return;
      }

      message = Object.assign(
        {},
        { y: "top", mode: "multi-line", timeout: 0 },
        message
      );

      if (!message.html) {
        console.error("Got empty runtime message", { message });
        return;
      }

      this.snackbar.show = true;
      this.snackbar.message = message;
    },

    closeSnackbar() {
      this.snackbar.show = false;

      setTimeout(() => {
        this.snackbar.message = {};
        this.loadOneRuntimeMessage();
      }, 1000);
    },

    storageOnChanged(changes) {
      if (
        changes.runtimeMessages &&
        changes.runtimeMessages.newValue &&
        changes.runtimeMessages.newValue.length &&
        !this.snackbar.message.html
      ) {
        this.loadOneRuntimeMessage();
      }
    }
  },

  mounted() {
    this.loadOneRuntimeMessage();

    this.$el.addEventListener("click", event => {
      if (event.target.matches("#runtime-message-content a")) {
        this.$ga.event("actions", "runtime-message-link", event.target.href);
      }
    });
  }
};
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
