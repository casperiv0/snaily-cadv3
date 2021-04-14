import * as React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { State } from "types/State";

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
}

export const Seo: React.FC<Props> = (props) => {
  const cad = useSelector((s: State) => s.global.cadInfo);

  const defaults: Props = {
    title: (cad as any).seo?.title,
    description: (cad as any).seo?.description,
    url: (cad as any).seo?.url,
  };

  const tags = {
    ...defaults,
    ...props,
    title: props.title ? props.title + ` - ${cad?.cad_name ?? "SnailyCAD"}` : defaults.title,
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
