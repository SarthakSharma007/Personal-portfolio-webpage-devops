import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import './AdminPanel.css'; // Make sure you have styles for this
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';

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
const newSkillTemplate = { name: '', percentage: 0, category: '' };
const newProjectTemplate = { title: '', description: '', tech_stack: '', github_link: '', demo_link: '', image_url: '', featured: false };
const newCertificateTemplate = { name: '', organization: '', issue_date: '', credential_link: '' };
const newExperienceTemplate = { position: '', company: '', location: '', dates: '', description: '', technologies: '' };
const newEducationTemplate = { degree: '', school: '', location: '', dates: '', description: '' };


const AdminPanel = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // --- All States ---
  const [personalInfo, setPersonalInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  // --- FIX: Silence incorrect 'no-unused-vars' warnings ---
  // eslint-disable-next-line no-unused-vars
  const [projects, setProjects] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [certificates, setCertificates] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [experiences, setExperiences] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [education, setEducation] = useState([]);
  // --- NEW: State for Messages ---
  const [messages, setMessages] = useState([]);

  // State for file uploads
  const [files, setFiles] = useState({
    profile_image: null,
    about_image: null,
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

        // --- NEW: Added api.get('/messages') ---
        const [infoRes, skillsRes, projectsRes, certsRes, expRes, eduRes, messagesRes] =
          await Promise.all([
            api.get('/personal-info/1'), // Assuming ID 1
            api.get('/skills'),
            api.get('/projects/all-admin'),
            api.get('/certifications'),
            api.get('/experiences'),
            api.get('/education'),
            api.get('/messages'), // Fetch messages
          ]);

        if (infoRes.data.success) setPersonalInfo(infoRes.data.data);
        if (skillsRes.data.success) setSkills(skillsRes.data.data);
        if (projectsRes.data.success) setProjects(projectsRes.data.data);
        if (certsRes.data.success) setCertificates(certsRes.data.data);
        if (expRes.data.success) setExperiences(expRes.data.data);
        if (eduRes.data.success) setEducation(eduRes.data.data);
        // --- NEW: Set messages state ---
        if (messagesRes.data.success) setMessages(messagesRes.data.data);

      } catch (err) {
        console.error('Error fetching admin data:', err);
        showStatus('page', 'error', 'Failed to load initial data.');
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
      newState[index] = { ...newState[index], [field]: value };
      return newState;
    });
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleAddItem = (setState, template) => {
    setState(prev => [...prev, { ...template, id: `new-${Date.now()}` }]);
  };

  // eslint-disable-next-line no-unused-vars
  const handleRemoveItem = async (state, setState, index, endpoint, key) => {
    // This logic is slightly complex, so we get the item first
    const itemToRemove = state[index]; // <--- FIX: Get item from state array directly
    
    // If it's a new item (not in DB), just remove from state
    if (itemToRemove?.id && itemToRemove.id.toString().startsWith('new-')) {
      setState(prev => prev.filter((_, i) => i !== index));
      return;
    }

    // If it's an existing item, delete from DB
    if (itemToRemove?.id) {
      try {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        await api.delete(`${endpoint}/${itemToRemove.id}`);
        setState(prev => prev.filter((_, i) => i !== index));
        showStatus(key, 'success', `${key} item deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting ${key}:`, err);
        showStatus(key, 'error', `Failed to delete ${key} item.`);
      } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  // --- Save Handlers ---

  // Save handler for Personal Info (handles FormData for images)
  const savePersonalInfo = async () => {
    setLoadingStates(prev => ({ ...prev, personalInfo: true }));
    
    const formData = new FormData();
    
    // Append all text fields
    for (const key in personalInfo) {
      formData.append(key, personalInfo[key] || '');
    }

    // Append files if they exist
    if (files.profile_image) {
      formData.append('profile_image', files.profile_image);
    }
    if (files.about_image) {
      formData.append('about_image', files.about_image);
    }

    try {
      // Your API endpoint must be configured to handle 'multipart/form-data'
      const res = await api.put('/personal-info/1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        // Update state with new image URLs if server sends them back
        setPersonalInfo(res.data.data); 
        // Clear file state
        setFiles({ profile_image: null, about_image: null });
        showStatus('personalInfo', 'success', 'Home & About saved successfully.');
      } else {
        showStatus('personalInfo', 'error', res.data.message || 'Failed to save Home & About.');
      }
    } catch (err) {
      console.error('Error saving personal info:', err);
      showStatus('personalInfo', 'error', 'Failed to save Home & About.');
    } finally {
      setLoadingStates(prev => ({ ...prev, personalInfo: false }));
    }
  };

  // Generic save handler for array sections (Projects, Certs, etc.)
  const createSaveHandler = (endpoint, state, key) => async () => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
      const results = await Promise.all(
        state.map(item => {
          const { id, ...data } = item;
          if (id?.toString().startsWith('new-')) {
            // Create new item
            return api.post(endpoint, data);
          } else {
            // Update existing item
            return api.put(`${endpoint}/${id}`, data);
          }
        })
      );
      
      // Update state with new IDs from server
      const updatedState = results.map(res => res.data.data);
      if (key === 'projects') setProjects(updatedState);
      else if (key === 'certificates') setCertificates(updatedState);
      else if (key === 'experiences') setExperiences(updatedState);
      else if (key === 'education') setEducation(updatedState);
      else if (key === 'skills') setSkills(updatedState);
      // Note: Messages are not saved here, only deleted.

      showStatus(key, 'success', `${key} saved successfully.`);
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
      showStatus(key, 'error', `Failed to save ${key}.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  // --- Skill Grouping Logic ---
  const skillGroups = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  const skillCategories = useMemo(() => Object.keys(skillGroups), [skillGroups]);

  const handleSkillChange = (category, skillIndex, field, value) => {
    const globalSkillIndex = skills.findIndex(
      s => s.id === skillGroups[category][skillIndex].id
    );

    if (globalSkillIndex > -1) {
      handleInputChange(setSkills, globalSkillIndex, field, value);
    }
  };

  const handleAddSkill = (category) => {
    const template = { ...newSkillTemplate, category: category, id: `new-${Date.now()}` };
    setSkills(prev => [...prev, template]);
  };
  
  const handleRemoveSkill = (category, skillIndex) => {
    const skillToRemove = skillGroups[category][skillIndex];
    const globalSkillIndex = skills.findIndex(s => s.id === skillToRemove.id);

    if (globalSkillIndex > -1) {
      handleRemoveItem(skills, setSkills, globalSkillIndex, '/skills', 'skills');
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '' || skillCategories.includes(newCategory.trim())) {
      showStatus('skills', 'error', 'Please enter a unique category name.');
      return;
    }
    const template = { ...newSkillTemplate, category: newCategory.trim(), id: `new-${Date.now()}` };
    setSkills(prev => [...prev, template]);
    setNewCategory('');
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- Render ---
  if (loadingStates.page) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
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
        
        {/* --- 🏠 Home & 👤 About Me Section --- */}
        {personalInfo && (
          <AdminSection
            title="Home & About"
            onSave={savePersonalInfo}
            isLoading={loadingStates.personalInfo}
            statusMessage={statusMessages.personalInfo}
          >
            <h4>Home Section</h4>
            <label>Name (Home):</label>
            <input
              type="text"
              value={personalInfo.name || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'name', e.target.value)}
            />
            <label>Profession/Passion (Home):</label>
            <input
              type="text"
              value={personalInfo.profession || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'profession', e.target.value)}
            />
            <label>Profile Image (Home):</label>
            <input type="file" name="profile_image" onChange={handleFileChange} />
            {personalInfo.profile_image_url && !files.profile_image && (
              <img src={personalInfo.profile_image_url} alt="Profile Preview" className="admin-preview-image" />
            )}

            <hr />
            <h4>About Me Section</h4>
            <label>Name (About):</label>
            <input
              type="text"
              value={personalInfo.about_name || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'about_name', e.target.value)}
            />
            <label>Title/Position (About):</label>
            <input
              type="text"
              value={personalInfo.about_position || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'about_position', e.target.value)}
            />
            <label>Description (About):</label>
            <textarea
              value={personalInfo.about_description || ''}
              onChange={e => handleInputChange(setPersonalInfo, null, 'about_description', e.target.value)}
            />
            <label>About Image:</label>
            <input type="file" name="about_image" onChange={handleFileChange} />
            {personalInfo.about_image_url && !files.about_image && (
              <img src={personalInfo.about_image_url} alt="About Preview" className="admin-preview-image" />
            )}
          </AdminSection>
        )}

        {/* --- 📧 Inbox / Messages Section --- */}
        <AdminSection
          title="Inbox / Messages"
          // No onSave prop - this section is read/delete only
          isLoading={loadingStates.messages}
          statusMessage={statusMessages.messages}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={message.id} className="admin-list-item-column message-item">
                <div className="message-header">
                  <strong>From: {message.name}</strong>
                  <span>({message.email})</span>
                  <ListItemControls
                    index={index}
                    onRemove={() => handleRemoveItem(messages, setMessages, index, '/messages', 'messages')}
                    // No onAdd prop
                    isLast={false} // Don't show "add" button
                    itemType="Message"
                  />
                </div>
                <p className="message-body">{message.message}</p>
                <small>Received: {new Date(message.created_at).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No new messages.</p>
          )}
        </AdminSection>

        {/* --- 💡 Skills Section --- */}
        <AdminSection
          title="Skills"
          onSave={createSaveHandler('/skills', skills, 'skills')}
          isLoading={loadingStates.skills}
          statusMessage={statusMessages.skills}
        >
          {skillCategories.map((category) => (
            <div key={category} className="admin-skill-category">
              <h5>{category}</h5>
              {skillGroups[category].map((skill, index) => (
                <div key={skill.id} className="admin-list-item">
                  <input
                    type="text"
                    placeholder="Skill Name"
                    value={skill.name}
                    onChange={e => handleSkillChange(category, index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Percentage"
                    value={skill.percentage}
                    onChange={e => handleSkillChange(category, index, 'percentage', e.target.value)}
                  />
                  <ListItemControls
                    index={index}
                    onRemove={() => handleRemoveSkill(category, index)}
                    onAdd={() => handleAddSkill(category)}
                    isLast={index === skillGroups[category].length - 1}
                    itemType="Skill"
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="admin-add-category">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <button onClick={handleAddCategory} className="add-button">
              <FaPlus /> Add Category
            </button>
          </div>
        </AdminSection>

        {/* --- 💻 Projects Section --- */}
        <AdminSection
          title="Projects"
          onSave={createSaveHandler('/projects', projects, 'projects')}
          isLoading={loadingStates.projects}
          statusMessage={statusMessages.projects}
        >
          {projects.map((project, index) => (
            <div key={project.id} className="admin-list-item-column">
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
                type="text"
                value={project.github_link || ''}
                onChange={e => handleInputChange(setProjects, index, 'github_link', e.target.value)}
              />
              <label>Demo Link:</label>
              <input
                type="text"
                value={project.demo_link || ''}
                onChange={e => handleInputChange(setProjects, index, 'demo_link', e.target.value)}
              />
              <label>Image URL:</label>
              <input
                type="text"
                value={project.image_url || ''}
                onChange={e => handleInputChange(setProjects, index, 'image_url', e.target.value)}
              />
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
             <button onClick={() => handleAddItem(setProjects, newProjectTemplate)} className="add-button">
                <FaPlus /> Add First Project
             </button>
          )}
        </AdminSection>

        {/* --- 📜 Certificates Section --- */}
        <AdminSection
          title="Certificates"
          onSave={createSaveHandler('/certifications', certificates, 'certificates')}
          isLoading={loadingStates.certificates}
          statusMessage={statusMessages.certificates}
        >
          {certificates.map((cert, index) => (
            <div key={cert.id} className="admin-list-item-column">
              <label>Certificate Name:</label>
              <input
                type="text"
                value={cert.name || ''}
                onChange={e => handleInputChange(setCertificates, index, 'name', e.target.value)}
              />
              <label>Organization:</label>
              <input
                type="text"
                value={cert.organization || ''}
                onChange={e => handleInputChange(setCertificates, index, 'organization', e.target.value)}
              />
              <label>Issued Date:</label>
              <input
                type="text"
                placeholder="e.g., 2023-10-28"
                value={cert.issue_date || ''}
                onChange={e => handleInputChange(setCertificates, index, 'issue_date', e.target.value)}
              />
              <label>Credential Link:</label>
              <input
                type="text"
                value={cert.credential_link || ''}
                onChange={e => handleInputChange(setCertificates, index, 'credential_link', e.target.value)}
              />
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
             <button onClick={() => handleAddItem(setCertificates, newCertificateTemplate)} className="add-button">
                <FaPlus /> Add First Certificate
             </button>
          )}
        </AdminSection>

        {/* --- 💼 Experience Section --- */}
        <AdminSection
          title="Experience"
          onSave={createSaveHandler('/experiences', experiences, 'experiences')}
          isLoading={loadingStates.experiences}
          statusMessage={statusMessages.experiences}
        >
          {experiences.map((exp, index) => (
            <div key={exp.id} className="admin-list-item-column">
              <label>Position:</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={e => handleInputChange(setExperiences, index, 'position', e.target.value)}
              />
              <label>Company:</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={e => handleInputChange(setExperiences, index, 'company', e.target.value)}
              />
              <label>Location:</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={e => handleInputChange(setExperiences, index, 'location', e.target.value)}
              />
              <label>Dates:</label>
              <input
                type="text"
                placeholder="e.g., Jan 2022 - Present"
                value={exp.dates || ''}
                onChange={e => handleInputChange(setExperiences, index, 'dates', e.target.value)}
              />
              <label>Description:</label>
              <textarea
                value={exp.description || ''}
                onChange={e => handleInputChange(setExperiences, index, 'description', e.target.value)}
              />
              <label>Technologies (comma-separated):</label>
              <input
                type="text"
                value={exp.technologies || ''}
                onChange={e => handleInputChange(setExperiences, index, 'technologies', e.target.value)}
              />
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
             <button onClick={() => handleAddItem(setExperiences, newExperienceTemplate)} className="add-button">
                <FaPlus /> Add First Experience
             </button>
          )}
        </AdminSection>

        {/* --- 🎓 Education Section --- */}
        <AdminSection
          title="Education"
          onSave={createSaveHandler('/education', education, 'education')}
          isLoading={loadingStates.education}
          statusMessage={statusMessages.education}
        >
          {education.map((edu, index) => (
            <div key={edu.id} className="admin-list-item-column">
              <label>Degree:</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={e => handleInputChange(setEducation, index, 'degree', e.target.value)}
              />
              <label>School/University:</label>
              <input
                type="text"
                value={edu.school || ''}
                onChange={e => handleInputChange(setEducation, index, 'school', e.target.value)}
              />
              <label>Location:</label>
              <input
                type="text"
                value={edu.location || ''}
                onChange={e => handleInputChange(setEducation, index, 'location', e.target.value)}
              />
              <label>Dates:</label>
              <input
                type="text"
                placeholder="e.g., 2018 - 2022"
                value={edu.dates || ''}
                onChange={e => handleInputChange(setEducation, index, 'dates', e.target.value)}
              />
              <label>Description:</label>
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
             <button onClick={() => handleAddItem(setEducation, newEducationTemplate)} className="add-button">
                <FaPlus /> Add First Education
             </button>
          )}
        </AdminSection>

      </div>
    </div>
  );
};

export default AdminPanel;

