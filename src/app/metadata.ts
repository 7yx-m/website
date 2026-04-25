import { Metadata } from "next";

export function generateMetadata({ 
  title, 
  description, 
  path = "" 
}: { 
  title?: string; 
  description?: string; 
  path?: string; 
}): Metadata {
  const defaultTitle = "Neekson Shrestha | Student Developer | C++ & Python";
  const defaultDescription = "High-performance portfolio for Neekson Shrestha - Engineering focused developer experience.";
  const url = `https://neeksonshrestha.com.np${path}`;

  return {
    title: title ? `${title} | Neekson Shrestha` : defaultTitle,
    description: description || defaultDescription,
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url,
      siteName: "Neekson Shrestha Portfolio",
      images: [
        {
          url: "/og-image.png", // Fallback to static OG image
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || defaultTitle,
      description: description || defaultDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
