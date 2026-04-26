import MarkdownRenderer from '@/components/legal/MarkdownRenderer';

export const metadata = {
  title: 'Politique de confidentialité',
  description:
    'Découvrez comment Beafrica WebTV collecte, utilise et protège vos informations personnelles.',
};

export default function PolicyPage() {
  return <MarkdownRenderer filePath="src/app/legal/policy.md" />;
}
