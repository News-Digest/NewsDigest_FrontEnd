const GUEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJndWVzdF91c2VyIiwibmFtZSI6Ikd1ZXN0IFVzZXIiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTkwMDAwMDAwMH0.Ks-K9M1xawRMB6t-hKx1mQVMuAE9Xio_ZZskBtC9T-o';

export async function fetchCorporateNews(category: string = 'Latest', language: string = 'en') {
  
  const apiCategory = category === 'Latest' ? '' : encodeURIComponent(category);
  const apiUrl = `https://services.corporatenews.info/api/v1/headlines/?category=${apiCategory}&language=${language}&limit=50`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GUEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`API failed: ${response.status}`);

    const data = await response.json();
    const rawArticles = Array.isArray(data) ? data : data.results || [];

    // Getting data to transform
    return rawArticles.map((article: any) => {
      let imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; 
      
      if (article.thumbnail?.default?.url) {
        imageUrl = article.thumbnail.default.url;
      } else if (article.thumbnail?.url) {
        imageUrl = article.thumbnail.url;
      } else if (article.render_urls && Array.isArray(article.render_urls) && article.render_urls.length > 0) {
        imageUrl = article.render_urls[0];
      } else if (typeof article.render_urls === 'string') {
        try {
          const parsedUrls = JSON.parse(article.render_urls.replace(/'/g, '"'));
          if (parsedUrls.length > 0) imageUrl = parsedUrls[0];
        } catch (e) { }
      }

      const contentText = (article.text || article.html || '').trim();

      return {
        id: article.uuid || article.id,
        title: article.title,
        imageUrl: imageUrl,
        aiSummary: contentText ? contentText.substring(0, 160) + '...' : 'Content pending AI summarization...',
        score: (Math.random() * (9.9 - 7.5) + 7.5).toFixed(1),
        category: article.category_names?.[0] || category,
        time: new Date(article.pubdate || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      
    });
  } catch (error) {
    console.error("Error pulling news data:", error);
    return [];
  }
}