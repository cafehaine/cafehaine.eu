import React, { useEffect, useState } from "react"
import sanitizeHtml from "sanitize-html"
import Gadget from "./gadget"
import styles from "./rss.module.css"
import Spinner from "../spinner"

enum Source {
  Fosstodon = "fosstodon",
  PouetChapril = "pouet.chapril.org",
  Twitter = "twitter",
  Itch = "itch.io",
  Unknown = "?",
}

const DOMAIN_SOURCE_MAP: Map<string, Source> = new Map(
  Object.entries({
    "fosstodon.org": Source.Fosstodon,
    "cafehaine.itch.io": Source.Itch,
    "gemma-pricot.itch.io": Source.Itch,
    "itch.io": Source.Itch,
    "nitter.poast.org": Source.Twitter,
    "pouet.chapril.org": Source.PouetChapril,
  }));

type Article = {
  title: string,
  content: string,
  url: URL,
  datePublished: Date,
  source: Source,
}

enum RequestState {
  Offline,
  Fetching,
  Failed,
}

function RSSComponent(): React.ReactNode {
  const [articles, setArticles] = useState<Article[] | RequestState>(RequestState.Offline)

  const fetchArticles = async () => {
    setArticles(RequestState.Fetching)
    let response;
    try {
      response = await fetch("//feed.cafehaine.eu/");
    } catch {
      setArticles(RequestState.Failed)
      return;
    }
    if (!response.ok) {
      setArticles(RequestState.Failed)
    } else {
      try {
        const feed = await response.json();
        const newArticles: Article[] = []
        for (const item of feed.items) {
          const content = sanitizeHtml(item["content_html"], { allowedTags: [], allowedAttributes: {} });
          const title = sanitizeHtml(item["title"], { allowedTags: [], allowedAttributes: {} }) || content;
          const url = new URL(item["url"])
          const article: Article = {
            title: title,
            content: content,
            url: url,
            datePublished: new Date(item["date_published"]),
            source: DOMAIN_SOURCE_MAP.get(url.hostname) || Source.Unknown,
          }
          newArticles.push(article)
        }
        newArticles.sort((a, b) => b.datePublished.getTime() - a.datePublished.getTime());
        setArticles(newArticles);
      } catch {
        setArticles(RequestState.Failed)
      }
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const renderArticles = (): React.ReactNode => {
    if (articles === RequestState.Offline) {
      return "Offline"
    } else if (articles === RequestState.Fetching) {
      return <div className={styles.center}><Spinner /></div>
    } else if (articles === RequestState.Failed) {
      return (
        <div className={styles.center}>
          <p>Failed to load feed.</p>
          <button onClick={fetchArticles}>Retry</button>
        </div>
      )
    } else {
      return (
        <ul>
          {
            articles.map(
              (article: Article, index: number) => (
                <li key={index}>
                  <button onClick={() => window.open(article.url, "_blank")}>
                    <h2 title={article.title}>{article.title}</h2>
                    <p>{article.content}</p>
                    <div className={styles.metadata}>
                      <span title={article.source}>{article.source}</span>
                      <time>{article.datePublished.toLocaleDateString()}</time>
                    </div>
                  </button>
                </li>
              )
            )
          }
        </ul>
      );
    }
  }

  return (
    <section className={styles.feed}>
      {renderArticles()}
    </section>
  );
}

export default class RSS extends Gadget {
  content(): React.ReactNode {
    return <RSSComponent />
  }
}
