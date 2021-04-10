import * as React from "react";
import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
}

const defaults: Props = {
  title: "SnailyCAD - Free open source CAD/MDT",
  description: "A free, fast, simple and secure open source CAD/MDT",
};

const Seo: React.FC<Props> = (props) => {
  const tags = {
    ...defaults,
    ...props,
    title: props.title ? props.title + " - SnailyCAD" : defaults.title,
  };

  //   TODO: add support for custom text & images.

  return (
    <Head>
      <title>{tags.title}</title>
      <meta name="twitter:title" content={tags.title} />
      <meta property="og:site_name" content={tags.title} />
      <meta property="og:title" content={tags.title} />

      <meta name="description" content={tags.description} />
      <meta property="og:description" content={tags.description} />
      <meta name="twitter:description" content={tags.description} />

      <link rel="canonical" href={tags.url} />
      <meta property="og:url" content={tags.url} />
    </Head>
  );
};

export default Seo;
