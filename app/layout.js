export const metadata = {
  title: 'Google Style Search',
  description: 'A Google-inspired search engine UI powered by DuckDuckGo search results.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
