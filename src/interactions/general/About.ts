import {
  ActionRowBuilder,
  ApplicationCommandData,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  InteractionResponse,
} from 'discord.js';
import { inject, injectable } from 'tsyringe';

import { Client } from '../../structures/Client';
import { Context, Interaction } from '../../structures/Interaction';

import { AboutEmbed } from '../../lib/embeds/AboutEmbed';

import { BOT_INVITE, SUPPORT_SERVER, clientSymbol } from '../../utils/Constants';

import { commands } from '../../i18n';

export const helpersButtons = new ActionRowBuilder<ButtonBuilder>({
  components: [
    new ButtonBuilder({
      label: 'Invite me',
      style: ButtonStyle.Link,
      url: BOT_INVITE,
    }),
    new ButtonBuilder({
      label: 'Support',
      style: ButtonStyle.Link,
      url: SUPPORT_SERVER,
    }),
    new ButtonBuilder({
      label: 'GitHub',
      style: ButtonStyle.Link,
      url: 'https://github.com/glazk0',
    }),
  ],
});

@injectable()
export default class About extends Interaction {
  public enabled = true;

  public readonly category = 'General';

  public readonly command: ApplicationCommandData = {
    type: ApplicationCommandType.ChatInput,
    ...commands['about'],
  };

  constructor(@inject(clientSymbol) private client: Client) {
    super();
  }

  public async run(
    interaction: ChatInputCommandInteraction<CacheType>,
    ctx: Context,
  ): Promise<InteractionResponse<boolean>> {
    const guilds = await this.client.cluster.broadcastEval(
      (client) => client.guilds.cache.size,
    );
    const users = await this.client.cluster.broadcastEval((client) =>
      client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
    );

    const data = {
      guilds: guilds.reduce((acc, guildCount) => acc + guildCount, 0),
      users: users.reduce((acc, memberCount) => acc + memberCount, 0),
      shardId: interaction.guild?.shardId || 0,
    };

    const embed = new AboutEmbed(data, ctx);

    return await interaction.reply({
      embeds: [embed],
      components: [helpersButtons],
    });
  }
}
