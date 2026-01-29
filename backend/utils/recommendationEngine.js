/**
 * AI Job Recommendation Engine
 * Uses TF-IDF vectorization and cosine similarity for CV-job matching
 */

import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

/**
 * Extract searchable text from a job seeker's profile
 * @param {Object} profile - The user's profile
 * @param {Object} user - The user object
 * @param {string} resumeText - Optional parsed resume text
 */
export const extractProfileText = (profile, user, resumeText = '') => {
    const textParts = [];

    // Add parsed resume text (high priority - this contains all CV data)
    if (resumeText && resumeText.trim()) {
        // Repeat resume text for emphasis since it's the primary source
        textParts.push(resumeText.toLowerCase());
        textParts.push(resumeText.toLowerCase());
    }

    // Add skills (high weight - repeat for emphasis)
    if (profile?.skills && Array.isArray(profile.skills)) {
        profile.skills.forEach(skill => {
            if (skill.name) {
                // Repeat skill based on level for weighting
                const weight = skill.level === 'expert' ? 4 :
                    skill.level === 'advanced' ? 3 :
                        skill.level === 'intermediate' ? 2 : 1;
                for (let i = 0; i < weight; i++) {
                    textParts.push(skill.name.toLowerCase());
                }
            }
        });
    }

    // Add experience titles and descriptions
    if (profile?.experience && Array.isArray(profile.experience)) {
        profile.experience.forEach(exp => {
            if (exp.title) textParts.push(exp.title.toLowerCase());
            if (exp.description) textParts.push(exp.description.toLowerCase());
        });
    }

    // Add about/summary
    if (profile?.about) {
        textParts.push(profile.about.toLowerCase());
    }

    // Add education fields
    if (profile?.education && Array.isArray(profile.education)) {
        profile.education.forEach(edu => {
            if (edu.field) textParts.push(edu.field.toLowerCase());
            if (edu.degree) textParts.push(edu.degree.toLowerCase());
        });
    }

    // Add user name for context
    if (user?.name) {
        textParts.push(user.name.toLowerCase());
    }

    return textParts.join(' ');
};

/**
 * Extract searchable text from a job listing
 */
export const extractJobText = (job) => {
    const textParts = [];

    // Add title (high weight - repeat for emphasis)
    if (job.title) {
        for (let i = 0; i < 3; i++) {
            textParts.push(job.title.toLowerCase());
        }
    }

    // Add skills (high weight)
    if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach(skill => {
            for (let i = 0; i < 3; i++) {
                textParts.push(skill.toLowerCase());
            }
        });
    }

    // Add description
    if (job.description) {
        textParts.push(job.description.toLowerCase());
    }

    // Add requirements
    if (job.requirements && Array.isArray(job.requirements)) {
        job.requirements.forEach(req => {
            textParts.push(req.toLowerCase());
        });
    }

    // Add company name
    if (job.company) {
        textParts.push(job.company.toLowerCase());
    }

    // Add job type
    if (job.type) {
        textParts.push(job.type.toLowerCase());
    }

    return textParts.join(' ');
};

/**
 * Calculate experience level from profile
 * Returns years of experience estimate
 */
const calculateExperienceYears = (profile) => {
    if (!profile?.experience || !Array.isArray(profile.experience)) {
        return 0;
    }

    let totalMonths = 0;

    profile.experience.forEach(exp => {
        if (exp.startDate) {
            const start = new Date(exp.startDate);
            const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
            const months = (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());
            totalMonths += months;
        }
    });

    return Math.round(totalMonths / 12);
};

/**
 * Parse experience requirement from job
 */
