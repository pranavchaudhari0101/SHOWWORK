/* =====================================================
   ShowWork - Supabase Client
   Database and authentication integration
   ===================================================== */

// Supabase configuration
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (using CDN version)
// Note: Include this in your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
let supabase;

function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabase;
    }
    console.warn('Supabase JS library not loaded');
    return null;
}

// =====================================================
// Authentication Functions
// =====================================================

async function signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
            emailRedirectTo: `${window.location.origin}/verify.html`
        }
    });

    if (error) throw error;
    return data;
}

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/dashboard.html`
        }
    });

    if (error) throw error;
    return data;
}

async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/dashboard.html`
        }
    });

    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
}

async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}

// =====================================================
// Profile Functions
// =====================================================

async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            category:categories(id, name, slug, icon),
            skills:profile_skills(skill:skills(id, name)),
            education:education(*)
        `)
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data;
}

async function getProfileByUsername(username) {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            category:categories(id, name, slug, icon),
            skills:profile_skills(skill:skills(id, name)),
            education:education(*),
            projects(
                id, title, slug, short_desc, cover_image_url, 
                views_count, likes_count, created_at,
                skills:project_skills(skill:skills(id, name))
            )
        `)
        .eq('username', username)
        .single();

    if (error) throw error;
    return data;
}

async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function checkUsernameAvailable(username) {
    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

    if (error) throw error;
    return !data;
}

// =====================================================
// Project Functions
// =====================================================

async function getProjects({
    category = null,
    tech = null,
    sort = 'recent',
    limit = 12,
    offset = 0
} = {}) {
    let query = supabase
        .from('projects')
        .select(`
            id, title, slug, short_desc, cover_image_url, demo_video_url,
            views_count, likes_count, saves_count, created_at,
            profile:profiles(id, username, full_name, avatar_url),
            skills:project_skills(skill:skills(id, name))
        `)
        .eq('visibility', 'PUBLIC')
        .range(offset, offset + limit - 1);

    // Apply category filter
    if (category) {
        query = query.eq('profile.category.slug', category);
    }

    // Apply tech filter (through project_skills)
    if (tech) {
        query = query.contains('skills', [{ skill: { name: tech } }]);
    }

    // Apply sorting
    switch (sort) {
        case 'popular':
            query = query.order('likes_count', { ascending: false });
            break;
        case 'trending':
            // Trending score: likes * 3 + views * 0.5 + recency
            query = query.order('likes_count', { ascending: false })
                .order('created_at', { ascending: false });
            break;
        case 'views':
            query = query.order('views_count', { ascending: false });
            break;
        default: // recent
            query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { projects: data, total: count };
}

async function getProject(projectId) {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            profile:profiles(id, username, full_name, avatar_url, headline),
            skills:project_skills(skill:skills(id, name)),
            images:project_images(id, image_url, order)
        `)
        .eq('id', projectId)
        .single();

    if (error) throw error;

    // Increment view count
    await supabase.rpc('increment_views', { project_id: projectId });

    return data;
}

async function getProjectBySlug(username, projectSlug) {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            profile:profiles!inner(id, username, full_name, avatar_url, headline),
            skills:project_skills(skill:skills(id, name)),
            images:project_images(id, image_url, order)
        `)
        .eq('profile.username', username)
        .eq('slug', projectSlug)
        .single();

    if (error) throw error;
    return data;
}

async function createProject(projectData) {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const profile = await getProfile(user.id);

    // Generate slug from title
    const slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const { data, error } = await supabase
        .from('projects')
        .insert({
            profile_id: profile.id,
            title: projectData.title,
            slug,
            short_desc: projectData.shortDesc,
            full_desc: projectData.fullDesc,
            cover_image_url: projectData.coverImageUrl,
            demo_video_url: projectData.demoVideoUrl,
            github_url: projectData.githubUrl,
            live_url: projectData.liveUrl,
            project_type: projectData.projectType,
            status: projectData.status || 'COMPLETED',
            visibility: projectData.visibility || 'PUBLIC'
        })
        .select()
        .single();

    if (error) throw error;

    // Add skills
    if (projectData.skills?.length > 0) {
        await supabase
            .from('project_skills')
            .insert(
                projectData.skills.map(skillId => ({
                    project_id: data.id,
                    skill_id: skillId
                }))
            );
    }

    return data;
}

