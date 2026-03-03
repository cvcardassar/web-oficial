import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'vudja2mq',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})