# 🎬 Beafrica Web TV

A self-hosted video website for Beafrica Web TV. It allows creators to publish and showcase their videos outside of YouTube or other third-party platforms.  
The goal is independence: videos remain available even if the external platform is unavailable or restricted.

---

## 🚀 Features

- **Video Catalog**
  - Browse all videos in a clean grid layout.
  - Individual video pages with title, description, and publish date.
  - Mobile-friendly, SEO-optimized pages.

- **Video Playback**
  - Adaptive streaming with Bunny Stream.
  - Support for thumbnails.

- **Content Management**
  - Headless CMS (Sanity) with a Studio interface for adding and editing videos.
  - Simple publishing flow: drag & drop a video, add metadata, publish.
  - Drafts, scheduling, and playlist/series support.

- **Resilience**
  - Originals stored in object storage (Bunny/R2/Backblaze B2) for long-term backups.
  - Site revalidates automatically when new videos are published.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **CMS:** [Sanity](https://www.sanity.io/) (headless, customizable schemas)  
- **Video Delivery:** [Bunny Stream](https://bunny.net/) (encoding, CDN)  
- **Storage:** Bunny Object Storage, Cloudflare R2, or Backblaze B2 (masters/backups)  
- **Hosting:** [Vercel](https://vercel.com/) (Next.js optimized)  
- **Domain/CDN:** Cloudflare/Bunny  

---

## 📜 License

MIT License. Free to use and adapt.
