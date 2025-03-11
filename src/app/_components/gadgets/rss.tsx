import React, {ReactNode, useEffect, useState} from "react"
import sanitizeHtml from "sanitize-html"
import Gadget from "./gadget"
import styles from "./rss.module.css"
import Spinner from "../spinner" 

enum Source {
  Fosstodon = "@cafehaine@fosstodon.org",
  Twitter = "@cafehaine",
}

type Article = {
  title: string | null,
  contentHtml: string,
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
  const [popupArticle, setPopupArticle] = useState<Article | null>(null)

  const fetchArticles = async () => {
    setArticles(RequestState.Fetching)
    const response = await fetch("//feed.cafehaine.eu/");
    if (!response.ok) {
      setArticles(RequestState.Failed)
    } else {
      try {
        const feed = await response.json();
        const newArticles: Article[] = []
        for (const item of feed.items) {
          const content = sanitizeHtml(item["content_html"])
          const title =sanitizeHtml(item["title"]) || content
          const url = new URL(item["url"])
          const article: Article = {
            title: title,
            contentHtml: content,
            url: url,
            datePublished: new Date(item["date_published"]),
            source: url.hostname == "fosstodon.org" ? Source.Fosstodon : Source.Twitter,
          }
          newArticles.push(article)
        }
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
      return <Spinner />
    } else if (articles === RequestState.Failed) {
      return (
        <>
          <p>Failed to load feed.</p>
          <button onClick={fetchArticles}>Retry</button>
        </>
      )
    } else {
      return (
        <ul>
          {
            articles.map(
              (article: Article, index: number) => (
                <li key={index}>
                  <button>
                    <h2 dangerouslySetInnerHTML={{__html: article.title || article.contentHtml}}></h2>
                    <span>{article.source}</span>
                    <time>{article.datePublished.toLocaleDateString()}</time>
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
