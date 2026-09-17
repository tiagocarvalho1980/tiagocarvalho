import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Rule entries — 55 total. `n` is the number (1..55).
// Locked entries have status='locked' and body may be empty.
const entries = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/entries' }),
  schema: z.object({
    n: z.number().int().min(1).max(55),
    title: z.string().optional(),
    status: z.enum(['written', 'locked']),
    description: z.string().max(160).optional(),
    reading_time: z.string().optional(),
    published: z.date().optional(),
    tease: z.string().optional(),
  }),
});

// Notes — dated, timely. Every note has a rule number it closes on.
const notes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    rule: z.number().int().min(1).max(55),
    d: z.enum(['Done', 'Deliver', 'Do', 'Dork', 'Dream']).optional(),
    description: z.string().max(160).optional(),
  }),
});

export const collections = { entries, notes };
