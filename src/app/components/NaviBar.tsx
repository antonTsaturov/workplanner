'use client'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Link from 'next/link'
import '../globals.css';

import { useRouter } from 'next/navigation';
import { handleFetch} from '../lib/fetch';
import { storage } from '../utils/localStorage';
import { useSession } from './Providers';


import { usePathname } from 'next/navigation'


const NaviBar = ({resetSession}) => {
  const { session, isLoading, refreshSession } = useSession();

  const initialPath = usePathname()

  const [pathname, setPathname] = useState(usePathname())
  
  const router = useRouter();
    
  const hadleLogout = async () => {
    
    resetSession()
    await handleFetch('logout', 'GET');
    await router.push('/auth');
    storage.remove('user')
    setPathname('auth');
  }

  const handleClick = (e) => {
    setPathname(e)
  }
  

  //!pathname.includes('auth') &&
  return  !pathname.includes('auth') && (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-content">

          {/* Left block */}
          <div className="nav-section">
            <img src="/assets/workplanner_icon.png" alt="Workplanner" style={{ height: '2rem', marginLeft: '1rem'}} />

            <div className="nav-links">
              <Link
                href="/pages/calendar"
                className={`nav-link ${pathname?.includes('calendar') ? 'active' : ''}`}
                onClick={(e:string)=>handleClick('calendar')}
              >
                Calendar
              </Link>
              <Link
                href="/pages/staff"
                className={`nav-link ${pathname?.includes('staff') ? 'active' : ''}`}
                onClick={(e:string)=>handleClick('staff')}
              >
                Staff
              </Link>
              <Link
                href="/pages/dashboard"
                className={`nav-link ${pathname?.includes('dashboard') ? 'active' : ''}`}
                onClick={(e:string)=>handleClick('dashboard')}
              >
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
