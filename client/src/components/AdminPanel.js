import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import './AdminPanel.css'; // Make sure you have styles for this
// FIX: Added FaGithub import
import { FaSave, FaTrash, FaPlus, FaLink, FaImage, FaGithub } from 'react-icons/fa';

// --- Reusable Section Wrapper ---
// Updated to make onSave optional
const AdminSection = ({ title, children, onSave, isLoading, statusMessage }) => (
  <div className="admin-section card">
    <h2>{title}</h2>
    {statusMessage && (
      <p className={`status-message ${statusMessage.type}`}>{statusMessage.text}</p>
    )}
    <div className="admin-section-content">{children}</div>
    {/* Only show save button if onSave prop is provided */}
    {onSave && (
      <button onClick={onSave} disabled={isLoading} className="save-button">
        <FaSave /> {isLoading ? 'Saving...' : `Save ${title}`}
      </button>
    )}
  </div>
);

// --- Controls for Add/Remove ---
// Updated to make onAdd optional
const ListItemControls = ({ index, onRemove, onAdd, isLast, itemType }) => (
  <div className="list-item-controls">
    <button onClick={() => onRemove(index)} className="remove-button" title={`Remove ${itemType}`}>
      <FaTrash />
    </button>
    {/* Only show add button if onAdd prop is provided */}
    {onAdd && isLast && (
      <button onClick={onAdd} className="add-button" title={`Add New ${itemType}`}>
        <FaPlus />
      </button>
    )}
  </div>
);

// --- Templates for new items ---
const newSkillTemplate = { skill_name: '', proficiency_level: 'Intermediate', category: 'Other', icon: '' }; // Updated field names
const newProjectTemplate = { title: '', description: '', tech_stack: '', github_link: '', demo_link: '', image_url: '', featured: false };
const newCertificateTemplate = { cert_name: '', issuing_organization: '', issue_date: '', credential_url: '', image_url: '' }; // Updated field names
const newExperienceTemplate = { title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '', technologies: '', type: 'Internship' }; // Updated field names
const newEducationTemplate = { degree: '', institution: '', location: '', start_date: '', end_date: '', current: false, gpa: '', description: '' }; // Updated field names


