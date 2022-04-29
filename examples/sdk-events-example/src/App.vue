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
              <b-button @click="unsubscribeFromTransfers()"
                >Unsubscribe</b-button
              >
              <b-taglist class="mb-0">
                <b-tag
                  v-if="status"
                  type="is-primary is-light"
                  size="is-medium"
                  >{{ status }}</b-tag
                >
                <b-tag v-if="event.state" type="is-light" size="is-medium"
                  >Since: {{ event.state }}</b-tag
                >
              </b-taglist>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="transfer in transfers"
        :key="transfer.id"
        class="column is-half is-offset-one-quarter"
      >
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img
                    :src="`https://services.tzkt.io/v1/avatars/${transfer.token.contract.address}`"
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div v-if="transfer.from && transfer.to" class="media-content">
                <p class="title is-5">Transfer {{ transfer.amount }} tokens</p>
                <p class="subtitle is-6">
                  From
                  <a :href="`https://tzkt.io/${transfer.from.address}`">{{
                    transfer.from.alias || transfer.from.address
                  }}</a>
                  to
                  <a :href="`https://tzkt.io/${transfer.to.address}`">{{
                    transfer.to.alias || transfer.to.address
                  }}</a>
                </p>
              </div>
              <div v-else-if="transfer.to" class="media-content">
                <p class="title is-5">Mint {{ transfer.amount }} tokens</p>
                <p class="subtitle is-6">
                  To
                  <a :href="`https://tzkt.io/${transfer.to.address}`">{{
                    transfer.to.alias || transfer.to.address
                  }}</a>
                </p>
              </div>
              <div v-else-if="transfer.from" class="media-content">
                <p class="title is-5">Burn {{ transfer.amount }} tokens</p>
                <p class="subtitle is-6">
                  From
                  <a :href="`https://tzkt.io/${transfer.from.address}`">{{
                    transfer.from.alias || transfer.from.address
                  }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "@vue/composition-api";
import { EventsService, Subscription, TokenTransfer } from "@tzkt/sdk-events";

export default {
  name: "App",
  setup() {
    const transfers: Ref<Array<TokenTransfer>> = ref([]);
    const event = ref({});
    const status = ref("Disconnected");
    const client = new EventsService({
      url: "https://api.tzkt.io/v1/events",
      reconnect: true,
    });

    let sub: Subscription;
    const subscribeToTransfers = async function () {
      sub = client.transfers({}).subscribe({
        next: (t) => {
          console.log(t);
          transfers.value.push(t.data!);
        },
      });
      client.events().subscribe({
        next: (e) => {
          console.log(e);
          event.value = e;
        },
      });
      client.status().subscribe({
        next: (s) => {
          console.log(s);
          status.value = s;
        },
      });
    };

    const unsubscribeFromTransfers = async function () {
      sub.unsubscribe();
    };

    return {
      subscribeToTransfers,
      unsubscribeFromTransfers,
      transfers,
      event,
      status,
    };
  },
};
</script>
