import type { JsonLdGraph } from "@/lib/seo/jsonld";

type Props = {
  data: JsonLdGraph;
  id?: string;
};

export function JsonLd({ data, id }: Props) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
