import MarkdownRenderer from '@/components/legal/MarkdownRenderer';

export const metadata = {
  title: "Conditions d'utilisation",
  description:
    "Consultez les conditions d'utilisation du site Beafrica WebTV.",
};

export default function TermsPage() {
  return <MarkdownRenderer filePath="src/app/legal/terms.md" />;
}
