export * from './eip';
export * from './complexity';

// DevnetSpec: minimal interface for upstream forkcast compatibility.
// Used by src/data/devnet-specs.ts to type-check devnet JSON blobs.
export interface DevnetSpec {
  id: string;
  name?: string;
  version?: number;
  launchDate?: string;
  type?: string;
  headliner?: string;
  eips?: number[];
  clientSupport?: Record<string, unknown>;
}