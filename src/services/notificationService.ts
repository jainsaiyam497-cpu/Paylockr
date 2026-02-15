import { Notification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../constants';

/**
 * Notification Service
 */

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    return Promise.resolve(INITIAL_NOTIFICATIONS);
  },

  markAsRead: async (id: string): Promise<boolean> => {
    return Promise.resolve(true);
  },

  clearAll: async (): Promise<boolean> => {
    return Promise.resolve(true);
  }
};
