import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image, Bell, Users, LogOut, Shield, Calendar, Mail, Settings, Home as HomeIcon, Book, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { GenericCrud } from './admin/GenericCrud';
import { AdminUsers } from './admin/AdminUsers';
import { AdminMessages } from './admin/AdminMessages';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { session, profile, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!session || profile?.role !== 'ADMIN' || profile?.status !== 'ACTIVE')) {
            navigate('/admin');
        }
    }, [session, profile, loading, navigate]);

    if (loading || !profile) return <div style={{ padding: '40px' }}>Loading Secure Admin...</div>;

    const navItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '' },
        { name: 'Users', icon: <Users size={20} />, path: 'users' },
        { name: 'Home View', icon: <HomeIcon size={20} />, path: 'home-content' },
        { name: 'About View', icon: <Book size={20} />, path: 'about-content' },
        { name: 'Sunday View', icon: <Book size={20} />, path: 'sunday-content' },
        { name: 'Sunday Teachers', icon: <Book size={20} />, path: 'sunday-teachers' },
        { name: 'Gallery', icon: <Image size={20} />, path: 'gallery' },
        { name: 'Members', icon: <Users size={20} />, path: 'members' },
        { name: 'Events', icon: <Calendar size={20} />, path: 'events' },
        { name: 'Announcements', icon: <Bell size={20} />, path: 'announcements' },
        { name: 'Messages', icon: <Mail size={20} />, path: 'messages' },
        { name: 'Settings', icon: <Settings size={20} />, path: 'settings' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar Overlay for Mobile */}
            <div
                className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={24} color="var(--primary)" /> CSI Admin</h2>
                    {/* Close button on mobile */}
                    <button className="menu-toggle" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '4px' }}>
                        <X size={24} />
                    </button>
                </div>
                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    {navItems.map((item, idx) => (
                        <Link
                            key={idx}
                            to={`/admin/dashboard/${item.path}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--text-main)' }}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}{item.name}
                        </Link>
                    ))}
                </nav>
                <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
                    <button onClick={async () => { await supabase.auth.signOut(); navigate('/admin'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}><LogOut size={20} /> Logout</button>
                </div>
            </aside>
            <main className="admin-main">
                <div className="admin-mobile-header">
                    <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><Shield size={24} color="var(--primary)" /> CSI Admin</h2>
                    <button className="menu-toggle" onClick={() => setSidebarOpen(true)} style={{ display: 'block' }}>
                        <Menu size={24} />
                    </button>
                </div>
                <Routes>
                    <Route path="/" element={<h2>Dashboard Overview - Real Supabase Connected</h2>} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="home-content" element={<GenericCrud tableName="church_settings" title="Home Page Content" columns={[{ key: 'hero_title_en', label: 'Hero Title (EN)', fullWidth: true }, { key: 'hero_title_ta', label: 'Hero Title (TA)', fullWidth: true }, { key: 'hero_subtitle_en', label: 'Hero Subtitle (EN)', fullWidth: true }, { key: 'hero_subtitle_ta', label: 'Hero Subtitle (TA)', fullWidth: true }, { key: 'verse_text_en', label: 'Verse Text (EN)', fullWidth: true }, { key: 'verse_text_ta', label: 'Verse Text (TA)', fullWidth: true }, { key: 'verse_reference_en', label: 'Verse Reference (EN)' }, { key: 'verse_reference_ta', label: 'Verse Reference (TA)' }]} />} />
                    <Route path="about-content" element={<GenericCrud tableName="church_settings" title="About Section Content" columns={[{ key: 'about_title_en', label: 'About Title (EN)', fullWidth: true }, { key: 'about_title_ta', label: 'About Title (TA)', fullWidth: true }, { key: 'about_desc1_en', label: 'About Par 1 (EN)', fullWidth: true }, { key: 'about_desc1_ta', label: 'About Par 1 (TA)', fullWidth: true }, { key: 'about_desc2_en', label: 'About Par 2 (EN)', fullWidth: true }, { key: 'about_desc2_ta', label: 'About Par 2 (TA)', fullWidth: true }]} />} />
                    <Route path="sunday-content" element={<GenericCrud tableName="church_settings" title="Sunday Class Overview" columns={[{ key: 'sunday_school_mission_en', label: 'Mission (EN)', fullWidth: true }, { key: 'sunday_school_mission_ta', label: 'Mission (TA)', fullWidth: true }, { key: 'sunday_school_schedule_en', label: 'Schedule (EN)' }, { key: 'sunday_school_schedule_ta', label: 'Schedule (TA)' }, { key: 'sunday_school_location_en', label: 'Location (EN)' }, { key: 'sunday_school_location_ta', label: 'Location (TA)' }]} />} />
                    <Route path="sunday-teachers" element={<GenericCrud tableName="sunday_school_teachers" title="Manage Sunday Teachers" bucketName="church-gallery" columns={[{ key: 'name_en', label: 'Teacher Name', required: true }, { key: 'class_name_en', label: 'Class Assigned', required: true }, { key: 'qualification_en', label: 'Qualification' }, { key: 'experience', label: 'Experience' }, { key: 'photo_url', label: 'Photo', type: 'file' }, { key: 'status', label: 'Status', type: 'select', options: ['PUBLISHED', 'DRAFT'] }]} />} />
                    <Route path="gallery" element={<GenericCrud tableName="gallery" title="Manage Gallery" bucketName="church-gallery" columns={[{ key: 'title_en', label: 'Title' }, { key: 'description_en', label: 'Description', fullWidth: true }, { key: 'image_url', label: 'Image', type: 'file' }, { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] }]} />} />
                    <Route path="members" element={<GenericCrud tableName="church_members" title="Manage Church Members" bucketName="church-gallery" columns={[{ key: 'name_en', label: 'Full Name', required: true }, { key: 'position', label: 'Position', type: 'select', options: ['PASTOR', 'ASSISTANT_PASTOR', 'PC_MEMBER', 'DC_MEMBER', 'SECRETARY', 'TREASURER', 'MEMBER'] }, { key: 'photo_url', label: 'Photo', type: 'file' }, { key: 'qualification_en', label: 'Qualification' }, { key: 'experience', label: 'Experience' }, { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] }]} />} />
                    <Route path="events" element={<GenericCrud tableName="events" title="Manage Events" bucketName="site-media" columns={[{ key: 'title_en', label: 'Title', required: true }, { key: 'event_date', label: 'Date', type: 'date', required: true }, { key: 'start_time', label: 'Start Time', type: 'time', required: true }, { key: 'service_type', label: 'Type', type: 'select', options: ['SUNDAY_SERVICE', 'FRIDAY_SERVICE', 'SPECIAL_PROGRAM'] }, { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] }]} />} />
                    <Route path="announcements" element={<GenericCrud tableName="announcements" title="Manage Announcements" columns={[{ key: 'title_en', label: 'Title', required: true }, { key: 'announcement_date', label: 'Date', type: 'date' }, { key: 'priority', label: 'Priority', type: 'select', options: ['NORMAL', 'IMPORTANT', 'URGENT'] }, { key: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'] }]} />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="settings" element={<GenericCrud tableName="church_settings" title="Church Information Settings" columns={[{ key: 'church_name_en', label: 'Church Name' }, { key: 'address_en', label: 'Address', fullWidth: true }, { key: 'phone', label: 'Phone Number' }, { key: 'email', label: 'Email Address' }, { key: 'office_hours_en', label: 'Office Hours', fullWidth: true }]} />} />
                </Routes>
            </main>
        </div>
    );
};
export default AdminDashboard;
