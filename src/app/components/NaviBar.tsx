'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import '../globals.css';



import { useRouter } from 'next/navigation';
import { getSessionInfo } from '../lib/fetch';
import { logout } from '../lib/fetch';

const NaviBar = ({userData}) => {

  //const [userData, setUserData] = useState({});

  // useEffect(()=>{
  //   let data = getSessionInfo()
  //     .then(success=> {setUserData(success.success)})
  // }, [])
  
  const hadleLogout = async () => {
    const response = await logout();
    await router.push('/auth');
    //console.log(response)
  }

  console.log('userData',userData)
  const router = useRouter();  
  
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-content">

          {/* Left block */}
          <div className="nav-section">
            <div className="nav-links">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/about" className="nav-link">
                About
              </Link>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
            </div>
          </div>

          {/* Right block */}
          <div className="nav-user-section">
              <div className="user-info">
                <div className="user-details">
                  <div className="user-name">{userData?.name}</div>
                    <div className="user-dept">{userData?.dept}</div>
                </div>
                
                <div className="dropdown-container">
                  <button className="dropdown-toggle">
                    <span>Account</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  <div className="dropdown-menu">
                    <Link 
                      href="/profile" 
                      className="dropdown-item"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="dropdown-item"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={hadleLogout}
                      className="dropdown-item logout-button"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NaviBar;
