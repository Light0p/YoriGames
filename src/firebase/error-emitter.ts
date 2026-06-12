'use client';

type ErrorEvents = {
  'permission-error': (error: any) => void;
};

class ErrorEmitter {
  private listeners: { [K in keyof ErrorEvents]?: ErrorEvents[K][] } = {};

  on<K extends keyof ErrorEvents>(event: K, callback: ErrorEvents[K]) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof ErrorEvents>(event: K, callback: ErrorEvents[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(cb => cb !== callback);
  }

  emit<K extends keyof ErrorEvents>(event: K, ...args: Parameters<ErrorEvents[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach(callback => (callback as any)(...args));
  }
}

export const errorEmitter = new ErrorEmitter();
