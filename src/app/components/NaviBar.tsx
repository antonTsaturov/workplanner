'use client'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Link from 'next/link'
import '../globals.css';

import { useRouter } from 'next/navigation';
//import { getSessionInfo } from '../lib/fetch';
import { logout } from '../lib/fetch';
import { storage } from '../utils/localStorage';
import { useSession } from './Providers';
import { useLocation } from 'react-router-dom';

const NaviBar = ({resetSession}) => {
  const { session, isLoading, refreshSession } = useSession();
  const [pathname, setPathname] = useState(location?.pathname || window.location.pathname)
  
  const router = useRouter();
  
  //console.log('Navibar: ', location)
  
  const hadleLogout = async () => {
    resetSession()
    await logout();
    await router.push('/auth');
    storage.remove('user')
    setPathname('')
  }

  //useEffect(() => {
    //handleClick()
  //},[])

  const handleClick = (page?) => {
    !page ? setPathname(location?.pathname || window.location.pathname) : setPathname(page)
    console.log('Navibar: ', page)
  }
  

  //userData &&
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-content">

          {/* Left block */}
          <div className="nav-section">
            <div className="nav-links">
              <Link
                href="/pages/calendar"
                className={`nav-link ${pathname.includes('calendar') ? 'active' : ''}`}
                onClick={()=>handleClick('calendar')}
              >
                Calendar
              </Link>
              <Link
                href="/pages/staff"
                className={`nav-link ${pathname.includes('staff') ? 'active' : ''}`}
                onClick={()=>handleClick('staff')}
              >
                Staff
              </Link>
              <Link href="" className="nav-link">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Right block */}
          <div className="nav-user-section">
              <div className="user-info">
                <div className="user-details">
                  <div className="user-name">{session?.user?.name}</div>
                    <div className="user-dept">{session?.user?.dept}</div>
                </div>

                <div className="dropdown-container">
                  <button className="dropdown-toggle">
                    <span>Account</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  <div className="dropdown-menu">
                  {session ? (
                    <div>
                      <button
                        className="dropdown-item-button"
                      >
                        Profile
                      </button>
                      <button
                        className="dropdown-item-button"
                      >
                        Settings
                      </button>
                      <button
                        onClick={hadleLogout}
                        className="dropdown-item-button logout-button"
                      >
                        Logout
                      </button>
                    </div>
                    ) : null
                  }
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