const parseExperienceRequirement = (experience) => {
    if (!experience) return 0;

    const exp = experience.toLowerCase();

    // Match patterns like "3+ years", "1-2 years", "entry level", etc.
    if (exp.includes('entry') || exp.includes('fresher') || exp.includes('junior')) {
        return 0;
    }

    const match = exp.match(/(\d+)/);
    if (match) {
        return parseInt(match[1]);
    }

    if (exp.includes('senior') || exp.includes('lead')) {
        return 5;
    }

    if (exp.includes('mid')) {
        return 2;
    }

    return 0;
};

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
const cosineSimilarity = (tfidf, doc1Index, doc2Index) => {
    const terms1 = {};
    const terms2 = {};

    tfidf.listTerms(doc1Index).forEach(item => {
        terms1[item.term] = item.tfidf;
    });

    tfidf.listTerms(doc2Index).forEach(item => {
        terms2[item.term] = item.tfidf;
    });

    // Get all unique terms
    const allTerms = new Set([...Object.keys(terms1), ...Object.keys(terms2)]);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    allTerms.forEach(term => {
        const val1 = terms1[term] || 0;
        const val2 = terms2[term] || 0;

        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
    });

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Common tech skills to look for in resume
 */
const TECH_SKILLS = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust',
    'react', 'reactjs', 'angular', 'vue', 'vuejs', 'svelte', 'node', 'nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap', 'jquery', 'material-ui', 'mui',
    'mongodb', 'mysql', 'postgresql', 'postgres', 'redis', 'elasticsearch', 'firebase', 'sqlite', 'oracle', 'sql server', 'mariadb',
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'jenkins', 'git', 'github', 'gitlab', 'bitbucket',
    'machine learning', 'ml', 'deep learning', 'dl', 'artificial intelligence', 'ai', 'data science', 'data analysis', 'nlp', 'computer vision',
    'agile', 'scrum', 'jira', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
    'rest', 'restful', 'rest api', 'graphql', 'microservices', 'devops', 'ci/cd', 'cicd',
    'linux', 'unix', 'windows', 'macos', 'android', 'ios', 'mobile', 'flutter', 'react native',
    'sql', 'nosql', 'orm', 'api', 'frontend', 'front-end', 'backend', 'back-end', 'fullstack', 'full-stack', 'full stack',
    'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby', 'webpack', 'vite', 'babel', 'npm', 'yarn', 'pnpm',
    'tensorflow', 'pytorch', 'keras', 'pandas', 'numpy', 'scikit-learn', 'scipy', 'matplotlib',
    'testing', 'jest', 'mocha', 'cypress', 'selenium', 'unit testing', 'integration testing',
    'communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'project management',
    'excel', 'powerpoint', 'word', 'office', 'sap', 'salesforce', 'crm',
    'blockchain', 'ethereum', 'solidity', 'web3', 'smart contracts',
    'security', 'cybersecurity', 'penetration testing', 'network security'
];

/**
 * Extract skills from resume text
 */
