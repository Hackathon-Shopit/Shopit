import React from 'react';

/**
 * Renders the Markdown scraped from a webpage by the webpage_scraper tool.
 * Expects a prop `artifact` with a `markdown` string.
 */
type Props = {
  artifact: { markdown: string }
}

export const WebpageMarkdownArtifact = ({ artifact }: Props) => (
  <div className="prose max-w-none">
    <h2>Scraped Markdown</h2>
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{artifact.markdown}</pre>
  </div>
);
