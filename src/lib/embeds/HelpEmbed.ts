import { Collection } from 'discord.js';

import { Embed } from '../../lib/embeds/Embed';

import { Context, Interaction } from '../../structures/Interaction';

export class HelpEmbed extends Embed {
  constructor(commands: Collection<string, Interaction>, { i18n }: Context) {
    super();

    const categories = [
      ...new Set(commands.map((command) => command.category)),
    ];

    this.data.author = {
      name: i18n.embeds.help.title({ username: this.client.user?.username }),
      icon_url: this.client.user?.displayAvatarURL(),
    };

    this.data.description = i18n.embeds.help.description();

    for (const category of categories) {
      const commandsInCategory = commands.filter(
        (command) => command.category === category,
      );
      this.addFields({
        name: category,
        value: commandsInCategory
          .map((command) => `\`${command.command.name}\``)
          .join(', '),
      });
    }
  }
}
