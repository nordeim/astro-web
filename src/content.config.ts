import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    client: z.string(),
    services: z.array(z.string()).default([]),
    cover: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    anchor: z.string(),
    offerings: z.array(z.string()).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('Kelp Team'),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string().optional(),
  }),
});

export const collections = { caseStudies, services, articles, testimonials };
