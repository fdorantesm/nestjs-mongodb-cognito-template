import type { Json } from '@/core/domain/json';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';

export type UserProfileSeed = {
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: Json;
  birthday?: Date;
  phone?: string;
  gender?: string;
  pronouns?: string;
  isPublic: boolean;
};

export type UserSeedDefinition = {
  email: string;
  password: string;
  username: string;
  displayName: string;
  roleName: string;
  scopes?: string[];
  profile: UserProfileSeed;
};

export const defaultUserSeeds: UserSeedDefinition[] = [
  {
    email: 'root@example.com',
    password: 'OpenSesame1!',
    username: 'root',
    displayName: 'Root Superuser',
    roleName: 'super-admin',
    scopes: [Scopes.Website],
    profile: {
      displayName: 'Root Superuser',
      bio: 'Root-level account with unrestricted access.',
      location: 'Remote',
      website: 'https://example.com',
      socialLinks: {
        github: 'https://github.com/root',
      },
      isPublic: false,
    },
  },
  {
    email: 'admin@example.com',
    password: 'OpenSesame1!',
    username: 'admin',
    displayName: 'Platform Admin',
    roleName: 'admin',
    scopes: [Scopes.Website],
    profile: {
      displayName: 'Platform Admin',
      bio: 'Administrative account for day-to-day operations.',
      location: 'Remote',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/company/example',
      },
      isPublic: false,
    },
  },
  {
    email: 'user@example.com',
    password: 'OpenSesame1!',
    username: 'user',
    displayName: 'User',
    roleName: 'user',
    scopes: [Scopes.Website],
    profile: {
      displayName: 'User',
      bio: 'User account for general access.',
      location: 'Los Angeles, USA',
      phone: '+1987654321',
      isPublic: true,
    },
  },
];
