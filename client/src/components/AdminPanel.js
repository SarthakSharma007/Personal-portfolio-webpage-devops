import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ThemeContext } from '../contexts/ThemeContext';
import './AdminPanel.css'; // We'll create this file for styling
import { FaSave, FaTrash, FaPlus } from 'react-icons/fa';

// Helper component for consistent section layout
const AdminSection = ({ title, children, onSave, isLoading, statusMessage }) => (
  <div className="admin-section card">
    <h2>Edit {title}</h2>
    {statusMessage && (
      <p className={`status-message ${statusMessage.type}`}>{statusMessage.text}</p>
    )}
    <div className="admin-section-content">{children}</div>
    <button onClick={onSave} disabled={isLoading} className="save-button">
      <FaSave /> {isLoading ? 'Saving...' : `Save ${title}`}
    </button>
  </div>
);

// Helper component for list item controls (Add/Remove)
const ListItemControls = ({ index, onRemove, onAdd, isFirst, isLast, itemType }) => (
  <div className="list-item-controls">
    <button onClick={() => onRemove(index)} className="remove-button" title={`Remove ${itemType}`}>
      <FaTrash />
    </button>
    {isLast && (
       <button onClick={onAdd} className="add-button" title={`Add New ${itemType}`}>
         <FaPlus />
       </button>
    )}
  </div>
);


