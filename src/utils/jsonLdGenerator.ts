export type PageType = 'website' | 'article' | 'product' | 'profile';

interface Entity {
    name: string;
    url?: string;
    image?: string;
    sameAs?: string[];
}

interface JsonLdOptions {
    type: PageType;
    url: string;
    title: string;
    description: string;
    image?: string;
    publishDate?: string;
    modifiedDate?: string;
    author?: Entity;
    siteName?: string;
}

/**
 * Generates Google-recommended JSON-LD structured data for various page types.
 * Addresses SGE/LLM requirements for entity linking and structural clarity.
 */
export function generateJsonLd(options: JsonLdOptions) {
    const {
        type,
        url,
        title,
        description,
        image,
        publishDate,
        modifiedDate,
        author,
        siteName = 'Your Site Name' // Should interact with CMS or config
    } = options;

    // Base Schema
    const schema: any = {
        '@context': 'https://schema.org',
    };

    // Breadcrumb Schema (Site Structure)
    const breadcrumbList = {
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': new URL('/', url).href
            },
            // Simplified logic: assumes current page is level 2 for now.
            // In a real app, you'd pass a breadcrumb array.
            ...(url !== new URL('/', url).href ? [{
                '@type': 'ListItem',
                'position': 2,
                'name': title,
                'item': url
            }] : [])
        ]
    };

    // Main Entity Schema
    let mainEntity: any = {};

    if (type === 'article') {
        mainEntity = {
            '@type': 'Article',
            'headline': title,
            'image': image ? [image] : [],
            'datePublished': publishDate,
            'dateModified': modifiedDate || publishDate,
            'author': author ? [{
                '@type': 'Person',
                'name': author.name,
                'url': author.url,
                'sameAs': author.sameAs // Entity Linking for LLMs
            }] : undefined,
            'publisher': {
                '@type': 'Organization',
                'name': siteName,
                'logo': {
                    '@type': 'ImageObject',
                    'url': new URL('/logo.png', url).href // Adjust path to actual logo
                }
            },
            'description': description,
            'speakable': { // For Voice Assistants/AI
                '@type': 'SpeakableSpecification',
                'cssSelector': ['h1', '.summary'] // Adjust selectors to your content
            }
        };
    } else if (type === 'product') {
        mainEntity = {
            '@type': 'Product',
            'name': title,
            'image': image ? [image] : [],
            'description': description,
            // Add offers, brand, etc. as needed from CMS data
        };
    } else {
        // Default Website
        mainEntity = {
            '@type': 'WebSite',
            'name': siteName,
            'url': new URL('/', url).href,
            'description': description,
            'publisher': {
                '@type': 'Organization',
                'name': siteName,
                'sameAs': [
                    'https://twitter.com/yourprofile', // Replace with real links
                    'https://wikipedia.org/wiki/YourOrganization'
                ]
            }
        };
    }

    // Combine schemas into a graph or array
    return {
        ...schema,
        '@graph': [
            breadcrumbList,
            mainEntity
        ]
    };
}
