# pkm.nz

My projects and workshop log. A static site built with [Astro](https://astro.build), hosted on Cloudflare Pages.

## Posting an update

- **From a browser or phone:** go to `pkm.nz/admin`, sign in with GitHub, choose **Updates → New Update**, fill it in and press **Publish**. The site rebuilds in a minute or two.
- **Through Claude:** send the photos and a few lines and ask for an update to be posted.

Photos can come straight off the phone (including iPhone HEIC); they're resized and converted on upload. Videos go on YouTube or Vimeo, and the link goes in the video field.

## Where things live

| What | Where |
| --- | --- |
| Site title, email, form address | `src/site.config.ts` |
| Project pages | `src/content/projects/*.md` |
| Journal updates | `src/content/updates/*.md` |
| Uploaded photos | `public/uploads/` |
| Card and hero images | `public/images/projects/` |
| Interactive pieces and 3D models | `public/play/<project>/` |
| Posting editor settings | `public/admin/config.yml` |

## Comments and contact

Comment and contact forms send to the address in `formEndpoint` (`src/site.config.ts`), for example a free Formspree form, which emails them to me. Nothing is published automatically: to show an approved comment, add it to the update's **Approved comments** in the editor. With no form address set, the forms open the visitor's email app instead.

## Working on the code

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # writes the site to dist/
```

Cloudflare Pages settings: build command `npm run build`, output directory `dist`.
