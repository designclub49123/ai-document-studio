import { Template } from './api';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
  previewImageUrl: string;
  category: string;
}

/**
 * Built-in templates data
 */
export const BUILT_IN_TEMPLATES: TemplateData[] = [
  {
    id: 'tpl-resume-1',
    title: 'Professional Resume',
    description: 'Clean, modern resume template perfect for job applications',
    previewImageUrl: '/placeholder.svg',
    category: 'Career',
  },
  {
    id: 'tpl-resume-2',
    title: 'Creative Resume',
    description: 'Stand out with this creative and unique resume design',
    previewImageUrl: '/placeholder.svg',
    category: 'Career',
  },
  {
    id: 'tpl-letter-1',
    title: 'Formal Letter',
    description: 'Professional business letter template',
    previewImageUrl: '/placeholder.svg',
    category: 'Letters',
  },
  {
    id: 'tpl-letter-2',
    title: 'Cover Letter',
    description: 'Compelling cover letter for job applications',
    previewImageUrl: '/placeholder.svg',
    category: 'Letters',
  },
  {
    id: 'tpl-report-1',
    title: 'Business Report',
    description: 'Comprehensive business report template',
    previewImageUrl: '/placeholder.svg',
    category: 'Reports',
  },
  {
    id: 'tpl-report-2',
    title: 'Project Status Report',
    description: 'Track and communicate project progress',
    previewImageUrl: '/placeholder.svg',
    category: 'Reports',
  },
  {
    id: 'tpl-proposal-1',
    title: 'Business Proposal',
    description: 'Win clients with this professional proposal template',
    previewImageUrl: '/placeholder.svg',
    category: 'Business',
  },
  {
    id: 'tpl-invoice-1',
    title: 'Invoice',
    description: 'Clean and professional invoice template',
    previewImageUrl: '/placeholder.svg',
    category: 'Business',
  },
  {
    id: 'tpl-meeting-1',
    title: 'Meeting Notes',
    description: 'Structured meeting notes template',
    previewImageUrl: '/placeholder.svg',
    category: 'Productivity',
  },
  {
    id: 'tpl-essay-1',
    title: 'Academic Essay',
    description: 'Properly formatted academic essay template',
    previewImageUrl: '/placeholder.svg',
    category: 'Academic',
  },
];

/**
 * Get templates grouped by category
 */
export function getTemplatesByCategory(): Record<string, TemplateData[]> {
  return BUILT_IN_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TemplateData[]>);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(BUILT_IN_TEMPLATES.map((t) => t.category))];
}

/**
 * Search templates by query
 * @param query - Search query
 */
export function searchTemplates(query: string): TemplateData[] {
  const lowerQuery = query.toLowerCase();
  return BUILT_IN_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Load template and create new document
 * @param templateId - Template ID
 * @returns New document ID
 */
export async function loadTemplate(templateId: string): Promise<string> {
  try {
    const result = await Template.clone(templateId);
    return result.documentId;
  } catch (error) {
    console.error('[loadTemplate] Error:', error);
    throw error;
  }
}

/**
 * Upload user's template file
 * @param file - File to upload
 * @returns Created template data
 */
export async function uploadUserTemplate(
  file: File
): Promise<TemplateData> {
  console.log('[uploadUserTemplate] File:', file.name);
  
  // Placeholder - simulate upload
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: `user-${Date.now()}`,
    title: file.name.replace(/\.[^/.]+$/, ''),
    description: 'User uploaded template',
    previewImageUrl: '/placeholder.svg',
    category: 'My Templates',
  };
}
