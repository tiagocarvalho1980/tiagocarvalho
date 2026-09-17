import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const entries = (await getCollection('entries'))
    .filter((e) => e.data.status === 'written')
    .sort((a, b) => {
      const ad = a.data.published?.valueOf() ?? 0;
      const bd = b.data.published?.valueOf() ?? 0;
      return bd - ad;
    });

  const notes = (await getCollection('notes')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  // Combined feed — rules and notes, newest first.
  // Rules take priority as the primary content (they trigger the newsletter).
  const items = [
    ...entries.map((e) => {
      const num = String(e.data.n).padStart(2, '0');
      return {
        title: `Rule ${num}: ${e.data.title}`,
        pubDate: e.data.published ?? new Date(),
        description: e.data.description ?? '',
        link: `/55/${num}`,
        categories: ['The 55'],
      };
    }),
    ...notes.map((n) => ({
      title: n.data.title,
      pubDate: n.data.date,
      description: n.data.description ?? '',
      link: `/notes/${n.id.replace(/\.md$/, '')}`,
      categories: ['Notes'],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: 'Tiago Carvalho — The 55',
    description:
      'Fifty-five rules for selling, serving and starting again. One rule at a time, with the method to use today and the practice for tomorrow.',
    site: context.site,
    items,
    customData: `<language>en</language><copyright>© Tiago Carvalho</copyright>`,
    trailingSlash: false,
  });
}