const AdminPanel = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // --- State for each section ---
  const [personalInfo, setPersonalInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  // --- Loading and Status States ---
  const [loadingStates, setLoadingStates] = useState({});
  const [statusMessages, setStatusMessages] = useState({});

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, page: true }));
        const [
          infoRes,
          skillsRes,
          projectsRes,
          certsRes,
          expRes,
          eduRes,
        ] = await Promise.all([
          api.get('/personal-info').catch(e => ({ data: { success: false, error: e } })),
          api.get('/skills').catch(e => ({ data: { success: false, error: e } })),
          // Fetch ALL projects for admin, not just featured
          api.get('/projects/all-admin').catch(e => ({ data: { success: false, error: e } })),
           // Assuming /certifications fetches all
          api.get('/certifications').catch(e => ({ data: { success: false, error: e } })),
          api.get('/experiences').catch(e => ({ data: { success: false, error: e } })),
          api.get('/education').catch(e => ({ data: { success: false, error: e } })),
        ]);

        if (infoRes.data.success) setPersonalInfo(infoRes.data.data); else console.error("Failed to fetch personal info:", infoRes.data.error);
        // Backend for skills seems to return array directly
        if (Array.isArray(skillsRes.data)) setSkills(skillsRes.data); else console.error("Failed to fetch skills:", skillsRes.data.error);
         // Ensure projects endpoint returns {success: boolean, data: []}
        if (projectsRes.data.success) setProjects(projectsRes.data.data); else console.error("Failed to fetch projects:", projectsRes.data.error);
        if (certsRes.data.success) setCertificates(certsRes.data.data); else console.error("Failed to fetch certificates:", certsRes.data.error);
        if (expRes.data.success) setExperiences(expRes.data.data); else console.error("Failed to fetch experiences:", expRes.data.error);
        if (eduRes.data.success) setEducation(eduRes.data.data); else console.error("Failed to fetch education:", eduRes.data.error);

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setStatusMessages(prev => ({ ...prev, page: { type: 'error', text: 'Failed to load initial data.' } }));
         // Implement fallback or redirect if critical data fails
        if (!personalInfo) {
            // Maybe redirect to login if personal info fails critically
            // navigate('/login');
        }
      } finally {
        setLoadingStates(prev => ({ ...prev, page: false }));
      }
    };
    // Check for token before fetching
     const token = localStorage.getItem('token');
     if (!token) {
       navigate('/login');
       return;
     }
    fetchData();
  }, [navigate]); // Added navigate to dependency array


   // --- Generic Handlers ---
   const handleInputChange = (setState, index, field, value) => {
    setState(prev => {
      if (index === null) { // For single objects like personalInfo
        return { ...prev, [field]: value };
      }
      // For arrays
      const newState = [...prev];
      newState[index] = { ...newState[index], [field]: value };
      return newState;
    });
  };

  const handleAddItem = (setState, newItemTemplate) => {
    setState(prev => [...prev, { ...newItemTemplate, id: `new-${Date.now()}` }]); // Temporary ID
  };

 const handleRemoveItem = async (setState, index, endpoint, itemType) => {
    const itemToRemove = skills[index]; // Use skills state directly

    // Only attempt deletion if it's not a newly added item (has a real ID)
    if (typeof itemToRemove.id === 'number') {
      try {
        setLoadingStates(prev => ({ ...prev, [itemType]: true }));
        await api.delete(`${endpoint}/${itemToRemove.id}`);
         // Remove from state only after successful API call
        setState(prev => prev.filter((_, i) => i !== index));
        setStatusMessages(prev => ({ ...prev, [itemType]: { type: 'success', text: `${itemType} removed.` } }));
      } catch (error) {
        console.error(`Error removing ${itemType}:`, error);
        setStatusMessages(prev => ({ ...prev, [itemType]: { type: 'error', text: `Failed to remove ${itemType}.` } }));
      } finally {
        setLoadingStates(prev => ({ ...prev, [itemType]: false }));
      }
    } else {
       // If it's a new item (temp ID), just remove from state
       setState(prev => prev.filter((_, i) => i !== index));
    }
 };


  // --- Save Handlers ---
  const createSaveHandler = (endpoint, state, sectionKey, setState) => async () => {
    setLoadingStates(prev => ({ ...prev, [sectionKey]: true }));
    setStatusMessages(prev => ({ ...prev, [sectionKey]: null }));
    let hasError = false;
    let message = '';

    try {
      if (Array.isArray(state)) {
        // Handle array updates (Skills, Projects, etc.)
        const results = await Promise.allSettled(
          state.map(item => {
            const payload = { ...item };
            if (typeof item.id === 'string' && item.id.startsWith('new-')) {
               // It's a new item, use POST
               delete payload.id; // Remove temporary ID
               return api.post(endpoint, payload);
            } else if (item.id) {
               // It's an existing item, use PUT
               return api.put(`${endpoint}/${item.id}`, payload);
            }
            return Promise.resolve({ status: 'skipped', value: { data: { success: true } } }); // Skip items without ID changes if needed
          })
        );

         // Check results for errors
        const failedRequests = results.filter(r => r.status === 'rejected' || (r.value && !r.value.data.success));
        if (failedRequests.length > 0) {
          hasError = true;
          message = `Some ${sectionKey} failed to save. Check console for details.`;
          console.error(`Failed ${sectionKey} saves:`, failedRequests);
        } else {
          message = `${sectionKey} saved successfully.`;
           // Fetch updated data to get real IDs for new items
          const freshData = await api.get(endpoint);
          if (Array.isArray(freshData.data)) { // Check if backend sends array directly
            setState(freshData.data);
          } else if (freshData.data.success) { // Or if it sends {success, data}
             setState(freshData.data.data);
          }

        }

      } else {
        // Handle single object updates (PersonalInfo)
        await api.put(endpoint, state);
        message = `${sectionKey} saved successfully.`;
      }

      setStatusMessages(prev => ({ ...prev, [sectionKey]: { type: hasError ? 'error' : 'success', text: message } }));

    } catch (error) {
      console.error(`Error saving ${sectionKey}:`, error);
      setStatusMessages(prev => ({ ...prev, [sectionKey]: { type: 'error', text: `Failed to save ${sectionKey}. ${error.response?.data?.message || error.message}` } }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [sectionKey]: false }));
      // Auto-clear status message after a few seconds
       setTimeout(() => setStatusMessages(prev => ({ ...prev, [sectionKey]: null })), 5000);
    }
  };


   // Define default templates for new items
   const newSkillTemplate = { skill_name: '', proficiency_level: 'Intermediate', category: 'Other' };
   const newProjectTemplate = { title: '', description: '', tech_stack: '', github_link: '', demo_link: '', image_url: '', featured: false };
   const newCertificateTemplate = { cert_name: '', issuing_organization: '', issue_date: '', credential_id: '', credential_url: '' };
   const newExperienceTemplate = { title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '', technologies: '', type: 'Internship' };
   const newEducationTemplate = { degree: '', institution: '', location: '', start_date: '', end_date: '', current: false, gpa: '', description: '' };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

   if (loadingStates.page) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
   }

  return (
    <div className={`admin-panel ${theme}`}>
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      {statusMessages.page && <p className={`status-message ${statusMessages.page.type}`}>{statusMessages.page.text}</p>}

      <div className="admin-sections-container">
        {/* --- Home/About Section (Personal Info) --- */}
        {personalInfo && (
          <AdminSection
              title="Home & About Info"
              onSave={createSaveHandler('/personal-info', personalInfo, 'personalInfo')}
              isLoading={loadingStates.personalInfo}
              statusMessage={statusMessages.personalInfo}
          >
            <label>Full Name:</label>
            <input type="text" value={personalInfo.full_name || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'full_name', e.target.value)} />

            <label>Title/Profession:</label>
            <input type="text" value={personalInfo.title || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'title', e.target.value)} />

             <label>Bio (About Me Description):</label>
            <textarea value={personalInfo.bio || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'bio', e.target.value)} />

            <label>Home Profile Image URL:</label>
            <input type="text" placeholder="Enter image URL" value={personalInfo.profile_image_home || personalInfo.profile_image || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'profile_image_home', e.target.value)} />

             <label>About Me Photo URL:</label>
            <input type="text" placeholder="Enter image URL" value={personalInfo.profile_image_about || personalInfo.profile_image || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'profile_image_about', e.target.value)} />

             {/* Add other personal info fields as needed: email, phone, location, github_url, linkedin_url, resume_url */}
             <label>Email:</label>
             <input type="email" value={personalInfo.email || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'email', e.target.value)} />
             <label>Phone:</label>
             <input type="tel" value={personalInfo.phone || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'phone', e.target.value)} />
             <label>Location:</label>
             <input type="text" value={personalInfo.location || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'location', e.target.value)} />
             <label>GitHub URL:</label>
             <input type="url" value={personalInfo.github_url || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'github_url', e.target.value)} />
             <label>LinkedIn URL:</label>
             <input type="url" value={personalInfo.linkedin_url || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'linkedin_url', e.target.value)} />
             <label>Resume URL:</label>
             <input type="url" value={personalInfo.resume_url || ''} onChange={(e) => handleInputChange(setPersonalInfo, null, 'resume_url', e.target.value)} />

          </AdminSection>
        )}

        {/* --- Skills Section --- */}
         <AdminSection
              title="Skills"
              onSave={createSaveHandler('/skills', skills, 'skills', setSkills)}
              isLoading={loadingStates.skills}
              statusMessage={statusMessages.skills}
         >
           {skills.map((skill, index) => (
             <div key={skill.id || `new-${index}`} className="list-item">
               <input
                 type="text"
                 placeholder="Skill Name"
                 value={skill.skill_name || ''}
                 onChange={(e) => handleInputChange(setSkills, index, 'skill_name', e.target.value)}
               />
               <select
                 value={skill.proficiency_level || 'Intermediate'}
                 onChange={(e) => handleInputChange(setSkills, index, 'proficiency_level', e.target.value)}
               >
                 <option>Beginner</option>
                 <option>Intermediate</option>
                 <option>Advanced</option>
                 <option>Expert</option>
               </select>
               <select
                 value={skill.category || 'Other'}
                 onChange={(e) => handleInputChange(setSkills, index, 'category', e.target.value)}
               >
                 <option>Primary</option>
                 <option>Other</option>
               </select>
                <ListItemControls
                   index={index}
                   onRemove={(i) => handleRemoveItem(setSkills, i, '/skills', 'Skill')}
                   onAdd={() => handleAddItem(setSkills, newSkillTemplate)}
                   isFirst={index === 0}
                   isLast={index === skills.length - 1}
                   itemType="Skill"
                 />
             </div>
           ))}
           {/* Add button if list is empty */}
           {skills.length === 0 && (
              <button onClick={() => handleAddItem(setSkills, newSkillTemplate)} className="add-button-empty">
                 <FaPlus /> Add First Skill
              </button>
           )}
         </AdminSection>

        {/* --- Projects Section --- */}
        <AdminSection
            title="Projects"
            onSave={createSaveHandler('/projects', projects, 'projects', setProjects)}
            isLoading={loadingStates.projects}
            statusMessage={statusMessages.projects}
        >
          {projects.map((project, index) => (
            <div key={project.id || `new-${index}`} className="list-item project-item">
              <input type="text" placeholder="Title" value={project.title || ''} onChange={(e) => handleInputChange(setProjects, index, 'title', e.target.value)} />
              <textarea placeholder="Description" value={project.description || ''} onChange={(e) => handleInputChange(setProjects, index, 'description', e.target.value)} />
              <input type="text" placeholder="Tech Stack (comma-separated)" value={project.tech_stack || ''} onChange={(e) => handleInputChange(setProjects, index, 'tech_stack', e.target.value)} />
              <input type="url" placeholder="GitHub Link" value={project.github_link || ''} onChange={(e) => handleInputChange(setProjects, index, 'github_link', e.target.value)} />
              <input type="url" placeholder="Demo Link (Optional)" value={project.demo_link || ''} onChange={(e) => handleInputChange(setProjects, index, 'demo_link', e.target.value)} />
               <input type="url" placeholder="Image URL (Optional)" value={project.image_url || ''} onChange={(e) => handleInputChange(setProjects, index, 'image_url', e.target.value)} />
              <label className="checkbox-label">
                <input type="checkbox" checked={!!project.featured} onChange={(e) => handleInputChange(setProjects, index, 'featured', e.target.checked)} />
                Featured Project
              </label>
              <ListItemControls
                index={index}
                onRemove={(i) => handleRemoveItem(setProjects, i, '/projects', 'Project')}
                onAdd={() => handleAddItem(setProjects, newProjectTemplate)}
                isFirst={index === 0}
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

        {/* --- Certificates Section --- */}
         <AdminSection
             title="Certificates"
             onSave={createSaveHandler('/certifications', certificates, 'certificates', setCertificates)}
             isLoading={loadingStates.certificates}
             statusMessage={statusMessages.certificates}
         >
           {certificates.map((cert, index) => (
             <div key={cert.id || `new-${index}`} className="list-item">
               <input type="text" placeholder="Certificate Name" value={cert.cert_name || ''} onChange={(e) => handleInputChange(setCertificates, index, 'cert_name', e.target.value)} />
               <input type="text" placeholder="Issuing Organization" value={cert.issuing_organization || ''} onChange={(e) => handleInputChange(setCertificates, index, 'issuing_organization', e.target.value)} />
               <input type="date" placeholder="Issue Date" value={cert.issue_date ? cert.issue_date.split('T')[0] : ''} onChange={(e) => handleInputChange(setCertificates, index, 'issue_date', e.target.value)} />
               <input type="text" placeholder="Credential ID (Optional)" value={cert.credential_id || ''} onChange={(e) => handleInputChange(setCertificates, index, 'credential_id', e.target.value)} />
               <input type="url" placeholder="Credential URL (Optional)" value={cert.credential_url || ''} onChange={(e) => handleInputChange(setCertificates, index, 'credential_url', e.target.value)} />
                {/* Removed expiry_date and image_url based on user request */}
               <ListItemControls
                 index={index}
                 onRemove={(i) => handleRemoveItem(setCertificates, i, '/certifications', 'Certificate')}
                 onAdd={() => handleAddItem(setCertificates, newCertificateTemplate)}
                 isFirst={index === 0}
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


        {/* --- Experience Section --- */}
        <AdminSection
            title="Experience"
            onSave={createSaveHandler('/experiences', experiences, 'experiences', setExperiences)}
            isLoading={loadingStates.experiences}
            statusMessage={statusMessages.experiences}
        >
          {experiences.map((exp, index) => (
            <div key={exp.id || `new-${index}`} className="list-item experience-item">
              <input type="text" placeholder="Job Title" value={exp.title || ''} onChange={(e) => handleInputChange(setExperiences, index, 'title', e.target.value)} />
              <input type="text" placeholder="Company Name" value={exp.company || ''} onChange={(e) => handleInputChange(setExperiences, index, 'company', e.target.value)} />
               <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => handleInputChange(setExperiences, index, 'location', e.target.value)} />
              <input type="date" placeholder="Start Date" value={exp.start_date ? exp.start_date.split('T')[0] : ''} onChange={(e) => handleInputChange(setExperiences, index, 'start_date', e.target.value)} />
              <input type="date" placeholder="End Date (leave blank if current)" value={exp.end_date ? exp.end_date.split('T')[0] : ''} onChange={(e) => handleInputChange(setExperiences, index, 'end_date', e.target.value)} disabled={exp.current} />
              <label className="checkbox-label">
                <input type="checkbox" checked={!!exp.current} onChange={(e) => handleInputChange(setExperiences, index, 'current', e.target.checked)} />
                Currently Working Here
              </label>
              <textarea placeholder="Description" value={exp.description || ''} onChange={(e) => handleInputChange(setExperiences, index, 'description', e.target.value)} />
              <input type="text" placeholder="Technologies (comma-separated)" value={exp.technologies || ''} onChange={(e) => handleInputChange(setExperiences, index, 'technologies', e.target.value)} />
               <select value={exp.type || 'Internship'} onChange={(e) => handleInputChange(setExperiences, index, 'type', e.target.value)}>
                    <option>Internship</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
               </select>
              <ListItemControls
                index={index}
                onRemove={(i) => handleRemoveItem(setExperiences, i, '/experiences', 'Experience')}
                onAdd={() => handleAddItem(setExperiences, newExperienceTemplate)}
                isFirst={index === 0}
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

        {/* --- Education Section --- */}
        <AdminSection
            title="Education"
            onSave={createSaveHandler('/education', education, 'education', setEducation)}
            isLoading={loadingStates.education}
            statusMessage={statusMessages.education}
        >
          {education.map((edu, index) => (
            <div key={edu.id || `new-${index}`} className="list-item education-item">
              <input type="text" placeholder="Degree Name" value={edu.degree || ''} onChange={(e) => handleInputChange(setEducation, index, 'degree', e.target.value)} />
              <input type="text" placeholder="Institution/School" value={edu.institution || ''} onChange={(e) => handleInputChange(setEducation, index, 'institution', e.target.value)} />
               <input type="text" placeholder="Location" value={edu.location || ''} onChange={(e) => handleInputChange(setEducation, index, 'location', e.target.value)} />
              <input type="date" placeholder="Start Date" value={edu.start_date ? edu.start_date.split('T')[0] : ''} onChange={(e) => handleInputChange(setEducation, index, 'start_date', e.target.value)} />
              <input type="date" placeholder="End Date (leave blank if current)" value={edu.end_date ? edu.end_date.split('T')[0] : ''} onChange={(e) => handleInputChange(setEducation, index, 'end_date', e.target.value)} disabled={edu.current} />
               <label className="checkbox-label">
                 <input type="checkbox" checked={!!edu.current} onChange={(e) => handleInputChange(setEducation, index, 'current', e.target.checked)} />
                 Currently Studying Here
               </label>
               {/* GPA field removed as per user request */}
              <textarea placeholder="Description (Optional)" value={edu.description || ''} onChange={(e) => handleInputChange(setEducation, index, 'description', e.target.value)} />
              <ListItemControls
                index={index}
                onRemove={(i) => handleRemoveItem(setEducation, i, '/education', 'Education')}
                onAdd={() => handleAddItem(setEducation, newEducationTemplate)}
                isFirst={index === 0}
                isLast={index === education.length - 1}
                itemType="Education"
              />
            </div>
          ))}
          {education.length === 0 && (
             <button onClick={() => handleAddItem(setEducation, newEducationTemplate)} className="add-button-empty">
                <FaPlus /> Add First Education
             </button>
          )}
        </AdminSection>

      </div>
    </div>
  );
};

export default AdminPanel;
