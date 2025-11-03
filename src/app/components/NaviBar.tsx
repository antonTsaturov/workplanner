'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import '../globals.css';

import { useRouter } from 'next/navigation';
//import { getSessionInfo } from '../lib/fetch';
import { logout } from '../lib/fetch';
import { storage } from '../utils/localStorage';
import { useSession } from './Providers';

const NaviBar = ({resetSession}) => {
  const { session, isLoading, refreshSession } = useSession();

  const router = useRouter();
  const hadleLogout = async () => {
    resetSession()
    await logout();
    await router.push('/auth');
    storage.remove('user')
    //hadleUserData()
    //console.log(response)
  }

  //console.log('Navibar: ', session)

  //userData &&
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-content">

          {/* Left block */}
          <div className="nav-section">
            <div className="nav-links">
              <Link href="/pages/calendar" className="nav-link">
                Calendar
              </Link>
              <Link href="/pages/staff" className="nav-link">
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