async function updateProject(projectId, updates) {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function deleteProject(projectId) {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) throw error;
}

// =====================================================
// Like & Save Functions
// =====================================================

async function toggleProjectLike(projectId) {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const profile = await getProfile(user.id);

    // Check if already liked
    const { data: existing } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('profile_id', profile.id)
        .maybeSingle();

    if (existing) {
        // Unlike
        await supabase
            .from('project_likes')
            .delete()
            .eq('project_id', projectId)
            .eq('profile_id', profile.id);

        await supabase.rpc('decrement_likes', { project_id: projectId });
        return false;
    } else {
        // Like
        await supabase
            .from('project_likes')
            .insert({ project_id: projectId, profile_id: profile.id });

        await supabase.rpc('increment_likes', { project_id: projectId });
        return true;
    }
}

async function toggleProjectSave(projectId) {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const profile = await getProfile(user.id);

    // Check if already saved
    const { data: existing } = await supabase
        .from('project_saves')
        .select('id')
        .eq('project_id', projectId)
        .eq('profile_id', profile.id)
        .maybeSingle();

    if (existing) {
        // Unsave
        await supabase
            .from('project_saves')
            .delete()
            .eq('project_id', projectId)
            .eq('profile_id', profile.id);
        return false;
    } else {
        // Save
        await supabase
            .from('project_saves')
            .insert({ project_id: projectId, profile_id: profile.id });
        return true;
    }
}

async function getSavedProjects() {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const profile = await getProfile(user.id);

    const { data, error } = await supabase
        .from('project_saves')
        .select(`
            project:projects(
                id, title, slug, short_desc, cover_image_url,
                views_count, likes_count,
                profile:profiles(username, full_name, avatar_url)
            )
        `)
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(d => d.project);
}

// =====================================================
// Category & Skills Functions
// =====================================================

async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
}

async function getSkills(categoryId = null) {
    let query = supabase.from('skills').select('*');

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
}

// =====================================================
// Search Functions
// =====================================================

async function searchProjects(query, limit = 10) {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            id, title, slug, short_desc,
            profile:profiles(username)
        `)
        .textSearch('title', query, { type: 'websearch' })
        .eq('visibility', 'PUBLIC')
        .limit(limit);

    if (error) throw error;
    return data;
}

async function searchProfiles(query, limit = 10) {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, headline')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(limit);

    if (error) throw error;
    return data;
}

// =====================================================
// Media Upload Functions
// =====================================================

async function uploadImage(file, path) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

    return publicUrl;
}

async function uploadVideo(file, path) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

    return publicUrl;
}

// =====================================================
// Analytics Functions
// =====================================================

async function getProfileAnalytics(days = 30) {
    const user = await getUser();
    if (!user) throw new Error('Not authenticated');

    const profile = await getProfile(user.id);

    // Get total stats
    const { data: projects } = await supabase
        .from('projects')
        .select('views_count, likes_count, saves_count')
        .eq('profile_id', profile.id);

    const totals = projects.reduce((acc, p) => ({
        views: acc.views + p.views_count,
        likes: acc.likes + p.likes_count,
        saves: acc.saves + p.saves_count
    }), { views: 0, likes: 0, saves: 0 });

    return {
        totalViews: totals.views,
        totalLikes: totals.likes,
        totalSaves: totals.saves,
        projectCount: projects.length
    };
}

// =====================================================
// Export Functions
// =====================================================

window.SupabaseClient = {
    init: initSupabase,

    // Auth
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    getUser,
    getSession,
    onAuthStateChange,

    // Profiles
    getProfile,
    getProfileByUsername,
    updateProfile,
    checkUsernameAvailable,

    // Projects
    getProjects,
    getProject,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,

    // Interactions
    toggleProjectLike,
    toggleProjectSave,
    getSavedProjects,

    // Categories & Skills
    getCategories,
    getSkills,

    // Search
    searchProjects,
    searchProfiles,

    // Media
    uploadImage,
    uploadVideo,

    // Analytics
    getProfileAnalytics
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}
