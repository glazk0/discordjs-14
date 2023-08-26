import { Events, Guild } from 'discord.js';

import { Event } from '../structures/Event';

export default class GuildCreate extends Event {
  constructor() {
    super('onGuildCreate', Events.GuildCreate);
  }

  async run(guild: Guild): Promise<void> {
    if (!this.client.isReady) return;

    this.client.logger.info(`Joined ${guild.name} (${guild.id})`);
  }
}
