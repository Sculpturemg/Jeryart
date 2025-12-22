
import { Sculpture, SiteContent, BlogPost, Testimonial } from "../types";
import { INITIAL_CONTENT, INITIAL_SCULPTURES, INITIAL_BLOG_POSTS } from "../constants";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const formatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};

export const getAdminPassword = (): string => {
  return localStorage.getItem('jery_admin_password') || "jery2024";
};

export const saveAdminPassword = (newPassword: string): void => {
  localStorage.setItem('jery_admin_password', newPassword);
};

export const getSculptures = async (): Promise<Sculpture[]> => {
  try {
    const res = await fetch(`${STRAPI_URL}/api/sculptures?populate=*`);
    if (!res.ok) throw new Error();
    const { data } = await res.json();
    return data.map((item: any) => ({
      id: item.id.toString(),
      ...item.attributes,
      imageUrl: formatImageUrl(item.attributes.image?.data?.attributes?.url)
    }));
  } catch (error) {
    const local = localStorage.getItem('jery_local_sculptures');
    return local ? JSON.parse(local) : INITIAL_SCULPTURES;
  }
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const res = await fetch(`${STRAPI_URL}/api/blog-posts?populate=*`);
    if (!res.ok) throw new Error();
    const { data } = await res.json();
    return data.map((item: any) => ({
      id: item.id.toString(),
      ...item.attributes,
      imageUrl: formatImageUrl(item.attributes.image?.data?.attributes?.url)
    }));
  } catch (error) {
    const local = localStorage.getItem('jery_local_blog');
    return local ? JSON.parse(local) : INITIAL_BLOG_POSTS;
  }
};

export const getContent = async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${STRAPI_URL}/api/site-content?populate=*`);
    if (!res.ok) throw new Error();
    const { data } = await res.json();
    if (!data) return INITIAL_CONTENT;
    
    return {
      ...INITIAL_CONTENT,
      ...data.attributes,
      heroImageUrl: formatImageUrl(data.attributes.heroImage?.data?.attributes?.url)
    };
  } catch (error) {
    const local = localStorage.getItem('jery_local_content');
    return local ? JSON.parse(local) : INITIAL_CONTENT;
  }
};

export const saveContent = async (content: SiteContent): Promise<void> => {
  localStorage.setItem('jery_local_content', JSON.stringify(content));
  if (!API_TOKEN) return;
  try {
    await fetch(`${STRAPI_URL}/api/site-content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` },
      body: JSON.stringify({ data: content })
    });
  } catch (e) { console.error("Strapi save failed"); }
};