const extractSkillsFromResume = (resumeText) => {
    if (!resumeText || typeof resumeText !== 'string') {
        return [];
    }

    const text = resumeText.toLowerCase();
    const foundSkills = [];

    TECH_SKILLS.forEach(skill => {
        // Create pattern to match the skill as a word
        const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (pattern.test(text)) {
            foundSkills.push(skill);
        }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
};

/**
 * Calculate skill match percentage (enhanced to use resume skills)
 */
const calculateSkillMatch = (profileSkills, jobSkills, resumeText = '') => {
    if (!jobSkills || jobSkills.length === 0) {
        return 0;
    }

    // Get skills from profile
    let allUserSkills = [];

    if (profileSkills && Array.isArray(profileSkills)) {
        allUserSkills = profileSkills.map(s =>
            (typeof s === 'string' ? s : s.name || '').toLowerCase()
        ).filter(s => s);
    }

    // Extract skills from resume text
    if (resumeText) {
        const resumeSkills = extractSkillsFromResume(resumeText);
        allUserSkills = [...new Set([...allUserSkills, ...resumeSkills])];
    }

    if (allUserSkills.length === 0) {
        return 0;
    }

    const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

    let matchCount = 0;
    jobSkillsLower.forEach(jobSkill => {
        if (allUserSkills.some(ps =>
            ps.includes(jobSkill) || jobSkill.includes(ps)
        )) {
            matchCount++;
        }
    });

    return (matchCount / jobSkillsLower.length) * 100;
};

/**
 * Generate match reason based on analysis
 */
const generateReason = (job, profile, skillMatch, experienceMatch, tfidfScore, resumeText = '') => {
    const reasons = [];

    // Skill matching reason
    if (skillMatch >= 80) {
        reasons.push('Excellent skill match');
    } else if (skillMatch >= 50) {
        reasons.push('Good skill alignment');
    } else if (skillMatch > 0) {
        reasons.push('Some relevant skills');
    }

    // Get all user skills (profile + resume)
    let allUserSkills = [];

    if (profile?.skills && Array.isArray(profile.skills)) {
        allUserSkills = profile.skills.map(s =>
            (typeof s === 'string' ? s : s.name || '').toLowerCase()
        ).filter(s => s);
    }

    // Add skills from resume
    if (resumeText) {
        const resumeSkills = extractSkillsFromResume(resumeText);
        allUserSkills = [...new Set([...allUserSkills, ...resumeSkills])];
    }

    // Find specific matching skills from both profile and resume
    if (job.skills && job.skills.length > 0 && allUserSkills.length > 0) {
        const matchingSkills = job.skills.filter(js =>
            allUserSkills.some(ps => ps.includes(js.toLowerCase()) || js.toLowerCase().includes(ps))
        );
        if (matchingSkills.length > 0) {
            reasons.push(`Matches: ${matchingSkills.slice(0, 4).join(', ')}`);
        }
    }

    // Experience reason
    if (experienceMatch) {
        reasons.push('Experience level suitable');
    }

    // Job type
    if (job.type) {
        reasons.push(`${job.type} position`);
    }

    return reasons.length > 0 ? reasons.join('. ') : 'Based on resume and profile analysis';
};

/**
 * Main recommendation function
 * Returns top N jobs ranked by relevance
 * @param {Object} profile - User's profile
 * @param {Object} user - User object
 * @param {Array} jobs - Array of job listings
 * @param {number} limit - Maximum recommendations to return
 * @param {string} resumeText - Optional parsed resume text
 */
export const getRecommendations = (profile, user, jobs, limit = 5, resumeText = '') => {
    if (!jobs || jobs.length === 0) {
        return [];
    }

    const tfidf = new TfIdf();

    // Extract profile text (including resume if available) and add as first document
    const profileText = extractProfileText(profile, user, resumeText);
    tfidf.addDocument(profileText);

    // Add all job texts
    jobs.forEach(job => {
        const jobText = extractJobText(job);
        tfidf.addDocument(jobText);
    });

    // Calculate user's experience level
    const userExperience = calculateExperienceYears(profile);

    // Calculate scores for each job
    const scoredJobs = jobs.map((job, index) => {
        // TF-IDF similarity score (profile is doc 0, jobs start at doc 1)
        const tfidfScore = cosineSimilarity(tfidf, 0, index + 1);

        // Skill match score (now includes resume-extracted skills)
        const skillMatch = calculateSkillMatch(profile?.skills, job.skills, resumeText);

        // Experience compatibility
        const requiredExp = parseExperienceRequirement(job.experience);
        const experienceMatch = userExperience >= requiredExp;
        const experiencePenalty = experienceMatch ? 0 : Math.min((requiredExp - userExperience) * 5, 30);

        // Combined score (weighted)
        // TF-IDF: 40%, Skill Match: 45%, Experience: 15%
        let combinedScore = (tfidfScore * 100 * 0.40) +
            (skillMatch * 0.45) +
            (experienceMatch ? 15 : 0) -
            experiencePenalty;

        // Normalize to 0-100
        combinedScore = Math.max(0, Math.min(100, combinedScore));

        // Generate human-readable reason (now includes resume skills)
        const reason = generateReason(job, profile, skillMatch, experienceMatch, tfidfScore, resumeText);

        return {
            job_id: job._id,
            job_title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            skills: job.skills,
            match_score: Math.round(combinedScore),
            reason,
            _original: job // Keep original job data
        };
    });

    // Filter out jobs with very low scores and sort by score
    const filteredJobs = scoredJobs
        .filter(j => j.match_score > 10) // Minimum threshold
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, limit);

    return filteredJobs;
};

export default {
    extractProfileText,
    extractJobText,
    getRecommendations
};
