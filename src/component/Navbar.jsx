import React, { useState, useEffect, useRef } from 'react';
import { FaWpexplorer } from "react-icons/fa";
import { GiRegeneration } from "react-icons/gi";
import { AiOutlineNotification } from "react-icons/ai";


const NavLink = ({ href, children }) => (
    <a href={href} style={styles.navLink}>{children}</a>
);

const IconButton = ({ children }) => (
    <button style={styles.iconButton}>{children}</button>
);

export default function RevealNavbar() {
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0,
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, []);

    return (
        <>
            <div ref={observerRef} style={{ height: '1px', position: 'absolute', top: 0 }} />

            <nav style={{
                ...styles.navbar,
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            }}>
                <div style={styles.container}>
                    <div style={styles.navContent}>
                        <a href="/" style={styles.logo}>Logo</a>
                        <div style={styles.navLinks}>
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/about">About</NavLink>
                            <NavLink href="/services">Services</NavLink>
                            <NavLink href="/contact">Contact</NavLink>
                        </div>
                        <div style={styles.navActions}>
                            <IconButton>
                                <GiRegeneration size={'1.5em'} />
                            </IconButton>
                            <IconButton>
                                <FaWpexplorer size={'1.5em'}/>
                            </IconButton>
                            <IconButton>
                                <AiOutlineNotification size={'1.5em'}/>
                            </IconButton>
                            <IconButton>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </IconButton>
                            <IconButton style={styles.menuButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </nav>

           
        </>
    );
}

const styles = {
    navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
    },
    navContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#333',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'none',
        alignItems: 'center',
        '@media (min-width: 768px)': {
            display: 'flex',
        },
    },
    navLink: {
        marginLeft: '1rem',
        fontSize: '0.875rem',
        color: '#666',
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
        ':hover': {
            color: '#333',
        },
    },
    navActions: {
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.8rem',
        color: '#666',
        transition: 'color 0.2s ease-in-out',
        ':hover': {
            color: '#333',
        },
    },
    menuButton: {
        '@media (min-width: 768px)': {
            display: 'none',
        },
    },
    content: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '5rem 1rem 1rem',
    },
    heading: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    paragraph: {
        marginBottom: '1rem',
    },
};