import {defineArrayMember, defineField, defineType} from 'sanity'

const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
  ],
  lists: [
    {title: 'Bullet list', value: 'bullet'},
    {title: 'Numbered list', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Bold', value: 'strong'},
      {title: 'Italic', value: 'em'},
      {title: 'Underline', value: 'underline'},
    ],
    annotations: [
      {
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL or internal path',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'openInNewTab',
            title: 'Open in new tab',
            type: 'boolean',
            initialValue: false,
          }),
        ],
      },
    ],
  },
})

export const insightType = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',

  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'related', title: 'Related content'},
    {name: 'seo', title: 'SEO'},
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Dan', value: 'Dan'},
          {title: 'Mike', value: 'Mike'},
          {title: 'Growth Assist', value: 'Growth Assist'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'published',
      title: 'Published date',
      type: 'date',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'updated',
      title: 'Updated date',
      type: 'date',
      group: 'content',
      description: 'Only complete this when the article has been materially updated.',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Sales Intelligence', value: 'Sales Intelligence'},
          {title: 'Commercial Intelligence', value: 'Commercial Intelligence'},
          {title: 'Sales Triggers', value: 'Sales Triggers'},
          {title: 'CRM Intelligence', value: 'CRM Intelligence'},
          {title: 'Commercial Data', value: 'Commercial Data'},
          {title: 'Industry Intelligence', value: 'Industry Intelligence'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'kind',
      title: 'Content type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'Guide', value: 'Guide'},
          {title: 'Note', value: 'Note'},
          {title: 'Analysis', value: 'Analysis'},
          {title: 'Opinion', value: 'Opinion'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      group: 'content',
      of: [
        richTextBlock,

        defineArrayMember({
          name: 'callout',
          title: 'Callout',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Callout title',
              type: 'string',
            }),
            defineField({
              name: 'text',
              title: 'Callout text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'text',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Callout',
                subtitle,
              }
            },
          },
        }),

        defineArrayMember({
          name: 'definition',
          title: 'Definition',
          type: 'object',
          fields: [
            defineField({
              name: 'term',
              title: 'Term',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'definition',
              title: 'Definition',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'term',
              subtitle: 'definition',
            },
          },
        }),

        defineArrayMember({
          name: 'contentTable',
          title: 'Table',
          type: 'object',
          fields: [
            defineField({
              name: 'caption',
              title: 'Table caption',
              type: 'string',
            }),
            defineField({
              name: 'columns',
              title: 'Column headings',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.required().min(2),
            }),
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'tableRow',
                  title: 'Row',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [{type: 'string'}],
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      cells: 'cells',
                    },
                    prepare({cells}) {
                      return {
                        title: Array.isArray(cells)
                          ? cells.join(' | ')
                          : 'Table row',
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'faqs',
      title: 'Frequently asked questions',
      type: 'array',
      group: 'related',
      of: [
        defineArrayMember({
          name: 'faq',
          title: 'Question',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [richTextBlock],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'relatedInsights',
      title: 'Related Insights',
      type: 'array',
      group: 'related',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'insight'}],
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: 'relatedLinks',
      title: 'Related service, industry or use-case links',
      type: 'array',
      group: 'related',
      of: [
        defineArrayMember({
          name: 'relatedLink',
          title: 'Related link',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'For example: The Service, Industry or Use Case.',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'href',
              title: 'Website path or URL',
              type: 'string',
              description: 'For example: /sales-intelligence',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'label',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: 'metaTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Leave blank to use the article title.',
      validation: (Rule) =>
        Rule.max(60).warning('SEO titles are normally kept within 60 characters.'),
    }),

    defineField({
      name: 'metaDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Leave blank to use the article excerpt.',
      validation: (Rule) =>
        Rule.max(160).warning(
          'SEO descriptions are normally kept within 160 characters.',
        ),
    }),
  ],

  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedDesc',
      by: [{field: 'published', direction: 'desc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      published: 'published',
    },
    prepare({title, category, published}) {
      return {
        title,
        subtitle: [category, published].filter(Boolean).join(' · '),
      }
    },
  },
})