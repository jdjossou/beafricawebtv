import MarkdownRenderer from '@/components/legal/MarkdownRenderer';

export const metadata = {
  title: 'Politique relative aux cookies',
  description:
    'Découvrez comment Beafrica WebTV utilise les cookies sur son site.',
};

export default function CookiesPage() {
  return <MarkdownRenderer filePath="src/app/legal/cookies.md" />;
}
