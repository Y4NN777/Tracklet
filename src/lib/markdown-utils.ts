/**
 * Enhanced markdown to HTML converter for AI responses
 * Handles common markdown formatting with better reliability
 */
export function formatMarkdown(text: string): string {
  if (!text) return '';

  let html = text;

  // Handle code blocks first (to prevent interference)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Handle inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Handle bold and italic (process in correct order)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Handle alternative bold/italic syntax
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Handle links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Handle strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\*\*\*$/gm, '<hr>');

  // Handle numbered lists - simple approach
  html = html.replace(/^(\d+)\.\s+(.*)$/gm, '<li>$2</li>');
  // Group consecutive list items into ordered lists
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, '<ol>$&</ol>');

  // Handle bullet lists - simple approach
  html = html.replace(/^[\*\-\+]\s+(.*)$/gm, '<li>$1</li>');
  // Group consecutive list items into unordered lists
  html = html.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');

  // Handle line breaks and spacing between elements
  html = html.replace(/\n\n+/g, '</p><br><br><p>');

  // Add spacing between headers and content
  html = html.replace(/<\/h[1-6]>\s*<p>/g, '</h1><br><p>');
  html = html.replace(/<\/h[1-6]>\s*<ul>/g, '</h1><br><ul>');
  html = html.replace(/<\/h[1-6]>\s*<ol>/g, '</h1><br><ol>');

  // Add spacing between paragraphs and lists
  html = html.replace(/<\/p>\s*<ul>/g, '</p><br><ul>');
  html = html.replace(/<\/p>\s*<ol>/g, '</p><br><ol>');

  // Add spacing between lists and paragraphs
  html = html.replace(/<\/ul>\s*<p>/g, '</ul><br><p>');
  html = html.replace(/<\/ol>\s*<p>/g, '</ol><br><p>');

  // Wrap content in paragraphs if not already wrapped
  if (!html.includes('<h') && !html.includes('<p>') && !html.includes('<ul>') && !html.includes('<ol>')) {
    html = html.replace(/\n/g, '<br>');
    html = `<p>${html}</p>`;
  }

  // Clean up any remaining markdown artifacts
  html = html.replace(/\*\*/g, '');
  html = html.replace(/\*/g, '');

  return html;
}