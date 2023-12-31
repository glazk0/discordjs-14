import {
  Guild,
  NewsChannel,
  ShardClientUtil,
  Snowflake,
  TextChannel,
} from 'discord.js';

import { Client } from '../structures/Client';

import { Logger } from '../lib/Logger';

/**
 * Wait for a given amount of milliseconds.
 *
 * @param ms - The amount of milliseconds to wait.
 * @returns - Promise<void> The promise.
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Duration in milliseconds for common time units.
 * @type {Object}
 */
export const duration = {
  seconds: (n: number) => n * 1000,
  minutes: (n: number) => n * 1000 * 60,
  hours: (n: number) => n * 1000 * 60 * 60,
  days: (n: number) => n * 1000 * 60 * 60 * 24,
};

/**
 * Checks if the current environment is development.
 * @type {boolean}
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * Fetches the data from the url.
 *
 * @param url - The url to fetch.
 * @param json - If the response should be json.
 * @param method - The method to use.
 * @param headers - The headers to use.
 * @param body - The body to use.
 *
 * @returns - Promise<any> The response or null.
 */
export async function request(
  url: string,
  json = false,
  method = 'GET' || 'POST' || 'PUT' || 'DELETE',
  headers = {
    'User-Agent': 'Seki/DiscordBot',
  },
  body?: RequestInit['body'],
): Promise<any> {
  if (!url) throw new Error('No URL provided.');
  else {
    let req = null;

    try {
      let options: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET') options.body = body;

      req = await fetch(url, options);

      if (json) return await req.json();
      else return await req.text();
    } catch (error) {
      Logger.error(error);
      req = null;
    }

    return req;
  }
}

/**
 * Returns a Discord guild from the cluster.
 *
 * @param client - The client.
 * @param guildId - The guild id.
 *
 * @returns - The guild.
 */
export const getGuild = async (
  client: Client,
  guildId: Snowflake,
): Promise<Guild | undefined> => {
  const evalResult = (await client.cluster.broadcastEval(
    (c, { guildId }) => c.guilds.cache.get(guildId),
    {
      context: { guildId },
    },
  )) as (Guild | undefined)[];
  return evalResult.find((guild) => guild !== null);
};

/**
 * Returns a Discord channel from the cluster.
 *
 * @param client - The client.
 * @param channelId - The channel id.
 *
 * @returns - The channel.
 */
export const getChannel = async (
  client: Client,
  channelId: Snowflake,
): Promise<NewsChannel | TextChannel | undefined> => {
  const evalResult = (await client.cluster.broadcastEval(
    (c, { channelId }) => c.channels.fetch(channelId),
    {
      context: { channelId },
    },
  )) as (NewsChannel | TextChannel | undefined)[];
  return evalResult.find((channel) => channel !== null);
};

/**
 * Get the ClusterId based of the ShardId. Thanks to https://github.com/Tomato6966/Codes/blob/main/hybridUtils/customEvaluates.js
 *
 * @param client - The client.
 * @param shardId - The shard id.
 *
 * @returns - The cluster id.
 */
export const clusterIdOfShardId = (client: Client, shardId: number): number => {
  if (
    typeof shardId === 'undefined' ||
    typeof shardId !== 'number' ||
    isNaN(shardId)
  )
    throw new Error('No valid ShardId Provided');
  if (Number(shardId) > client.cluster.info.TOTAL_SHARDS)
    throw new Error('Provided ShardId, is bigger than all Shard Ids');
  const middlePart =
    Number(shardId) === 0
      ? 0
      : Number(shardId) /
        Math.ceil(
          client.cluster.info.TOTAL_SHARDS / client.cluster.info.CLUSTER_COUNT,
        );
  return Number(shardId) === 0
    ? 0
    : Math.ceil(middlePart) - (middlePart % 1 !== 0 ? 1 : 0);
};

/**
 * Get the ClusterId based of the GuildId
 *
 * @param client - The client.
 * @param guildId - The guild id.
 *
 * @returns - The cluster id.
 */
export const clusterIdOfGuildId = (
  client: Client,
  guildId: Snowflake,
): number => {
  if (!guildId || !/^(?<id>\d{17,20})$/.test(guildId))
    throw new Error('Provided GuildId, is not a valid GuildId');
  return clusterIdOfShardId(client, shardIdOfGuildId(client, guildId));
};

/**
 * Get the shardId based of the GuildId
 *
 * @param client - The client.
 * @param guildId - The guild id.
 *
 * @returns - The shard id.
 */
export const shardIdOfGuildId = (
  client: Client,
  guildId: Snowflake,
): number => {
  if (!guildId || !/^(?<id>\d{17,20})$/.test(guildId))
    throw new Error('Provided GuildId, is not a valid GuildId');
  return ShardClientUtil.shardIdForGuildId(
    guildId,
    client.cluster.info.TOTAL_SHARDS,
  );
};
