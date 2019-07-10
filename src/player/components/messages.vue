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
      <v-btn icon @click="closeSnackbar">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { local } from "../../helpers";

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
      const { runtimeMessages } = await local.get({ runtimeMessages: [] });
      if (!runtimeMessages.length) {
        return;
      }

      const message = Object.assign(
        {},
        { y: "top", mode: "multi-line", timeout: 0 },
        runtimeMessages.shift()
      );

      if (!message.html) {
        console.error("Got empty runtime message", { message });
        return;
      }

      this.snackbar.show = true;
      this.snackbar.message = message;

      await local.set({ runtimeMessages });
    },

    closeSnackbar() {
      this.snackbar.show = false;

      setTimeout(() => {
        this.snackbar.message = {};
        this.loadOneRuntimeMessage();
      }, 1000);
    }
  },

  mounted() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (changes.runtimeMessages && !this.snackbar.message.html) {
        this.loadOneRuntimeMessage();
      }
    });

    this.loadOneRuntimeMessage();

    this.$el.addEventListener("click", event => {
      if (event.target.matches("#runtime-message-content a")) {
        this.$ga.event("actions", "runtime-message-link", event.target.href);
      }
    });
  }
};
</script>