const AdminPanel = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // --- All States ---
  const [personalInfo, setPersonalInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [messages, setMessages] = useState([]);

  // State for file uploads - Only need profile_image for now
  const [files, setFiles] = useState({
    profile_image: null,
    // about_image: null, // Removed as per focus on Home section for now
  });

  const [loadingStates, setLoadingStates] = useState({});
  const [statusMessages, setStatusMessages] = useState({});
  const [newCategory, setNewCategory] = useState('');

  // --- Initial Fetch ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, page: true }));

        // Fetch all data concurrently
        const [infoRes, skillsRes, projectsRes, certsRes, expRes, eduRes, messagesRes] =
          await Promise.all([
            api.get('/personal-info'), // Endpoint likely gets the single record
            api.get('/skills'),
            api.get('/projects'), // Fetch featured projects for potential display, or change if needed
            api.get('/certifications'),
            api.get('/experiences'),
            api.get('/education'),
            api.get('/messages'), // Fetch messages
          ]);

        // --- Process Responses ---
        // Ensure data exists before setting state
        if (infoRes.data.success && infoRes.data.data) {
          // If the backend returns an array (like LIMIT 1), take the first item
          const infoData = Array.isArray(infoRes.data.data) ? infoRes.data.data[0] : infoRes.data.data;
          setPersonalInfo(infoData);
        } else {
           console.error("Failed to fetch personal info or no data found:", infoRes.data);
           // Set default structure if fetch fails or no data
           setPersonalInfo({ full_name: '', title: '', linkedin_url: '', github_url: '', profile_image: '', bio: '', email: '', phone: '', location: '', resume_url: '' }); // Added removed fields back to default state
        }

        if (skillsRes.data.success) setSkills(skillsRes.data.data || []); else console.error("Failed to fetch skills:", skillsRes.data);
        if (projectsRes.data.success) setProjects(projectsRes.data.data || []); else console.error("Failed to fetch projects:", projectsRes.data);
        if (certsRes.data.success) setCertificates(certsRes.data.data || []); else console.error("Failed to fetch certifications:", certsRes.data);
        if (expRes.data.success) setExperiences(expRes.data.data || []); else console.error("Failed to fetch experiences:", expRes.data);
        if (eduRes.data.success) setEducation(eduRes.data.data || []); else console.error("Failed to fetch education:", eduRes.data);
        if (messagesRes.data.success) setMessages(messagesRes.data.data || []); else console.error("Failed to fetch messages:", messagesRes.data);

      } catch (err) {
        console.error('Error fetching admin data:', err);
        showStatus('page', 'error', 'Failed to load initial data.');
        // Initialize personalInfo with default structure on error
        setPersonalInfo({ full_name: '', title: '', linkedin_url: '', github_url: '', profile_image: '', bio: '', email: '', phone: '', location: '', resume_url: '' }); // Added removed fields back to default state
      } finally {
        setLoadingStates(prev => ({ ...prev, page: false }));
      }
    };

    fetchData();
  }, [navigate]);

  // --- Status Message Helper ---
  const showStatus = (key, type, text) => {
    setStatusMessages(prev => ({ ...prev, [key]: { type, text } }));
    setTimeout(() => {
      setStatusMessages(prev => ({ ...prev, [key]: null }));
    }, 4000);
  };

  // --- Input Handlers ---
  const handleInputChange = (setState, index, field, value) => {
    setState(prev => {
      // Handle single object state (like personalInfo)
      if (index === null) {
        return { ...prev, [field]: value };
      }
      // Handle array state
      const newState = [...prev];
      // Ensure the item exists before trying to update
      if (newState[index]) {
        newState[index] = { ...newState[index], [field]: value };
      }
      return newState;
    });
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
      // Optional: Show image preview immediately
      // This requires careful state management if you also display the current URL
      /*
      const reader = new FileReader();
      reader.onloadend = () => {
        // Example: set a separate preview state
        // setPersonalInfo(prev => ({...prev, profile_image_preview: reader.result }));
      };
      reader.readAsDataURL(inputFiles[0]);
      */
    } else {
        // Clear the file if user cancels selection
        setFiles(prev => ({ ...prev, [name]: null }));
    }
  };

  // Generic handler for adding items to arrays
  const handleAddItem = (setState, template) => {
    // Generate a temporary unique ID for new items
    const newItem = { ...template, id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
    setState(prev => [...prev, newItem]);
  };

 // Generic handler for removing items from arrays
 const handleRemoveItem = async (state, setState, index, endpoint, key) => {
    if (index < 0 || index >= state.length) {
      console.error(`Invalid index ${index} for removing item from ${key}`);
      return;
    }
    const itemToRemove = state[index];

    // If it's a new item (not in DB yet), just remove from state
    if (itemToRemove?.id && itemToRemove.id.toString().startsWith('new-')) {
      setState(prev => prev.filter((_, i) => i !== index));
      return;
    }

    // If it's an existing item, attempt to delete from DB
    if (itemToRemove?.id) {
      // Use browser confirm for simplicity, replace with modal if needed
      const confirmDelete = window.confirm(`Are you sure you want to delete this ${key} item?`);
      if (!confirmDelete) return;

      try {
        setLoadingStates(prev => ({ ...prev, [`delete_${key}_${itemToRemove.id}`]: true }));
        await api.delete(`${endpoint}/${itemToRemove.id}`);
        setState(prev => prev.filter((_, i) => i !== index));
        showStatus(key, 'success', `${key.charAt(0).toUpperCase() + key.slice(1)} item deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting ${key}:`, err.response?.data?.message || err.message);
        showStatus(key, 'error', `Failed to delete ${key} item: ${err.response?.data?.message || 'Server error'}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, [`delete_${key}_${itemToRemove.id}`]: false }));
      }
    } else {
      console.warn(`Attempted to remove ${key} item without an ID at index ${index}`);
      // Fallback: Remove from state if it somehow lacks an ID
      setState(prev => prev.filter((_, i) => i !== index));
    }
  };


  // --- Save Handlers ---

  // Save handler for Personal Info (handles FormData for images)
  const savePersonalInfo = async () => {
    if (!personalInfo) {
      showStatus('personalInfo', 'error', 'Personal info not loaded yet.');
      return;
    }
    setLoadingStates(prev => ({ ...prev, personalInfo: true }));

    const formData = new FormData();

    // Append all text fields from the personalInfo state
    // Ensure all expected fields by the backend are included
    const fieldsToSave = [
        'full_name', 'title', 'email', 'phone', 'location',
        'bio', 'github_url', 'linkedin_url', 'resume_url'
        // 'profile_image' is handled separately below if it's a file
    ];

    fieldsToSave.forEach(key => {
        // FIX: Send null if value is undefined or null, otherwise send the value
        const value = personalInfo[key];
        formData.append(key, value === undefined || value === null ? null : value);
    });

    // Append the profile image file if selected
    if (files.profile_image) {
      formData.append('profile_image', files.profile_image);
      // Backend needs to handle 'profile_image' field as a file upload
    }
    // No need to append profile_image if no new file is selected,
    // as the backend route `personalInfo.js` is updated to handle this.

    try {
      // Using PUT /api/personal-info (assuming backend handles ID 1 implicitly)
      const res = await api.put('/personal-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      if (res.data.success) {
        // Update state with potentially new data from server (including image URL)
        if (res.data.data) {
             const updatedInfo = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
             setPersonalInfo(updatedInfo);
        } else {
             console.warn("Save successful, but no updated data returned from server.");
             // Optionally refetch if needed: fetchData();
        }
        setFiles({ profile_image: null }); // Clear file input state on success
        showStatus('personalInfo', 'success', 'Personal Info saved successfully.');
      } else {
        showStatus('personalInfo', 'error', res.data.message || 'Failed to save Personal Info.');
      }
    } catch (err) {
      console.error('Error saving personal info:', err.response?.data || err.message);
      showStatus('personalInfo', 'error', `Failed to save Personal Info: ${err.response?.data?.message || 'Check console'}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, personalInfo: false }));
    }
  };

  // Generic save handler for array sections (Projects, Certs, etc.)
  const createSaveHandler = (endpoint, state, setState, key) => async () => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    let hasError = false;
    const results = []; // To store results including new IDs

    try {
        // Use Promise.all to run updates/creates concurrently for better performance
        await Promise.all(state.map(async (item) => {
            const { id, ...data } = item;
            try {
                let response;
                if (id?.toString().startsWith('new-')) {
                    // Create new item
                    response = await api.post(endpoint, data);
                } else if (id) {
                    // Update existing item
                    response = await api.put(`${endpoint}/${id}`, data);
                    // Ensure response structure matches POST for consistency if needed
                    if (response.data.success && !response.data.data && id) {
                       // If PUT doesn't return data, reconstruct it (less ideal but functional)
                       response.data.data = { id, ...data };
                    }
                } else {
                    console.warn(`Item in ${key} is missing an ID and doesn't start with 'new-'`, item);
                    results.push(item); // Keep the item in state if it has no ID
                    return; // Skip API call for items without ID
                }

                if (response.data.success && response.data.data) {
                    results.push(response.data.data); // Collect successful results with potentially new IDs
                } else {
                    console.error(`Failed operation for item ${id || 'new'} in ${key}:`, response.data.message);
                    showStatus(key, 'error', `Failed for item "${data.title || data.skill_name || data.cert_name || data.degree || 'New Item'}": ${response.data.message || 'Unknown error'}`);
                    hasError = true;
                    results.push(item); // Push original item back on failure
                }
            } catch (itemError) {
                console.error(`Error saving item ${id || 'new'} in ${key}:`, itemError.response?.data || itemError.message);
                showStatus(key, 'error', `Error for item "${data.title || data.skill_name || data.cert_name || data.degree || 'New Item'}": ${itemError.response?.data?.message || 'Check console'}`);
                hasError = true;
                results.push(item); // Push original item back on error
            }
        }));

        // Update state with results (important for new IDs and reflecting any failed items)
        setState(results);

        if (!hasError) {
            showStatus(key, 'success', `${key.charAt(0).toUpperCase() + key.slice(1)} saved successfully.`);
        } else {
            showStatus(key, 'warning', `Some ${key} items may not have saved. Check messages.`);
        }

    } catch (err) {
        // Catch errors during the Promise.all phase itself (less likely now)
        console.error(`General error saving ${key}:`, err);
        showStatus(key, 'error', `Failed to save ${key}. Check console.`);
    } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
};


  // --- Skill Grouping Logic ---
   const skillGroups = useMemo(() => {
    return skills.reduce((acc, skill) => {
      // Use skill.category or default to 'Other'
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const skillCategories = useMemo(() => Object.keys(skillGroups).sort(), [skillGroups]);


  const handleSkillChange = (category, skillIndexInCategory, field, value) => {
     // Find the actual skill object using category and index within that category
     if (skillGroups[category] && skillGroups[category][skillIndexInCategory]) {
        const skillIdToUpdate = skillGroups[category][skillIndexInCategory].id;
         // Find the global index of this skill in the main `skills` array
        const globalSkillIndex = skills.findIndex(s => s.id === skillIdToUpdate);

        if (globalSkillIndex > -1) {
            // Use the generic handleInputChange with the correct global index
            handleInputChange(setSkills, globalSkillIndex, field, value);
        } else {
             console.error(`Skill with ID ${skillIdToUpdate} not found in global skills array.`);
        }
     } else {
         console.error(`Invalid category "${category}" or skill index "${skillIndexInCategory}"`);
     }
  };


    const handleAddSkill = (category) => {
        const template = {
            ...newSkillTemplate,
            category: category, // Assign the current category
            id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` // Unique temp ID
        };
        setSkills(prev => [...prev, template]);
    };

  const handleRemoveSkill = (category, skillIndexInCategory) => {
     if (skillGroups[category] && skillGroups[category][skillIndexInCategory]) {
        const skillToRemove = skillGroups[category][skillIndexInCategory];
        const globalSkillIndex = skills.findIndex(s => s.id === skillToRemove.id);

        if (globalSkillIndex > -1) {
            // Use the generic handleRemoveItem with the correct global index
            handleRemoveItem(skills, setSkills, globalSkillIndex, '/skills', 'skills');
        } else {
             console.error(`Skill with ID ${skillToRemove.id} not found for removal.`);
        }
     } else {
         console.error(`Invalid category "${category}" or skill index "${skillIndexInCategory}" for removal.`);
     }
  };


  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory === '') {
        showStatus('skills', 'error', 'Please enter a category name.');
        return;
    }
     // Check if category already exists (case-insensitive)
    if (skillCategories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
        showStatus('skills', 'error', `Category "${trimmedCategory}" already exists.`);
        return;
    }

    // Add a placeholder skill in the new category
    const template = {
        ...newSkillTemplate,
        category: trimmedCategory, // Use the trimmed name
        id: `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setSkills(prev => [...prev, template]);
    setNewCategory(''); // Clear the input field
  };


  // --- Logout ---
  // Ensure this function correctly removes the token
  const handleLogout = () => {
    console.log("Attempting logout..."); // Add log
    localStorage.removeItem('token');
    console.log("Token removed from localStorage (verify in dev tools)"); // Add log
    // Also clear Axios default headers if set globally
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // --- Render ---
  if (loadingStates.page || personalInfo === null) { // Added check for personalInfo null state
    return (
      <div className="loading-spinner" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div> Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className={`admin-panel ${theme}`}>
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      {statusMessages.page && (
        <p className={`status-message ${statusMessages.page.type}`}>
          {statusMessages.page.text}
        </p>
      )}

      <div className="admin-sections-container">

        {/* --- 🏠 Personal Information Section --- */}
        <AdminSection
          title="Personal Information"
          onSave={savePersonalInfo}
          isLoading={loadingStates.personalInfo}
          statusMessage={statusMessages.personalInfo}
        >
            {/* --- HOME SECTION SUB-BLOCK --- */}
            <h4 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Home Section Content</h4>
             <label htmlFor="home_full_name">Full Name (Displayed on Home):</label>
            <input
              id="home_full_name"
              type="text"
              value={personalInfo.full_name || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'full_name', e.target.value)}
              placeholder="e.g., Sarthak Sharma"
            />
            <label htmlFor="home_title">Title / Role (Displayed on Home):</label>
            <input
              id="home_title"
              type="text"
              value={personalInfo.title || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'title', e.target.value)}
              placeholder="e.g., DevOps Cloud Engineer"
            />
             <label htmlFor="linkedin_url"><FaLink /> LinkedIn URL:</label>
            <input
              id="linkedin_url"
              type="url"
              value={personalInfo.linkedin_url || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <label htmlFor="github_url"><FaGithub /> GitHub URL:</label>
            <input
              id="github_url"
              type="url"
              value={personalInfo.github_url || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'github_url', e.target.value)}
              placeholder="https://github.com/yourusername"
            />
            <label htmlFor="profile_image"><FaImage /> Profile Image (Home & About):</label>
            <input
               id="profile_image"
               type="file"
               name="profile_image" // Must match the key in 'files' state and FormData
               accept="image/png, image/jpeg, image/gif, image/webp" // Specify accepted types
               onChange={handleFileChange}
            />
            {/* Display current image or preview */}
            {files.profile_image ? (
                <img src={URL.createObjectURL(files.profile_image)} alt="New Profile Preview" className="admin-preview-image" style={{maxWidth: '150px', marginTop: '10px', borderRadius: '8px'}}/>
            ) : (
                personalInfo.profile_image && <img src={personalInfo.profile_image} alt="Current Profile" className="admin-preview-image" style={{maxWidth: '150px', marginTop: '10px', borderRadius: '8px'}}/>
            )}


             {/* --- ABOUT SECTION SUB-BLOCK --- */}
             <h4 style={{ marginTop: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About Section</h4>
              {/* Only Bio is needed here based on previous request */}
             <label htmlFor="about_bio">Bio / About Me Description:</label>
             <textarea
               id="about_bio"
               value={personalInfo.bio || ''}
               onChange={e => handleInputChange(setPersonalInfo, null, 'bio', e.target.value)}
               placeholder="Write a short description about yourself..."
               rows="5" // Give it a bit more space
             />
        </AdminSection>


        {/* --- 📧 Inbox / Messages Section --- */}
        <AdminSection
          title="Inbox / Messages"
          isLoading={loadingStates.messages} // General loading for the section if needed
          statusMessage={statusMessages.messages}
          // No onSave prop - this section is read/delete only
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={message.id || `msg-${index}`} className="admin-list-item-column message-item">
                <div className="message-header">
                  <div>
                     <strong>From: {message.name || 'N/A'}</strong>
                     <span> ({message.email || 'N/A'})</span>
                     <br/>
                     <small>Received: {message.created_at ? new Date(message.created_at).toLocaleString() : 'N/A'}</small>
                  </div>
                   {/* Pass unique ID to loading state */}
                   <button
                        onClick={() => handleRemoveItem(messages, setMessages, index, '/messages', 'messages')}
                        className="remove-button"
                        title="Delete Message"
                        disabled={loadingStates[`delete_messages_${message.id}`]} // Unique loading state key
                    >
                       {loadingStates[`delete_messages_${message.id}`] ? 'Deleting...' : <FaTrash />}
                    </button>
                </div>
                <p className="message-body">{message.message || 'No message content.'}</p>

              </div>
            ))
          ) : (
            <p>No new messages.</p>
          )}
        </AdminSection>

        {/* --- 💡 Skills Section --- */}
        <AdminSection
          title="Skills"
          onSave={createSaveHandler('/skills', skills, setSkills, 'skills')}
          isLoading={loadingStates.skills}
          statusMessage={statusMessages.skills}
        >
          {skillCategories.map((category) => (
            <div key={category} className="admin-skill-category" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem'}}>
              <h5>{category}</h5>
              {skillGroups[category].map((skill, index) => (
                <div key={skill.id} className="admin-list-item" style={{display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', paddingRight: '60px'}}>
                  <input
                    type="text"
                    placeholder="Skill Name"
                    value={skill.skill_name || ''} // Use skill_name
                    onChange={e => handleSkillChange(category, index, 'skill_name', e.target.value)}
                    style={{ flexGrow: 1 }}
                  />
                  <select
                     value={skill.proficiency_level || 'Intermediate'} // Use proficiency_level
                     onChange={e => handleSkillChange(category, index, 'proficiency_level', e.target.value)}
                     style={{ width: '150px' }}
                  >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                  </select>
                  {/* Icon field removed for simplicity unless needed */}
                  {/* <input type="text" placeholder="Icon (optional)" value={skill.icon || ''} onChange={e => handleSkillChange(category, index, 'icon', e.target.value)} /> */}
                  <ListItemControls
                    index={index}
                    onRemove={() => handleRemoveSkill(category, index)}
                    onAdd={() => handleAddSkill(category)} // Pass category to add skill correctly
                    isLast={index === skillGroups[category].length - 1}
                    itemType="Skill"
                  />
                </div>
              ))}
                {/* Ensure add button appears even if category is empty */}
                 {(!skillGroups[category] || skillGroups[category].length === 0) && (
                     <button onClick={() => handleAddSkill(category)} className="add-button-empty">
                         <FaPlus /> Add Skill to "{category}"
                     </button>
                )}
            </div>
          ))}
          <div className="admin-add-category" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center'}}>
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ flexGrow: 1}}
            />
            <button onClick={handleAddCategory} className="add-button" style={{color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', padding: '0.6rem 1rem'}}>
              <FaPlus /> Add Category
            </button>
          </div>
        </AdminSection>


        {/* --- 💻 Projects Section --- */}
        <AdminSection
          title="Projects"
          onSave={createSaveHandler('/projects', projects, setProjects, 'projects')}
          isLoading={loadingStates.projects}
          statusMessage={statusMessages.projects}
        >
          {projects.map((project, index) => (
            <div key={project.id || `proj-${index}`} className="admin-list-item-column project-item">
              <label>Project Name:</label>
              <input
                type="text"
                value={project.title || ''}
                onChange={e => handleInputChange(setProjects, index, 'title', e.target.value)}
              />
              <label>Description:</label>
              <textarea
                value={project.description || ''}
                onChange={e => handleInputChange(setProjects, index, 'description', e.target.value)}
              />
              <label>Tools & Technologies (comma-separated):</label>
              <input
                type="text"
                value={project.tech_stack || ''}
                onChange={e => handleInputChange(setProjects, index, 'tech_stack', e.target.value)}
              />
              <label>GitHub Link:</label>
              <input
                type="url"
                value={project.github_link || ''}
                onChange={e => handleInputChange(setProjects, index, 'github_link', e.target.value)}
              />
              <label>Demo Link (Optional):</label>
              <input
                type="url"
                value={project.demo_link || ''}
                onChange={e => handleInputChange(setProjects, index, 'demo_link', e.target.value)}
              />
              <label>Image URL (Optional):</label>
              <input
                type="url"
                value={project.image_url || ''}
                onChange={e => handleInputChange(setProjects, index, 'image_url', e.target.value)}
              />
               <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!project.featured} // Ensure boolean value
                      onChange={e => handleInputChange(setProjects, index, 'featured', e.target.checked)}
                    />
                    Featured Project (Show on Home Page)
               </label>
              <ListItemControls
                index={index}
                onRemove={() => handleRemoveItem(projects, setProjects, index, '/projects', 'projects')}
                onAdd={() => handleAddItem(setProjects, newProjectTemplate)}
                isLast={index === projects.length - 1}
                itemType="Project"
              />
            </div>
          ))}
          {projects.length === 0 && (
             <button onClick={() => handleAddItem(setProjects, newProjectTemplate)} className="add-button-empty">
                <FaPlus /> Add First Project
             </button>
          )}
        </AdminSection>

        {/* --- 📜 Certifications Section --- */}
         <AdminSection
          title="Certifications"
          onSave={createSaveHandler('/certifications', certificates, setCertificates, 'certificates')}
          isLoading={loadingStates.certificates}
          statusMessage={statusMessages.certificates}
        >
          {certificates.map((cert, index) => (
            <div key={cert.id || `cert-${index}`} className="admin-list-item-column certificate-item">
              <label>Certificate Name:</label>
              <input
                type="text"
                value={cert.cert_name || ''} // Use cert_name
                onChange={e => handleInputChange(setCertificates, index, 'cert_name', e.target.value)}
              />
              <label>Issuing Organization:</label>
              <input
                type="text"
                value={cert.issuing_organization || ''} // Use issuing_organization
                onChange={e => handleInputChange(setCertificates, index, 'issuing_organization', e.target.value)}
              />
               <label>Issue Date:</label>
              <input
                type="date" // Use date type for better UX
                value={cert.issue_date ? cert.issue_date.split('T')[0] : ''} // Format YYYY-MM-DD for input
                onChange={e => handleInputChange(setCertificates, index, 'issue_date', e.target.value)}
              />
               {/* Expiry Date (Optional) - Add if needed in schema */}
              {/* <label>Expiry Date (Optional):</label>
              <input type="date" value={cert.expiry_date ? cert.expiry_date.split('T')[0] : ''} onChange={e => handleInputChange(setCertificates, index, 'expiry_date', e.target.value)} /> */}
               <label>Credential ID (Optional):</label>
              <input
                 type="text"
                 value={cert.credential_id || ''} // Use credential_id
                 onChange={e => handleInputChange(setCertificates, index, 'credential_id', e.target.value)}
              />
              <label>Credential URL (Verification Link):</label>
              <input
                type="url"
                value={cert.credential_url || ''} // Use credential_url
                onChange={e => handleInputChange(setCertificates, index, 'credential_url', e.target.value)}
              />
               {/* Image URL (Optional) - Add if needed in schema */}
               {/* <label>Image URL (Optional):</label>
               <input type="url" value={cert.image_url || ''} onChange={e => handleInputChange(setCertificates, index, 'image_url', e.target.value)} /> */}
              <ListItemControls
                index={index}
                onRemove={() => handleRemoveItem(certificates, setCertificates, index, '/certifications', 'certificates')}
                onAdd={() => handleAddItem(setCertificates, newCertificateTemplate)}
                isLast={index === certificates.length - 1}
                itemType="Certificate"
              />
            </div>
          ))}
          {certificates.length === 0 && (
             <button onClick={() => handleAddItem(setCertificates, newCertificateTemplate)} className="add-button-empty">
                <FaPlus /> Add First Certificate
             </button>
          )}
        </AdminSection>


        {/* --- 💼 Experience Section --- */}
         <AdminSection
          title="Experience"
          onSave={createSaveHandler('/experiences', experiences, setExperiences, 'experiences')}
          isLoading={loadingStates.experiences}
          statusMessage={statusMessages.experiences}
        >
          {experiences.map((exp, index) => (
            <div key={exp.id || `exp-${index}`} className="admin-list-item-column experience-item">
               <label>Job Title / Position:</label>
               <input
                 type="text"
                 value={exp.title || ''} // Use title
                 onChange={e => handleInputChange(setExperiences, index, 'title', e.target.value)}
               />
               <label>Company:</label>
               <input
                 type="text"
                 value={exp.company || ''}
                 onChange={e => handleInputChange(setExperiences, index, 'company', e.target.value)}
               />
               <label>Location (Optional):</label>
               <input
                 type="text"
                 value={exp.location || ''}
                 onChange={e => handleInputChange(setExperiences, index, 'location', e.target.value)}
               />
                <label>Start Date:</label>
               <input
                 type="date"
                 value={exp.start_date ? exp.start_date.split('T')[0] : ''} // Format YYYY-MM-DD
                 onChange={e => handleInputChange(setExperiences, index, 'start_date', e.target.value)}
               />
                <label>End Date (Leave blank if current):</label>
               <input
                 type="date"
                 value={exp.end_date ? exp.end_date.split('T')[0] : ''} // Format YYYY-MM-DD
                 onChange={e => handleInputChange(setExperiences, index, 'end_date', e.target.value)}
                 disabled={!!exp.current} // Disable if 'Current' is checked
               />
                <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!exp.current}
                      onChange={e => handleInputChange(setExperiences, index, 'current', e.target.checked)}
                    />
                    Current Job
               </label>
               <label>Description / Responsibilities:</label>
              <textarea
                value={exp.description || ''}
                onChange={e => handleInputChange(setExperiences, index, 'description', e.target.value)}
              />
              <label>Technologies Used (comma-separated, optional):</label>
              <input
                type="text"
                value={exp.technologies || ''}
                onChange={e => handleInputChange(setExperiences, index, 'technologies', e.target.value)}
              />
               <label>Type:</label>
               <select
                   value={exp.type || 'Internship'}
                   onChange={e => handleInputChange(setExperiences, index, 'type', e.target.value)}
               >
                   <option value="Internship">Internship</option>
                   <option value="Full-time">Full-time</option>
                   <option value="Part-time">Part-time</option>
                   <option value="Contract">Contract</option>
                   {/* Add other types as needed */}
               </select>

              <ListItemControls
                index={index}
                onRemove={() => handleRemoveItem(experiences, setExperiences, index, '/experiences', 'experiences')}
                onAdd={() => handleAddItem(setExperiences, newExperienceTemplate)}
                isLast={index === experiences.length - 1}
                itemType="Experience"
              />
            </div>
          ))}
          {experiences.length === 0 && (
             <button onClick={() => handleAddItem(setExperiences, newExperienceTemplate)} className="add-button-empty">
                <FaPlus /> Add First Experience
             </button>
          )}
        </AdminSection>


        {/* --- 🎓 Education Section --- */}
        <AdminSection
          title="Education"
          onSave={createSaveHandler('/education', education, setEducation, 'education')}
          isLoading={loadingStates.education}
          statusMessage={statusMessages.education}
        >
          {education.map((edu, index) => (
            <div key={edu.id || `edu-${index}`} className="admin-list-item-column education-item">
              <label>Degree / Qualification:</label>
               <input
                 type="text"
                 value={edu.degree || ''}
                 onChange={e => handleInputChange(setEducation, index, 'degree', e.target.value)}
               />
               <label>Institution / School:</label>
               <input
                 type="text"
                 value={edu.institution || ''}
                 onChange={e => handleInputChange(setEducation, index, 'institution', e.target.value)}
               />
                <label>Location (Optional):</label>
               <input
                 type="text"
                 value={edu.location || ''}
                 onChange={e => handleInputChange(setEducation, index, 'location', e.target.value)}
               />
                <label>Start Date:</label>
               <input
                 type="date"
                 value={edu.start_date ? edu.start_date.split('T')[0] : ''}
                 onChange={e => handleInputChange(setEducation, index, 'start_date', e.target.value)}
               />
                <label>End Date (Leave blank if current):</label>
               <input
                 type="date"
                 value={edu.end_date ? edu.end_date.split('T')[0] : ''}
                 onChange={e => handleInputChange(setEducation, index, 'end_date', e.target.value)}
                 disabled={!!edu.current}
               />
                <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!edu.current}
                      onChange={e => handleInputChange(setEducation, index, 'current', e.target.checked)}
                    />
                    Currently Studying Here
               </label>
               <label>GPA / Grade (Optional):</label>
               <input
                 type="text" // Use text to allow for various formats (e.g., 8.5/10, A+)
                 value={edu.gpa || ''}
                 onChange={e => handleInputChange(setEducation, index, 'gpa', e.target.value)}
               />
               <label>Description / Details (Optional):</label>
              <textarea
                value={edu.description || ''}
                onChange={e => handleInputChange(setEducation, index, 'description', e.target.value)}
              />
              <ListItemControls
                index={index}
                onRemove={() => handleRemoveItem(education, setEducation, index, '/education', 'education')}
                onAdd={() => handleAddItem(setEducation, newEducationTemplate)}
                isLast={index === education.length - 1}
                itemType="Education"
              />
            </div>
          ))}
          {education.length === 0 && (
             <button onClick={() => handleAddItem(setEducation, newEducationTemplate)} className="add-button-empty">
                <FaPlus /> Add First Education Record
             </button>
          )}
        </AdminSection>


      </div>
    </div>
  );
};

export default AdminPanel;
