import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

import { Collection, Events } from 'discord.js';
import { container } from 'tsyringe';

import { Client } from '../structures/Client';
import { Event } from '../structures/Event';

import { clientSymbol } from '../utils/Constants';

export class EventHandler {
  /**
   * The client.
   * @type {Client}
   * @readonly
   */
  readonly client: Client;
  /**
   * The event handlers.
   * @type {Collection<string, Event>}
   * @readonly
   */
  readonly handlers: Collection<Events, Event>;
  /**
   * Creates a new event handler.
   *
   * @param client - The client.
   */
  constructor() {
    this.client = container.resolve<Client>(clientSymbol);

    this.handlers = new Collection<Events, Event>();
  }

  /**
   * Initializes the event handlers.
   */
  async init(): Promise<void> {
    const dir = join(__dirname, '..', 'events');

    let files = await readdir(dir);

    files = files.filter(
      (file) => file.endsWith('.js') && !file.startsWith('EventHandler'),
    );

    if (this.handlers.size > 0) this.handlers.clear();

    for (const file of files) {
      const handler = new (await import(join(dir, file))).default() as Event;

      this.handlers.set(handler.event, handler);
    }

    this.client.logger.info(`Loaded ${this.handlers.size} event handlers`);
  }

  /**
   * Runs an event.
   *
   * @param id - The event identifier.
   * @param args - The arguments.
   */
  async run(event: Events, ...args: any[]): Promise<void> {
    const handler = this.handlers.get(event);

    if (!handler) throw new Error(`Event handler ${event} doesn't exist`);

    await handler.run(...args);
  }
}
