import {
  ActivityType,
  ClientOptions,
  GatewayIntentBits,
  Locale,
  Partials,
  PresenceData,
} from 'discord.js';

/**
 * The CDN.
 * @type {string}
 */
export const CDN = 'https://s3.glazk0.dev/zeki';

/**
 * The bot invite link.
 * @type {string}
 */
export const BOT_INVITE = 'https://lilith.mom/invite';

/**
 * The support server invite link.
 * @type {string}
 */
export const SUPPORT_SERVER = 'https://discord.gg/Mv2yCrJK87';

/**
 * The client symbol for the container.
 * @type {symbol}
 */
export const clientSymbol = Symbol('client');
/**
 * Utility enum for admins.
 * @enum {string}
 */
export enum Admins {
  /** glazk0 on Discord. */
  glazk0 = '247344130798256130',
}

/**
 * The presence data for the client.
 * @type {PresenceData}
 */
export const presence: PresenceData = {
  status: 'online',
  activities: [
    {
      name: 'whatever',
      type: ActivityType.Watching,
    },
  ],
};

/**
 * The client options.
 * @type {ClientOptions}
 */
export const options: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildScheduledEvents,
  ],
  partials: [Partials.Channel, Partials.GuildScheduledEvent],
  presence: presence,
  allowedMentions: {
    repliedUser: false,
    parse: ['roles', 'everyone'],
  },
};

/**
 * List of Discord locales.
 * @type {Locale[]}
 */
export const discordLocales = [
  'vi',
  'da',
  'he',
  'zh-TW',
  'ja',
  'th',
  'hi',
  'ru',
  'pl',
  'fr',
  'lt',
  'en-GB',
  'pt-BR',
  'it',
  'cs',
  'bg',
  'hr',
  'tr',
  'hu',
  'ro',
  'ar',
  'de',
  'ko',
  'el',
  'en-US',
  'no',
  'sv-SE',
  'uk',
  'zh-CN',
  'nl',
  'es-ES',
  'fi',
] as Locale[];

/**
 * Match short locales to Discord locales.
 * @type {Record<string, Locale>}
 */
export const discordLocaleMappings = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
} as Record<string, Locale>;

/**
 * Lilith locales to their full name.
 * @type {Record<string, string>}
 */
export const localesMap = {
  en: 'English',
} as Record<string, string>;
