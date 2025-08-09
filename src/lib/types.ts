/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	// Authorigins = '_authOrigins',
	// Externalauths = '_externalAuths',
	// Mfas = '_mfas',
	// Otps = '_otps',
	// Superusers = '_superusers',
	Modpacks = 'modpacks',
	Services = 'services',
	TemporaryFiles = 'temporaryFiles',
	Worlds = 'worlds',
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T };

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString;
	collectionId: string;
	collectionName: Collections;
} & ExpandType<T>;

export type AuthSystemFields<T = unknown> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection
export type ModpacksRecord = {
	id: string;
	created?: IsoDateString;
	updated?: IsoDateString;

	title: string;
	slug: string;
	thumbnail: string;
	minecraftVersion?: string;
	modLoader?: string;
	tags?: string;
	author?: string;
	longDescription?: string;
	images?: string[];
	otherDownloads?: string[];
	downloads?: string[];
	relatedWorlds?: RecordIdString[];
};

export type ServicesRecord = {
	id: string;
	created?: IsoDateString;
	updated?: IsoDateString;
	title: string;
	slug: string;
	link?: string;
	linkButton?: string;
	newTab?: boolean;
	thumbnail: string;
	tags?: string;
	author?: string;
	longDescription?: string;
	images?: string[];
	otherDownloads?: string[];
	downloads?: string[];
};

export type TemporaryFilesRecord = {
	id: string;
	created?: IsoDateString;
	updated?: IsoDateString;
	file: string;
};

export type WorldsRecord = {
	id: string;
	created?: IsoDateString;
	updated?: IsoDateString;
	title: string;
	slug: string;
	thumbnail: string;
	minecraftVersion?: string;
	modLoader?: string;
	description?: string;
	tags?: string;
	images?: string[];
	otherDownloads?: string[];
	downloads?: string[];
	relatedModpacks?: RecordIdString[];
};

// Response types include system fields and match responses from the PocketBase API
export type ModpacksResponse<Texpand = unknown> = Required<ModpacksRecord> &
	BaseSystemFields<Texpand>;
export type WorldsResponse<Texpand = unknown> = Required<WorldsRecord> & BaseSystemFields<Texpand>;
export type ServicesResponse<Texpand = unknown> = Required<ServicesRecord> &
	BaseSystemFields<Texpand>;
export type TemporaryFilesResponse<Texpand = unknown> = Required<TemporaryFilesRecord> &
	BaseSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	modpacks: ModpacksRecord;
	services: ServicesRecord;
	temporaryFiles: TemporaryFilesRecord;
	worlds: WorldsRecord;
};

export type CollectionResponses = {
	modpacks: ModpacksResponse;
	services: ServicesResponse;
	temporaryFiles: TemporaryFilesResponse;
	worlds: WorldsResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'modpacks'): RecordService<ModpacksResponse>;
	collection(idOrName: 'services'): RecordService<ServicesResponse>;
	collection(idOrName: 'temporaryFiles'): RecordService<TemporaryFilesResponse>;
	collection(idOrName: 'worlds'): RecordService<WorldsResponse>;
};
