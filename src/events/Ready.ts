import { Events } from 'discord.js';

import { Event } from '../structures/Event';

export default class Ready extends Event {
  constructor() {
    super('onReady', Events.ClientReady);
  }

  async run(): Promise<void> {
    const shards =
      [...this.client.cluster.ids.keys()].length > 1
        ? [...this.client.cluster.ids.keys()].join(', ')
        : [...this.client.cluster.ids.keys()];

    this.client.logger.info(
      `${this.client.user?.tag}, ready to serve ${this.client.guilds.cache.size} servers on cluster #${this.client.cluster.id} (Shards: ${shards})`,
    );
  }
}
