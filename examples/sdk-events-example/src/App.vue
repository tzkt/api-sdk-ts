<template>
  <div id="app">
    <div class="container">
      <div class="column is-half is-offset-one-quarter">
        <div class="card p-5">
          <div class="is-flex is-justify-content-space-between">
            <div class="buttons mb-0">
              <b-button class="is-primary" @click="subscribeToTransfers()"
                >Subscribe</b-button
              >
              <b-button @click="unsubscribeFromTransfers()">Unsubscribe</b-button>
              <b-taglist class="mb-0">
                <b-tag v-if="status" type="is-primary is-light" size="is-medium">{{ status }}</b-tag>
              </b-taglist>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half is-offset-one-quarter">
        <p>Event: {{ event }}</p>
        <p>Response: {{ response }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "@vue/composition-api";
import { EventsService, Subscription } from "@tzkt/sdk-events";

export default {
  name: "App",
  setup() {
    const response = ref({});
    const event = ref({});
    const status = ref('Disconnected');
    const client = new EventsService({ url: "https://api.tzkt.io/v1/events", reconnect: true });

    let sub: Subscription;
    const subscribeToTransfers = async function () {
      sub = client.transfers({}).subscribe({
        next: (x) => {
          console.log(x);
          response.value = x;
        },
      });
      client.events().subscribe({
        next: (e) => {
          console.log(e);
          event.value = e;
        }
      });
      client.status().subscribe({
        next: (s) => { 
          console.log(s);
          status.value = s;
        }
      });
    };

    const unsubscribeFromTransfers = async function () {
      sub.unsubscribe();
    };

    return {
      subscribeToTransfers,
      unsubscribeFromTransfers,
      response,
      event,
      status
    };
  },
};
</script>