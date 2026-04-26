import {defineField, defineType} from 'sanity'
import StreamUploadInput from '../components/StreamUploadInput'
import TagInput from '../components/TagInput'

export default defineType({
  name: 'video',
  title: 'Vidéo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titre',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title', maxLength: 96},
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      components: {
        input: TagInput,
      },
      validation: rule =>
        rule.custom((tags?: string[]) => {
          if (!tags || tags.length === 0) return true
          const total = tags.join(',').length
          return total <= 500
            ? true
            : `Tags exceed 500-character limit (currently ${total}).`
        }),
    }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Miniature',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Date de publication',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'stream',
      title: 'Bunny Stream',
      type: 'object',
      description: 'Téléversement et métadonnées Bunny Stream.',
      components: {
        input: StreamUploadInput,
      },
      fields: [
        defineField({
          name: 'playbackId',
          type: 'string',
          title: 'Identifiant de lecture Bunny Stream',
          readOnly: true,
        }),
        defineField({
          name: 'uid',
          type: 'string',
          title: 'Identifiant Bunny Stream (UID)',
          description:
            'Identifiant interne utilisé pour les API Bunny (statut, suppression).',
          readOnly: true,
          hidden: true,
        }),
        defineField({
          name: 'duration',
          type: 'number',
          title: 'Durée (secondes)',
          readOnly: true,
          hidden: true,
        }),
        defineField({
          name: 'thumbnailUrl',
          type: 'url',
          title: 'Miniature Bunny',
          readOnly: true,
          hidden: true,
        }),
      ],
    }),
  ],
})
