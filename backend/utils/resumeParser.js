/**
 * Resume Parser Utility
 * Extracts text from PDF and DOCX resume files
 */

import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

/**
 * Parse resume file and extract text content
 * @param {string} resumePath - Path to the resume file (can be URL path like /uploads/resumes/...)
 * @returns {Promise<string>} - Extracted text content
 */
export const parseResume = async (resumePath) => {
    if (!resumePath) {
        return '';
    }

    try {
        // Convert URL path to file system path
        let filePath = resumePath;

        // If it's a relative URL path (starts with /uploads), convert to absolute file path
        if (resumePath.startsWith('/uploads') || resumePath.startsWith('uploads')) {
            filePath = path.join(process.cwd(), resumePath.replace(/^\//, ''));
        }

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log('Resume file not found:', filePath);
            return '';
        }

        const extension = path.extname(filePath).toLowerCase();

        if (extension === '.pdf') {
            return await parsePDF(filePath);
        } else if (extension === '.docx') {
            return await parseDOCX(filePath);
        } else if (extension === '.doc') {
            // .doc files are harder to parse, try as plain text
            console.log('DOC format not fully supported, attempting basic read');
            return '';
        } else if (extension === '.txt') {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            console.log('Unsupported resume format:', extension);
            return '';
        }
    } catch (error) {
        console.error('Error parsing resume:', error.message);
        return '';
    }
};

/**
 * Parse PDF file using dynamic import to avoid pdf-parse test file issue
 */
const parsePDF = async (filePath) => {
    try {
        // Use dynamic import to avoid pdf-parse test file requirement
        const pdfParse = (await import('pdf-parse')).default;
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return cleanText(data.text);
    } catch (error) {
        console.error('Error parsing PDF:', error.message);
        // Return empty string on error - don't break recommendations
        return '';
    }
};

/**
 * Parse DOCX file
 */
const parseDOCX = async (filePath) => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return cleanText(result.value);
    } catch (error) {
        console.error('Error parsing DOCX:', error.message);
        return '';
    }
};

/**
 * Clean extracted text
 */
const cleanText = (text) => {
    if (!text) return '';

    return text
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove special characters but keep important ones
        .replace(/[^\w\s\-\+\#\.@]/g, ' ')
        // Normalize spaces
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
};

/**
 * Extract key information from resume text
 * Returns structured data for better matching
 */
export const extractResumeInfo = (resumeText) => {
    if (!resumeText) {
        return { skills: [], experience: [], education: [] };
    }

    // Common tech skills to look for
    const techSkills = [
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
        'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel',
        'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery',
        'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'firebase',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
        'machine learning', 'deep learning', 'artificial intelligence', 'data science',
        'agile', 'scrum', 'jira', 'figma', 'photoshop', 'illustrator',
        'rest api', 'graphql', 'microservices', 'devops', 'ci/cd',
        'linux', 'windows', 'macos', 'android', 'ios',
        'sql', 'nosql', 'orm', 'api', 'frontend', 'backend', 'fullstack', 'full stack',
        'nextjs', 'next.js', 'nuxt', 'gatsby', 'webpack', 'vite', 'npm', 'yarn',
        'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'scikit-learn',
        'communication', 'leadership', 'teamwork', 'problem solving', 'analytical'
    ];

    // Find matching skills
    const foundSkills = techSkills.filter(skill =>
        resumeText.includes(skill.toLowerCase())
    );

    // Look for experience indicators
    const experiencePattern = /(\d+)\s*(?:\+)?\s*years?\s*(?:of)?\s*experience/gi;
    const experienceMatches = resumeText.match(experiencePattern) || [];

    // Look for job titles
    const titlePatterns = [
        'software engineer', 'developer', 'programmer', 'architect', 'designer',
        'manager', 'lead', 'senior', 'junior', 'intern', 'analyst', 'consultant',
        'frontend', 'backend', 'fullstack', 'devops', 'data scientist', 'ml engineer'
    ];

    const foundTitles = titlePatterns.filter(title =>
        resumeText.includes(title.toLowerCase())
    );

    return {
        skills: [...new Set(foundSkills)],
        experience: experienceMatches,
        titles: foundTitles,
        rawText: resumeText
    };
};

export default {
    parseResume,
    extractResumeInfo
};
