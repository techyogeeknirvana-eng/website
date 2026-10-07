/**
 * TYGN Nirvana Central Role-Based Access Control (RBAC) & Permission Engine
 * Enforces least-privilege security across both Frontend and Backend.
 */

import { User } from '@/types';

export type UserRole = 
  | 'GUEST'
  | 'MEMBER'
  | 'USER'        // Backward compatibility alias for MEMBER
  | 'ORGANIZER'
  | 'MODERATOR'
  | 'ADMIN';

export type Permission =
  // Events
  | 'event.view_public'
  | 'event.register'
  | 'event.create'
  | 'event.edit_own'
  | 'event.submit'
  | 'event.approve'
  | 'event.reject'
  | 'event.publish'
  | 'event.unpublish'
  | 'event.cancel_own'
  | 'event.cancel_any'
  | 'event.delete'
  | 'event.manage_own_registrations'
  | 'event.manage_all_registrations'
  
  // Opportunities
  | 'opportunity.view_public'
  | 'opportunity.save'
  | 'opportunity.create'
  | 'opportunity.approve'
  | 'opportunity.reject'
  | 'opportunity.delete'
  | 'opportunity.verify'

  // Community
  | 'community.view_channels'
  | 'community.send_messages'
  | 'community.edit_own_message'
  | 'community.delete_own_message'
  | 'community.delete_any_message'
  | 'community.pin_message'
  | 'community.lock_thread'
  | 'community.attach_files'
  | 'community.create_threads'
  | 'community.add_reactions'
  | 'community.report_content'
  | 'community.manage_channels'
  | 'community.moderate'

  // Nirvana Live Room
  | 'live.join'
  | 'live.answer'
  | 'live.qa_ask'
  | 'live.qa_moderate'
  | 'live.host'
  | 'live.manage'

  // Quizzes & Growth
  | 'quiz.take'
  | 'quiz.create'
  | 'quiz.publish'
  | 'growth.take_diagnostic'

  // Administration & Moderation
  | 'admin.access_dashboard'
  | 'admin.manage_users'
  | 'admin.manage_roles'
  | 'admin.view_audit_logs'
  | 'admin.moderate_queue'
  | 'admin.manage_announcements';

// Role hierarchy permission assignments
const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  GUEST: [
    'event.view_public',
    'opportunity.view_public',
    'quiz.take',
    'growth.take_diagnostic'
  ],

  MEMBER: [
    // Inherits GUEST
    'event.view_public',
    'opportunity.view_public',
    'quiz.take',
    'growth.take_diagnostic',
    // Member privileges
    'event.register',
    'event.create',
    'event.edit_own',
    'event.submit',
    'opportunity.save',
    'opportunity.create',
    'community.view_channels',
    'community.send_messages',
    'community.edit_own_message',
    'community.delete_own_message',
    'community.attach_files',
    'community.create_threads',
    'community.add_reactions',
    'community.report_content',
    'live.join',
    'live.answer',
    'live.qa_ask',
  ],

  // Backward compatibility alias for MEMBER
  USER: [
    'event.view_public',
    'opportunity.view_public',
    'quiz.take',
    'growth.take_diagnostic',
    'event.register',
    'event.create',
    'event.edit_own',
    'event.submit',
    'opportunity.save',
    'opportunity.create',
    'community.view_channels',
    'community.send_messages',
    'community.edit_own_message',
    'community.delete_own_message',
    'community.attach_files',
    'community.create_threads',
    'community.add_reactions',
    'community.report_content',
    'live.join',
    'live.answer',
    'live.qa_ask',
  ],

  ORGANIZER: [
    // Inherits MEMBER
    'event.view_public',
    'opportunity.view_public',
    'quiz.take',
    'growth.take_diagnostic',
    'event.register',
    'event.create',
    'event.edit_own',
    'event.submit',
    'opportunity.save',
    'opportunity.create',
    'community.view_channels',
    'community.send_messages',
    'community.edit_own_message',
    'community.delete_own_message',
    'community.attach_files',
    'community.create_threads',
    'community.add_reactions',
    'community.report_content',
    'live.join',
    'live.answer',
    'live.qa_ask',
    // Organizer privileges
    'event.cancel_own',
    'event.manage_own_registrations',
    'live.host',
    'live.manage',
    'live.qa_moderate',
    'quiz.create',
  ],

  MODERATOR: [
    // Inherits MEMBER
    'event.view_public',
    'opportunity.view_public',
    'quiz.take',
    'growth.take_diagnostic',
    'event.register',
    'event.create',
    'event.edit_own',
    'event.submit',
    'opportunity.save',
    'opportunity.create',
    'community.view_channels',
    'community.send_messages',
    'community.edit_own_message',
    'community.delete_own_message',
    'community.attach_files',
    'community.create_threads',
    'community.add_reactions',
    'community.report_content',
    'live.join',
    'live.answer',
    'live.qa_ask',
    // Moderator privileges
    'community.delete_any_message',
    'community.pin_message',
    'community.lock_thread',
    'community.moderate',
    'admin.access_dashboard',
    'admin.moderate_queue',
  ],

  ADMIN: [
    // Full platform administrative authority
    'event.view_public',
    'event.register',
    'event.create',
    'event.edit_own',
    'event.submit',
    'event.approve',
    'event.reject',
    'event.publish',
    'event.unpublish',
    'event.cancel_own',
    'event.cancel_any',
    'event.delete',
    'event.manage_own_registrations',
    'event.manage_all_registrations',

    'opportunity.view_public',
    'opportunity.save',
    'opportunity.create',
    'opportunity.approve',
    'opportunity.reject',
    'opportunity.delete',
    'opportunity.verify',

    'community.view_channels',
    'community.send_messages',
    'community.edit_own_message',
    'community.delete_own_message',
    'community.delete_any_message',
    'community.pin_message',
    'community.lock_thread',
    'community.attach_files',
    'community.create_threads',
    'community.add_reactions',
    'community.report_content',
    'community.manage_channels',
    'community.moderate',

    'live.join',
    'live.answer',
    'live.qa_ask',
    'live.qa_moderate',
    'live.host',
    'live.manage',

    'quiz.take',
    'quiz.create',
    'quiz.publish',
    'growth.take_diagnostic',

    'admin.access_dashboard',
    'admin.manage_users',
    'admin.manage_roles',
    'admin.view_audit_logs',
    'admin.moderate_queue',
    'admin.manage_announcements',
  ]
};

/**
 * Checks if a given user has permission to perform an action.
 */
export function can(permission: Permission, user?: User | null): boolean {
  if (!user) {
    return ROLE_PERMISSIONS.GUEST.includes(permission);
  }

  // Super Lead Admin override
  if (
    user.email?.toLowerCase().trim() === 'techyogeeknirvana@gmail.com' ||
    user.email?.toLowerCase().trim() === 'ishpreet823@gmail.com' ||
    user.id === 'user_lead_admin' ||
    user.role === 'ADMIN'
  ) {
    return true;
  }

  const role = (user.role || 'MEMBER').toUpperCase() as UserRole;
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.MEMBER;
  return permissions.includes(permission);
}

/**
 * Returns whether user is an authorized admin or moderator.
 */
export function isStaff(user?: User | null): boolean {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'MODERATOR' || can('admin.access_dashboard', user);
}
